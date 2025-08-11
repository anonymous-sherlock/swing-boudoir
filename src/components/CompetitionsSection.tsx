import CompetitionCard from "./CompetitionCard";
import { useCompetitions } from "@/hooks/useCompetitions";
import { RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CompetitionsSection = () => {
  const { getActiveCompetitions, isLoading } = useCompetitions();
  const competitions = getActiveCompetitions();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading competitions...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Active Competitions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our exciting competitions and start your journey to winning amazing prizes
          </p>
        </div>

        {/* Competitions Grid */}
        {competitions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Active Competitions</h3>
            <p className="text-muted-foreground">
              Check back soon for exciting new competitions!
            </p>
          </div>
        )}

        {/* More Competitions CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            More competitions launching soon!
          </p>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
            <span className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse"></span>
            <span className="text-accent font-medium">Stay tuned for upcoming opportunities</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompetitionsSection;