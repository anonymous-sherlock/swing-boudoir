import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@maximcovergirl.com", "press@maximcovergirl.com"],
      description: "Get detailed answers to your questions"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 123-4568"],
      description: "Speak directly with our support team"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Fashion Avenue", "New York, NY 10001"],
      description: "Our headquarters in the heart of NYC"
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Monday - Friday: 9AM - 6PM EST", "Weekend: Limited support"],
      description: "When our team is available"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8">
              <Mail className="w-4 h-4 mr-2" />
              Get in Touch
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Have questions about competitions, technical issues, or partnerships? We're here to help
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                  Send us a Message
                </h2>
                <Card className="shadow-card">
                  <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="competition">Competition Question</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                            <SelectItem value="press">Press & Media</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-competition text-competition-foreground hover:opacity-90 transition-smooth"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          "Sending..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <Card key={index} className="shadow-card hover:shadow-luxury transition-luxury">
                      <CardContent className="p-6">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mr-4 flex-shrink-0">
                            <info.icon className="w-6 h-6 text-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground text-lg mb-2">
                              {info.title}
                            </h3>
                            <div className="space-y-1 mb-2">
                              {info.details.map((detail, detailIndex) => (
                                <p key={detailIndex} className="text-foreground font-medium">
                                  {detail}
                                </p>
                              ))}
                            </div>
                            <p className="text-muted-foreground text-sm">
                              {info.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Link */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quick Answers
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Many common questions are answered in our FAQ section
            </p>
            <Button asChild className="bg-gradient-luxury text-white hover:opacity-90 transition-smooth">
              <a href="/faq">View FAQ</a>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;