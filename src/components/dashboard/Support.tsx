import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Phone, Clock, HelpCircle } from "lucide-react";

export function Support() {
  const openIntercom = () => {
    // TODO: Initialize Intercom chat
    console.log("Opening Intercom chat");
    // window.Intercom('show');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Support</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Need Assistance? We're Here to Help!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-8 bg-primary/5 rounded-lg">
            <MessageCircle className="mx-auto h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat Support</h3>
            <p className="text-muted-foreground mb-4">
              Get instant help from our support team. Just click the Intercom chat bubble in the bottom-right corner.
            </p>
            <Button onClick={openIntercom} size="lg">
              <MessageCircle className="mr-2 h-5 w-5" />
              Open Live Chat
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Other Ways to Reach Us</h3>
              
              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">support@swingboudior.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">1-800-SB-1</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 border rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM IST</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              
              <div className="space-y-3">
                <details className="border rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50">
                    How do I vote for a contestant?
                  </summary>
                  <div className="px-3 pb-3 text-sm text-muted-foreground">
                    Navigate to the contestant's profile and click the "Vote" button. You get one free vote every 24 hours, or you can purchase additional votes.
                  </div>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50">
                    How do I join a competition?
                  </summary>
                  <div className="px-3 pb-3 text-sm text-muted-foreground">
                    Go to the Competitions page and click "Join Competition" for any active competition. Complete your profile and upload photos to participate.
                  </div>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50">
                    When will I receive my prize?
                  </summary>
                  <div className="px-3 pb-3 text-sm text-muted-foreground">
                    Prizes are typically shipped within 2-4 weeks after competition ends. You'll receive tracking information via email.
                  </div>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50">
                    How do premium votes work?
                  </summary>
                  <div className="px-3 pb-3 text-sm text-muted-foreground">
                    Premium votes allow you to vote multiple times without waiting 24 hours. Purchase vote packages through our secure payment system.
                  </div>
                </details>

                <details className="border rounded-lg">
                  <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50">
                    Can I change my profile information?
                  </summary>
                  <div className="px-3 pb-3 text-sm text-muted-foreground">
                    Yes! Go to the "Edit Profile" section in your dashboard to update your information, photos, and messages for voters.
                  </div>
                </details>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Can't find what you're looking for?</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Our support team is available to help with any questions or issues you might have.
            </p>
            <Button variant="outline" onClick={openIntercom}>
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}