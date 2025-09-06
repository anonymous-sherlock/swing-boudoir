import { useState, useEffect, useMemo, useCallback } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useContestSearch, ContestSearchParams, ContestSearchResult } from "@/hooks/useSearch";
import { useContests } from "@/hooks/api/useContests";
import { Contest } from "@/types/contest.types";

// Unified contest type for the combobox
type UnifiedContest = ContestSearchResult | Contest;

interface ContestComboboxProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showFilters?: boolean;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function ContestCombobox({ value, onValueChange, placeholder = "Select contest...", className, disabled = false, showFilters = true }: ContestComboboxProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContest, setSelectedContest] = useState<UnifiedContest | null>(null);
  const [filters, setFilters] = useState<{ status?: string }>({});

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { data: allContests, isLoading: isLoadingAll } = useContests(1, 100, "all");

  const searchParams: ContestSearchParams = {
    query: debouncedSearchQuery || undefined,
    limit: 50,
    status: (filters.status && filters.status !== "all") ? filters.status as "active" | "upcoming" | "ended" | "booked" : undefined,
  };

  // Run search if query OR filters are applied
  const shouldRunSearch = !!debouncedSearchQuery || (!!filters.status && filters.status !== "all");
  const { data: searchResults, isLoading: isSearching } = useContestSearch(searchParams, shouldRunSearch);

  const getContestId = useCallback((c: UnifiedContest) => c.id, []);
  const getContestName = useCallback((c: UnifiedContest) => c.name, []);
  const getContestPrizePool = useCallback((c: UnifiedContest) => c.prizePool, []);
  const getContestStatus = useCallback((c: UnifiedContest) => (c as Contest).status ?? "", []);
  const getContestDates = useCallback((c: UnifiedContest) => ({ startDate: c.startDate, endDate: c.endDate }), []);
  const getContestImage = useCallback((c: UnifiedContest) => {
    if ("images" in c && Array.isArray(c.images) && c.images.length > 0) return c.images[0].url;
    return null;
  }, []);

  const contests = useMemo(() => {
    // Use search results when we have a search query or status filter
    const base = shouldRunSearch ? searchResults : allContests?.data;
    if (!base) return [];

    // No additional client-side filtering needed since API handles it
    return base;
  }, [shouldRunSearch, searchResults, allContests?.data]);

  const isLoading = shouldRunSearch ? isSearching : isLoadingAll;

  useEffect(() => {
    if (value) {
      let contest = contests?.find((c) => getContestId(c) === value);
      if (!contest && allContests?.data) contest = allContests.data.find((c) => getContestId(c) === value);
      if (!contest && searchResults) contest = searchResults.find((c) => getContestId(c) === value);
      setSelectedContest(contest || null);
    } else {
      setSelectedContest(null);
    }
  }, [value, contests, allContests?.data, searchResults, getContestId]);

  const handleSelect = (id: string) => {
    const contest = contests.find((c) => getContestId(c) === id);
    if (contest) {
      // If clicking on the already selected contest, deselect it
      if (selectedContest && getContestId(selectedContest) === id) {
        setSelectedContest(null);
        onValueChange?.("");
      } else {
        // Otherwise, select the new contest
        setSelectedContest(contest);
        onValueChange?.(id);
      }
    }
    setDialogOpen(false);
  };

  const handleClear = () => {
    setSelectedContest(null);
    onValueChange?.("");
  };

  const handleFilterChange = (key: keyof typeof filters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined) || !!searchQuery;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={dialogOpen} className={cn("w-full justify-between", className)} disabled={disabled}>
          {selectedContest ? (
            <div className="flex items-center gap-2">
              {getContestImage(selectedContest) ? (
                <img src={getContestImage(selectedContest)!} alt={getContestName(selectedContest)} className="w-5 h-5 rounded object-cover" />
              ) : (
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {getContestName(selectedContest).slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="truncate">{getContestName(selectedContest)}</span>
              <span className="text-xs text-muted-foreground">(${getContestPrizePool(selectedContest).toLocaleString()})</span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl flex flex-col gap-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Select Contest</DialogTitle>
        </DialogHeader>

        {/* Search and Filters */}
        {showFilters && (
          <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Search & Filters</h3>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <div className="flex gap-3">
              {/* Search Input */}
              <div className="flex-1 h-full">
                <Input placeholder="Search contests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-10 text-sm" />
              </div>

              {/* Status Filter */}
              <div className="w-40 h-full">
                <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value)}>
                  <SelectTrigger className="h-7 text-sm">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                    <SelectItem value="booked">Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    Search: {searchQuery}
                  </Badge>
                )}
                {filters.status && filters.status !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Status: {filters.status}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search Bar (when filters are hidden) */}
        {!showFilters && (
          <div className="flex items-center gap-2">
            <Input placeholder="Search contests..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1" />
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Contest List */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <div className="text-sm text-muted-foreground">{shouldRunSearch ? "Searching contests..." : "Loading contests..."}</div>
            </div>
          ) : contests.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-lg font-medium text-foreground mb-2">No contests found</div>
              <div className="text-sm text-muted-foreground">{hasActiveFilters ? "Try adjusting your filters or search terms." : "No contests are available at the moment."}</div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground mb-3">
                {contests.length} contest{contests.length !== 1 ? "s" : ""} found
              </div>
              {contests.map((contest) => {
                const id = getContestId(contest);
                const img = getContestImage(contest);
                const isSelected = selectedContest && getContestId(selectedContest) === id;
                const status = getContestStatus(contest);
                const statusColor =
                  {
                    active: "bg-green-100 text-green-800 border-green-200",
                    upcoming: "bg-blue-100 text-blue-800 border-blue-200",
                    ended: "bg-gray-100 text-gray-800 border-gray-200",
                    booked: "bg-purple-100 text-purple-800 border-purple-200",
                  }[status.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200";

                return (
                  <div
                    key={id}
                    onClick={() => handleSelect(id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm",
                      isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50 hover:bg-accent/50"
                    )}
                  >
                    {/* Contest Image */}
                    <div className="flex-shrink-0">
                      {img ? (
                        <img src={img} alt={getContestName(contest)} className="w-12 h-12 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-sm border border-border">
                          {getContestName(contest).slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Contest Info */}
                    <div className="flex flex-col flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-base truncate">{getContestName(contest)}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold text-primary">${getContestPrizePool(contest).toLocaleString()}</span>
                          <Check className={cn("h-4 w-4", isSelected ? "opacity-100 text-primary" : "opacity-0")} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border", statusColor)}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                        <span className="text-muted-foreground">
                          {new Date(getContestDates(contest).startDate).toLocaleDateString()} - {new Date(getContestDates(contest).endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
