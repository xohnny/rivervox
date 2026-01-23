import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Currency = 'USD' | 'BDT';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate: 1 USD = ~110 BDT (approximate)
const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  BDT: 110,
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  BDT: '৳',
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('rivervox-currency');
    return (saved as Currency) || 'USD';
  });

  useEffect(() => {
    localStorage.setItem('rivervox-currency', currency);
  }, [currency]);

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * EXCHANGE_RATES[currency];
  };

  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD);
    const symbol = CURRENCY_SYMBOLS[currency];
    
    if (currency === 'BDT') {
      return `${symbol}${converted.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
    }
    
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
