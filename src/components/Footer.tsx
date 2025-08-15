import { Instagram, Twitter, Facebook, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerLinks = {
    "Competitions": [
      { label: "Active Competitions", href: "/competitions" },
      { label: "How to Enter", href: "/how-to-enter" },
      { label: "Competition Rules", href: "/rules" },
      { label: "Past Winners", href: "/winners" }
    ],
    "Support": [
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
      { label: "Technical Support", href: "/support" },
      { label: "Guidelines", href: "/guidelines" }
    ],
    "Legal": [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Contest Rules", href: "/contest-rules" }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/maxim", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/maxim", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com/maxim", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com/maxim", label: "YouTube" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-display text-3xl font-bold mb-4">
              Stay in the loop
            </h3>
            <p className="text-white/80 mb-8">
              Get notified about new competitions, winners, and exclusive opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Button className="bg-gradient-competition text-competition-foreground hover:opacity-90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-col mb-6">
              <div className="text-3xl font-display font-bold tracking-tight">
                SWING
              </div>
              <div className="text-sm text-white/60 tracking-wider">
                Boudoir
              </div>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Join the most prestigious modeling competitions and win life-changing prizes. 
              Become part of the Swing Boudoir family and launch your modeling career.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-smooth"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-accent transition-smooth text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white/60 text-sm mb-4 md:mb-0">
              © 2025 Swing Boudoir. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="/terms" className="text-white/60 hover:text-accent transition-smooth">
                Terms
              </a>
              <a href="/privacy" className="text-white/60 hover:text-accent transition-smooth">
                Privacy
              </a>
              <a href="/cookies" className="text-white/60 hover:text-accent transition-smooth">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;