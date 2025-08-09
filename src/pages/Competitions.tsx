import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CompetitionCard from "@/components/CompetitionCard";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Grid, List } from "lucide-react";
import bigGameImage from "@/assets/big-game-competition.jpg";
import hotGirlSummerImage from "@/assets/hot-girl-summer.jpg";
import workoutWarriorImage from "@/assets/workout-warrior.jpg";

interface Competition {
  id: string;
  title: string;
  image: string;
  prize: string;
  endDate: string;
  location?: string;
  perks: string[];
  description: string;
  status: 'active' | 'coming-soon' | 'ended';
  createdAt: string;
  updatedAt: string;
}

const Competitions = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [competitions, setCompetitions] = useState<Competition[]>([]);

  // Load competitions from localStorage on component mount
  useEffect(() => {
    const loadCompetitions = () => {
      const storedCompetitions = localStorage.getItem('competitions');
      if (storedCompetitions) {
        setCompetitions(JSON.parse(storedCompetitions));
      } else {
        // Fallback to default competitions if none exist in localStorage
        const defaultCompetitions = [
          {
            id: "big-game-weekend",
            title: "Big Game Weekend",
            image: bigGameImage,
            prize: "$50,000 cash prize",
            endDate: "2025-08-31",
            location: "Santa Clara",
            perks: [
              "Trip for 2 to Santa Clara",
              "2 Tickets to Maxim Party",
              "2 Tickets to Big Game",
              "Become a Maxim Content Creator"
            ],
            description: "Join the ultimate Big Game Weekend experience with luxury accommodations and exclusive access to the biggest sporting event of the year.",
            status: "active" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "hot-girl-summer",
            title: "Hot Girl Summer - Barbados",
            image: hotGirlSummerImage,
            prize: "$25,000 cash prize",
            endDate: "2025-08-07",
            location: "Miami + Barbados",
            perks: [
              "Trip for 2 to Miami + Barbados",
              "1-on-1 Influencer Masterclass",
              "Portfolio Photoshoot",
              "Maxim Magazine Feature"
            ],
            description: "Experience the ultimate tropical getaway with professional photoshoots and influencer training in paradise.",
            status: "active" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "workout-warrior",
            title: "Workout Warrior",
            image: workoutWarriorImage,
            prize: "$20,000 cash prize",
            endDate: "2025-09-27",
            location: "Miami",
            perks: [
              "Maxim Photoshoot",
              "Maxim Magazine Feature",
              "Trip to Miami",
              "Fitness Brand Partnerships"
            ],
            description: "Showcase your fitness journey and dedication with professional photoshoots and brand partnership opportunities.",
            status: "active" as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setCompetitions(defaultCompetitions);
        localStorage.setItem('competitions', JSON.stringify(defaultCompetitions));
      }
    };

    loadCompetitions();

    // Listen for storage changes (when admin panel updates competitions)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'competitions') {
        if (e.newValue) {
          setCompetitions(JSON.parse(e.newValue));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter competitions based on search query and only show active ones
  const filteredCompetitions = competitions
    .filter(comp => comp.status === 'active') // Only show active competitions
    .filter(comp =>
      comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Page Header */}
        <section className="py-16 bg-gradient-hero">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              All Competitions
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Browse all available modeling competitions and find the perfect opportunity to showcase your talent
            </p>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search competitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                
                <div className="flex border border-border rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-none border-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-none border-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitions Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {filteredCompetitions.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                  No competitions found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or check back later for new competitions
                </p>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1 max-w-4xl mx-auto'
              }`}>
                {filteredCompetitions.map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Competitions;