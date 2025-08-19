import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, ArrowLeft, Eye, Heart, Star, Calendar, User, Award, Trophy, RefreshCw } from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";
import { useContestBySlug, useContestParticipants, useContests } from "@/hooks/api/useContests";
import { formatDistanceToNow } from "date-fns";
import { useQueryState } from "nuqs";

export function ContestParticipants() {
  const { slug } = useParams({ from: "/_public/competitions/$slug/participants" });
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [filter, setFilter] = useQueryState("filter", { defaultValue: "all" });

  // Get contest details
  const { data: contestData, isLoading: isLoadingContest } = useContestBySlug(slug);

  // Get participants
  const { data: participantsData, isLoading, error } = useContestParticipants(contestData?.id || "", parseInt(page || "1", 10), 12);

  const participants = participantsData?.data || [];
  const pagination = participantsData?.pagination;

  // Filter participants based on search and filter
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      !search || participant.profile?.user?.name?.toLowerCase().includes(search.toLowerCase()) || participant.profile?.bio?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter = filter === "all" || (filter === "approved" && participant.isApproved) || (filter === "participating" && participant.isParticipating);

    return matchesSearch && matchesFilter;
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoadingContest || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !contestData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-600">
              {error ? "Failed to load participants" : "Contest not found"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link to={`/competitions/$slug`} params={{ slug: contestData?.slug || "" }}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Contest
            </Button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contest Participants</h1>
            <p className="text-gray-600 mt-2">
              {contestData?.name} • {participants.length} participants
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm text-gray-600">{pagination?.total || 0} total participants</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search participants..." value={search || ""} onChange={(e) => setSearch(e.target.value || null)} className="pl-10" />
            </div>

            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                All
              </Button>
              <Button variant={filter === "approved" ? "default" : "outline"} size="sm" onClick={() => setFilter("approved")}>
                Approved
              </Button>
              <Button variant={filter === "participating" ? "default" : "outline"} size="sm" onClick={() => setFilter("participating")}>
                Participating
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants Grid */}
      {filteredParticipants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredParticipants.map((participant) => (
            <Card key={participant.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                {participant.coverImage ? (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={participant.coverImage.url} alt="Participant cover" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                <div className="absolute top-2 right-2">
                  {participant.isApproved && <Badge className="bg-green-100 text-green-800">Approved</Badge>}
                  {participant.isParticipating && <Badge className="bg-blue-100 text-blue-800 ml-1">Active</Badge>}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={participant.profile?.user?.image || ""} />
                    <AvatarFallback>{participant.profile?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{participant.profile?.user?.name || "Anonymous"}</h3>
                    <p className="text-sm text-gray-500">Joined {formatDistanceToNow(new Date(participant.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>

                {participant.profile?.bio && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{participant.profile.bio}</p>}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(participant.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No participants found</h3>
              <p className="text-gray-600">{search || filter !== "all" ? "Try adjusting your search or filter criteria" : "This contest doesn't have any participants yet"}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(parseInt(page || "1", 10) - 1)} disabled={!pagination.hasPreviousPage}>
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              const currentPageNum = parseInt(page || "1", 10);

              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPageNum <= 3) {
                pageNum = i + 1;
              } else if (currentPageNum >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = currentPageNum - 2 + i;
              }

              return (
                <Button key={pageNum} variant={currentPageNum === pageNum ? "default" : "outline"} size="sm" onClick={() => handlePageChange(pageNum)} className="w-10 h-10">
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button variant="outline" size="sm" onClick={() => handlePageChange(parseInt(page || "1", 10) + 1)} disabled={!pagination.hasNextPage}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
