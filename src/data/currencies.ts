export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // How much 1 USD is worth in this currency
}

// Exchange rates: 1 USD = X of target currency (fallback/default rates)
// Base currency: USD
export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 110 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.5 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 278 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 3.75 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 3.67 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 4.47 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 15800 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 1.34 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 150 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 1350 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 32 },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 49 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 1550 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 18.2 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 4.97 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 17.1 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 34.5 },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 25000 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 56 },
  { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal', rate: 3.64 },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar', rate: 0.31 },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', rate: 0.385 },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar', rate: 0.376 },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', rate: 300 },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee', rate: 134 },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', rate: 2100 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.88 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 10.3 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 10.7 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 6.88 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 1.64 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: 91 },
];

// Country code (ISO 3166-1 alpha-2) to currency code mapping
export const countryToCurrency: Record<string, string> = {
  BD: 'BDT',
  US: 'USD',
  GB: 'GBP',
  DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR', NL: 'EUR', BE: 'EUR',
  AT: 'EUR', PT: 'EUR', IE: 'EUR', FI: 'EUR', GR: 'EUR', SK: 'EUR',
  SI: 'EUR', LT: 'EUR', LV: 'EUR', EE: 'EUR', CY: 'EUR', MT: 'EUR',
  LU: 'EUR', HR: 'EUR',
  IN: 'INR',
  PK: 'PKR',
  SA: 'SAR',
  AE: 'AED',
  MY: 'MYR',
  ID: 'IDR',
  SG: 'SGD',
  CA: 'CAD',
  AU: 'AUD',
  JP: 'JPY',
  KR: 'KRW',
  CN: 'CNY',
  TR: 'TRY',
  EG: 'EGP',
  NG: 'NGN',
  ZA: 'ZAR',
  BR: 'BRL',
  MX: 'MXN',
  TH: 'THB',
  VN: 'VND',
  PH: 'PHP',
  QA: 'QAR',
  KW: 'KWD',
  OM: 'OMR',
  BH: 'BHD',
  LK: 'LKR',
  NP: 'NPR',
  MM: 'MMK',
  CH: 'CHF',
  SE: 'SEK',
  NO: 'NOK',
  DK: 'DKK',
  NZ: 'NZD',
  RU: 'RUB',
};

export const getCurrencyByCode = (code: string): Currency => {
  return currencies.find(c => c.code === code) || currencies[0]; // fallback to USD
};

// Merge live rates into currencies list
export const mergeLiveRates = (liveRates: Record<string, number>): Currency[] => {
  return currencies.map(c => ({
    ...c,
    rate: liveRates[c.code] ?? c.rate,
  }));
};
