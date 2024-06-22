import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [nativeCurrency, setNativeCurrency] = useState('USD');
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const apiKey = 'db98adcfce776acb4c910f0f';

  useEffect(() => {
    chrome.storage.sync.get(['nativeCurrency', 'sourceCurrency', 'exchangeRates'], (result) => {
      if (result.nativeCurrency) {
        setNativeCurrency(result.nativeCurrency);
      }
      if (result.sourceCurrency) {
        setSourceCurrency(result.sourceCurrency);
      }
      if (result.exchangeRates) {
        setRates(result.exchangeRates);
        setLoading(false);
      } else {
        fetchRates('USD');
      }
    });
  }, []);

  const fetchRates = (currency) => {
    fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`)
      .then(response => response.json())
      .then(data => {
        setRates(data.conversion_rates);
        chrome.storage.sync.set({ exchangeRates: data.conversion_rates });
        setLoading(false);
      })
      .catch(error => console.error('Error fetching exchange rates:', error));
  };

  const saveCurrencies = () => {
    chrome.storage.sync.set({
      nativeCurrency,
      sourceCurrency,
      exchangeRates: rates
    });
  };

  useEffect(() => {
    setLoading(true);
    fetchRates(sourceCurrency);
  }, [sourceCurrency]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Currency Converter</h1>
      <div className="mt-4">
        <label htmlFor="sourceCurrency" className="block text-sm font-medium text-gray-700">Source Currency</label>
        <select
          id="sourceCurrency"
          name="sourceCurrency"
          value={sourceCurrency}
          onChange={(e) => setSourceCurrency(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(rates).map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
      </div>
      <div className="mt-4">
        <label htmlFor="nativeCurrency" className="block text-sm font-medium text-gray-700">Native Currency</label>
        <select
          id="nativeCurrency"
          name="nativeCurrency"
          value={nativeCurrency}
          onChange={(e) => setNativeCurrency(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {Object.keys(rates).map((rate) => (
            <option key={rate} value={rate}>{rate}</option>
          ))}
        </select>
      </div>
      <button
        onClick={saveCurrencies}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default Popup;
