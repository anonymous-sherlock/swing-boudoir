import { createLazyFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Trophy, Users, RefreshCw } from "lucide-react";
import RanksTable from "./-data-table/index";
import { useModelRanksAnalytics, useUpdateComputedRanks } from "@/hooks/api/useModelRanks";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/admin/ranks/")({
  component: () => <AdminRanksPage />,
});

function AdminRanksPage() {
  const { data: analytics, isLoading, error } = useModelRanksAnalytics();
  const updateComputedRanksMutation = useUpdateComputedRanks();

  // Calculate analytics from the data
  const totalModels = analytics?.pagination?.total || 0;
  const manualRanks = analytics?.data?.filter((item) => item.isManualRank === true).length || 0;
  const topRated = analytics?.data?.filter((item) => typeof item.rank === "number" && item.rank <= 3).length || 0;

  // Handle manual rank update
  const handleUpdateRanks = async () => {
    try {
      await updateComputedRanksMutation.mutateAsync();
      toast.success("Ranks updated successfully!");
    } catch (error) {
      toast.error("Failed to update ranks. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Model Rankings</h1>
          <p className="text-muted-foreground text-sm">Manage model rankings and assign manual ranks (1-5) to top performers</p>
        </div>
        <Button
          onClick={handleUpdateRanks}
          disabled={updateComputedRanksMutation.isPending}
          size="sm"
          className="flex items-center gap-2 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${updateComputedRanksMutation.isPending ? 'animate-spin' : ''}`} />
          {updateComputedRanksMutation.isPending ? 'Updating...' : 'Update Ranks'}
        </Button>
      </div>

      {/* Stats Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Models</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : totalModels}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manual Ranks</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : manualRanks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Rated</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : error ? "Error" : topRated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rankings Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Model Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <RanksTable />
        </CardContent>
      </Card>

      {/* Top Ranked Models - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Ranked Models */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-800">
              <Trophy className="h-5 w-5 text-purple-600" />
              <span>Top Ranked Models</span>
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
            ) : analytics?.data && analytics.data.length > 0 ? (
              <div className="space-y-3">
                {analytics.data
                  .filter((item) => typeof item.rank === "number" && item.rank <= 10 && item.isManualRank !== true)
                  .slice(0, 5)
                  .map((model, index) => {
                    const gradientColors = [
                      "from-pink-400 to-purple-500",
                      "from-blue-400 to-purple-500",
                      "from-green-400 to-blue-500",
                      "from-yellow-400 to-orange-500",
                      "from-red-400 to-pink-500",
                    ];
                    const gradient = gradientColors[index % gradientColors.length];
                    const initials =
                      model.profile.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "M";

                    return (
                      <div key={model.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-purple-200/50 transition-colors cursor-pointer">
                        <div className="relative">
                          {model.profile.image ? (
                            <img src={model.profile.image} alt={model.profile.name} className="w-12 h-12 rounded-full object-cover border-3 border-purple-200 shadow-md" />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg border-3 border-purple-200 shadow-md`}
                            >
                              {initials}
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">#{model.rank}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-purple-900 truncate">{model.profile.name}</h4>
                          <p className="text-xs text-purple-700 truncate">@{model.profile.username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-bold text-purple-800">{model.stats.freeVotes + model.stats.paidVotes} votes</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center text-purple-600 py-4">No ranked models available</div>
            )}
          </CardContent>
        </Card>

        {/* Manual Rankings */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-800">
              <Crown className="h-5 w-5 text-orange-600" />
              <span>Manual Rankings</span>
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
            ) : analytics?.data && analytics.data.length > 0 ? (
              <div className="space-y-3">
                {analytics.data
                  .filter((item) => item.isManualRank === true)
                  .slice(0, 5)
                  .map((model, index) => {
                    const gradientColors = [
                      "from-cyan-400 to-blue-500",
                      "from-emerald-400 to-teal-500",
                      "from-amber-400 to-yellow-500",
                      "from-rose-400 to-pink-500",
                      "from-violet-400 to-indigo-500",
                    ];
                    const gradient = gradientColors[index % gradientColors.length];
                    const initials =
                      model.profile.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "M";

                    return (
                      <div key={model.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-200/50 transition-colors cursor-pointer">
                        <div className="relative">
                          {model.profile.image ? (
                            <img src={model.profile.image} alt={model.profile.name} className="w-12 h-12 rounded-full object-cover border-3 border-orange-200 shadow-md" />
                          ) : (
                            <div
                              className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg border-3 border-orange-200 shadow-md`}
                            >
                              {initials}
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-bold min-w-[24px] text-center">#{model.rank}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-orange-900 truncate">{model.profile.name}</h4>
                          <p className="text-xs text-orange-700 truncate">@{model.profile.username}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-bold text-orange-800">Manual Rank</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="text-center text-orange-600 py-4">No manual rankings assigned</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
