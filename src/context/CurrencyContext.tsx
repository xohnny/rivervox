import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currencies, countryToCurrency, getCurrencyByCode, type Currency } from '@/data/currencies';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (bdtPrice: number) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      return getCurrencyByCode(saved);
    }
    return getCurrencyByCode('USD'); // default until geo detected
  });

  useEffect(() => {
    // Only auto-detect if user hasn't manually selected
    if (localStorage.getItem('selectedCurrency')) return;

    const detectCurrency = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-location');
        if (!error && data?.countryCode) {
          const currencyCode = countryToCurrency[data.countryCode] || 'USD';
          setCurrencyState(getCurrencyByCode(currencyCode));
        }
      } catch {
        // Keep default USD
      }
    };

    detectCurrency();
  }, []);

  const setCurrency = (code: string) => {
    const curr = getCurrencyByCode(code);
    setCurrencyState(curr);
    localStorage.setItem('selectedCurrency', code);
  };

  const formatPrice = (bdtPrice: number): string => {
    const converted = bdtPrice * currency.rate;
    
    // For currencies with large values (JPY, KRW, VND, IDR, etc.), no decimals
    const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'MMK', 'BDT', 'NGN', 'RUB'];
    const fractionDigits = noDecimalCurrencies.includes(currency.code) ? 0 : 2;

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies }}>
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
