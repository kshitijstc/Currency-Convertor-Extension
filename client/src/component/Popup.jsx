import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [currency, setCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const apiKey = 'db98adcfce776acb4c910f0f'; // Replace with your actual API key

  useEffect(() => {
    chrome.storage.sync.get(['nativeCurrency', 'exchangeRates'], (result) => {
      if (result.nativeCurrency) {
        setCurrency(result.nativeCurrency);
      }
      if (result.exchangeRates) {
        setRates(result.exchangeRates);
        setLoading(false);
      } else {
        fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`)
          .then(response => response.json())
          .then(data => {
            console.log(data);
            setRates(data.conversion_rates);
            chrome.storage.sync.set({ exchangeRates: data.conversion_rates });
            setLoading(false);
          })
          .catch(error => console.error('Error fetching exchange rates:', error));
      }
    });
  }, []);

  const saveCurrency = () => {
    chrome.storage.sync.set({ nativeCurrency: currency });
  };

  if (loading) {
    return(
    <div className="p-4">Loading...</div>
    )
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Currency Converter</h1>
      <div className="mt-4">
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Native Currency</label>
        <select
          id="currency"
          name="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(rates).map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
      </div>
      <button
        onClick={saveCurrency}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Popup;
