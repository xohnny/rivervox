import { ChevronDown } from 'lucide-react';
import { useCurrency, Currency } from '@/context/CurrencyContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'BDT', label: 'BDT', symbol: '৳' },
];

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  const currentCurrency = currencies.find((c) => c.value === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 gap-1 text-sm font-medium hover:bg-secondary"
        >
          <span className="text-primary font-semibold">{currentCurrency?.symbol}</span>
          <span>{currentCurrency?.label}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[120px] bg-popover border border-border shadow-lg z-50"
      >
        {currencies.map((cur) => (
          <DropdownMenuItem
            key={cur.value}
            onClick={() => setCurrency(cur.value)}
            className={`cursor-pointer ${currency === cur.value ? 'bg-primary/10 text-primary' : ''}`}
          >
            <span className="font-semibold mr-2">{cur.symbol}</span>
            <span>{cur.label}</span>
            {currency === cur.value && (
              <span className="ml-auto text-primary">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
