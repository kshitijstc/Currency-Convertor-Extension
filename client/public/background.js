const apiKey = 'db98adcfce776acb4c910f0f'; // Replace with your actual API key
const fetchRates = async () => {
  try {
    const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
    const data = await response.json();
    chrome.storage.sync.set({ exchangeRates: data.conversion_rates });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "convertCurrency",
    title: "Convert to Native Currency",
    contexts: ["page"]
  });
  fetchRates();
  // Fetch rates every 24 hours
  setInterval(fetchRates, 24 * 60 * 60 * 1000);
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convertCurrency") {
    chrome.tabs.sendMessage(tab.id, { action: "convertCurrency" });
  }
});
