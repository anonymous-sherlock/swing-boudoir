import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import defaultImage from "@/assets/hot-girl-summer.jpg";
import { Contest } from "@/hooks/api/useContests";
import { Separator } from "../ui/separator";
import { ContestJoinButton } from "@/components/global";

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

  const formatPrize = (prize: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(prize);
  };

  if (!contest) {
    return null;
  }
  return (
    <>
      <Card className="w-full max-w-sm overflow-hidden relative ">
        <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="block">
          <div className="relative cursor-pointer">

            <img src={contest?.images?.[0]?.url || (defaultImage as unknown as string)} alt={contest.name} className="w-full aspect-video object-cover" />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
              {(contest?.images?.length || 0) > 0 && <p className="text-white text-sm">{contest.images?.length} images</p>}
            </div>
          </div>
        </Link>
        <CardHeader>
          <div className="flex items-center justify-between ">
            <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="hover:text-[#d4af37] duration-300">
              <CardTitle className="text-lg font-semibold">{contest.name}</CardTitle>
            </Link>
          </div>
          <CardDescription className="line-clamp-2">{contest.description}</CardDescription>
        </CardHeader>

        <Separator className="my-4" />
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start Date:</span>
            <span>{formatDate(contest.startDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">End Date:</span>
            <span>{formatDate(contest.endDate)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Prize Pool:</span>
            <span className="font-semibold text-green-600">{formatPrize(contest.prizePool)}</span>
          </div>

          {contest.awards && contest.awards.length > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Awards:</span>
              <span>{contest.awards.length} available</span>
            </div>
          )}
        </CardContent>
        <Separator className="my-4" />

        {showJoinButton && (
          <CardFooter className="flex flex-col space-y-2">
            <ContestJoinButton 
              contest={contest} 
              className="w-full"
              variant="default"
            />
          </CardFooter>
        )}
      </Card>
    </>
  );
};

export default CompetitionCard;
