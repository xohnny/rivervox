import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { currencies as defaultCurrencies, countryToCurrency, getCurrencyByCode, mergeLiveRates, type Currency } from '@/data/currencies';
import { supabase } from '@/integrations/supabase/client';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (usdPrice: number) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [activeCurrencies, setActiveCurrencies] = useState<Currency[]>(defaultCurrencies);
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('selectedCurrency');
    if (saved) {
      return getCurrencyByCode(saved);
    }
    return getCurrencyByCode('USD');
  });

  // Fetch live exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-exchange-rates');
        if (!error && data?.rates) {
          const merged = mergeLiveRates(data.rates);
          setActiveCurrencies(merged);
          // Update current currency with live rate
          const saved = localStorage.getItem('selectedCurrency');
          const code = saved || currency.code;
          const updated = merged.find(c => c.code === code);
          if (updated) setCurrencyState(updated);
        }
      } catch {
        // Keep fallback rates
      }
    };

    fetchRates();
  }, []);

  // Auto-detect currency by location
  useEffect(() => {
    if (localStorage.getItem('selectedCurrency')) return;

    const detectCurrency = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-location');
        if (!error && data?.countryCode) {
          const currencyCode = countryToCurrency[data.countryCode] || 'USD';
          const found = activeCurrencies.find(c => c.code === currencyCode);
          if (found) setCurrencyState(found);
        }
      } catch {
        // Keep default USD
      }
    };

    detectCurrency();
  }, [activeCurrencies]);

  const setCurrency = (code: string) => {
    const curr = activeCurrencies.find(c => c.code === code) || getCurrencyByCode(code);
    setCurrencyState(curr);
    localStorage.setItem('selectedCurrency', code);
  };

  const formatPrice = (usdPrice: number): string => {
    // Convert from USD to selected currency
    const converted = usdPrice * currency.rate;

    const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'MMK', 'BDT', 'NGN', 'RUB'];
    const fractionDigits = noDecimalCurrencies.includes(currency.code) ? 0 : 2;

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });

    return `${currency.symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: activeCurrencies }}>
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
