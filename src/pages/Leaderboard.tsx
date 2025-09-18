import Header from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { ModelRank, useGetModelRanks } from "@/hooks/api/useModelRanks";
import { ImageHelper } from "@/lib/image-helper";
import { Link } from "@tanstack/react-router";
import { Award, Crown, Heart, Medal, Pin, Search, Trophy } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

type LeaderboardStats = {
  totalModels: number;
  totalVotes: number;
  activeContests: number;
};

interface LeaderboardModel extends ModelRank {
  displayName: string;
  totalVotes: number;
  isCurrentUser: boolean;
}

interface PaginatedData {
  data: LeaderboardModel[];
  pagination: {
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: number | null;
    previousPage: number | null;
  };
}

// Memoized user entry component for performance
const UserEntry = React.memo(
  ({
    model,
    index,
    isSticky = false,
    ref,
    currentUserRank,
    isAuthenticated,
    getRankIcon,
    formatNumber,
  }: {
    model: LeaderboardModel;
    index: number;
    isSticky?: boolean;
    ref?: React.RefObject<HTMLDivElement>;
    currentUserRank?: number | "N/A";
    isAuthenticated: boolean;
    getRankIcon: (rank: number | "N/A") => JSX.Element;
    formatNumber: (num: number) => string;
  }) => {
    const shouldBlurRank =
      isAuthenticated &&
      currentUserRank !== undefined &&
      typeof model.rank === "number" &&
      typeof currentUserRank === "number" &&
      model.rank < currentUserRank &&
      !model.isCurrentUser;

    return (
      <div
        key={model.id}
        ref={ref}
        className={`p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors relative ${
          model.isCurrentUser
            ? `bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ${isSticky ? "sticky bottom-0 z-10 shadow-md" : ""}`
            : index === 0
              ? "bg-gradient-to-r from-yellow-50 to-orange-50"
              : ""
        }`}
      >
        {model.isCurrentUser && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Pin className="w-3 h-3 mr-1" />
              You
            </Badge>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {/* Rank */}
          <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 ${shouldBlurRank ? "blur-sm" : ""}`}>
            {shouldBlurRank ? <span className="text-lg font-bold text-gray-400">***</span> : getRankIcon(model.rank)}
          </div>

          {/* Avatar */}
          <div className="relative">
            <Link to="/profile/$username" params={{ username: model.profile.username }}>
              <img
                src={model.profile.image ? ImageHelper.avatar(model.profile.image, "small") : `https://ui-avatars.com/api/?name=${model.displayName}&size=60&background=random`}
                alt={model.displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 hover:border-blue-300 transition-colors cursor-pointer"
              />
            </Link>
          </div>

          {/* Model Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{model.displayName}</h3>
              <span className="text-sm text-gray-500">@{model.profile.username}</span>
            </div>

            <div className="text-sm text-gray-500 mt-2 w-2/3">
              <div className="line-clamp-2">{model.profile.bio || "No recent activity"}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="text-right space-y-1">
            <div className="flex items-center justify-end space-x-4 text-sm text-gray-600 mb-2">
              {model.isCurrentUser ? (
                <span className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {formatNumber(model.totalVotes)} votes
                </span>
              ) : (
                <span className="flex items-center text-gray-400">
                  <Heart className="w-4 h-4 mr-1" />
                  *** votes
                </span>
              )}
              <span className="flex items-center text-gray-400">
                <Trophy className="w-4 h-4 mr-1" />
                *** wins
              </span>
            </div>
            <div className="text-xs text-gray-400">Updated: {new Date(model.updatedAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    );
  }
);

UserEntry.displayName = "UserEntry";

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [allData, setAllData] = useState<LeaderboardModel[]>([]);
  const [paginatedData, setPaginatedData] = useState<PaginatedData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ITEMS_PER_PAGE = 30;

  // Use nuqs for search state
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""));
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Use the useModelRanks hook to fetch data
  const {
    data: modelRanksData,
    isLoading,
    error,
  } = useGetModelRanks({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch || undefined,
  });

  // Transform data when new data arrives
  const transformData = useCallback(
    (data: ModelRank[]) => {
      const currentUserProfileId = user?.profileId;
      return data.map((modelRank) => ({
        ...modelRank,
        displayName: modelRank.profile.name,
        totalVotes: modelRank.stats.freeVotes + modelRank.stats.paidVotes,
        isCurrentUser: modelRank.profile.id === currentUserProfileId,
      }));
    },
    [user?.profileId]
  );

  // Use data directly from API (no client-side filtering needed)
  const visibleData = useMemo(() => {
    const maxVisibleItems = 100; // Limit to 100 items for performance
    if (allData.length <= maxVisibleItems) {
      return allData;
    }

    // For search results, show all
    if (debouncedSearch) {
      return allData;
    }

    // For normal pagination, limit to first 100 items
    return allData.slice(0, maxVisibleItems);
  }, [allData, debouncedSearch]);

  // Handle new data from API
  useEffect(() => {
    if (modelRanksData?.data) {
      const transformedData = transformData(modelRanksData.data);

      if (currentPage === 1) {
        // First page - replace all data
        setAllData(transformedData);
        setPaginatedData({
          data: transformedData,
          pagination: modelRanksData.pagination,
        });
      } else {
        // Subsequent pages - append data
        setAllData((prev) => [...prev, ...transformedData]);
        setPaginatedData((prev) =>
          prev
            ? {
                ...prev,
                data: [...prev.data, ...transformedData],
                pagination: modelRanksData.pagination,
              }
            : null
        );
      }

      // Calculate stats from all data
      const totalVotes = transformedData.reduce((sum, model) => sum + model.totalVotes, 0);

      setIsLoadingMore(false);
    }
  }, [modelRanksData, transformData, currentPage]);

  // Reset pagination when search changes
  useEffect(() => {
    if (debouncedSearch !== "") {
      setCurrentPage(1);
      setAllData([]);
      setPaginatedData(null);
    }
  }, [debouncedSearch]);

  // Debounced load more function
  const loadMore = useCallback(() => {
    if (paginatedData?.pagination.hasNextPage && !isLoadingMore && !isLoading) {
      setIsLoadingMore(true);
      setCurrentPage((prev) => prev + 1);
    }
  }, [paginatedData?.pagination.hasNextPage, isLoadingMore, isLoading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore && !isLoading) {
          // Debounce the load more call
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }
          scrollTimeoutRef.current = setTimeout(() => {
            loadMore();
          }, 100); // 100ms debounce
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Start loading when 100px before the element
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [loadMore, isLoadingMore, isLoading]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const getRankIcon = (rank: number | "N/A") => {
    if (rank === "N/A") {
      return (
        <Badge
          variant="secondary"
          className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 border border-gray-200"
        >
          N/A
        </Badge>
      );
    }

    const NumberPill = ({ value }: { value: number }) => (
      <span className="absolute -bottom-1 -right-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/90 text-gray-900 shadow-sm border border-black/5">
        #{value}
      </span>
    );

    if (rank === 1) {
      return (
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-yellow-400 via-amber-300 to-orange-400 ring-2 ring-yellow-300/60 ring-offset-2 ring-offset-white shadow-[0_8px_20px_-8px_rgba(234,179,8,0.7)]">
          <Crown className="w-6 h-6 text-white drop-shadow" />
          <NumberPill value={rank} />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-gray-200 to-zinc-300 ring-2 ring-slate-300/60 ring-offset-2 ring-offset-white shadow-[0_8px_20px_-8px_rgba(148,163,184,0.6)]">
          <Medal className="w-6 h-6 text-white drop-shadow" />
          <NumberPill value={rank} />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-amber-300 via-orange-300 to-amber-500 ring-2 ring-amber-300/60 ring-offset-2 ring-offset-white shadow-[0_8px_20px_-8px_rgba(251,191,36,0.6)]">
          <Award className="w-6 h-6 text-white drop-shadow" />
          <NumberPill value={rank} />
        </div>
      );
    }

    return (
      <Badge
        variant="outline"
        className="px-2 py-1 text-sm font-semibold bg-white/60 backdrop-blur border border-gray-200 text-gray-800 shadow-sm"
      >
        #{rank}
      </Badge>
    );
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Only show full page loader on initial load (page 1) and no data, and not when searching
  if (isLoading && currentPage === 1 && allData.length === 0 && !debouncedSearch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="space-y-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Leaderboard</h1>
              <p className="text-gray-600">There was an error loading the leaderboard data. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="pt-40 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the top-performing models and rising stars in our community. Vote for your favorites and watch them climb the ranks!
            </p>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Total Models</p>
                    <p className="text-3xl font-bold text-yellow-900">
                      {leaderboardStats && formatNumber(leaderboardStats.totalModels)}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800">Total Votes</p>
                    <p className="text-3xl font-bold text-purple-900">
                      {leaderboardStats && formatNumber(leaderboardStats.totalVotes)}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Active Contests</p>
                    <p className="text-3xl font-bold text-green-900">
                      {leaderboardStats && formatNumber(leaderboardStats.activeContests)}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div> */}

          {/* Search Section */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search models..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Models</span>
                <Badge variant="secondary" className="text-sm">
                  {debouncedSearch ? visibleData.length : paginatedData?.pagination.total || 0} models
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {/* Loading state for search - only show when no data exists */}
                {isLoading && debouncedSearch && visibleData.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Searching models...</span>
                    </div>
                  </div>
                )}

                {/* No results found for search */}
                {!isLoading && debouncedSearch && visibleData.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="w-8 h-8 text-gray-400" />
                      <h3 className="text-lg font-medium text-gray-900">No models found</h3>
                      <p className="text-gray-500">Try adjusting your search terms</p>
                    </div>
                  </div>
                )}

                {/* Blank blurred cards for missing ranks - only show when not searching */}
                {!debouncedSearch &&
                  (() => {
                    // Get the first rank from the original sorted data, not filtered data
                    const sortedData = [...visibleData].sort((a, b) => {
                      if (typeof a.rank === "number" && typeof b.rank === "number") {
                        return a.rank - b.rank;
                      }
                      return 0;
                    });

                    const firstRank = sortedData.length > 0 ? (typeof sortedData[0].rank === "number" ? sortedData[0].rank : 1) : 1;
                    const blankCards: JSX.Element[] = [];

                    for (let i = 1; i < firstRank; i++) {
                      blankCards.push(
                        <div key={`blank-${i}`} className="p-6 border-b border-gray-100 bg-gray-50">
                          <div className="flex items-center space-x-4">
                            {/* Rank */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 blur-sm">
                              <span className="text-lg font-bold text-gray-400">#{i}</span>
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-gray-200 blur-sm"></div>
                            </div>

                            {/* Model Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <div className="h-6 bg-gray-200 rounded blur-sm w-32"></div>
                                <div className="h-4 bg-gray-200 rounded blur-sm w-20"></div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded blur-sm w-2/3"></div>
                            </div>

                            {/* Stats */}
                            <div className="text-right space-y-1">
                              <div className="flex items-center justify-end space-x-4 text-sm text-gray-400 mb-2">
                                <div className="h-4 bg-gray-200 rounded blur-sm w-16"></div>
                                <div className="h-4 bg-gray-200 rounded blur-sm w-12"></div>
                              </div>
                              <div className="h-3 bg-gray-200 rounded blur-sm w-24"></div>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return blankCards;
                  })()}

                {/* Blurred cards for ranks above current user + gaps in admin-assigned ranks - only show when not searching */}
                {!debouncedSearch &&
                  (() => {
                    const currentUserRank = visibleData.find((m) => m.isCurrentUser)?.rank;
                    if (!isAuthenticated || !currentUserRank || typeof currentUserRank !== "number") {
                      return null;
                    }

                    // Get all assigned ranks (1-5 are admin assigned)
                    const assignedRanks = visibleData
                      .filter((model) => typeof model.rank === "number" && model.rank <= 5)
                      .map((model) => model.rank as number)
                      .sort((a, b) => a - b);

                    // Find gaps in admin-assigned ranks (1-5)
                    const adminRanks = [1, 2, 3, 4, 5];
                    const missingAdminRanks = adminRanks.filter((rank) => !assignedRanks.includes(rank));

                    // Get ranks above current user
                    const ranksAboveCurrentUser = visibleData
                      .filter((model) => typeof model.rank === "number" && model.rank < currentUserRank && !model.isCurrentUser)
                      .sort((a, b) => (a.rank as number) - (b.rank as number));

                    // Combine missing admin ranks and ranks above current user
                    const allRanksToShow = [...missingAdminRanks, ...ranksAboveCurrentUser.map((m) => m.rank as number)]
                      .filter((rank, index, arr) => arr.indexOf(rank) === index) // Remove duplicates
                      .sort((a, b) => a - b);

                    return allRanksToShow.map((rank) => {
                      // Check if this rank has an actual user
                      const actualUser = ranksAboveCurrentUser.find((m) => m.rank === rank);

                      if (actualUser) {
                        // Show blurred card for actual user
                        return (
                          <div key={actualUser.id} className="p-6 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center space-x-4">
                              {/* Rank - blurred */}
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 blur-sm">
                                <span className="text-lg font-bold text-gray-400">#{rank}</span>
                              </div>

                              {/* Avatar - visible but blurred */}
                              <div className="relative">
                                <img
                                  src={
                                    actualUser.profile.image
                                      ? ImageHelper.avatar(actualUser.profile.image, "small")
                                      : `https://ui-avatars.com/api/?name=${actualUser.displayName}&size=60&background=random`
                                  }
                                  alt={actualUser.displayName}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 blur-sm"
                                />
                              </div>

                              {/* Model Info - blurred */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="h-6 bg-gray-200 rounded blur-sm w-32"></div>
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-20"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded blur-sm w-2/3"></div>
                              </div>

                              {/* Stats - blurred */}
                              <div className="text-right space-y-1">
                                <div className="flex items-center justify-end space-x-4 text-sm text-gray-400 mb-2">
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-16"></div>
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-12"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded blur-sm w-24"></div>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Show blank card for missing admin rank
                        return (
                          <div key={`missing-admin-${rank}`} className="p-6 border-b border-gray-100 bg-gray-50">
                            <div className="flex items-center space-x-4">
                              {/* Rank */}
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 blur-sm">
                                <span className="text-lg font-bold text-gray-400">#{rank}</span>
                              </div>

                              {/* Avatar */}
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-gray-200 blur-sm"></div>
                              </div>

                              {/* Model Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="h-6 bg-gray-200 rounded blur-sm w-32"></div>
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-20"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded blur-sm w-2/3"></div>
                              </div>

                              {/* Stats */}
                              <div className="text-right space-y-1">
                                <div className="flex items-center justify-end space-x-4 text-sm text-gray-400 mb-2">
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-16"></div>
                                  <div className="h-4 bg-gray-200 rounded blur-sm w-12"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded blur-sm w-24"></div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    });
                  })()}

                {/* Regular leaderboard entries (excluding ranks above current user) */}
                {visibleData.map((model, index) => {
                    // Skip ranks above current user as they're handled separately above
                    const currentUserRank = visibleData.find((m) => m.isCurrentUser)?.rank;
                    const isRankAboveCurrentUser =
                      isAuthenticated &&
                      currentUserRank !== undefined &&
                      typeof model.rank === "number" &&
                      typeof currentUserRank === "number" &&
                      model.rank < currentUserRank &&
                      !model.isCurrentUser;

                    if (isRankAboveCurrentUser) {
                      return null; // Skip this entry as it's handled above
                    }

                    return (
                      <UserEntry
                        key={model.id}
                        model={model}
                        index={index}
                        isSticky={false}
                        currentUserRank={currentUserRank}
                        isAuthenticated={isAuthenticated}
                        getRankIcon={getRankIcon}
                        formatNumber={formatNumber}
                      />
                    );
                  })}

                {/* Load More Trigger (Intersection Observer) */}
                {paginatedData?.pagination.hasNextPage && !debouncedSearch && (
                  <div ref={loadMoreRef} className="p-6 text-center">
                    {isLoadingMore ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Loading more models...</span>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Scroll down to load more</div>
                    )}
                  </div>
                )}

                {/* Manual Load More Button (fallback) */}
                {paginatedData?.pagination.hasNextPage && !debouncedSearch && !isLoadingMore && (
                  <div className="p-6 text-center">
                    <Button onClick={loadMore} variant="outline" size="lg" className="min-w-32">
                      Load More
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          {/* <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Ready to Join the Competition?
              </h3>
              <p className="text-blue-700 mb-6 max-w-2xl mx-auto">
                Create your profile, join contests, and start climbing the leaderboard. Your journey
                to the top starts here!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Trophy className="w-5 h-5 mr-2" />
                  Join Contest
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="w-5 h-5 mr-2" />
                  Browse Models
                </Button>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
