import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, Clock, HelpCircle, Trophy, Users, CreditCard, Camera, Star, Shield, AlertCircle } from "lucide-react";

export function Support() {
  const openWhatsApp = () => {
    window.open("https://wa.me/447878619356?text=Hi! I need help with the Swing Boudoir Competition", "_blank");
  };

  const openEmail = () => {
    window.location.href = "mailto:submit@swingboudoirmag.com?subject=Support Request - Swing Boudoir Competition";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Center</h1>
        <p className="text-muted-foreground text-lg">We're here to help you succeed in the Ultimate Cover Model Competition</p>
      </div>

      {/* Emergency Notice */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div>
              <p className="font-medium text-orange-800 dark:text-orange-200">Competition Deadline Approaching!</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">Voting closes in 3 days. Need urgent help? Use WhatsApp for fastest response.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={openWhatsApp}>
          <CardContent className="pt-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Quick help via WhatsApp</p>
            <Badge variant="secondary">+44 7878619356</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={openEmail}>
          <CardContent className="pt-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">Detailed help via email</p>
            <Badge variant="outline">submit@swingboudoirmag.com</Badge>
          </CardContent>
        </Card>
      </div>

      {/* General Support Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            General Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="bg-primary/10 rounded-full p-2">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Competition Support</h4>
                <p className="text-sm text-muted-foreground mb-2">Entry questions, voting issues, prize information, and general competition queries</p>
                <a href="mailto:submit@swingboudoirmag.com" className="text-sm text-primary hover:underline">
                  submit@swingboudoirmag.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="bg-primary/10 rounded-full p-2">
                <Camera className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Model Support</h4>
                <p className="text-sm text-muted-foreground mb-2">Photo requirements, profile setup, promotional help, and model-specific assistance</p>
                <a href="mailto:submit@swingboudoirmag.com" className="text-sm text-primary hover:underline">
                  submit@swingboudoirmag.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="bg-primary/10 rounded-full p-2">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Payment & Billing</h4>
                <p className="text-sm text-muted-foreground mb-2">Vote purchases, refunds, payment issues, and billing inquiries</p>
                <a href="mailto:submit@swingboudoirmag.com" className="text-sm text-primary hover:underline">
                  submit@swingboudoirmag.com
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
              <div className="bg-primary/10 rounded-full p-2">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium mb-1">Technical Issues</h4>
                <p className="text-sm text-muted-foreground mb-2">Website problems, voting errors, account access, and technical support</p>
                <a href="mailto:submit@swingboudoirmag.com" className="text-sm text-primary hover:underline">
                  submit@swingboudoirmag.com
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Support Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span>WhatsApp Support</span>
            <span className="text-sm text-muted-foreground">Mon-Fri: 9AM-9PM IST</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Email Support</span>
            <span className="text-sm text-muted-foreground">Within 24 hours</span>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              <strong>Competition Period:</strong> Extended support hours during active voting
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="mr-2 h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-primary">🏆 Competition & Voting</h4>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">How do I vote for my favorite model?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Click on any model's profile and hit the "Vote Now" button. You get 1 free vote every 24 hours per email. Want to vote more? Purchase vote packages starting at $1
                  for 5 votes.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">What prizes can models win?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  🥇 Winner: $999 cash + magazine cover + Instagram collab
                  <br />
                  🖐 Top 5: Magazine feature + Hall of Fame entry
                  <br />
                  🔟 Top 10: Digital interview + social spotlight
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">How does the voter reward wheel work?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  After voting, spin our reward wheel to win extra votes, exclusive content access, or free digital magazine copies. Each voter gets one spin per day!
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">When does voting end?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Check the countdown timer on our homepage. Winners are announced within 48 hours of voting closure. Follow us on Instagram @swingboudoir for live updates!
                </div>
              </details>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-primary">👗 For Models</h4>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">How do I join the competition?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Reply "I'M IN" to our competition post, complete the onboarding form we send you, and submit 3-5 high-quality photos. Entry is 100% FREE!
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">What photo requirements do you have?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  High-resolution (1080x1080+), professional lighting, boudoir/fashion appropriate, no watermarks. Must be original content you own the rights to.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">How can I promote my voting link?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Share your personal voting link on Instagram, TikTok, WhatsApp, Snapchat! We provide ready-made templates and captions to help you get more votes.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">What if I'm in the Top 10?</summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Top 10 models get priority support access and dedicated assistance. You'll also receive your prizes within 2-4 weeks of competition end.
                </div>
              </details>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Final CTA */}
      <Card className="bg-gradient-to-r from-primary/10 to-pink-100 dark:from-primary/20 dark:to-pink-950">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Still Need Help?</h3>
            <p className="text-muted-foreground mb-4">Our expert support team is standing by to help you succeed in the competition</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={openWhatsApp} size="lg">
                <Phone className="mr-2 h-5 w-5" />
                WhatsApp Support
              </Button>
              <Button variant="outline" size="lg" onClick={openEmail}>
                <Mail className="mr-2 h-5 w-5" />
                Email Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
