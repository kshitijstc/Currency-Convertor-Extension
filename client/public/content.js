// Description: This file is responsible for converting the prices of the products from the source currency to the native currency of the user. It listens for a message from the background script to convert the prices on the page. It fetches the exchange rates from the storage and uses them to convert the prices. It replaces the prices on the page with the converted prices in the native currency.

const currencySymbols = {
  AED: 'د.إ',
  AFN: '؋',
  ALL: 'L',
  AMD: '֏',
  ANG: 'ƒ',
  AOA: 'Kz',
  ARS: '$',
  AUD: '$',
  AWG: 'ƒ',
  AZN: '₼',
  BAM: 'KM',
  BBD: '$',
  BDT: '৳',
  BGN: 'лв',
  BHD: '.د.ب',
  BIF: 'FBu',
  BMD: '$',
  BND: '$',
  BOB: 'Bs.',
  BRL: 'R$',
  BSD: '$',
  BTN: 'Nu.',
  BWP: 'P',
  BYN: 'Br',
  BZD: '$',
  CAD: '$',
  CDF: 'FC',
  CHF: 'CHF',
  CLP: '$',
  CNY: '¥',
  COP: '$',
  CRC: '₡',
  CUP: '$',
  CVE: '$',
  CZK: 'Kč',
  DJF: 'Fdj',
  DKK: 'kr',
  DOP: '$',
  DZD: 'د.ج',
  EGP: '£',
  ERN: 'Nfk',
  ETB: 'Br',
  EUR: '€',
  FJD: '$',
  FKP: '£',
  FOK: 'kr',
  GBP: '£',
  GEL: '₾',
  GGP: '£',
  GHS: '₵',
  GIP: '£',
  GMD: 'D',
  GNF: 'FG',
  GTQ: 'Q',
  GYD: '$',
  HKD: '$',
  HNL: 'L',
  HRK: 'kn',
  HTG: 'G',
  HUF: 'Ft',
  IDR: 'Rp',
  ILS: '₪',
  IMP: '£',
  INR: '₹',
  IQD: 'ع.د',
  IRR: '﷼',
  ISK: 'kr',
  JEP: '£',
  JMD: '$',
  JOD: 'د.ا',
  JPY: '¥',
  KES: 'Sh',
  KGS: 'с',
  KHR: '៛',
  KID: '$',
  KMF: 'CF',
  KRW: '₩',
  KWD: 'د.ك',
  KYD: '$',
  KZT: '₸',
  LAK: '₭',
  LBP: 'ل.ل',
  LKR: 'Rs',
  LRD: '$',
  LSL: 'L',
  LYD: 'ل.د',
  MAD: 'د.م.',
  MDL: 'L',
  MGA: 'Ar',
  MKD: 'ден',
  MMK: 'K',
  MNT: '₮',
  MOP: 'P',
  MRU: 'UM',
  MUR: '₨',
  MVR: 'Rf',
  MWK: 'MK',
  MXN: '$',
  MYR: 'RM',
  MZN: 'MT',
  NAD: '$',
  NGN: '₦',
  NIO: 'C$',
  NOK: 'kr',
  NPR: '₨',
  NZD: '$',
  OMR: 'ر.ع.',
  PAB: 'B/.',
  PEN: 'S/',
  PGK: 'K',
  PHP: '₱',
  PKR: '₨',
  PLN: 'zł',
  PYG: '₲',
  QAR: 'ر.ق',
  RON: 'lei',
  RSD: 'дин.',
  RUB: '₽',
  RWF: 'FRw',
  SAR: 'ر.س',
  SBD: '$',
  SCR: '₨',
  SDG: 'ج.س.',
  SEK: 'kr',
  SGD: '$',
  SHP: '£',
  SLE: 'Le',
  SOS: 'Sh',
  SRD: '$',
  SSP: '£',
  STN: 'Db',
  SYP: '£',
  SZL: 'E',
  THB: '฿',
  TJS: 'ЅМ',
  TMT: 'T',
  TND: 'د.ت',
  TOP: 'T$',
  TRY: '₺',
  TTD: '$',
  TVD: '$',
  TWD: 'NT$',
  TZS: 'Sh',
  UAH: '₴',
  UGX: 'Sh',
  USD: '$',
  UYU: '$',
  UZS: 'сўм',
  VES: 'Bs.S',
  VND: '₫',
  VUV: 'VT',
  WST: 'T',
  XAF: 'FCFA',
  XCD: '$',
  XDR: 'SDR',
  XOF: 'CFA',
  XPF: '₣',
  YER: '﷼',
  ZAR: 'R',
  ZMW: 'ZK',
  ZWL: '$'
};
 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertCurrency") {
    convertPrices();
  }
});

const convertPrices = () => {
  chrome.storage.sync.get(['nativeCurrency', 'sourceCurrency', 'exchangeRates'], (result) => {
    const nativeCurrency = result.nativeCurrency || 'USD';
    const sourceCurrency = result.sourceCurrency || 'USD';
    const rates = result.exchangeRates;

    if (!rates || !rates[nativeCurrency] || !rates[sourceCurrency]) {
      console.error('Exchange rates not found or invalid currency.');
      return;
    }

    const rate = rates[nativeCurrency] / rates[sourceCurrency];

    const sourceSymbol = currencySymbols[sourceCurrency] || sourceCurrency;
    const nativeSymbol = currencySymbols[nativeCurrency] || nativeCurrency;

    const currencyRegex = new RegExp(`(${sourceSymbol.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})\\s?(\\d+(?:,\\d{3})*(?:\\.\\d{2})?)`, 'g');

    document.body.innerHTML = document.body.innerHTML.replace(currencyRegex, (match, symbol, value) => {
      const parsedValue = parseFloat(value.replace(/,/g, ""));
      if (isNaN(parsedValue)) {
        return match;
      }
      const convertedValue = (parsedValue * rate).toFixed(2);
      return `${nativeSymbol} ${convertedValue}`;
    });
  });
};

convertPrices();





