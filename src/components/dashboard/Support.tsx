import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Mail, Phone, Clock, HelpCircle, Trophy, Users, CreditCard, Camera, Star, Shield, AlertCircle } from "lucide-react";

export function Support() {
  const openIntercom = () => {
    // TODO: Initialize Intercom chat
    console.log("Opening Intercom chat");
    // window.Intercom('show');
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/[PHONE_NUMBER]?text=Hi! I need help with the Swing Boudoir Competition", "_blank");
  };

  const supportCategories = [
    {
      icon: <Trophy className="h-5 w-5" />,
      title: "Competition Support",
      email: "competition@swingboudoir.com",
      description: "Entry questions, voting issues, prize information"
    },
    {
      icon: <Camera className="h-5 w-5" />,
      title: "Model Support",
      email: "models@swingboudoir.com",
      description: "Photo requirements, profile setup, promotional help"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Payment & Billing",
      email: "billing@swingboudoir.com",
      description: "Vote purchases, refunds, payment issues"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Technical Issues",
      email: "tech@swingboudoir.com",
      description: "Website problems, voting errors, account access"
    }
  ];

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
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Voting closes in 3 days. Need urgent help? Use live chat for fastest response.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20" onClick={openIntercom}>
          <CardContent className="pt-6 text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Instant support from our team
            </p>
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Online Now
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={openWhatsApp}>
          <CardContent className="pt-6 text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">WhatsApp Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Quick help via WhatsApp
            </p>
            <Badge variant="secondary">+1 (555) 123-4567</Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6 text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Detailed help via email
            </p>
            <Badge variant="outline">24hr response</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Specialized Support Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Specialized Support Teams
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {supportCategories.map((category, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="bg-primary/10 rounded-full p-2">
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{category.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                  <a href={`mailto:${category.email}`} className="text-sm text-primary hover:underline">
                    {category.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support Hours & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Support Hours
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Live Chat</span>
              <Badge className="bg-green-100 text-green-800">24/7 Available</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Email Support</span>
              <span className="text-sm text-muted-foreground">Within 24 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span>WhatsApp</span>
              <span className="text-sm text-muted-foreground">Mon-Fri: 9AM-9PM IST</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Phone Support</span>
              <span className="text-sm text-muted-foreground">Mon-Fri: 10AM-6PM IST</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Competition Period:</strong> Extended support hours during active voting
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="mr-2 h-5 w-5" />
              VIP Model Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Top 10 contestants get priority support access:
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Dedicated account manager
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Priority chat queue
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Promotional guidance
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  Technical assistance
                </li>
              </ul>
              <Button variant="outline" size="sm" className="mt-3">
                <Mail className="mr-2 h-4 w-4" />
                vip@swingboudoir.com
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

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
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  How do I vote for my favorite model?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Click on any model's profile and hit the "Vote Now" button. You get 1 free vote every 24 hours per email. Want to vote more? Purchase vote packages starting at $1 for 5 votes.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  What prizes can models win?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  🥇 Winner: $999 cash + magazine cover + Instagram collab<br/>
                  🖐 Top 5: Magazine feature + Hall of Fame entry<br/>
                  🔟 Top 10: Digital interview + social spotlight
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  How does the voter reward wheel work?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  After voting, spin our reward wheel to win extra votes, exclusive content access, or free digital magazine copies. Each voter gets one spin per day!
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  When does voting end?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Check the countdown timer on our homepage. Winners are announced within 48 hours of voting closure. Follow us on Instagram @swingboudoir for live updates!
                </div>
              </details>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-primary">👗 For Models</h4>
              
              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  How do I join the competition?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Reply "I'M IN" to our competition post, complete the onboarding form we send you, and submit 3-5 high-quality photos. Entry is 100% FREE!
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  What photo requirements do you have?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  High-resolution (1080x1080+), professional lighting, boudoir/fashion appropriate, no watermarks. Must be original content you own the rights to.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  How can I promote my voting link?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Share your personal voting link on Instagram, TikTok, WhatsApp, Snapchat! We provide ready-made templates and captions to help you get more votes.
                </div>
              </details>

              <details className="border rounded-lg">
                <summary className="p-3 cursor-pointer font-medium hover:bg-muted/50 text-sm">
                  What if I'm in the Top 10?
                </summary>
                <div className="px-3 pb-3 text-sm text-muted-foreground">
                  Top 10 models get VIP support access, dedicated account managers, and priority assistance. You'll also receive your prizes within 2-4 weeks of competition end.
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
            <p className="text-muted-foreground mb-4">
              Our expert support team is standing by to help you succeed in the competition
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={openIntercom} size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Live Chat
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = 'mailto:support@swingboudoir.com'}>
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