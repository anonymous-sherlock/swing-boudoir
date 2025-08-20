import { CompetitionCard } from "@/components/competitions/CompetitionCard";
import { CompetitionListItem } from "@/components/competitions/CompetitionListItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { Contest, useContests } from "@/hooks/api/useContests";
import { useToast } from "@/hooks/use-toast";
import { isAfter, isBefore, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Grid3X3, List, Loader2, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";

const ITEMS_PER_PAGE = 12;

export const CompetitionsList: React.FC = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const statuses = ["all", "active", "upcoming", "ended"] as const;
  // URL state management with nuqs
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [status, setStatus] = useQueryState<(typeof statuses)[number]>("status", {
    defaultValue: "active",
    parse: (value) => (statuses.includes(value as (typeof statuses)[number]) ? (value as (typeof statuses)[number]) : "active"),
  });
  const [view, setView] = useQueryState("view", { defaultValue: "grid" as "grid" | "list" });

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(search || "");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(search || "");

  // Convert page to number for the hook
  const currentPage = parseInt(page || "1", 10);

  // Use the new useContests hook with status filtering and search
  const { data: contestsData, isLoading, error } = useContests(currentPage, ITEMS_PER_PAGE, status, debouncedSearchQuery || undefined);
  const contests = contestsData?.data || [];
  const pagination = contestsData?.pagination;

  // Debounce search query and update URL
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      if (searchQuery !== search) {
        setSearch(searchQuery || null);
        setPage("1");
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, search, setSearch, setPage]);

  // Sync local search state with URL state
  useEffect(() => {
    setSearchQuery(search || "");
  }, [search]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as (typeof statuses)[number]);
    setPage("1");
  };

  const handleViewChange = (newView: "grid" | "list") => {
    setView(newView);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "VOTING":
        return "secondary";
      case "JUDGING":
        return "outline";
      case "COMPLETED":
        return "secondary";
      case "DRAFT":
        return "outline";
      case "PUBLISHED":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-600";
      case "VOTING":
        return "text-blue-600";
      case "JUDGING":
        return "text-yellow-600";
      case "COMPLETED":
        return "text-gray-600";
      case "DRAFT":
        return "text-gray-500";
      case "PUBLISHED":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Competitions</CardTitle>
            <CardDescription>There was an error loading the competitions. Please try again later.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="pt-16 pb-16 bg-[#FBFCFC]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Competitions</h1>
          <p className="text-lg text-gray-600">Discover and join exciting contests to showcase your talent</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search competitions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>

            {/* Status Filter */}
            <Select value={status || "active"} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ended">Ended</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-md">
              <Button variant={view === "grid" ? "default" : "ghost"} size="sm" onClick={() => handleViewChange("grid")} className="rounded-r-none">
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant={view === "list" ? "default" : "ghost"} size="sm" onClick={() => handleViewChange("list")} className="rounded-l-none">
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {contests.length} competition{contests.length !== 1 ? "s" : ""} found
            </span>
            {pagination && (
              <span>
                Page {currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-600">Loading competitions...</span>
          </div>
        )}

        {/* Competitions Grid/List */}
        {!isLoading && contests.length > 0 && (
          <>
            <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8" : "space-y-4 mb-8"}>
              {contests.map((contest) => (
                <div key={contest.id}>{view === "grid" ? <CompetitionCard contest={contest} /> : <CompetitionListItem competition={contest} />}</div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={!pagination.hasPreviousPage}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button key={pageNum} variant={currentPage === pageNum ? "default" : "outline"} size="sm" onClick={() => handlePageChange(pageNum)} className="w-10 h-10">
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={!pagination.hasNextPage}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!isLoading && contests.length === 0 && (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>No competitions found</CardTitle>
              <CardDescription>Try adjusting your search or filters to find what you're looking for.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSearch(null);
                  setStatus(null);
                  setPage("1");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
};

export default CompetitionsList;
