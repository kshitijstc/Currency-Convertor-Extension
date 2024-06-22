const apiKey = 'db98adcfce776acb4c910f0f';

const fetchRates = async () => {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    const data = await response.json();
    console.log(data);
    chrome.storage.sync.set({ exchangeRates: data.conversion_rates });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};
fetchRates();
