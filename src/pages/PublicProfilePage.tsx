import { useState, useEffect, useMemo } from "react";
import { useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share, Star, User, Trophy, Calendar, Users, AlertCircle, Image as ImageIcon, Heart, Clock, Gift, DollarSign, Eye, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/api/useProfile";
import { useContestLeaderboard } from "@/hooks/api/useContests";
import { useFreeVote, usePaidVote } from "@/hooks/api/useVotes";

import { formatUsdAbbrev } from "@/lib/utils";
import { PortfolioGallery } from "@/components/profile/PortfolioGallery";
import { Lightbox } from "@/components/Lightbox";
import { BioSection } from "@/components/profile/BioSection";
import { PublicProfileHeroSection } from "@/components/profile/ProfileMain";
import { ContestsParticipationSection } from "@/components/profile/ContestsParticipationSection";

interface TimeLeft {
  [key: string]: string;
}

const PAID_VOTE_PACKAGES = [
  {
    id: "basic",
    name: "Starter Pack",
    votes: 5,
    price: 1,
    savings: null,
  },
  {
    id: "premium",
    name: "Popular Choice",
    votes: 70,
    price: 10,
    savings: "Save 30%",
  },
  {
    id: "vip",
    name: "Ultimate VIP",
    votes: 500,
    price: 50,
    savings: "Save 50%",
  },
];

export default function PublicProfilePage() {
  const { username } = useParams({ from: "/_public/profile/$username" });

  const [userVotes, setUserVotes] = useState(0);

  const [showPaidVoteOptions, setShowPaidVoteOptions] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);

  // API hooks
  const { useProfileByUsername, useActiveParticipation } = useProfile();
  const { data: modelProfile, isLoading, error } = useProfileByUsername(username || "");
  const { data: participations } = useActiveParticipation(modelProfile?.id || "");
  const freeVoteMutation = useFreeVote();
  const paidVoteMutation = usePaidVote();

  const handleImageClick = (image: { url: string; caption: string }) => {
    setLightboxImage(image);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  // Process participations data for display
  const activeParticipations = useMemo(() => {
    if (!participations?.data) return [];
    console.log("Raw participations data:", participations);
    // Temporarily show all participations for debugging
    const filtered = participations.data;
    console.log("All participations (no filtering):", filtered);
    return filtered;
  }, [participations]);

  // Countdown timer for competitions
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const newTimeLeft: TimeLeft = {};

  //     activeParticipations.forEach((participation) => {
  //       if (participation.contest?.endDate) {
  //         const now = new Date().getTime();
  //         const end = new Date(participation.contest.endDate).getTime();
  //         const difference = end - now;

  //         if (difference > 0) {
  //           const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  //           const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //           const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  //           const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  //           newTimeLeft[participation.contestId] =
  //             `${days.toString().padStart(2, "0")} : ${hours.toString().padStart(2, "0")} : ${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
  //         } else {
  //           newTimeLeft[participation.contestId] = "Ended";
  //         }
  //       }
  //     });

  //     setTimeLeft(newTimeLeft);
  //   }, 1000);

  //   return () => clearInterval(timer);
  // }, [activeParticipations]);

  const handleBuyVotesClick = () => {
    window.location.href = "/voters/buy-votes";
  };

  const shareProfile = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get leaderboard data for the first contest to show model rank and total participants
  const { data: leaderboardData } = useContestLeaderboard(activeParticipations[0]?.contestId || "", 1, 100);

  if (isLoading) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex flex-col items-start">
                <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
                <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <DollarSign className="w-4 h-4 mr-1" />
                Buy More Votes
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <Share className="w-4 h-4 mr-1" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !modelProfile) {
    return (
      <>
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex flex-col items-start">
                <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
                <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <DollarSign className="w-4 h-4 mr-1" />
                Buy More Votes
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
                <Share className="w-4 h-4 mr-1" />
                Share Profile
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center pt-16">
          <div className="text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Not Found</h3>
            <p className="text-gray-600">This profile could not be loaded.</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex flex-col items-start">
              <div className="text-2xl font-display font-bold text-primary tracking-tight">SWING</div>
              <div className="text-xs font-medium text-muted-foreground -mt-1 tracking-wider">Boudoir</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setShowPaidVoteOptions(true)} variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
              <DollarSign className="w-4 h-4 mr-1" />
              Buy More Votes
            </Button>
            <Button onClick={shareProfile} variant="outline" size="sm" className="text-gray-600 hover:text-gray-800 border-gray-300 hidden sm:flex">
              <Share className="w-4 h-4 mr-1" />
              Share Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowMobileMenu(!showMobileMenu)} className="sm:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-gradient-to-br from-slate-50 to-blue-50">
        <PublicProfileHeroSection
          name={modelProfile.user.name}
          username={modelProfile.user.username}
          city={modelProfile.city || ""}
          country={modelProfile.country || ""}
          phone={modelProfile.phone || ""}
          bannerImage={modelProfile.bannerImage?.url || ""}
          coverImage={modelProfile.coverImage?.url || ""}
          socialMedia={{
            instagram: modelProfile.instagram || "",
            twitter: modelProfile.twitter || "",
            facebook: modelProfile.facebook || "",
            youtube: modelProfile.youtube || "",
            linkedin: modelProfile.linkedin || "",
            website: modelProfile.website || "",
            tiktok: modelProfile.tiktok || "",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
          <BioSection
            bio={modelProfile?.bio || ""}
            hobbies={modelProfile?.hobbiesAndPassions || ""}
            dateOfBirth={modelProfile?.dateOfBirth || ""}
            gender={modelProfile?.gender || ""}
            email={modelProfile?.user?.email || ""}
          />

          <ContestsParticipationSection profile={modelProfile} participations={activeParticipations || []} onVoteSuccess={() => {}} />

          <PortfolioGallery photos={modelProfile.profilePhotos || []} onImageClick={handleImageClick} />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg sm:hidden">
          <div className="p-4 space-y-3">
            <Button onClick={handleBuyVotesClick} variant="outline" size="sm" className="w-full text-gray-600 hover:text-gray-800 border-gray-300">
              <DollarSign className="w-4 h-4 mr-2" />
              Buy More Votes
            </Button>
            <Button onClick={shareProfile} variant="outline" size="sm" className="w-full text-gray-600 hover:text-gray-800 border-gray-300">
              <Share className="w-4 h-4 mr-2" />
              Share Profile
            </Button>
          </div>
        </div>
      )}

      {lightboxImage && <Lightbox image={lightboxImage} onClose={closeLightbox} />}
    </>
  );
}
