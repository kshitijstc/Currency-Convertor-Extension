chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertCurrency") {
    convertPrices();
  }
});

const convertPrices = async () => {
  chrome.storage.sync.get(['nativeCurrency', 'exchangeRates'], async (result) => {
    const nativeCurrency = result.nativeCurrency || 'USD';
    const rates = result.exchangeRates;

    if (!rates || !rates[nativeCurrency]) {
      console.error('Exchange rates not found or invalid native currency.');
      return;
    }

    const rate = rates[nativeCurrency];

    document.body.innerHTML = document.body.innerHTML.replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, (match) => {
      const value = parseFloat(match.replace(/[^0-9.-]+/g, ""));
      const convertedValue = (value * rate).toFixed(2);
      return `${nativeCurrency} ${convertedValue}`;
    });
  });
};
