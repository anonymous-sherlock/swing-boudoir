import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, FileText, Users, Camera, Award } from "lucide-react";

const Rules = () => {
  const ruleCategories = [
    {
      icon: Users,
      title: "Eligibility Requirements",
      badge: "Essential",
      rules: [
        "Must be 18 years of age or older",
        "Legal resident of participating countries",
        "Not currently under exclusive modeling contract",
        "Able to travel internationally if selected",
        "No criminal background that would prevent travel"
      ]
    },
    {
      icon: Camera,
      title: "Submission Guidelines",
      badge: "Important",
      rules: [
        "Submit 3-5 high-resolution photos (minimum 300 DPI)",
        "Photos must be recent (within 6 months)",
        "No excessive retouching or filters",
        "Must own rights to all submitted photos",
        "Include variety of poses and outfits"
      ]
    },
    {
      icon: FileText,
      title: "Content Standards",
      badge: "Mandatory",
      rules: [
        "All content must be appropriate and tasteful",
        "No nudity or sexually explicit material",
        "Photos must comply with platform guidelines",
        "Respectful and professional presentation",
        "Original content only - no copyright infringement"
      ]
    },
    {
      icon: Award,
      title: "Competition Process",
      badge: "Process",
      rules: [
        "Judging combines expert panel and public voting",
        "Voting period varies by competition",
        "Winners announced within 2 weeks of voting close",
        "Decisions are final and binding",
        "One entry per person per competition"
      ]
    }
  ];

  const prohibitedActions = [
    "Creating multiple accounts or fake profiles",
    "Submitting photos that aren't of yourself",
    "Using bots or automated voting systems",
    "Harassment of other participants or judges",
    "Attempting to influence judges outside the platform",
    "Submitting inappropriate or offensive content"
  ];

  const prizeTerms = [
    "Cash prizes paid within 30 days of winner announcement",
    "Travel prizes must be claimed within 12 months",
    "Winners responsible for taxes on prize values",
    "Photo shoots and experiences non-transferable",
    "Maxim reserves right to substitute prizes of equal value"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8">
              <FileText className="w-4 h-4 mr-2" />
              Competition Guidelines
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              Competition Rules
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Please read and understand all rules before participating in any Maxim Covergirl competition
            </p>
          </div>
        </section>

        {/* Rules Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {ruleCategories.map((category, index) => (
                <Card key={index} className="shadow-card hover:shadow-luxury transition-luxury">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mr-3">
                          <category.icon className="w-5 h-5 text-accent" />
                        </div>
                        <CardTitle className="text-foreground">{category.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">{category.badge}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.rules.map((rule, ruleIndex) => (
                        <li key={ruleIndex} className="flex items-start">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Prohibited Actions */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Prohibited Actions
                </h2>
                <p className="text-lg text-muted-foreground">
                  The following actions will result in immediate disqualification
                </p>
              </div>

              <Card className="shadow-card border-destructive/20">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <AlertTriangle className="w-6 h-6 text-destructive mr-3" />
                    <h3 className="font-semibold text-destructive text-xl">
                      Actions That Lead to Disqualification
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {prohibitedActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-destructive rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-foreground">{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Prize Terms */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Prize Terms & Conditions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Important information about claiming and receiving prizes
                </p>
              </div>

              <Card className="shadow-card">
                <CardContent className="p-8">
                  <ul className="space-y-4">
                    {prizeTerms.map((term, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{term}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Legal Notice */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Legal Notice
              </h2>
              <div className="text-muted-foreground space-y-4 text-sm leading-relaxed">
                <p>
                  By participating in any Maxim Covergirl competition, you agree to abide by these rules 
                  and the platform's Terms of Service. Maxim reserves the right to modify rules and 
                  disqualify participants who violate guidelines.
                </p>
                <p>
                  These competitions are void where prohibited by law. Participants must comply with 
                  all local, state, and federal laws. For complete legal terms, please review our 
                  Terms of Service and Privacy Policy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a 
                  href="/terms" 
                  className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted/50 transition-smooth"
                >
                  Terms of Service
                </a>
                <a 
                  href="/privacy" 
                  className="inline-flex items-center justify-center px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted/50 transition-smooth"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rules;