import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  if (totalItems === 0) {
    return (
      <div className="relative">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="relative">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="relative">
        <ShoppingCart className="h-5 w-5" />
        <Badge className="absolute -top-2 -right-2 bg-warm-orange text-white min-w-[20px] h-5 flex items-center justify-center text-xs">
          {totalItems}
        </Badge>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-auto z-50 shadow-strong bg-gradient-card border border-warm-orange/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-center">
              <span>Your Cart</span>
              <Badge variant="secondary">{totalItems} items</Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                <span className="text-2xl">{item.image}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name}</h4>
                  <p className="text-warm-orange font-bold">Rs {item.price}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  
                  <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 p-0 ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total:</span>
              <span className="text-warm-orange">Rs {totalPrice}</span>
            </div>
            
            <Button 
              className="w-full bg-gradient-premium text-white shadow-medium hover:shadow-strong transition-all duration-300"
              onClick={() => {
                setIsOpen(false);
                navigate('/payment');
              }}
            >
              Proceed to Checkout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};