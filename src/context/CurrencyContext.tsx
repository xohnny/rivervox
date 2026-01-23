import { createContext, useContext, ReactNode } from 'react';

interface CurrencyContextType {
  formatPrice: (priceInUSD: number) => string;
  convertPrice: (priceInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rate: 1 USD = ~110 BDT (approximate)
const EXCHANGE_RATE = 110;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * EXCHANGE_RATE;
  };

  const formatPrice = (priceInUSD: number): string => {
    const converted = convertPrice(priceInUSD);
    return `৳${converted.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;
  };

  return (
    <CurrencyContext.Provider value={{ formatPrice, convertPrice }}>
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
