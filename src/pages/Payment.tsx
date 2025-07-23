import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, MapPin, User, Mail, Phone, ArrowRight, CheckCircle, AlertCircle, Smartphone, Copy } from "lucide-react";
import { StripePayment } from "@/components/StripePayment";

export const PaymentPage = () => {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'info' | 'payment' | 'success'>('info');
  const [error, setError] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('upi');
  const [upiId, setUpiId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
  });

  const deliveryFee = totalPrice > 500 ? 0 : 50;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + deliveryFee + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join(', ')}`);
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateForm()) {
      setCurrentStep('payment');
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "🎉 Order placed successfully!",
      description: `Your order for Rs ${finalTotal} has been confirmed. You'll receive an email confirmation shortly.`,
      duration: 5000,
    });
    
    clearCart();
    setCurrentStep('success');
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  const handleUpiPayment = () => {
    // Simulate UPI payment confirmation
    toast({
      title: "Processing payment confirmation...",
      description: "Please wait while we verify your payment",
      duration: 3000,
    });

    // Simulate payment verification delay
    setTimeout(() => {
      handlePaymentSuccess();
    }, 2000);
  };

  const copyUpiId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "UPI ID Copied!",
      description: `${id} has been copied to clipboard`,
      duration: 2000,
    });
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    toast({
      title: "Payment Failed",
      description: errorMessage,
      variant: "destructive",
    });
  };

  if (totalItems === 0) {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-light-cream to-cream">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-8xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add some delicious meals to your cart before checkout</p>
          <Button 
            onClick={() => navigate("/menu")} 
            className="bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white px-8 py-3 rounded-full"
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen pt-16 bg-gradient-to-b from-light-cream to-cream">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">Order Confirmed! 🎉</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Thank you for your order! We're preparing your delicious meal.
            </p>
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
              <p className="text-lg font-semibold text-warm-orange mb-2">Order Total: Rs {finalTotal}</p>
              <p className="text-sm text-gray-600">Estimated delivery: 45 minutes</p>
            </div>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-light-cream to-cream">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-warm-orange to-deep-orange bg-clip-text text-transparent mb-2">
            Checkout
          </h1>
          <p className="text-muted-foreground">Complete your order and enjoy home-cooked goodness</p>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center mt-6 space-x-4">
            <div className={`flex items-center ${currentStep === 'info' ? 'text-warm-orange' : 'text-green-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'info' ? 'bg-warm-orange text-white' : 'bg-green-500 text-white'
              }`}>
                {currentStep === 'info' ? '1' : '✓'}
              </div>
              <span className="ml-2 font-medium">Information</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
            <div className={`flex items-center ${currentStep === 'payment' ? 'text-warm-orange' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'payment' ? 'bg-warm-orange text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <Alert className="max-w-2xl mx-auto mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="sticky top-24 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span>Order Summary</span>
                  <Badge variant="secondary" className="bg-warm-orange/10 text-warm-orange">
                    {totalItems} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{item.image}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-semibold text-warm-orange">
                      Rs {(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Rs {totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Rs {Math.round(tax)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-warm-orange">
                    <span>Total</span>
                    <span>Rs {finalTotal}</span>
                  </div>
                </div>
                
                {deliveryFee === 0 && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      🎉 You qualify for free delivery! (Orders over Rs 500)
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Forms */}
          <div className="lg:order-1">
            {currentStep === 'info' && (
              <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-warm-orange" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  
                  <div>
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
                  
                  <div>
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
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <MapPin className="h-5 w-5 text-warm-orange" />
                      Delivery Address
                    </h3>
                    
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleContinueToPayment}
                    className="w-full h-12 bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white font-semibold text-lg"
                  >
                    Continue to Payment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('info')}
                  className="mb-4"
                >
                  ← Back to Information
                </Button>
                
                {/* Payment Method Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Choose Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <Button
                        variant={paymentMethod === 'upi' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('upi')}
                        className="h-20 flex flex-col items-center gap-2"
                      >
                        <Smartphone className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-semibold">UPI Payment</div>
                          <div className="text-sm text-muted-foreground">PhonePe, Google Pay, Paytm</div>
                        </div>
                      </Button>
                      <Button
                        variant={paymentMethod === 'card' ? 'default' : 'outline'}
                        onClick={() => setPaymentMethod('card')}
                        className="h-20 flex flex-col items-center gap-2"
                      >
                        <CreditCard className="h-6 w-6" />
                        <div className="text-center">
                          <div className="font-semibold">Card Payment</div>
                          <div className="text-sm text-muted-foreground">Credit/Debit Card</div>
                        </div>
                      </Button>
                    </div>

                    {paymentMethod === 'upi' && (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                          <h4 className="font-semibold text-blue-900 mb-4 text-center text-lg">Pay with UPI</h4>
                          
                          {/* QR Code Section */}
                          <div className="flex flex-col items-center mb-6">
                            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                              <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-4xl mb-2">📱</div>
                                  <div className="text-sm text-gray-600">QR Code</div>
                                  <div className="text-xs text-gray-500">Scan to Pay</div>
                                </div>
                              </div>
                            </div>
                            <p className="text-blue-700 text-sm text-center font-medium">
                              Scan QR code with any UPI app to pay Rs {finalTotal}
                            </p>
                          </div>

                          {/* UPI ID Section */}
                          <div className="text-center">
                            <p className="text-blue-700 text-sm mb-2">Or pay directly using UPI ID:</p>
                            <div className="flex items-center justify-center bg-white rounded-lg p-3 border border-blue-200 mb-4">
                              <span className="font-mono text-lg font-semibold text-gray-800">swaadgharka@paytm</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => copyUpiId('swaadgharka@paytm')}
                                className="ml-2"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-xs text-blue-600">
                              Amount: Rs {finalTotal} | Name: SwaadGharKa
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Button
                            onClick={handleUpiPayment}
                            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
                          >
                            <Smartphone className="mr-2 h-5 w-5" />
                            I have completed the payment
                          </Button>
                        </div>

                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            After making the UPI payment, click the button above to confirm your order. 
                            Do not refresh the page.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <StripePayment
                        amount={finalTotal}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                        customerInfo={{
                          name: `${formData.firstName} ${formData.lastName}`,
                          email: formData.email,
                          phone: formData.phone,
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
