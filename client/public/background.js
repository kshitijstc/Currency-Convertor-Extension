const apiKey = 'db98adcfce776acb4c910f0f';

const fetchRates = async (currency) => {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currency}`);
    const data = await response.json();
    console.log(data);
    chrome.storage.sync.set({ exchangeRates: data.conversion_rates });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};

// Listen for changes in the source currency and fetch new rates
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.sourceCurrency && namespace === 'sync') {
    fetchRates(changes.sourceCurrency.newValue);
  }
});

// Initially fetch rates for the default source currency (USD)
fetchRates('USD');
