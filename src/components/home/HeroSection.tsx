import { Button } from "@/components/ui/button";
import { ChevronRight, Trophy, Users, DollarSign, TrophyIcon, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import heroDesktop from "@/assets/hero-desktop.jpg";
import heroMobile from "@/assets/hero-mobile.jpg";
import { useContestsAnalytics } from "@/hooks/api/useContests";

const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  const { data: contestsAnalytics } = useContestsAnalytics();
  const stats = [
    { icon: DollarSign, label: "Prize Pool", value: "$20,000+" },
    { icon: Trophy, label: "Active Competitions", value: contestsAnalytics?.active },
    { icon: Trophy, label: "Upcoming Competitions", value: contestsAnalytics?.upcoming },
    { icon: Users, label: "Models Registered", value: "2,000+" },
  ];

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source media="(min-width: 768px)" srcSet={heroDesktop} />
            <img src={heroMobile} alt="Swing Boudoir Competition" className="w-full h-full object-cover" />
          </picture>
          <div className="absolute inset-0 bg-gradient-overlay"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center mb-10  ">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8 animate-fade-in">
              <TrophyIcon className="w-4 h-4 mr-2" />
              {isAuthenticated ? "Welcome back! Ready to compete?" : "Join competitions for your chance to win"}
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-up">
              Over <span className="bg-gradient-luxury bg-clip-text text-transparent">$20,000</span> in prizes
            </h1>

            <h2 className="font-display text-2xl md:text-4xl lg:text-5xl font-semibold text-white mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              will be awarded this year!
            </h2>

            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {isAuthenticated 
                ? "You're all set! Browse active competitions, join contests, and start competing for amazing prizes."
                : "Become a Swing Boudoir content creator and compete with models from around the world. Enter exclusive competitions and win amazing prizes."
              }
            </p>

            {/* CTA Buttons */}
            <div className="mb-16 animate-scale-in" style={{ animationDelay: "0.6s" }}>
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-competition text-competition-foreground hover:opacity-90 transition-luxury text-sm px-6 py-3 h-auto shadow-glow"
                  >
                    Go to Dashboard
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/auth/$id" params={{ id: "sign-in" }}>
                  <Button
                    size="lg"
                    className="bg-gradient-competition text-competition-foreground hover:opacity-90 transition-luxury text-lg px-8 py-4 h-auto shadow-glow"
                  >
                    Register Now
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: "0.8s" }}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
                    <stat.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/70 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-accent/20 blur-xl animate-float"></div>
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-competition/20 blur-xl animate-float" style={{ animationDelay: "1s" }}></div>
      </section>
    </>
  );
};

export default HeroSection;
