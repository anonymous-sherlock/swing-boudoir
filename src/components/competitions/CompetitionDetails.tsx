import defaultImage from "@/assets/hot-girl-summer.jpg";
import { ContestJoinButton } from "@/components/global";
import { api } from "@/lib/api";
import { Contest_Status } from "@/lib/validations/contest.schema";
import { Route } from "@/routes/_public/competitions/$slug";
import { Contest } from "@/types/contest.types";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Clock, DollarSign, Share2, Trophy, Users, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const formatDate = (date: string | Date) => {
  return format(new Date(date), "MMM dd, yyyy");
};

function CountdownTimer({ targetDate }: { targetDate: string | Date }) {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) return null;

      return {
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-3">
      {[
        { label: "Days", value: timeLeft.d },
        { label: "Hours", value: timeLeft.h },
        { label: "Mins", value: timeLeft.m },
        { label: "Secs", value: timeLeft.s },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center min-w-[55px]">
          <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg shadow-sm mb-1.5">
            <span className="text-xl font-bold text-gray-900 tabular-nums">{item.value.toString().padStart(2, "0")}</span>
          </div>
          <span className="text-[9px] uppercase font-bold text-gray-500 tracking-wider">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function CompetitionDetails() {
  const { slug } = useParams({ from: "/_public/competitions/$slug" });
  const initialData = Route.useLoaderData();
  const { user } = useAuth();

  const {
    data: competition,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["competition", slug],
    queryFn: async (): Promise<Contest> => {
      const response = await api.get<Contest>(`/api/v1/contest/slug/${slug}`);
      return response.data;
    },
    initialData,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Competition Not Found</h1>
          <p className="text-gray-600">The competition you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getImageUrl = (images: { url: string }[] | null) => {
    if (images && images.length > 0) {
      return images[0].url;
    }
    return defaultImage;
  };

  const getStatusBadge = (status: keyof typeof Contest_Status) => {
    switch (status) {
      case "PUBLISHED":
        return <Badge className="bg-green-700 text-white">Active</Badge>;
      case "COMPLETED":
      case "BOOKED":
        return <Badge variant="secondary">Completed</Badge>;
      case "DRAFT":
        return (
          <Badge variant="outline" className="bg-violet-500 text-white">
            Upcoming
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const shareCompetition = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link Copied!", {
        description: "Competition link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Copy Failed", {
        description: "Failed to copy link to clipboard.",
      });
    }
  };

  const shareProfile = async () => {
    if (!user?.username) {
      toast.error("Profile not available", {
        description: "Unable to share profile at this time.",
      });
      return;
    }

    const url = `${window.location.origin}/profile/${user.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Profile Link Copied!", {
        description: "Your profile link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy profile link:", err);
      toast.error("Copy Failed", {
        description: "Failed to copy profile link to clipboard.",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Hero Section with Image and Title */}
        <div className="relative">
          <div className="w-full relative h-[520px] rounded-2xl overflow-hidden mb-6">
            <img src={getImageUrl(competition?.images ?? [])} alt={competition.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-0 right-0 py-6 px-8">
              <div className="flex items-center space-x-3 mb-4">{getStatusBadge(competition.status)}</div>
            </div>
            <div className="absolute bottom-0 right-0 p-4 md:p-8">
              <div className="flex items-center space-x-3 md:mb-4">
                <Button
                  onClick={shareCompetition}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-secondary hover:text-black"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {user?.username && (
                  <Button
                    onClick={shareProfile}
                    variant="outline"
                    size="sm"
                    className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-secondary hover:text-black"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                )}
              </div>
            </div>
            <div className="absolute md:bottom-0 bottom-10 left-0 p-4 pb-6 md:pb-8 md:p-8 md:pr-40">
              <h1 className="text-3xl capitalize font-bold text-white mb-2">{competition.name}</h1>
              <p className="text-white/90 text-sm sentence-case max-w-3xl hidden md:block">{competition.description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="p-2 bg-blue-50 rounded-lg">
                    <Trophy className="h-5 w-5 text-blue-600" />
                  </span>
                  About This Competition
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 leading-relaxed text-[15px]">{competition.description}</p>
              </CardContent>
            </Card>

            {/* Rules & Requirements */}
            {competition.rules && (
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="p-2 bg-red-50 rounded-lg">
                      <Clock className="h-5 w-5 text-red-600" />
                    </span>
                    Rules & Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap text-[15px]">{competition.rules}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {competition.requirements && (
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="p-2 bg-purple-50 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </span>
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap text-[15px]">{competition.requirements}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Awards */}
            {competition.awards && competition.awards.length > 0 && (
              <Card className="border border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="p-2 bg-yellow-50 rounded-lg">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                    </span>
                    Awards
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {competition.awards.map((award) => (
                      <div key={award.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">{award.icon}</span>
                        <span className="font-medium">{award.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-gray-100 bg-gray-50 py-6 px-5">
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Competition Details</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Prize Pool</p>
                    <p className="text-lg font-black text-gray-900 tracking-tight">${competition.prizePool?.toLocaleString()}</p>
                  </div>
                </div>

                {competition.registrationDeadline && (
                  <div className="flex items-start gap-3 pt-4 border-t border-gray-100 group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Registration</p>
                        {new Date() < new Date(competition.startDate) ? (
                          <Badge className="text-[9px] h-5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 px-1.5 font-bold uppercase rounded-md shadow-sm">
                            Upcoming
                          </Badge>
                        ) : new Date(competition.registrationDeadline) > new Date() ? (
                          <Badge className="text-[9px] h-5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 px-1.5 font-bold uppercase rounded-md shadow-sm">
                            Open
                          </Badge>
                        ) : (
                          <Badge className="text-[9px] h-5 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 px-1.5 font-bold uppercase rounded-md">Closed</Badge>
                        )}
                      </div>
                      <p className="font-bold text-gray-700 text-sm">
                        {formatDate(competition.startDate)} - {formatDate(competition.registrationDeadline)}
                      </p>
                      {(() => {
                        const now = new Date();
                        const start = new Date(competition.startDate);
                        const deadline = new Date(competition.registrationDeadline);

                        if (now < start) {
                          const diffDays = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <p className="text-[10px] font-semibold text-blue-600 mt-1">
                              Starts in {diffDays} {diffDays === 1 ? "day" : "days"}
                            </p>
                          );
                        } else if (now < deadline) {
                          const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                          return (
                            <p className="text-[10px] font-semibold text-orange-600 mt-1 flex items-center gap-1.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                              </span>
                              Ends in {diffDays} {diffDays === 1 ? "day" : "days"}
                            </p>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Clock className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Ends On</p>
                      <p className="font-bold text-gray-700 text-sm">{formatDate(competition.endDate)}</p>
                    </div>
                  </div>
                </div>

                {competition.resultAnnounceDate && (
                  <div className="flex items-start gap-3 pt-4 border-t border-gray-100 group">
                    <div className="w-10 h-10 rounded-xl bg-yellow-50 border border-yellow-100/50 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Results</p>
                        {new Date(competition.resultAnnounceDate) > new Date() ? (
                          <Badge className="text-[9px] h-5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-1.5 font-bold uppercase rounded-md shadow-sm">
                            Scheduled
                          </Badge>
                        ) : (
                          <Badge className="text-[9px] h-5 bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 px-1.5 font-bold uppercase rounded-md">
                            Announced
                          </Badge>
                        )}
                      </div>
                      <p className="font-bold text-gray-700 text-sm">{formatDate(competition.resultAnnounceDate)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="border border-gray-200 shadow-sm overflow-hidden bg-white relative">
              <div className="relative z-10">
                {new Date(competition.startDate) > new Date() ? (
                  <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">Starts In</p>
                    <div className="flex justify-center mb-6">
                      <CountdownTimer targetDate={competition.startDate} />
                    </div>
                    <Button disabled className="w-full bg-white border border-gray-200 text-gray-400 font-bold h-12 rounded-xl cursor-not-allowed text-sm" size="lg">
                      Join Contest (Opens Soon)
                    </Button>
                  </div>
                ) : new Date(competition.endDate) > new Date() ? (
                  <div className="bg-gray-50 p-6 text-center border-b border-gray-100">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4 text-gray-500">Competition Ends In</p>
                    <div className="flex justify-center mb-6">
                      <CountdownTimer targetDate={competition.endDate} />
                    </div>
                    <ContestJoinButton contest={competition} className="w-full h-12 rounded-xl text-sm font-bold shadow-sm transition-all" size="lg" showAuthModal={true} />
                  </div>
                ) : (
                  <div className="p-6 bg-white border-b border-gray-100">
                    <div className="text-center mb-4">
                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Competition Ended</p>
                    </div>
                    <ContestJoinButton contest={competition} className="w-full h-12 rounded-xl text-sm font-bold shadow-sm transition-all" size="lg" showAuthModal={true} />
                  </div>
                )}

                <div className="p-5 bg-white space-y-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 rounded-lg font-semibold border-gray-200 hover:bg-gray-50 transition-all text-gray-700 text-sm"
                    size="lg"
                    asChild
                  >
                    <Link to={`/competitions/$slug/participants`} params={{ slug: competition.slug }}>
                      View Participants
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-11 rounded-lg font-semibold border-gray-200 hover:bg-gray-50 transition-all text-gray-700 text-sm"
                      onClick={shareCompetition}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    {user?.username && (
                      <Button
                        variant="outline"
                        className="h-11 rounded-lg font-semibold border-gray-200 hover:bg-gray-50 transition-all text-gray-700 text-sm truncate px-1"
                        onClick={shareProfile}
                      >
                        <User className="w-4 h-4 mr-2 shrink-0" /> Share Profile
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
