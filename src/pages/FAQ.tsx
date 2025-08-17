import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";

const FAQ = () => {
  const faqs = [
    {
      id: "eligibility",
      question: "Who can participate in Maxim Covergirl competitions?",
      answer:
        "All models aged 18 and above can participate in our competitions. You must be legally able to enter contracts and travel internationally if you win. No prior modeling experience is required.",
    },
    {
      id: "entry-fee",
      question: "Is there an entry fee to join competitions?",
      answer: "No, all Maxim Covergirl competitions are completely free to enter. We believe talent should be accessible to everyone, regardless of financial background.",
    },
    {
      id: "submission-requirements",
      question: "What do I need to submit for my entry?",
      answer:
        "Typically, you'll need to submit 3-5 high-quality photos showcasing different looks and styles, a brief bio, and complete the registration form. Specific requirements may vary by competition.",
    },
    {
      id: "judging-process",
      question: "How are winners selected?",
      answer:
        "Our panel of industry professionals evaluates entries based on photogenic quality, personality, marketability, and alignment with the competition theme. Public voting may also be a component.",
    },
    {
      id: "prize-distribution",
      question: "How and when are prizes distributed?",
      answer: "Cash prizes are distributed within 30 days of winner announcement via bank transfer. Travel prizes and experiences are coordinated with winners within 60 days.",
    },
    {
      id: "photo-rights",
      question: "What happens to my submitted photos?",
      answer: "You retain ownership of your photos. By submitting, you grant Maxim limited rights to use your photos for competition promotion and marketing purposes.",
    },
    {
      id: "multiple-competitions",
      question: "Can I enter multiple competitions simultaneously?",
      answer: "Yes, you can enter multiple active competitions at the same time. Each competition is judged independently.",
    },
    {
      id: "international-participants",
      question: "Can international models participate?",
      answer: "Most competitions are open to international participants. However, travel prizes may have restrictions, and winners are responsible for visa requirements.",
    },
    {
      id: "disqualification",
      question: "What can lead to disqualification?",
      answer: "Disqualification may occur for submitting inappropriate content, violating terms of service, providing false information, or engaging in spam/fraudulent voting.",
    },
    {
      id: "technical-issues",
      question: "What if I experience technical issues during submission?",
      answer: "Contact our support team immediately at support@maximcovergirl.com with details about the issue. We'll help resolve problems before competition deadlines.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed answers to your questions",
      contact: "support@maximcovergirl.com",
      responseTime: "Within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      responseTime: "Typically within minutes",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+1 (555) 123-4567",
      responseTime: "Mon-Fri, 9AM-6PM EST",
    },
  ];

  return (
    <main className="pt-16 pb-16">
      {/* Page Header */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8">
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Center
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">Find answers to the most common questions about Maxim Covergirl competitions</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-border rounded-lg px-6 shadow-card hover:shadow-luxury transition-luxury">
                  <AccordionTrigger className="text-left py-6 hover:no-underline hover:text-accent transition-smooth">
                    <span className="font-medium text-foreground">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Our support team is here to help you with any questions or issues</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center shadow-card hover:shadow-luxury transition-luxury">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent/20 mb-6">
                    <method.icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{method.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                  <p className="font-medium text-foreground mb-2">{method.contact}</p>
                  <p className="text-xs text-muted-foreground">{method.responseTime}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button className="bg-gradient-competition text-competition-foreground hover:opacity-90 transition-smooth">Contact Support</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FAQ;
