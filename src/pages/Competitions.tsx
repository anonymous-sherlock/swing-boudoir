import { CompetitionCard } from "@/components/CompetitionCard";
import Header from "@/components/Header";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { useCompetitions } from "@/hooks/useCompetitions";
import { RefreshCw } from "lucide-react";
import React from "react";

export const CompetitionsPage: React.FC = () => {
  const { competitions, isLoading, error, refetch, joinedCompetitions, isLoadingJoined, getActiveCompetitions, getComingSoonCompetitions, getCompletedCompetitions } =
    useCompetitions();

  if (isLoading) {
    return <PageLoader title="Loading competitions..." description="Please wait while we get your information from the web" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Competitions</h2>
          <p className="text-gray-600 mb-4">Failed to load competitions. Please try again.</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const activeCompetitions = getActiveCompetitions();
  const comingSoonCompetitions = getComingSoonCompetitions();
  const completedCompetitions = getCompletedCompetitions();

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Photo Contests</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join exciting photo contests, showcase your talent, and compete for amazing prizes!</p>
        </div>

        {/* Active Competitions */}
        {activeCompetitions.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Active Contests</h2>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} showJoinButton={true} />
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Competitions */}
        {comingSoonCompetitions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} showJoinButton={false} />
              ))}
            </div>
          </section>
        )}

        {/* Completed Competitions */}
        {completedCompetitions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completed Contests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} showJoinButton={false} />
              ))}
            </div>
          </section>
        )}

        {/* Joined Competitions */}
        {!isLoadingJoined && joinedCompetitions.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Contests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} showJoinButton={true} />
              ))}
            </div>
          </section>
        )}

        {/* No Competitions */}
        {competitions.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Competitions Available</h3>
            <p className="text-gray-500">Check back later for new contests!</p>
          </div>
        )}
      </div>
    </>
  );
};
