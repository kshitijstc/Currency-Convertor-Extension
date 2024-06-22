const convertPrices = async () => {
  chrome.storage.sync.get(['nativeCurrency', 'sourceCurrency', 'exchangeRates'], (result) => {
    const nativeCurrency = result.nativeCurrency || 'USD';
    const sourceCurrency = result.sourceCurrency || 'USD';
    const rates = result.exchangeRates;
    if (!rates || !rates[nativeCurrency] || !rates[sourceCurrency]) {
      console.error('Exchange rates not found or invalid currency.');
      return;
    }

    const rate = rates[nativeCurrency] / rates[sourceCurrency];

    document.body.innerHTML = document.body.innerHTML.replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, (match) => {
      const value = parseFloat(match.replace(/[^0-9.-]+/g, ""));
      const convertedValue = (value * rate).toFixed(2);
      return `${nativeCurrency} ${convertedValue}`;
    });
  });
};

convertPrices();
