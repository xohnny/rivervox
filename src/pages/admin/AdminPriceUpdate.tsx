import { useState, useEffect } from 'react';
import { RefreshCw, Loader2, Edit2, X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { currencies as defaultCurrencies, type Currency } from '@/data/currencies';
import { useCurrency } from '@/context/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';

const AdminCurrencyRates = () => {
  const { currencies: liveCurrencies } = useCurrency();
  const { toast } = useToast();
  const [rates, setRates] = useState<Currency[]>([]);
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editRate, setEditRate] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setRates(liveCurrencies.length > 0 ? liveCurrencies : defaultCurrencies);
  }, [liveCurrencies]);

  const filteredRates = rates.filter(c =>
    c.code !== 'USD' && (
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  const startEditing = (currency: Currency) => {
    setEditingCode(currency.code);
    setEditRate(currency.rate.toString());
  };

  const cancelEditing = () => {
    setEditingCode(null);
    setEditRate('');
  };

  const saveRate = async (currency: Currency) => {
    const newRate = parseFloat(editRate);
    if (isNaN(newRate) || newRate <= 0) {
      toast({ title: 'Invalid rate', description: 'Please enter a valid positive number.', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      // Build updated rates object from current rates
      const ratesObj: Record<string, number> = { USD: 1 };
      rates.forEach(c => {
        ratesObj[c.code] = c.code === currency.code ? newRate : c.rate;
      });

      // Upsert into exchange_rates table
      const { error } = await supabase.from('exchange_rates').insert({
        base_currency: 'USD',
        rates: ratesObj,
        fetched_at: new Date().toISOString(),
      });

      if (error) throw error;

      setRates(prev => prev.map(c => c.code === currency.code ? { ...c, rate: newRate } : c));
      setEditingCode(null);
      toast({ title: 'Rate updated', description: `1 USD = ${newRate} ${currency.code}` });
    } catch (err: any) {
      toast({ title: 'Error saving rate', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const refreshFromAI = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-exchange-rates');
      if (error) throw error;
      if (data?.rates) {
        const merged = rates.map(c => ({
          ...c,
          rate: data.rates[c.code] ?? c.rate,
        }));
        setRates(merged);
        toast({ title: 'Rates refreshed', description: 'Live rates fetched successfully.' });
      }
    } catch (err: any) {
      toast({ title: 'Refresh failed', description: err.message, variant: 'destructive' });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <RefreshCw className="w-6 h-6 text-primary" />
            Currency Exchange Rates
          </h2>
          <p className="text-muted-foreground mt-1">
            Manually update exchange rates (1 USD = X). Rates are used across the storefront.
          </p>
        </div>
        <Button onClick={refreshFromAI} disabled={refreshing} variant="outline">
          {refreshing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Fetch Live Rates
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Currency</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Code</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Symbol</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Rate (1 USD =)</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRates.map((curr) => {
                const isEditing = editingCode === curr.code;

                return (
                  <tr key={curr.code} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-sm">{curr.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{curr.code}</td>
                    <td className="px-6 py-4 text-sm">{curr.symbol}</td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="any"
                          min="0"
                          value={editRate}
                          onChange={(e) => setEditRate(e.target.value)}
                          className="w-32 h-8 text-sm"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRate(curr);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                        />
                      ) : (
                        <span className="font-semibold">{curr.rate}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={cancelEditing} disabled={saving} className="h-8 w-8 p-0">
                            <X className="w-4 h-4" />
                          </Button>
                          <Button size="sm" onClick={() => saveRate(curr)} disabled={saving} className="h-8 px-3">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4 mr-1" /> Save</>}
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => startEditing(curr)} className="h-8">
                          <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No currencies found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCurrencyRates;
