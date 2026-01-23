import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ProductColor {
  name: string;
  hex: string;
}

interface ProductColorPickerProps {
  colors: ProductColor[];
  onColorsChange: (colors: ProductColor[]) => void;
}

const PRESET_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Cream', hex: '#F5F5DC' },
  { name: 'Beige', hex: '#F5E6D3' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Emerald', hex: '#0B5D3B' },
  { name: 'Deep Green', hex: '#0B5D3B' },
  { name: 'Burgundy', hex: '#722F37' },
  { name: 'Sky Blue', hex: '#87CEEB' },
  { name: 'Sage', hex: '#9CAF88' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
  { name: 'Pearl', hex: '#F0EAD6' },
  { name: 'Midnight', hex: '#191970' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Mint', hex: '#98FB98' },
  { name: 'Blush', hex: '#FFB6C1' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Light Green', hex: '#90EE90' },
  { name: 'Onyx', hex: '#353935' },
  { name: 'Gold', hex: '#D4AF37' },
];

const ProductColorPicker = ({ colors, onColorsChange }: ProductColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customHex, setCustomHex] = useState('#000000');

  const addColor = (color: ProductColor) => {
    // Check if color already exists
    if (colors.some(c => c.hex.toLowerCase() === color.hex.toLowerCase())) {
      return;
    }
    onColorsChange([...colors, color]);
  };

  const removeColor = (index: number) => {
    onColorsChange(colors.filter((_, i) => i !== index));
  };

  const addCustomColor = () => {
    if (customName.trim() && customHex) {
      addColor({ name: customName.trim(), hex: customHex });
      setCustomName('');
      setCustomHex('#000000');
    }
  };

  const isColorSelected = (hex: string) => {
    return colors.some(c => c.hex.toLowerCase() === hex.toLowerCase());
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Product Colors</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Color
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Preset Colors</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color.hex + color.name}
                      type="button"
                      onClick={() => addColor(color)}
                      disabled={isColorSelected(color.hex)}
                      className="group relative"
                      title={color.name}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg border-2 transition-all ${
                          isColorSelected(color.hex)
                            ? 'border-primary opacity-50 cursor-not-allowed'
                            : 'border-border hover:border-primary hover:scale-110'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      {color.hex === '#FFFFFF' && (
                        <div className="absolute inset-0 rounded-lg border border-border" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Custom Color</Label>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Color name"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-12 h-9 rounded border border-border cursor-pointer"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addCustomColor}
                    disabled={!customName.trim()}
                    className="h-9"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {colors.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 group"
            >
              <div
                className="w-6 h-6 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-sm font-medium">{color.name}</span>
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No colors selected. Click "Add Color" to add product colors.
        </p>
      )}
    </div>
  );
};

export default ProductColorPicker;
