import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Trophy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import VotesTable from "./-data-table";
import { useVotesAnalytics } from "@/hooks/api/useVotes";

export const Route = createFileRoute("/admin/votes/")({
  component: () => <AdminVotesPage />,
});

function AdminVotesPage() {
  const { data: analytics, isLoading, error } = useVotesAnalytics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Votes Management</h1>
          <p className="text-muted-foreground text-sm">Monitor all votes across the platform with advanced filtering and export capabilities</p>
        </div>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Votes</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : analytics?.totalVotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Votes</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : analytics?.paidVotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Free Votes</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : analytics?.freeVotes || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Votes Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Votes</CardTitle>
        </CardHeader>
        <CardContent>
          <VotesTable />
        </CardContent>
      </Card>

      {/* Top Vote Recipients and Top Voters - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Vote Recipients */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Top Vote Recipients</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-purple-200 rounded w-24"></div>
                      <div className="h-3 bg-purple-200 rounded w-16"></div>
                    </div>
                    <div className="h-6 bg-purple-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">Error loading data</div>
            ) : analytics?.topVoteRecipients && analytics.topVoteRecipients.length > 0 ? (
              <div className="space-y-3">
                {analytics.topVoteRecipients.map((recipient, index) => {
                  const gradientColors = [
                    "from-pink-400 to-purple-500",
                    "from-blue-400 to-purple-500",
                    "from-green-400 to-blue-500",
                    "from-yellow-400 to-orange-500",
                    "from-red-400 to-pink-500",
                    "from-indigo-400 to-purple-500",
                    "from-teal-400 to-green-500",
                    "from-orange-400 to-red-500",
                  ];
                  const gradient = gradientColors[index % gradientColors.length];
                  const initials =
                    recipient.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U";

                  return (
                    <Link
                      key={recipient.profileId}
                      to="/admin/profiles/$id"
                      params={{ id: recipient.profileId }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-200/50 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        {recipient.profileImage ? (
                          <img src={recipient.profileImage} alt={recipient.name} className="w-12 h-12 rounded-full object-cover border-3 border-purple-200 shadow-md" />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg border-3 border-purple-200 shadow-md`}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">{index + 1}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-purple-900 truncate">{recipient.name}</h4>
                        <p className="text-xs text-purple-700 truncate">@{recipient.username}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-bold text-purple-800">{recipient.totalVotesReceived} votes</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-purple-600 py-4">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Top Voters */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <User className="h-5 w-5 text-orange-600" />
              <span>Top Voters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-orange-200 rounded w-24"></div>
                      <div className="h-3 bg-orange-200 rounded w-16"></div>
                    </div>
                    <div className="h-6 bg-orange-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-4">Error loading data</div>
            ) : analytics?.topVoters && analytics.topVoters.length > 0 ? (
              <div className="space-y-3">
                {analytics.topVoters.map((voter, index) => {
                  const gradientColors = [
                    "from-cyan-400 to-blue-500",
                    "from-emerald-400 to-teal-500",
                    "from-amber-400 to-yellow-500",
                    "from-rose-400 to-pink-500",
                    "from-violet-400 to-indigo-500",
                    "from-lime-400 to-green-500",
                    "from-sky-400 to-blue-500",
                    "from-fuchsia-400 to-purple-500",
                  ];
                  const gradient = gradientColors[index % gradientColors.length];
                  const initials =
                    voter.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "U";

                  return (
                    <Link
                      key={voter.profileId}
                      to="/admin/profiles/$id"
                      params={{ id: voter.profileId }}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-200/50 transition-colors cursor-pointer"
                    >
                      <div className="relative">
                        {voter.profileImage ? (
                          <img src={voter.profileImage} alt={voter.name} className="w-12 h-12 rounded-full object-cover border-3 border-orange-200 shadow-md" />
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg border-3 border-orange-200 shadow-md`}
                          >
                            {initials}
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">{index + 1}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-orange-900 truncate">{voter.name}</h4>
                        <p className="text-xs text-orange-700 truncate">@{voter.username}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-bold text-orange-800">{voter.totalVotesGiven} votes</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-orange-600 py-4">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
