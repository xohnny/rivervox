import { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreVertical, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useInventory, InventoryProduct } from '@/hooks/useInventory';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const formatPrice = (price: number) => `৳${price.toLocaleString('en-BD', { maximumFractionDigits: 0 })}`;

const AdminProducts = () => {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const { products, loading, addProduct, updateProduct, deleteProduct } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    sizes: '',
    colors: '',
    images: '',
    lowStockThreshold: '10',
    featured: false,
    isActive: true,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      price: '',
      originalPrice: '',
      stock: '',
      sizes: '',
      colors: '',
      images: '',
      lowStockThreshold: '10',
      featured: false,
      isActive: true,
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map(c => {
      const trimmed = c.trim();
      return { name: trimmed, hex: '#000000' };
    }).filter(c => c.name);
    const imagesArray = formData.images.split(',').map(i => i.trim()).filter(Boolean);

    const success = await addProduct({
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category,
      sizes: sizesArray,
      colors: colorsArray,
      images: imagesArray.length > 0 ? imagesArray : ['/placeholder.svg'],
      stock: parseInt(formData.stock) || 0,
      low_stock_threshold: parseInt(formData.lowStockThreshold) || 10,
      featured: formData.featured,
      is_active: formData.isActive,
    });

    setSaving(false);
    if (success) {
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleEditClick = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || '',
      stock: product.stock.toString(),
      sizes: product.sizes.join(', '),
      colors: product.colors.map(c => c.name).join(', '),
      images: product.images.join(', '),
      lowStockThreshold: product.low_stock_threshold.toString(),
      featured: product.featured,
      isActive: product.is_active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSaving(true);

    const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = formData.colors.split(',').map(c => {
      const trimmed = c.trim();
      const existingColor = selectedProduct.colors.find(ec => ec.name.toLowerCase() === trimmed.toLowerCase());
      return { name: trimmed, hex: existingColor?.hex || '#000000' };
    }).filter(c => c.name);
    const imagesArray = formData.images.split(',').map(i => i.trim()).filter(Boolean);

    const success = await updateProduct(selectedProduct.id, {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price) || 0,
      original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      category: formData.category,
      sizes: sizesArray,
      colors: colorsArray,
      images: imagesArray.length > 0 ? imagesArray : ['/placeholder.svg'],
      stock: parseInt(formData.stock) || 0,
      low_stock_threshold: parseInt(formData.lowStockThreshold) || 10,
      featured: formData.featured,
      is_active: formData.isActive,
    });

    setSaving(false);
    if (success) {
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
    }
  };

  const handleDeleteClick = (product: InventoryProduct) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    await deleteProduct(selectedProduct.id);
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const toggleProductStatus = async (product: InventoryProduct) => {
    await updateProduct(product.id, { is_active: !product.is_active });
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-display font-bold text-destructive">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You don't have permission to view this page.</p>
      </div>
    );
  }

  const ProductForm = ({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) => (
    <form onSubmit={onSubmit} className="space-y-4 mt-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Product Name *</Label>
          <Input 
            placeholder="Enter product name" 
            className="mt-1" 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Category *</Label>
          <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="children">Children</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label>Description</Label>
        <Textarea 
          placeholder="Product description" 
          className="mt-1" 
          rows={3} 
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label>Price (৳) *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="mt-1" 
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>Original Price (৳)</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="mt-1" 
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
          />
        </div>
        <div>
          <Label>Stock Quantity *</Label>
          <Input 
            type="number" 
            placeholder="0" 
            className="mt-1" 
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Sizes (comma-separated)</Label>
          <Input 
            placeholder="S, M, L, XL" 
            className="mt-1" 
            value={formData.sizes}
            onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
          />
        </div>
        <div>
          <Label>Low Stock Threshold</Label>
          <Input 
            type="number" 
            placeholder="10" 
            className="mt-1" 
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Colors (comma-separated)</Label>
        <Input 
          placeholder="Black, White, Green" 
          className="mt-1" 
          value={formData.colors}
          onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
        />
      </div>
      <div>
        <Label>Image URLs (comma-separated)</Label>
        <Textarea
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className="mt-1"
          rows={2}
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
        />
      </div>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded border-border"
          />
          <span className="text-sm">Featured Product</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            className="rounded border-border"
          />
          <span className="text-sm">Active</span>
        </label>
      </div>
      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            setIsAddDialogOpen(false);
            setIsEditDialogOpen(false);
            resetForm();
          }} 
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
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
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="men">Men</SelectItem>
            <SelectItem value="women">Women</SelectItem>
            <SelectItem value="children">Children</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold">Product</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Category</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Price</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-semibold">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.images[0] || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {product.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold">{formatPrice(product.price)}</p>
                      {product.original_price && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.original_price)}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'text-sm',
                        product.stock <= product.low_stock_threshold && product.stock > 0 && 'text-amber-600',
                        product.stock === 0 && 'text-destructive'
                      )}
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        product.is_active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      )}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem onClick={() => handleEditClick(product)} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleProductStatus(product)} className="cursor-pointer">
                          {product.is_active ? (
                            <>
                              <EyeOff className="w-4 h-4 mr-2" />
                              Disable
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Enable
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(product)} className="text-destructive cursor-pointer">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} submitLabel="Add Product" />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleUpdateProduct} submitLabel="Save Changes" />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;