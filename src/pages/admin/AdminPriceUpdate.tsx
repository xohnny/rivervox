import { useState } from 'react';
import { DollarSign, Loader2, Edit2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInventory, InventoryProduct } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';
import { products as demoProducts } from '@/data/products';

const getDemoImage = (productName: string): string => {
  const demo = demoProducts.find(p => p.name.toLowerCase() === productName.toLowerCase());
  return demo?.images?.[0] || '/placeholder.svg';
};

interface PriceEdit {
  price: string;
  originalPrice: string;
}

const AdminPriceUpdate = () => {
  const { products, loading, updateProduct } = useInventory();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<PriceEdit>({ price: '', originalPrice: '' });
  const [saving, setSaving] = useState<string | null>(null);

  const startEditing = (product: InventoryProduct) => {
    setEditingId(product.id);
    setEditData({
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || '',
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ price: '', originalPrice: '' });
  };

  const savePrice = async (product: InventoryProduct) => {
    const newPrice = parseFloat(editData.price);
    if (isNaN(newPrice) || newPrice <= 0) {
      toast({ title: 'Invalid price', description: 'Please enter a valid price.', variant: 'destructive' });
      return;
    }

    const newOriginal = editData.originalPrice ? parseFloat(editData.originalPrice) : null;
    if (newOriginal !== null && isNaN(newOriginal)) {
      toast({ title: 'Invalid original price', description: 'Please enter a valid original price.', variant: 'destructive' });
      return;
    }

    setSaving(product.id);
    const success = await updateProduct(product.id, {
      price: newPrice,
      original_price: newOriginal,
    });

    setSaving(null);
    if (success) {
      setEditingId(null);
      toast({ title: 'Price updated', description: `${product.name} price updated to $${newPrice.toFixed(2)}` });
    }
  };

  const formatPrice = (price: number) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const discount = (price: number, original: number | null) => {
    if (!original || original <= price) return null;
    return Math.round(((original - price) / original) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-primary" />
          Manual Price Update
        </h2>
        <p className="text-muted-foreground mt-1">
          Quickly update product prices. All prices are in USD.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Current Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Original Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Discount</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => {
                const isEditing = editingId === product.id;
                const isSaving = saving === product.id;
                const disc = discount(product.price, product.original_price);

                return (
                  <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.images[0] && product.images[0] !== '/placeholder.svg' ? product.images[0] : getDemoImage(product.name)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editData.price}
                            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                            className="w-24 h-8 text-sm"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <span className="font-semibold">{formatPrice(product.price)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">$</span>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editData.originalPrice}
                            onChange={(e) => setEditData({ ...editData, originalPrice: e.target.value })}
                            className="w-24 h-8 text-sm"
                            placeholder="None"
                          />
                        </div>
                      ) : (
                        <span className="text-muted-foreground">
                          {product.original_price ? formatPrice(product.original_price) : '—'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {disc ? (
                        <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                          -{disc}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditing}
                            disabled={isSaving}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => savePrice(product)}
                            disabled={isSaving}
                            className="h-8 px-3"
                          >
                            {isSaving ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(product)}
                          className="h-8"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Edit Price
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPriceUpdate;
