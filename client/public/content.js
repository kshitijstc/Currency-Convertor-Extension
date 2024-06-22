// Assuming currencySymbols.js is in the same directory
import { currencySymbols } from './currencySymbols.js';

// Listener to convert currency on message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertCurrency") {
    convertPrices();
  }
});

const convertPrices = async () => {
  chrome.storage.sync.get(['nativeCurrency', 'sourceCurrency', 'exchangeRates'], (result) => {
    const nativeCurrency = result.nativeCurrency || 'USD';
    const sourceCurrency = result.sourceCurrency || 'USD';
    const rates = result.exchangeRates;

    if (!rates || !rates[nativeCurrency] || !rates[sourceCurrency]) {
      console.error('Exchange rates not found or invalid currency.');
      return;
    }

    // Calculate the conversion rate from source currency to native currency
    const rate = rates[nativeCurrency] / rates[sourceCurrency];

    // Get the currency symbol for the source currency
    const sourceSymbol = currencySymbols[sourceCurrency] || '';
    const nativeSymbol = currencySymbols[nativeCurrency] || '';

    // Regex to match different currency formats, using source symbol
    const currencyRegex = new RegExp(`\\b${sourceSymbol}\\s?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)\\b`, 'g');

    // Replace currency values in the document body
    document.body.innerHTML = document.body.innerHTML.replace(currencyRegex, (match, value) => {
      const parsedValue = parseFloat(value.replace(/,/g, ""));
      const convertedValue = (parsedValue * rate).toFixed(2);
      return `${nativeSymbol} ${convertedValue}`;
    });
  });
};

// Trigger the conversion initially when the script runs
convertPrices();
