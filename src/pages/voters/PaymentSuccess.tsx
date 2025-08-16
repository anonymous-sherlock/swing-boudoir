import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Heart, 
  Star, 
  Trophy, 
  ArrowRight, 
  Download,
  Share2,
  Home,
  Users
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentDetails {
  packageName: string;
  votes: number;
  amount: number;
  paymentId: string;
  timestamp: string;
}

export function PaymentSuccess() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const sessionId = searchParams.get('session_id');

        if (paymentIntentId || sessionId) {
          // Fetch payment details from your backend
          const response = await fetch(`/api/v1/payments/verify?payment_intent=${paymentIntentId}&session_id=${sessionId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setPaymentDetails(data);
          }
        }

        // Show success toast
        toast({
          title: "Payment Successful!",
          description: "Your premium votes have been added to your account.",
        });
      } catch (error) {
        console.error('Error fetching payment details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams, toast]);

  const handleDownloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      customer: user?.name,
      email: user?.email,
      package: paymentDetails?.packageName,
      votes: paymentDetails?.votes,
      amount: paymentDetails?.amount,
      date: paymentDetails?.timestamp,
      paymentId: paymentDetails?.paymentId
    };

    const blob = new Blob([JSON.stringify(receiptData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${paymentDetails?.paymentId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareSuccess = async () => {
    try {
      const shareText = `Just purchased ${paymentDetails?.votes} premium votes on SWING Boudoir! Ready to support amazing models! 🎉`;
      await navigator.share({
        title: 'Payment Successful',
        text: shareText,
        url: window.location.origin
      });
    } catch (error) {
      // Fallback to clipboard
      const shareText = `Just purchased ${paymentDetails?.votes} premium votes on SWING Boudoir! Ready to support amazing models! 🎉`;
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "Shared!",
        description: "Success message copied to clipboard.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Payment Successful!</h1>
        <p className="text-xl text-muted-foreground">
          Thank you for your purchase. Your premium votes have been added to your account.
        </p>
      </div>

      {/* Payment Details */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-green-600" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Package:</span>
                  <span className="font-medium">{paymentDetails.packageName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Votes Added:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Heart className="w-3 h-3 mr-1" />
                    {paymentDetails.votes} Premium Votes
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">${paymentDetails.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment ID:</span>
                  <span className="text-xs font-mono text-gray-500">{paymentDetails.paymentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm">{new Date(paymentDetails.timestamp).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">What's Next?</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Start Voting</p>
                      <p className="text-xs text-gray-600">Use your premium votes without cooldown periods</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Support Models</p>
                      <p className="text-xs text-gray-600">Help your favorite models win contests</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Trophy className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Access Premium Features</p>
                      <p className="text-xs text-gray-600">Unlock exclusive contests and voting tools</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Button asChild className="flex-1">
              <Link to="/voters/browse-contests">
                <Trophy className="w-4 h-4 mr-2" />
                Browse Contests
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <Link to="/voters/favorites">
                <Heart className="w-4 h-4 mr-2" />
                View Favorites
              </Link>
            </Button>
            
            <Button variant="outline" onClick={handleDownloadReceipt}>
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            
            <Button variant="outline" onClick={handleShareSuccess}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Start Voting</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Use your new premium votes to support your favorite models
            </p>
            <Button asChild size="sm">
              <Link to="/voters/browse-contests">
                Vote Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Discover Models</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find new models to support and add to your favorites
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/voters/favorites">
                Explore
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">View Dashboard</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Check your voting stats and premium vote balance
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/voters">
                Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you have any questions about your purchase or premium votes, our support team is here to help.
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/support">
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/voters/vote-history">
                  View Vote History
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentSuccess;
