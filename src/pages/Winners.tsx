import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Calendar, DollarSign, MapPin } from "lucide-react";

const Winners = () => {
  const winners = [
    {
      id: 1,
      name: "Sophia Rodriguez",
      competition: "Summer Paradise 2024",
      prize: "$50,000",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332b1ed?w=400&h=400&fit=crop&crop=face",
      date: "August 2024",
      location: "Miami, FL",
      description: "Sophia captured hearts with her stunning beachside photoshoot and charismatic personality."
    },
    {
      id: 2,
      name: "Emma Thompson",
      competition: "Fashion Week Elite 2024",
      prize: "$30,000",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      date: "June 2024",
      location: "New York, NY",
      description: "Emma's versatility and professional presence made her stand out among hundreds of contestants."
    },
    {
      id: 3,
      name: "Isabella Chen",
      competition: "Fitness Goddess 2024",
      prize: "$25,000",
      image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop&crop=face",
      date: "July 2024",
      location: "Los Angeles, CA",
      description: "Isabella's dedication to fitness and inspiring journey motivated thousands of participants."
    },
    {
      id: 4,
      name: "Aria Johnson",
      competition: "Holiday Glamour 2023",
      prize: "$40,000",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
      date: "December 2023",
      location: "Las Vegas, NV",
      description: "Aria brought elegance and sophistication to the holiday-themed competition."
    },
    {
      id: 5,
      name: "Maya Patel",
      competition: "Spring Awakening 2023",
      prize: "$35,000",
      image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&h=400&fit=crop&crop=face",
      date: "March 2023",
      location: "Phoenix, AZ",
      description: "Maya's fresh approach and natural beauty perfectly embodied the spring theme."
    },
    {
      id: 6,
      name: "Zoe Williams",
      competition: "Urban Chic 2023",
      prize: "$28,000",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face",
      date: "September 2023",
      location: "Chicago, IL",
      description: "Zoe's edgy style and confident attitude perfectly captured the urban aesthetic."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <section className="py-16 bg-gradient-luxury">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-medium mb-8">
              <Trophy className="w-4 h-4 mr-2" />
              Hall of Fame
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              Competition Winners
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Celebrating the talented models who have won our prestigious competitions and launched their careers
            </p>
          </div>
        </section>

        {/* Winners Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {winners.map((winner) => (
                <Card key={winner.id} className="group overflow-hidden shadow-card hover:shadow-luxury transition-luxury">
                  {/* Winner Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-luxury"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-accent text-accent-foreground">
                        <Trophy className="w-3 h-3 mr-1" />
                        Winner
                      </Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-luxury"></div>
                  </div>

                  <CardContent className="p-6">
                    {/* Winner Name */}
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {winner.name}
                    </h3>

                    {/* Competition */}
                    <p className="text-accent font-medium mb-3">
                      {winner.competition}
                    </p>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {winner.description}
                    </p>

                    {/* Prize */}
                    <div className="flex items-center mb-3 p-3 rounded-lg bg-gradient-competition/10 border border-competition/20">
                      <DollarSign className="w-4 h-4 text-competition mr-2" />
                      <span className="font-semibold text-competition">{winner.prize}</span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{winner.date}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{winner.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Join Our Winners?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your journey today and compete for life-changing prizes
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/competitions" 
                className="inline-flex items-center justify-center px-8 py-3 bg-gradient-competition text-competition-foreground rounded-lg font-medium hover:opacity-90 transition-smooth"
              >
                View Active Competitions
              </a>
              <a 
                href="/rules" 
                className="inline-flex items-center justify-center px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted/50 transition-smooth"
              >
                Learn Competition Rules
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Winners;