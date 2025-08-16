import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Star, 
  Gift, 
  Zap, 
  Check, 
  CreditCard,
  Lock,
  Shield,
  TrendingUp,
  Heart,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe (replace with your actual publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

interface VotePackage {
  id: string;
  name: string;
  votes: number;
  price: number;
  originalPrice?: number;
  savings?: number;
  popular?: boolean;
  bestValue?: boolean;
  features: string[];
  icon: React.ReactNode;
  stripePriceId?: string; // Stripe price ID for the package
}

const votePackages: VotePackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    votes: 25,
    price: 5,
    stripePriceId: 'price_starter_pack',
    features: [
      '25 premium votes',
      'No cooldown period',
      'Priority support',
      'Vote analytics'
    ],
    icon: <Star className="w-6 h-6 text-yellow-500" />
  },
  {
    id: 'popular',
    name: 'Popular Choice',
    votes: 100,
    price: 15,
    originalPrice: 20,
    savings: 25,
    popular: true,
    stripePriceId: 'price_popular_choice',
    features: [
      '100 premium votes',
      'No cooldown period',
      'Priority support',
      'Vote analytics',
      'Exclusive contests access',
      'Model favorites list'
    ],
    icon: <TrendingUp className="w-6 h-6 text-blue-500" />
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    votes: 250,
    price: 35,
    originalPrice: 50,
    savings: 30,
    stripePriceId: 'price_premium_pack',
    features: [
      '250 premium votes',
      'No cooldown period',
      'Priority support',
      'Vote analytics',
      'Exclusive contests access',
      'Model favorites list',
      'Early contest notifications',
      'VIP voting status'
    ],
    icon: <Heart className="w-6 h-6 text-red-500" />
  },
  {
    id: 'ultimate',
    name: 'Ultimate VIP',
    votes: 1000,
    price: 100,
    originalPrice: 200,
    savings: 50,
    bestValue: true,
    stripePriceId: 'price_ultimate_vip',
    features: [
      '1000 premium votes',
      'No cooldown period',
      'Priority support',
      'Vote analytics',
      'Exclusive contests access',
      'Model favorites list',
      'Early contest notifications',
      'VIP voting status',
      'Personal voting assistant',
      'Contest entry priority'
    ],
    icon: <Zap className="w-6 h-6 text-purple-500" />
  }
];

// Stripe Payment Form Component
function PaymentForm({ selectedPackage, onSuccess, onError }: {
  selectedPackage: VotePackage;
  onSuccess: (votes: number) => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create payment intent on your backend
      const response = await fetch('/api/v1/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          priceId: selectedPackage.stripePriceId,
          amount: selectedPackage.price * 100, // Convert to cents
          votes: selectedPackage.votes,
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: user.name,
            email: user.email
          }
        }
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError(stripeError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Update user's vote balance on backend
        const updateResponse = await fetch('/api/v1/users/votes/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            userId: user.id,
            votes: selectedPackage.votes,
            paymentIntentId: paymentIntent.id
          })
        });

        if (updateResponse.ok) {
          toast({
            title: "Payment Successful!",
            description: `You've successfully purchased ${selectedPackage.votes} premium votes.`,
          });
          onSuccess(selectedPackage.votes);
        } else {
          throw new Error('Failed to update vote balance');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Package:</span>
            <span className="font-medium">{selectedPackage.name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Votes:</span>
            <span className="font-medium">{selectedPackage.votes} premium votes</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-lg font-bold text-green-600">${selectedPackage.price}</span>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Pay ${selectedPackage.price}</span>
          </div>
        )}
      </Button>

      <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>SSL Encrypted</span>
        </div>
      </div>
    </form>
  );
}

export function BuyVotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = (votes: number) => {
    setShowPaymentForm(false);
    setSelectedPackage(null);
    // You might want to update the user's vote balance in your app state here
  };

  const handlePaymentError = (error: string) => {
    setShowPaymentForm(false);
    // Error is already handled in the PaymentForm component
  };

  const selectedPackageData = votePackages.find(pkg => pkg.id === selectedPackage);

  if (showPaymentForm && selectedPackageData) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Complete Your Purchase</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure payment powered by Stripe
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  selectedPackage={selectedPackageData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="w-5 h-5 mr-2 text-green-600" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Package Summary */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedPackageData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackageData.votes} premium votes
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedPackageData.price}
                    </div>
                    {selectedPackageData.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        ${selectedPackageData.originalPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Features */}
              <div>
                <h4 className="font-semibold mb-3">What you'll get:</h4>
                <ul className="space-y-2">
                  {selectedPackageData.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => setShowPaymentForm(false)}
                className="w-full"
              >
                ← Back to Packages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Buy Premium Votes</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Unlock unlimited voting power and support your favorite models with premium votes
        </p>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">No Cooldown</h3>
              <p className="text-sm text-muted-foreground">
                Vote as many times as you want without waiting
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">Premium Features</h3>
              <p className="text-sm text-muted-foreground">
                Access exclusive contests and advanced voting tools
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">Support Models</h3>
              <p className="text-sm text-muted-foreground">
                Help your favorite models win contests and grow
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vote Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {votePackages.map((pkg) => (
          <Card 
            key={pkg.id}
            className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPackage === pkg.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:scale-105'
            }`}
            onClick={() => handlePackageSelect(pkg.id)}
          >
            {/* Badges */}
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                🔥 POPULAR
              </Badge>
            )}
            
            {pkg.bestValue && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                ⭐ BEST VALUE
              </Badge>
            )}

            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                {pkg.icon}
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-3xl font-bold text-foreground">${pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${pkg.originalPrice}
                    </span>
                  )}
                </div>
                
                {pkg.savings && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save {pkg.savings}%
                  </Badge>
                )}
                
                <div className="text-2xl font-bold text-blue-600">
                  {pkg.votes} Votes
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Features */}
              <ul className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Select Button */}
              <Button 
                className={`w-full ${
                  selectedPackage === pkg.id 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
                variant={selectedPackage === pkg.id ? 'default' : 'outline'}
              >
                {selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold">How do premium votes work?</h4>
            <p className="text-sm text-muted-foreground">
              Premium votes allow you to vote for models without the 24-hour cooldown period. 
              They're perfect for supporting your favorite models in multiple contests.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Can I get a refund?</h4>
            <p className="text-sm text-muted-foreground">
              Premium votes are non-refundable once purchased. However, if you experience 
              technical issues, contact our support team for assistance.
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold">Do votes expire?</h4>
            <p className="text-sm text-muted-foreground">
              Premium votes are valid for 1 year from the date of purchase. 
              Use them wisely to support your favorite models!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BuyVotes;
