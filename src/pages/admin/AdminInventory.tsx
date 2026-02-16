import { useState } from 'react';
import { Package, AlertTriangle, TrendingDown, Search, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInventory } from '@/hooks/useInventory';

import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AdminInventory = () => {
  const { products, stats, loading, updateStock, updateThreshold } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' && p.stock > 0 && p.stock <= p.low_stock_threshold) ||
      (stockFilter === 'out' && p.stock === 0) ||
      (stockFilter === 'ok' && p.stock > p.low_stock_threshold);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const startEditing = (product: typeof products[0]) => {
    setEditingId(product.id);
    setEditStock(product.stock);
    setEditThreshold(product.low_stock_threshold);
  };

  const saveEdits = async (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      if (editStock !== product.stock) {
        await updateStock(productId, editStock);
      }
      if (editThreshold !== product.low_stock_threshold) {
        await updateThreshold(productId, editThreshold);
      }
    }
    setEditingId(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold">Inventory Management</h1>
        <p className="text-muted-foreground mt-1">Track stock levels and manage alerts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-amber-600">{stats.lowStockCount}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-destructive">{stats.outOfStockCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-amber-600">{stats.activeAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Table - Full Width */}
      <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stock Levels</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="ok">In Stock</SelectItem>
                    <SelectItem value="low">Low Stock</SelectItem>
                    <SelectItem value="out">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-semibold">Product</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold">Category</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold">Stock</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold">Threshold</th>
                      <th className="text-center py-3 px-2 text-sm font-semibold">Status</th>
                      <th className="text-right py-3 px-2 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No products found
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product) => {
                        const isEditing = editingId === product.id;
                        const isLowStock = product.stock > 0 && product.stock <= product.low_stock_threshold;
                        const isOutOfStock = product.stock === 0;

                        return (
                          <tr key={product.id} className="hover:bg-muted/30">
                            <td className="py-3 px-2">
                              <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                            </td>
                            <td className="py-3 px-2">
                              <span className="capitalize text-sm text-muted-foreground">
                                {product.category}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-center">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={editStock}
                                  onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                                  className="w-20 h-8 text-center mx-auto"
                                  min={0}
                                />
                              ) : (
                                <span
                                  className={cn(
                                    'font-semibold',
                                    isOutOfStock && 'text-destructive',
                                    isLowStock && 'text-amber-600'
                                  )}
                                >
                                  {product.stock}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={editThreshold}
                                  onChange={(e) => setEditThreshold(parseInt(e.target.value) || 0)}
                                  className="w-20 h-8 text-center mx-auto"
                                  min={0}
                                />
                              ) : (
                                <span className="text-muted-foreground">{product.low_stock_threshold}</span>
                              )}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <span
                                className={cn(
                                  'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                                  isOutOfStock && 'bg-red-100 text-red-700',
                                  isLowStock && 'bg-amber-100 text-amber-700',
                                  !isOutOfStock && !isLowStock && 'bg-emerald-100 text-emerald-700'
                                )}
                              >
                                {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-right">
                              {isEditing ? (
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => saveEdits(product.id)}
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={cancelEditing}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditing(product)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default AdminInventory;
