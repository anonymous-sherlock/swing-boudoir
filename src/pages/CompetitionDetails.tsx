import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Calendar, 
  Users, 
  Gift, 
  Clock, 
  Share2, 
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Eye,
  Star,
  Award,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  TrendingUp,
  UserCheck,
  FileText,
  Settings,
  Info,
  Heart,
  Instagram,
  Twitter,
  Facebook,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/api";
import { formatUsdAbbrev } from "@/lib/utils";
import { formatDistanceToNow, isAfter, isBefore, startOfDay } from "date-fns";
import { Competition, Award as AwardType } from "@/types/competitions.types";
import CompetitionDetailsHeader from "@/components/CompetitionDetailsHeader";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardSection } from "@/pages/Dashboard";

interface CompetitionDetails extends Competition {
  rules?: string[];
  eligibility?: string[];
  prizes?: {
    first?: number;
    second?: number;
    third?: number;
    special?: Array<{ name: string; amount: number }>;
  };
  participants?: number;
  maxParticipants?: number;
  category?: string;
  tags?: string[];
  organizer?: {
    name: string;
    email: string;
    phone?: string;
  };
  requirements?: {
    age?: { min: number; max: number };
    experience?: string;
    location?: string[];
    documents?: string[];
  };
  timeline?: {
    registrationDeadline: string;
    submissionDeadline: string;
    judgingStart: string;
    judgingEnd: string;
    resultsAnnouncement: string;
  };
}

export default function CompetitionDetails() {
  const { id } = useParams({ from: "/competition/$id" });

  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [competition, setCompetition] = useState<CompetitionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isJoined, setIsJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<DashboardSection>("competitions");

  // Fetch competition details
  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest(`/api/v1/contest/${id}`, {
          method: "GET",
        });

        if (response.success) {
          setCompetition(response.data);
          
          // Check if user is already joined
          if (isAuthenticated && user?.profileId) {
            const joinedResponse = await apiRequest(`/api/v1/contest/${user.profileId}/joined`, {
              method: "GET",
            });
            
            if (joinedResponse.success && joinedResponse.data) {
              const joinedContests = joinedResponse.data.data || joinedResponse.data;
              setIsJoined(Array.isArray(joinedContests) && joinedContests.some((contest: Competition) => contest.id === id));
            }
          }
        } else {
          setError('Failed to load competition details');
        }
      } catch (err) {
        console.error('Error fetching competition details:', err);
        setError('Failed to load competition details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompetitionDetails();
  }, [id, isAuthenticated, user?.profileId]);

  // Countdown timer
  useEffect(() => {
    if (!competition?.endDate) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(competition.endDate).getTime();
      const difference = end - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${days.toString().padStart(2, '0')} : ${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft("Ended");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [competition?.endDate]);

  const getCompetitionStatus = (): "active" | "coming-soon" | "ended" => {
    if (!competition) return "ended";
    
    const now = startOfDay(new Date());
    const startDate = startOfDay(new Date(competition.startDate));
    const endDate = startOfDay(new Date(competition.endDate));

    if (isAfter(now, endDate)) {
      return "ended";
    } else if (isBefore(now, startDate)) {
      return "coming-soon";
    } else {
      return "active";
    }
  };

  const getStatusBadge = (status: "active" | "coming-soon" | "ended") => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 text-white">Active</Badge>;
      case "ended":
        return <Badge variant="secondary">Completed</Badge>;
      case "coming-soon":
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleJoinContest = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join this competition",
        variant: "destructive",
      });
      return;
    }

    if (!competition) return;

    try {
      setIsJoining(true);
      
      const response = await apiRequest(`/api/v1/contest/${competition.id}/join`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.success) {
        setIsJoined(true);
        toast({
          title: "Success!",
          description: `You have joined ${competition.name}`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to join competition",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error joining competition:', error);
      toast({
        title: "Error",
        description: "Failed to join competition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const shareCompetition = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Competition link has been copied to clipboard.",
      });
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSidebarNavigation = (section: DashboardSection) => {
    setActiveSection(section);
    navigate(`/dashboard/${section}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <CompetitionDetailsHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex pt-16 min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block flex-shrink-0">
            <Sidebar activeSection={activeSection} setActiveSection={handleSidebarNavigation} />
          </aside>

          {/* Mobile Sidebar */}
          <Sidebar 
            activeSection={activeSection}
            setActiveSection={handleSidebarNavigation}
            isMobile={true}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
              <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="text-center space-y-4">
                  <RefreshCw className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <p className="text-lg text-muted-foreground">Loading competition details...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-background">
        <CompetitionDetailsHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex pt-16">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          </aside>

          {/* Mobile Sidebar */}
          <Sidebar 
            activeSection={activeSection}
            setActiveSection={handleSidebarNavigation}
            isMobile={true}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(false)}
          />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
              <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <div className="text-center space-y-4">
                  <AlertCircle className="h-16 w-16 text-destructive mx-auto" />
                  <h3 className="text-xl font-semibold">Competition Not Found</h3>
                  <p className="text-muted-foreground">{error || 'This competition could not be loaded.'}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const status = getCompetitionStatus();

  return (
    <div className="min-h-screen bg-background">
      <CompetitionDetailsHeader onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16 min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block flex-shrink-0">
          <Sidebar activeSection={activeSection} setActiveSection={handleSidebarNavigation} />
        </aside>

        {/* Mobile Sidebar */}
        <Sidebar 
          activeSection={activeSection}
          setActiveSection={handleSidebarNavigation}
          isMobile={true}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Back Navigation */}
            <div>
              <Link to="/dashboard/competitions">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Competitions
                </Button>
              </Link>
            </div>

            {/* Hero Section with Image and Title */}
            <div className="relative">
              {competition.images && competition.images.length > 0 && (
                <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                  <img 
                    src={competition.images[0].url} 
                    alt={competition.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center space-x-3 mb-4">
                      {getStatusBadge(status)}
                      <Button onClick={shareCompetition} variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{competition.name}</h1>
                    <p className="text-white/90 text-lg max-w-3xl">{competition.description}</p>
                  </div>
                </div>
              )}

              {/* If no image, show regular header */}
              {(!competition.images || competition.images.length === 0) && (
                <div className="space-y-4 mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(status)}
                        <span className="text-sm text-muted-foreground">Competition Details</span>
                      </div>
                      <h1 className="text-4xl font-bold text-foreground">{competition.name}</h1>
                      <p className="text-lg text-muted-foreground max-w-3xl">{competition.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button onClick={shareCompetition} variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar - Join/Status prominently placed */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                  <div className="flex items-center space-x-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{formatUsdAbbrev(competition.prizePool)}</div>
                      <div className="text-sm text-muted-foreground">Prize Pool</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {competition.participants || 0}
                        {competition.maxParticipants && <span className="text-lg">/{competition.maxParticipants}</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">Participants</div>
                    </div>
                    {status === 'active' && timeLeft && timeLeft !== "Ended" && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 font-mono">{timeLeft}</div>
                        <div className="text-sm text-muted-foreground">Time Left</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    {status === 'active' ? (
                      <>
                        {isJoined ? (
                          <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                              <UserCheck className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-green-600">You're In!</h3>
                              <p className="text-sm text-muted-foreground">Good luck in the competition</p>
                            </div>
                            <Button variant="outline" size="lg">
                              <Eye className="w-4 h-4 mr-2" />
                              View Your Entry
                            </Button>
                          </div>
                        ) : (
                          <Button 
                            onClick={handleJoinContest} 
                            disabled={isJoining}
                            size="lg"
                            className="text-lg px-8 py-4 h-auto"
                          >
                            {isJoining ? (
                              <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Joining...
                              </>
                            ) : (
                              <>
                                <Trophy className="w-5 h-5 mr-2" />
                                Join Competition
                              </>
                            )}
                          </Button>
                        )}
                      </>
                    ) : status === 'coming-soon' ? (
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                          <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-yellow-600">Coming Soon</h3>
                          <p className="text-sm text-muted-foreground">Registration opens soon</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Award className="w-8 h-8 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-600">Competition Ended</h3>
                          <p className="text-sm text-muted-foreground">View the final results</p>
                        </div>
                        <Button variant="outline" size="lg">
                          <Eye className="w-4 h-4 mr-2" />
                          View Results
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Awards - Most engaging section first */}
                {competition.awards && competition.awards.length > 0 && (
                  <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center text-2xl text-amber-800">
                        <Trophy className="w-6 h-6 mr-3 text-amber-600" />
                        Awards & Prizes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {competition.awards.map((award: AwardType, index: number) => (
                          <div key={award.id} className="flex items-center space-x-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200 shadow-sm">
                            <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                              <span className="text-3xl">{award.icon}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-amber-900 text-lg">{award.name}</p>
                              <p className="text-amber-700">Position #{index + 1}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Competition Timeline */}
                {competition.timeline && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Clock className="w-5 h-5 mr-3 text-primary" />
                        Competition Timeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {Object.entries(competition.timeline).map(([key, date], index) => {
                          const isActive = index === 0; // You can implement logic to determine active step
                          return (
                            <div key={key} className={`flex items-center space-x-6 p-4 rounded-lg border-2 ${isActive ? 'border-primary bg-primary/5' : 'border-slate-200 bg-slate-50'}`}>
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-primary text-white' : 'bg-slate-300 text-slate-600'}`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-lg capitalize text-foreground">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="text-muted-foreground">{formatDate(date)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Info className="w-5 h-5 mr-3 text-primary" />
                      Competition Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-700 font-medium">Start Date</p>
                          <p className="text-lg font-semibold text-blue-900">{formatDate(competition.startDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-red-700 font-medium">End Date</p>
                          <p className="text-lg font-semibold text-red-900">{formatDate(competition.endDate)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Rules & Requirements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <FileText className="w-5 h-5 mr-3 text-primary" />
                      Rules & Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {competition.rules && competition.rules.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-lg flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          Competition Rules
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {competition.rules.map((rule, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                              </div>
                              <span className="text-foreground leading-relaxed">{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {competition.eligibility && competition.eligibility.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground text-lg flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          Eligibility Requirements
                        </h4>
                        <div className="grid grid-cols-1 gap-4">
                          {competition.eligibility.map((requirement, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <UserCheck className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="text-foreground leading-relaxed">{requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - 1/3 width */}
              <div className="space-y-6">
                {/* Organizer Info */}
                {competition.organizer && (
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <Settings className="w-5 h-5 mr-2 text-primary" />
                        Organizer
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-200">
                          <p className="font-semibold text-foreground text-lg">{competition.organizer.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{competition.organizer.email}</p>
                          {competition.organizer.phone && (
                            <p className="text-sm text-muted-foreground">{competition.organizer.phone}</p>
                          )}
                        </div>
                        <Button variant="outline" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Organizer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Requirements */}
                {competition.requirements && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <UserCheck className="w-5 h-5 mr-2 text-primary" />
                        Additional Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {competition.requirements.age && (
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <UserCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Age Range</p>
                            <p className="text-sm text-muted-foreground">
                              {competition.requirements.age.min} - {competition.requirements.age.max} years
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {competition.requirements.experience && (
                        <div className="flex items-center space-x-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                          <Star className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Experience Level</p>
                            <p className="text-sm text-muted-foreground">{competition.requirements.experience}</p>
                          </div>
                        </div>
                      )}
                      
                      {competition.requirements.location && competition.requirements.location.length > 0 && (
                        <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
                          <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">Location</p>
                            <p className="text-sm text-muted-foreground">
                              {competition.requirements.location.join(', ')}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Category & Tags */}
                {(competition.category || (competition.tags && competition.tags.length > 0)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center text-lg">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                        Categories & Tags
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {competition.category && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                          <Badge variant="outline" className="text-sm px-3 py-2 bg-primary/10 border-primary/30 text-primary font-medium">
                            {competition.category}
                          </Badge>
                        </div>
                      )}
                      
                      {competition.tags && competition.tags.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-3">Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {competition.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs px-3 py-1 bg-slate-100 hover:bg-slate-200 transition-colors">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Heart className="w-5 h-5 mr-2 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Favorites
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on Social
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Related Competitions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <Trophy className="w-5 h-5 mr-2 text-primary" />
                      You Might Also Like
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-900 mb-1">Design Challenge 2024</p>
                      <p className="text-sm text-blue-700 mb-2">Prize: $5,000</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <p className="font-medium text-green-900 mb-1">Code Sprint</p>
                      <p className="text-sm text-green-700 mb-2">Prize: $10,000</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-900 mb-1">Innovation Contest</p>
                      <p className="text-sm text-purple-700 mb-2">Prize: $15,000</p>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom CTA Section */}
            {!isJoined && status === 'active' && (
              <Card className="bg-gradient-to-r from-primary to-primary/80 border-0 text-white mt-12">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-white/90" />
                  <h3 className="text-2xl font-bold mb-2">Ready to Compete?</h3>
                  <p className="text-white/90 mb-6 text-lg">Join thousands of participants and showcase your skills!</p>
                  <Button 
                    onClick={handleJoinContest} 
                    disabled={isJoining}
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 py-4 h-auto bg-white text-primary hover:bg-white/90"
                  >
                    {isJoining ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Joining Competition...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5 mr-2" />
                        Join Competition Now
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}