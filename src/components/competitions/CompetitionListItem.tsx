import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Contest } from "@/hooks/api/useContests";
import defaultImage from "@/assets/hot-girl-summer.jpg";
import { ContestJoinButton } from "@/components/global";

interface CompetitionListItemProps {
  competition: Contest;
}

export const CompetitionListItem: React.FC<CompetitionListItemProps> = ({ competition }) => {

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

  // Get the best available image
  const getImageUrl = () => {
    if (competition.images && competition.images.length > 0) {
      // Try to find an image with a valid URL
      const validImage = competition.images.find((img) => img.url && img.url.trim() !== "");
      if (validImage) return validImage.url;
    }

    // Fallback to placeholder image
    return defaultImage;
  };

  if (!competition) {
    return null;
  }

  return (
    <>
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Image Section - Bigger Size */}
            <Link to="/competitions/$slug" params={{ slug: competition.slug }} className="block">
                             <div className="relative w-full lg:w-80 h-48 lg:h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 cursor-pointer">

                <img
                  src={getImageUrl()}
                  alt={competition.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                  }}
                />

                <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex items-center justify-center">
                  {(competition?.images?.length || 0) > 0 && <p className="text-white text-sm">{competition.images?.length} images</p>}
                </div>

                {/* <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {competition.status}
                  </Badge>
                </div> */}
              </div>
            </Link>

            {/* Content Section */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div>
                <Link to="/competitions/$slug" params={{ slug: competition.slug }} className="hover:text-[#d4af37] duration-300">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{competition.name}</h3>
                </Link>
                <p className="text-gray-600 line-clamp-2 text-base">{competition.description}</p>
              </div>

              {/* Competition Details */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Start Date:</span>
                  <p className="font-medium">{formatDate(competition.startDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">End Date:</span>
                  <p className="font-medium">{formatDate(competition.endDate)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Prize Pool:</span>
                  <p className="font-medium text-green-600">{formatPrize(competition.prizePool)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Awards:</span>
                  <p className="font-medium">{competition.awards?.length || 0} available</p>
                </div>
              </div>

              
            </div>

            {/* Action Buttons - Right Side */}
            <div className="flex flex-col justify-center items-end space-y-3 min-w-[140px]">
              <ContestJoinButton 
                contest={competition} 
                className="w-full"
                variant="default"
              />
            </div>
          </div>
                 </CardContent>
       </Card>
     </>
   );
 };

export default CompetitionListItem;
