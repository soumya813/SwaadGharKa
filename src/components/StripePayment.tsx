import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { stripePromise } from '@/lib/stripe';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: true,
};

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onError, customerInfo }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'demo'>('demo');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'demo') {
        // Demo payment - simulate successful payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        onSuccess();
      } else {
        // Real Stripe payment
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error('Card element not found');
        }

        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
          billing_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        // In a real app, you would send the payment method to your server
        // For demo, we'll simulate success
        onSuccess();
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <Shield className="h-5 w-5 text-green-600" />
          Secure Payment
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('demo')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'demo'
                  ? 'border-warm-orange bg-warm-orange/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <CheckCircle className={`h-5 w-5 mx-auto mb-1 ${
                  paymentMethod === 'demo' ? 'text-warm-orange' : 'text-gray-400'
                }`} />
                <span className="text-sm font-medium">Demo Pay</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-warm-orange bg-warm-orange/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <CreditCard className={`h-5 w-5 mx-auto mb-1 ${
                  paymentMethod === 'card' ? 'text-warm-orange' : 'text-gray-400'
                }`} />
                <span className="text-sm font-medium">Credit Card</span>
              </div>
            </button>
          </div>
        </div>

        {/* Card Element */}
        {paymentMethod === 'card' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Card Details</label>
            <div className="p-4 border border-gray-300 rounded-lg bg-gray-50">
              <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>
          </div>
        )}

        {/* Demo Payment Info */}
        {paymentMethod === 'demo' && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              <strong>Demo Mode:</strong> This will simulate a successful payment without charging any real money.
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Summary */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Amount:</span>
            <span className="font-semibold">${amount.toFixed(2)}</span>
          </div>
          <div className="text-xs text-gray-500">
            Processing fee included • Secure SSL encryption
          </div>
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full h-12 bg-gradient-to-r from-warm-orange to-deep-orange hover:from-deep-orange hover:to-warm-orange text-white font-semibold text-lg shadow-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Pay ${amount.toFixed(2)}
              </>
            )}
          </Button>
        </form>

        {/* Security Info */}
        <div className="text-center text-xs text-gray-500">
          🔒 Your payment information is encrypted and secure
        </div>
      </CardContent>
    </Card>
  );
};

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export const StripePayment: React.FC<StripePaymentProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};
