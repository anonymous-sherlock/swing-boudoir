import { createFileRoute, NotFoundRoute, useParams } from "@tanstack/react-router";
import { useState } from "react";
import JSZip from "jszip";

import { Lightbox } from "@/components/Lightbox";
import { socialIcons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContestLeaderboard } from "@/hooks/api/useContests";
import { profileApi, useProfile, useProfile as useProfileApi } from "@/hooks/api/useProfile";
import { useProfileVotes, useTopVoters } from "@/hooks/api/useVotes";
import { shareProfile } from "@/utils";
import { getSocialMediaUrls } from "@/utils/social-media";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRightIcon,
  Download,
  ExternalLink,
  Eye,
  Facebook,
  Globe,
  Heart,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  MapPin,
  MessageSquare,
  Share,
  TrendingUp,
  TriangleAlert,
  Trophy,
  Twitter,
  Users,
  Youtube,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/profiles/$id")({
  component: () => <ProfileDetailsPage />,
  beforeLoad: async ({ params }) => {
    const { id } = params;
    const profile = await profileApi.getProfile(id);
    if (!profile) {
      const error = new Error("Profile not found");
      error.name = "PROFILE_NOT_FOUND";
      throw error;
    }
    if (profile?.user?.type === "VOTER") {
      const error = new Error("This is a voter profile, you cannot access it");
      error.name = "VOTER_PROFILE";
      throw error;
    }
    return profile;
  },
  errorComponent(props) {
    return (
      <div
        className={cn(
          "mt-4 rounded-md border  px-4 py-3 text-red-600",
          props.error.name === "VOTER_PROFILE" && "bg-amber-100 border-amber-500/50 text-amber-600",
          props.error.name === "PROFILE_NOT_FOUND" && "bg-red-100 border-red-500/50 text-red-600"
        )}
      >
        <div className="flex items-center gap-3">
          <TriangleAlert className="mt-0.5 shrink-0 opacity-60" size={16} aria-hidden="true" />
          <div className="flex items-center grow justify-between gap-3">
            <p className="text-sm">{props.error.message}</p>
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/users">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Users
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  },
});

function ProfileDetailsPage() {
  const { id } = useParams({ from: "/admin/profiles/$id" });
  const [lightboxImage, setLightboxImage] = useState<{ url: string; caption: string } | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDownloading, setIsDownloading] = useState(false);
  const { useProfile, useProfileStats, useActiveParticipation } = useProfileApi();
  // Fetch profile data
  const { data: profile, isLoading: profileLoading, error: profileError } = useProfile(id);
  const { data: profileStats, isLoading: statsLoading } = useProfileStats(id);

  // Fetch contest participations
  const { data: participationsData, isLoading: participationsLoading } = useActiveParticipation(id);

  // Fetch votes data
  const { data: votesData, isLoading: votesLoading } = useProfileVotes(id, { page: 1, limit: 50 });
  const { data: topVotersData, isLoading: topVotersLoading } = useTopVoters(id);

  const participations = participationsData?.data || [];
  const votes = votesData?.data || [];
  const topVoters = topVotersData || [];

  // Get contest leaderboard data for each participation to show vote counts
  const contestIds = participations.map((p) => p.contestId);

  // Call hooks at top level for each contest ID
  const leaderboard1 = useContestLeaderboard(contestIds[0] || "", 1, 100);
  const leaderboard2 = useContestLeaderboard(contestIds[1] || "", 1, 100);
  const leaderboard3 = useContestLeaderboard(contestIds[2] || "", 1, 100);
  const leaderboard4 = useContestLeaderboard(contestIds[3] || "", 1, 100);
  const leaderboard5 = useContestLeaderboard(contestIds[4] || "", 1, 100);

  const contestLeaderboards = contestIds.map((contestId, index) => {
    const leaderboardResponse = [leaderboard1, leaderboard2, leaderboard3, leaderboard4, leaderboard5][index];
    const participation = participations.find((p) => p.contestId === contestId);
    return {
      contestId,
      contestName: participation?.contest.name || "",
      leaderboardData: leaderboardResponse?.data || [],
    };
  });

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const openLightbox = (image: { url: string; caption: string }) => {
    setLightboxImage(image);
  };

  const downloadAllImages = async () => {
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      const imagePromises: Promise<void>[] = [];

      // Create folders
      const mainImagesFolder = zip.folder("main-images");
      const profileImagesFolder = zip.folder("profile-images");

      // Helper function to get proper file extension
      const getFileExtension = (url: string, blob: Blob): string => {
        // Since URLs don't have extensions, rely on MIME type detection
        if (blob.type) {
          const mimeType = blob.type.toLowerCase();
          
          // Map MIME types to file extensions
          if (mimeType.includes('jpeg') || mimeType.includes('jpg')) {
            return 'jpg';
          } else if (mimeType.includes('png')) {
            return 'png';
          } else if (mimeType.includes('gif')) {
            return 'gif';
          } else if (mimeType.includes('webp')) {
            return 'webp';
          } else if (mimeType.includes('bmp')) {
            return 'bmp';
          } else if (mimeType.includes('svg')) {
            return 'svg';
          }
        }
        
        // If MIME type detection fails, try to extract from URL as fallback
        const urlExtension = url.split('.').pop()?.toLowerCase();
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
        if (urlExtension && validExtensions.includes(urlExtension)) {
          return urlExtension;
        }
        
        // Log when falling back to default extension
        console.log(`Could not determine extension for URL: ${url}, MIME type: ${blob.type}, defaulting to jpg`);
        
        // Default to jpg if nothing else works
        return 'jpg';
      };

      // Add profile cover image if it exists
      if (profile?.coverImage) {
        try {
          const response = await fetch(profile.coverImage.url);
          if (!response.ok) throw new Error(`Failed to fetch cover image: ${response.status}`);
          const blob = await response.blob();
          const extension = getFileExtension(profile.coverImage.url, blob);
          mainImagesFolder?.file(`cover-image.${extension}`, blob);
        } catch (error) {
          console.error('Error fetching cover image:', error);
        }
      }

      // Add banner image if it exists
      if (profile?.bannerImage) {
        try {
          const response = await fetch(profile.bannerImage.url);
          if (!response.ok) throw new Error(`Failed to fetch banner image: ${response.status}`);
          const blob = await response.blob();
          const extension = getFileExtension(profile.bannerImage.url, blob);
          mainImagesFolder?.file(`banner-image.${extension}`, blob);
        } catch (error) {
          console.error('Error fetching banner image:', error);
        }
      }

      // Add profile photos if they exist
      if (profile?.profilePhotos && profile.profilePhotos.length > 0) {
        profile.profilePhotos.forEach((photo, index) => {
          const promise = fetch(photo.url)
            .then(response => {
              if (!response.ok) throw new Error(`Failed to fetch profile photo ${index + 1}: ${response.status}`);
              return response.blob();
            })
            .then(blob => {
              const extension = getFileExtension(photo.url, blob);
              profileImagesFolder?.file(`profile-photo-${index + 1}.${extension}`, blob);
            })
            .catch(error => {
              console.error(`Error fetching profile photo ${index + 1}:`, error);
            });
          imagePromises.push(promise);
        });
      }

      // Add contest cover images if they exist
      if (participations && participations.length > 0) {
        participations.forEach((participation, index) => {
          const coverImage = participation.coverImage;
          if (coverImage) {
            const promise = fetch(coverImage.url)
              .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch contest cover image: ${response.status}`);
                return response.blob();
              })
              .then(blob => {
                const extension = getFileExtension(coverImage.url, blob);
                profileImagesFolder?.file(`contest-${participation.contest.name.replace(/[^a-zA-Z0-9]/g, '-')}-cover.${extension}`, blob);
              })
              .catch(error => {
                console.error(`Error fetching contest cover image for ${participation.contest.name}:`, error);
              });
            imagePromises.push(promise);
          }
        });
      }

      // Wait for all images to be processed
      await Promise.all(imagePromises);

      // Generate and download the zip file
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profile?.user?.username || 'profile'}-images.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading images:', error);
      // You could add a toast notification here if you have one
    } finally {
      setIsDownloading(false);
    }
  };

  const socialUrls = getSocialMediaUrls({
    instagram: profile?.instagram ?? "",
    twitter: profile?.twitter ?? "",
    facebook: profile?.facebook ?? "",
    youtube: profile?.youtube ?? "",
    linkedin: profile?.linkedin ?? "",
    tiktok: profile?.tiktok ?? "",
  });

  const getSocialLinks = () => {
    return Object.entries(socialUrls)
      .filter(([_, url]) => url)
      .map(([platform, url]) => {
        const Icon = socialIcons[platform as keyof typeof socialIcons];
        if (!Icon) return null;

        return (
          <Button key={platform} variant="outline" size="sm" className="bg-grey backdrop-blur-lg border-white/30 hover:bg-white/10 transition-all duration-300 p-0 w-8 h-8" asChild>
            <Link to={url!} target="_blank">
              <Icon />
            </Link>
          </Button>
        );
      })
      .filter(Boolean);
  };

  const getContestStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "VOTING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      case "DRAFT":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="h-64 bg-muted rounded"></div>
            <div className="md:col-span-2 space-y-4">
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (profileError || !profile || profile?.user?.type === "VOTER") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">Error loading profile. Please try again.</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/users">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{profile?.user?.name || profile?.user?.username}</h1>
            <p className="text-muted-foreground text-sm">Profile ID: {profile?.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/profile/$username`} params={{ username: profile?.user?.username }}>
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Public Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Hero Section */}
      <div className="relative w-full h-80 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-lg overflow-hidden">
        {/* Banner Image Background */}
        {profile.bannerImage ? (
          <div
            className="absolute inset-0 cursor-pointer group z-0"
            onClick={() => openLightbox({ url: profile.bannerImage!.url, caption: profile.bannerImage!.caption || "Banner Image" })}
          >
            <img src={profile.bannerImage.url} alt="Banner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/30"></div>
            {/* View Icon on Hover */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
              <div className="bg-black/70 backdrop-blur-sm rounded-full p-3 shadow-lg cursor-pointer">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
          </div>
        )}

        {/* Profile Content Overlay */}
        <div className="relative h-full flex items-end p-6 z-10 pointer-events-none">
          <div className="flex items-end gap-6 w-full">
            {/* Profile Picture */}
            <div className="relative pointer-events-auto">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                {profile.coverImage ? (
                  <img
                    src={profile.coverImage.url}
                    alt="Profile"
                    className="w-full cursor-pointer h-full object-cover hover:opacity-90 transition-opacity"
                    onClick={() => openLightbox({ url: profile.coverImage!.url, caption: profile.coverImage!.caption || "Cover Image" })}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">{profile?.user?.username?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white pointer-events-auto">
              <h2 className="text-3xl font-bold mb-2">{profile?.user?.name || profile?.user?.username}</h2>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-300" />
                <span className="text-gray-300">
                  {profile.city && profile.country ? `${profile.city}, ${profile.country}` : profile.city || profile.country || "Location not specified"}
                </span>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-3">{getSocialLinks()}</div>
            </div>

            {/* Share Button */}
            <div className="flex items-end pointer-events-auto">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
                onClick={() => shareProfile(profile?.user?.username)}
              >
                <Share className="w-4 h-4 mr-2" />
                Share profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Images Gallery */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Profile Images Gallery
            </CardTitle>
            <Button 
              onClick={downloadAllImages}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 hover:bg-black hover:text-white"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download All Images
                  {(() => {
                    let count = 0;
                    if (profile?.coverImage) count++;
                    if (profile?.bannerImage) count++;
                    if (profile?.profilePhotos) count += profile.profilePhotos.length;
                    if (participations) {
                      participations.forEach(p => { if (p.coverImage) count++; });
                    }
                    return count > 0 ? ` (${count})` : '';
                  })()}
                  {/* <span className="text-xs text-muted-foreground ml-2">
                    Organized in 2 folders
                  </span> */}
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Photos */}
          {profile?.profilePhotos && profile?.profilePhotos.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-4">Profile Photos ({profile?.profilePhotos.length})</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {profile?.profilePhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => openLightbox({ url: photo.url, caption: photo.caption || `Profile Photo ${index + 1}` })}
                  >
                    <img src={photo.url} alt={`Profile Photo ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Profile Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Current Rank</p>
                  <p className="text-2xl font-bold">{profileStats?.currentRank || "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Votes</p>
                  <p className="text-2xl font-bold">{profileStats?.totalVotesReceived || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Active Contests</p>
                  <p className="text-2xl font-bold">{profileStats?.activeContests || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{profileStats?.winRate ? `${profileStats.winRate}%` : "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">${profileStats?.totalEarnings || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Best Rank</p>
                  <p className="text-2xl font-bold">{profileStats?.bestRank || "N/A"}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Competitions</p>
                  <p className="text-2xl font-bold">{profileStats?.totalCompetitions || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Average Rank</p>
                  <p className="text-2xl font-bold">{profileStats?.averageRank || "N/A"}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contests">Contests</TabsTrigger>
          <TabsTrigger value="votes">Votes</TabsTrigger>
          <TabsTrigger value="personal">Personal Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile?.coverImage?.url} className="object-cover" />
                    <AvatarFallback>{profile?.user?.username?.charAt(0)?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{profile?.user?.name || profile?.user?.username}</h3>
                    <p className="text-sm text-muted-foreground">@{profile?.user?.username}</p>
                    <p className="text-sm text-muted-foreground">{profile?.user?.email}</p>
                  </div>
                </div>

                {profile?.bio && (
                  <div>
                    <p className="text-sm font-medium mb-1">Bio</p>
                    <p className="text-sm text-muted-foreground">{profile?.bio}</p>
                  </div>
                )}

                {profile?.hobbiesAndPassions && (
                  <div>
                    <p className="text-sm font-medium mb-1">Hobbies & Passions</p>
                    <p className="text-sm text-muted-foreground">{profile?.hobbiesAndPassions}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.address}</span>
                  </div>
                )}
                {profile?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.city}</span>
                  </div>
                )}
                {profile?.country && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.country}</span>
                  </div>
                )}
                {profile?.postalCode && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile?.postalCode}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contests Tab */}
        <TabsContent value="contests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Contest Participations ({participations?.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participationsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : participations?.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No contest participations found.</p>
              ) : (
                <div className="space-y-4">
                  {participations?.map((participation) => (
                    <div key={participation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{participation.contest.name}</h4>
                            <Badge className={getContestStatusColor(participation.contest.status)}>{participation.contest.status}</Badge>
                            {participation.isApproved && <Badge variant="secondary">Approved</Badge>}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                            <div>
                              <p className="font-medium">Prize Pool</p>
                              <p>${participation.contest.prizePool}</p>
                            </div>
                            <div>
                              <p className="font-medium">Start Date</p>
                              <p>{format(new Date(participation.contest.startDate), "MMM dd, yyyy")}</p>
                            </div>
                            <div>
                              <p className="font-medium">End Date</p>
                              <p>{format(new Date(participation.contest.endDate), "MMM dd, yyyy")}</p>
                            </div>
                            <div>
                              <p className="font-medium">Joined</p>
                              <p>{format(new Date(participation.createdAt), "MMM dd, yyyy")}</p>
                            </div>
                          </div>

                          {/* Contest Vote Information */}
                          {(() => {
                            const leaderboard = contestLeaderboards.find((lb) => lb.contestId === participation.contestId);
                            const profileEntry = Array.isArray(leaderboard?.leaderboardData)
                              ? (leaderboard.leaderboardData as { profileId: string; rank: number; totalVotes: number; freeVotes: number; paidVotes: number }[]).find(
                                  (entry) => entry.profileId === profile.id
                                )
                              : undefined;

                            if (profileEntry) {
                              return (
                                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium text-green-600">Current Rank</p>
                                      <p className="text-lg font-bold">#{profileEntry.rank}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Total Votes</p>
                                      <p className="text-lg font-bold">{profileEntry.totalVotes}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Free Votes</p>
                                      <p className="text-sm">{profileEntry.freeVotes}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium">Paid Votes</p>
                                      <p className="text-sm">{profileEntry.paidVotes}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        {participation.coverImage && (
                          <div
                            className="w-20 h-20 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity ml-4"
                            onClick={() =>
                              openLightbox({
                                url: participation.coverImage!.url,
                                caption: "Contest Cover Image",
                              })
                            }
                          >
                            <img src={participation.coverImage.url} alt="Contest Cover" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Votes Tab */}
        <TabsContent value="votes" className="space-y-6">
          {/* Vote Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Vote Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Votes Received</p>
                  <p className="text-2xl font-bold">{profileStats?.totalVotesReceived || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Free Votes</p>
                  <p className="text-2xl font-bold text-blue-600">{votes.filter((v) => !v.amount).reduce((sum, v) => sum + v.count, 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Paid Votes</p>
                  <p className="text-2xl font-bold text-green-600">{votes.filter((v) => v.amount).reduce((sum, v) => sum + v.count, 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-purple-600">${votes.filter((v) => v.amount).reduce((sum, v) => sum + (v.amount || 0), 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Recent Votes Received ({votes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {votesLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : votes.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No votes received yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Voter</TableHead>
                        <TableHead>Contest</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {votes.slice(0, 10).map((vote) => (
                        <TableRow key={`${vote.profileId}-${vote.contestName}-${vote.votedOn}`}>
                          <TableCell className="font-medium">{vote.name}</TableCell>
                          <TableCell>{vote.contestName}</TableCell>
                          <TableCell>{vote.count}</TableCell>
                          <TableCell>{vote.amount ? `$${vote.amount}` : "Free"}</TableCell>
                          <TableCell>{format(new Date(vote.votedOn), "MMM dd, yyyy")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Voters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topVotersLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : topVoters.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No top voters data available.</p>
                ) : (
                  <div className="space-y-3">
                    {topVoters.map((voter, index) => (
                      <div key={voter.profileId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">{index + 1}</div>
                          <div>
                            <p className="font-medium">{voter.userName}</p>
                            <p className="text-sm text-muted-foreground">{voter.totalVotesGiven} votes</p>
                          </div>
                        </div>
                        {voter.comment && <p className="text-sm text-muted-foreground max-w-xs truncate">"{voter.comment}"</p>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Votes by Contest */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Votes by Contest
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No contest participations found.</p>
              ) : (
                <div className="space-y-4">
                  {participations.map((participation) => {
                    const leaderboard = contestLeaderboards.find((lb) => lb.contestId === participation.contestId);
                    const profileEntry = Array.isArray(leaderboard?.leaderboardData)
                      ? (leaderboard.leaderboardData as { profileId: string; rank: number; totalVotes: number; freeVotes: number; paidVotes: number }[]).find(
                          (entry) => entry.profileId === profile.id
                        )
                      : undefined;
                    const contestVotes = votes.filter((v) => v.contestName === participation.contest.name);

                    return (
                      <div key={participation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{participation.contest.name}</h4>
                          <Badge className={getContestStatusColor(participation.contest.status)}>{participation.contest.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Current Rank</p>
                            <p className="text-lg font-bold text-green-600">{profileEntry ? `#${profileEntry.rank}` : "N/A"}</p>
                          </div>
                          <div>
                            <p className="font-medium">Total Votes</p>
                            <p className="text-lg font-bold">{profileEntry?.totalVotes || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Free Votes</p>
                            <p className="text-sm text-blue-600">{profileEntry?.freeVotes || 0}</p>
                          </div>
                          <div>
                            <p className="font-medium">Paid Votes</p>
                            <p className="text-sm text-green-600">{profileEntry?.paidVotes || 0}</p>
                          </div>
                        </div>

                        {contestVotes.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Recent Votes in this Contest:</p>
                            <div className="space-y-1">
                              {contestVotes.slice(0, 3).map((vote, index) => (
                                <div key={index} className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>{vote.name}</span>
                                  <span>
                                    {vote.count} votes ({vote.amount ? `$${vote.amount}` : "Free"})
                                  </span>
                                </div>
                              ))}
                              {contestVotes.length > 3 && <p className="text-xs text-muted-foreground">... and {contestVotes.length - 3} more</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Details Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Full Name</p>
                    <p className="text-sm text-muted-foreground">{profile?.user?.name || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Username</p>
                    <p className="text-sm text-muted-foreground">@{profile?.user?.username}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-sm text-muted-foreground">{profile?.user?.email}</p>
                  </div>

                  {profile.phone && (
                    <div>
                      <p className="text-sm font-medium mb-1">Phone</p>
                      <p className="text-sm text-muted-foreground">{profile.phone}</p>
                    </div>
                  )}

                  {profile.dateOfBirth && (
                    <div>
                      <p className="text-sm font-medium mb-1">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(profile.dateOfBirth), "MMMM dd, yyyy")}</p>
                    </div>
                  )}

                  {profile.gender && (
                    <div>
                      <p className="text-sm font-medium mb-1">Gender</p>
                      <p className="text-sm text-muted-foreground">{profile.gender}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Address</p>
                    <p className="text-sm text-muted-foreground">{profile.address || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">City</p>
                    <p className="text-sm text-muted-foreground">{profile.city || "Not provided"}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Country</p>
                    <p className="text-sm text-muted-foreground">{profile.country || "Not provided"}</p>
                  </div>

                  {profile.postalCode && (
                    <div>
                      <p className="text-sm font-medium mb-1">Postal Code</p>
                      <p className="text-sm text-muted-foreground">{profile.postalCode}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium mb-1">Profile Created</p>
                    {/* <p className="text-sm text-muted-foreground">{format(new Date(profile?.createdAt), "MMMM dd, yyyy 'at' h:mm a")}</p> */}
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(profile?.updatedAt), "MMMM dd, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Media Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {profile?.instagram && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Instagram className="w-5 h-5 text-pink-600" />
                    <div className="flex-1">
                      <p className="font-medium">Instagram</p>
                      <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.instagram}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.tiktok && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center text-xs font-bold">T</div>
                    <div className="flex-1">
                      <p className="font-medium">TikTok</p>
                      <a href={profile.tiktok} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.tiktok}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.youtube && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium">YouTube</p>
                      <a href={profile.youtube} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.youtube}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.facebook && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Facebook</p>
                      <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.facebook}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.twitter && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="font-medium">Twitter</p>
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.twitter}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.linkedin && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <div className="flex-1">
                      <p className="font-medium">LinkedIn</p>
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.linkedin}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Website</p>
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.website}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}

                {profile.other && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Globe className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium">Other</p>
                      <a href={profile.other} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {profile.other}
                      </a>
                    </div>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>

              {!profile.instagram && !profile.tiktok && !profile.youtube && !profile.facebook && !profile.twitter && !profile.linkedin && !profile.website && !profile.other && (
                <p className="text-center text-muted-foreground py-8">No social media links provided.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Voter Messages */}
      <Card className="">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
            Messages for Voters
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Messages displayed to different types of voters</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
            <Label htmlFor="voterMessage" className="text-sm font-medium mb-2 block text-blue-800 dark:text-blue-200">
              Message for Paid Voters
            </Label>
            <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">This message will be shown to voters who purchased Swing Cover Girl votes from your profile</p>
            <textarea
              id="voterMessage"
              disabled
              rows={3}
              value="Thank you for supporting me with your vote! Your support means everything..."
              className="w-full p-3 bg-muted/50 cursor-not-allowed rounded-md border resize-none"
              readOnly
            />
          </div>

          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200 dark:border-green-800">
            <Label htmlFor="freeVoterMessage" className="text-sm font-medium mb-2 block text-green-800 dark:text-green-200">
              Message for Free Voters
            </Label>
            <p className="text-xs text-green-600 dark:text-green-300 mb-3">This message will be shown to voters who vote for you using free votes</p>
            <textarea
              id="freeVoterMessage"
              disabled
              rows={3}
              value="Thank you for your free vote! Every vote counts and I appreciate your support..."
              className="w-full p-3 bg-muted/50 cursor-not-allowed rounded-md border resize-none"
              readOnly
            />
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {lightboxImage && <Lightbox image={lightboxImage} onClose={closeLightbox} />}
    </div>
  );
}
