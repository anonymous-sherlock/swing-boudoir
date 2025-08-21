import defaultImage from "@/assets/hot-girl-summer.jpg";
import { ContestJoinButton } from "@/components/global";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Contest } from "@/types/contest.types";
import { Link } from "@tanstack/react-router";
import React from "react";
import { Separator } from "../ui/separator";
import { formatPrize } from "./utils";

interface CompetitionCardProps {
  contest: Contest;
  showJoinButton?: boolean;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ contest, showJoinButton = true }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to extract prize value from award name
  const extractPrizeValue = (awardName: string): number | null => {
    const match = awardName.match(/\$?(\d+(?:,\d+)*(?:\.\d+)?)/);
    if (match) {
      return parseFloat(match[1].replace(/,/g, ""));
    }
    return null;
  };

  if (!contest) {
    return null;
  }
  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden relative">
        <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="block">
          <div className="relative cursor-pointer">
            <img src={contest?.images?.[0]?.url || (defaultImage as unknown as string)} alt={contest.name} className="w-full h-64 object-cover" />
            {/* Prize Pool Overlay - Top Right */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wide block">Prize Pool</span>
              <div className="text-lg font-bold text-green-600">{formatPrize(contest.prizePool)}</div>
            </div>
          </div>
        </Link>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="hover:text-[#d4af37] duration-300">
              <CardTitle className="text-lg font-semibold">{contest.name}</CardTitle>
            </Link>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {contest.description.length > 80 ? `${contest.description.substring(0, 80)}... ` : contest.description}
            {contest.description.length > 80 && <span className="text-[#d4af37] font-medium cursor-pointer hover:underline">read more</span>}
          </CardDescription>
        </CardHeader>

        <Separator className="my-3" />

        <CardContent className="space-y-4">
          {/* End Date */}
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span className="font-medium">{formatDate(contest.endDate)}</span>
          </div> */}

          {/* Start Date - Commented out for now, can be reverted */}
          {/* <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span className="font-medium">{formatDate(contest.startDate)}</span>
          </div> */}

          {/* Awards List */}
          {contest.awards && contest.awards.length > 0 && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground block">Awards:</span>
              <div className="flex flex-wrap gap-2">
                {contest.awards
                  .sort((a, b) => {
                    // Sort by prize value if available, otherwise maintain original order
                    const aValue = extractPrizeValue(a.name);
                    const bValue = extractPrizeValue(b.name);
                    if (aValue && bValue) {
                      return bValue - aValue; // Higher prize first
                    }
                    return 0; // Maintain original order if no prize values
                  })
                  .map((award) => (
                    <div key={award.id} className="flex items-center gap-1 text-sm">
                      <span>{award.icon}</span>
                      <span className="text-xs">{award.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>

        <Separator className="my-3" />

        {showJoinButton && (
          <CardFooter className="flex flex-col space-y-2">
            <ContestJoinButton contest={contest} className="w-full" variant="default" />
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default CompetitionCard;
