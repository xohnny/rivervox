export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // How much 1 BDT is worth in this currency
}

// Exchange rates: 1 BDT = X of target currency
// Base currency: BDT (Bangladeshi Taka)
export const currencies: Currency[] = [
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', rate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.0091 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.0084 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0072 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 0.76 },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', rate: 2.53 },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', rate: 0.034 },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', rate: 0.033 },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', rate: 0.040 },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', rate: 143.5 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rate: 0.012 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 0.012 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 0.014 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 1.36 },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', rate: 12.3 },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 0.066 },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', rate: 0.29 },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', rate: 0.45 },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', rate: 14.0 },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', rate: 0.165 },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', rate: 0.045 },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 0.155 },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 0.31 },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', rate: 228 },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', rate: 0.51 },
  { code: 'QAR', symbol: 'QR', name: 'Qatari Riyal', rate: 0.033 },
  { code: 'KWD', symbol: 'KD', name: 'Kuwaiti Dinar', rate: 0.0028 },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial', rate: 0.0035 },
  { code: 'BHD', symbol: 'BD', name: 'Bahraini Dinar', rate: 0.0034 },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', rate: 2.72 },
  { code: 'NPR', symbol: 'Rs', name: 'Nepalese Rupee', rate: 1.22 },
  { code: 'MMK', symbol: 'K', name: 'Myanmar Kyat', rate: 19.1 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rate: 0.008 },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 0.094 },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', rate: 0.097 },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', rate: 0.063 },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', rate: 0.015 },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', rate: 0.83 },
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

// BDT to USD rate for admin panel
export const BDT_TO_USD_RATE = 110; // ~110 BDT = 1 USD

export const formatUSD = (bdtPrice: number): string => {
  const usdPrice = bdtPrice / BDT_TO_USD_RATE;
  return `$${usdPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const getCurrencyByCode = (code: string): Currency => {
  return currencies.find(c => c.code === code) || currencies[1]; // fallback to USD
};
