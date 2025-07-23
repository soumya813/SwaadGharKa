import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, MapPin, User, Mail, Phone, Lock } from "lucide-react";

export const PaymentPage = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: ""
  });

  const deliveryFee = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + deliveryFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "Order placed successfully! 🎉",
      description: `Your order for $${finalTotal.toFixed(2)} has been confirmed. You'll receive an email confirmation shortly.`,
      duration: 5000,
    });
    
    clearCart();
    setIsProcessing(false);
    navigate("/");
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-card">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some delicious meals to your cart before checkout</p>
          <Button onClick={() => navigate("/menu")} className="bg-gradient-premium text-white">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-card">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your order and enjoy home-cooked goodness</p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="sticky top-24 shadow-medium border-warm-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Order Summary</span>
                  <Badge variant="secondary">{totalItems} items</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-warm-orange">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                      {deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-warm-orange">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {totalPrice < 50 && (
                  <div className="p-3 bg-gold/20 rounded-lg border border-gold/40">
                    <p className="text-sm text-center">
                      Add ${(50 - totalPrice).toFixed(2)} more for free delivery! 🚚
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6 lg:order-1">
            {/* Delivery Information */}
            <Card className="shadow-medium border-warm-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="shadow-medium border-warm-orange/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardName"
                      name="cardName"
                      required
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="pl-10 mt-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        required
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full py-6 text-lg bg-gradient-premium text-white shadow-medium hover:shadow-strong transition-all duration-300 transform hover:scale-[1.02]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Payment...
                </div>
              ) : (
                `Complete Order - $${finalTotal.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};