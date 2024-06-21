// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "convertCurrency") {
//     convertPrices();
//   }
// });

const convertPrices = async () => {
  chrome.storage.sync.get(['nativeCurrency', 'exchangeRates'], (result) => {
    const nativeCurrency = result.nativeCurrency || 'USD';
    const rates = result.exchangeRates;

    console.log('nativeCurrency:', nativeCurrency);
    console.log('exchangeRates:', rates);

    if (!rates || !rates[nativeCurrency]) {
      console.error('Exchange rates not found or invalid native currency.');
      return;
    }

    const rate = rates[nativeCurrency];
    console.log('Exchange rate:', rate);

    document.body.innerHTML = document.body.innerHTML.replace(/\$\d+(?:,\d{3})*(?:\.\d{2})?/g, (match) => {
      const value = parseFloat(match.replace(/[^0-9.-]+/g, ""));
      console.log('Original value:', value);
      const convertedValue = (value * rate).toFixed(2);
      console.log('Converted value:', convertedValue);
      return `${nativeCurrency} ${convertedValue}`;
    });
  });
};

convertPrices();