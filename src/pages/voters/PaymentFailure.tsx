import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  ArrowLeft, 
  CreditCard,
  HelpCircle,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentError {
  code: string;
  message: string;
  declineCode?: string;
  paymentIntentId?: string;
}

export function PaymentFailure() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getErrorDetails = () => {
      try {
        const errorCode = searchParams.get('error_code');
        const errorMessage = searchParams.get('error_message');
        const declineCode = searchParams.get('decline_code');
        const paymentIntentId = searchParams.get('payment_intent');

        if (errorCode || errorMessage) {
          setPaymentError({
            code: errorCode || 'payment_failed',
            message: errorMessage || 'Payment processing failed',
            declineCode: declineCode || undefined,
            paymentIntentId: paymentIntentId || undefined
          });
        }

        // Show error toast
        toast({
          title: "Payment Failed",
          description: errorMessage || "There was an issue processing your payment.",
          variant: "destructive"
        });
      } catch (error) {
        console.error('Error parsing payment error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getErrorDetails();
  }, [searchParams, toast]);

  const getErrorMessage = (code: string, declineCode?: string) => {
    switch (code) {
      case 'card_declined':
        switch (declineCode) {
          case 'insufficient_funds':
            return 'Your card has insufficient funds. Please try a different payment method.';
          case 'card_not_supported':
            return 'This card type is not supported. Please use a different card.';
          case 'expired_card':
            return 'Your card has expired. Please update your payment information.';
          default:
            return 'Your card was declined. Please check your card details and try again.';
        }
      case 'expired_card':
        return 'Your card has expired. Please update your payment information.';
      case 'incorrect_cvc':
        return 'The security code (CVC) is incorrect. Please check and try again.';
      case 'processing_error':
        return 'There was an error processing your payment. Please try again.';
      case 'rate_limit':
        return 'Too many payment attempts. Please wait a moment and try again.';
      case 'invalid_request':
        return 'Invalid payment information. Please check your details and try again.';
      default:
        return 'Payment processing failed. Please try again or contact support.';
    }
  };

  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'card_declined':
      case 'expired_card':
      case 'incorrect_cvc':
        return <CreditCard className="w-6 h-6 text-red-500" />;
      case 'processing_error':
      case 'rate_limit':
        return <RefreshCw className="w-6 h-6 text-orange-500" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const handleRetryPayment = () => {
    // Redirect back to buy votes page
    window.location.href = '/voters/buy-votes';
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Payment Failed - Need Help');
    const body = encodeURIComponent(`
Hi Support Team,

I encountered a payment issue with the following details:
- Error Code: ${paymentError?.code}
- Error Message: ${paymentError?.message}
- Payment Intent ID: ${paymentError?.paymentIntentId}
- User ID: ${user?.id}

Please help me resolve this issue.

Best regards,
${user?.name}
    `);
    
    window.location.href = `mailto:support@swingboudoir.com?subject=${subject}&body=${body}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600">Loading error details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Error Header */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h1 className="text-4xl font-bold text-foreground">Payment Failed</h1>
        <p className="text-xl text-muted-foreground">
          We couldn't process your payment. Don't worry, you haven't been charged.
        </p>
      </div>

      {/* Error Details */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-800">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Error Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentError && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getErrorIcon(paymentError.code)}
                  <div>
                    <h4 className="font-semibold text-red-800">Error Type</h4>
                    <p className="text-sm text-red-600 capitalize">
                      {paymentError.code.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">What Happened</h4>
                  <p className="text-sm text-red-700">
                    {getErrorMessage(paymentError.code, paymentError.declineCode)}
                  </p>
                </div>

                {paymentError.paymentIntentId && (
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">Reference ID</h4>
                    <p className="text-xs font-mono text-red-600 bg-red-100 p-2 rounded">
                      {paymentError.paymentIntentId}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-red-800">What You Can Do</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Check Your Card</p>
                      <p className="text-xs text-red-600">Verify card details and expiration date</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Try Different Method</p>
                      <p className="text-xs text-red-600">Use a different card or payment method</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-sm">Contact Support</p>
                      <p className="text-xs text-red-600">Get help from our support team</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-red-200">
            <Button 
              onClick={handleRetryPayment}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button asChild variant="outline" className="flex-1">
              <Link to="/voters/buy-votes">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Packages
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleContactSupport}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Common Solutions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <CreditCard className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Check Card Details</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Verify your card number, expiration date, and CVC code
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetryPayment}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <HelpCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Get Help</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contact our support team for assistance with payment issues
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleContactSupport}
            >
              Contact Support
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <MessageCircle className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team for immediate assistance
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('/support/chat', '_blank')}
            >
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Support Information */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="font-semibold">Need Immediate Help?</h3>
            <p className="text-sm text-muted-foreground">
              Our support team is available 24/7 to help you resolve payment issues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm">support@swingboudoir.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Live Chat Available</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Actions */}
      <Card>
        <CardHeader>
          <CardTitle>What Would You Like to Do?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link to="/voters">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">D</span>
                </div>
                <span className="text-sm">Go to Dashboard</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link to="/voters/browse-contests">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs font-bold">C</span>
                </div>
                <span className="text-sm">Browse Contests</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link to="/voters/favorites">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-xs font-bold">F</span>
                </div>
                <span className="text-sm">View Favorites</span>
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Link to="/support">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xs font-bold">S</span>
                </div>
                <span className="text-sm">Support Center</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentFailure;
