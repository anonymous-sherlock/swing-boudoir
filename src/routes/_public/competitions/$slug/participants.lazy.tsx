import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_public/competitions/$slug/participants")({
  component: ContestParticipants,
});

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContestParticipant, useContestBySlug, useContestParticipants } from "@/hooks/api/useContests";
import { Link, useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Eye, MessageCircle, Trophy, User, Users, X } from "lucide-react";
import { useState } from "react";

export default function ContestParticipants() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();

  const [selectedParticipant, setSelectedParticipant] = useState<ContestParticipant | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Use hooks to fetch data
  const { data: contestInfo, isLoading: isLoadingContest, error: contestError } = useContestBySlug(slug);
  const { data: participantsData, isLoading: isLoadingParticipants, error: participantsError } = useContestParticipants(contestInfo?.id || "", currentPage, 20);

  const participants = participantsData?.data || [];
  const pagination = participantsData?.pagination || {
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  const isLoading = isLoadingContest || isLoadingParticipants;
  const error = contestError || participantsError;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getApprovalStatus = (isApproved: boolean) => {
    return isApproved ? (
      <Badge className="bg-green-500 text-white">Approved</Badge>
    ) : (
      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
        Pending
      </Badge>
    );
  };

  const openLightbox = (participant: ContestParticipant) => {
    setSelectedParticipant(participant);
    setCurrentImageIndex(0);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedParticipant(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedParticipant) return;
    const allImages = getAllImages(selectedParticipant);
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!selectedParticipant) return;
    const allImages = getAllImages(selectedParticipant);
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const getAllImages = (participant: ContestParticipant) => {
    const images: Array<{ id: string; key: string; caption?: string; url: string }> = [];

    // Add cover image if exists
    if (participant.coverImage) {
      images.push({
        id: participant.coverImage.id,
        key: participant.coverImage.key,
        url: participant.coverImage.url,
        caption: participant.coverImage.caption || undefined,
      });
    }

    return images;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex pt-16 min-h-screen">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8 p-6">
            {/* Back Navigation */}
            <div className="flex items-center justify-between">
              <Link to="/competitions/$slug" params={{ slug: contestInfo?.slug || "" }}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Competitions
                </Button>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{pagination.total}</div>
                  <div className="text-sm text-muted-foreground">Total Participants</div>
                </div>
              </div>
            </div>

            {/* Contest Info Header */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">{contestInfo?.name} - Participants</h1>
                    <p className="text-muted-foreground">{contestInfo?.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1" />
                        Prize: ${contestInfo?.prizePool?.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {contestInfo?.startDate && formatDate(contestInfo.startDate)} - {contestInfo?.endDate && formatDate(contestInfo.endDate)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center space-x-2">
                    <Users className="w-8 h-8 text-primary" />
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {contestInfo?.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Users className="w-5 h-5 mr-3 text-primary" />
                  Contest Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Participants Yet</h3>
                    <p className="text-muted-foreground">Be the first to join this competition!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Participant</th>
                            <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Cover Image</th>
                            <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Status</th>
                            <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Joined</th>
                            <th className="text-left py-4 px-4 font-semibold text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((participant, index) => (
                            <tr key={participant.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    {participant.profile?.user?.image ? (
                                      <img src={participant.profile.user.image} alt={participant.profile.user.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                      <User className="w-5 h-5 text-primary" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">{participant.profile?.user?.name || "Unknown User"}</p>
                                    <p className="text-sm text-muted-foreground">@{participant.profile?.user?.username}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  {/* Show cover image */}
                                  {participant.coverImage ? (
                                    <div className="size-20 rounded-lg overflow-hidden border">
                                      <img src={participant.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                                    </div>
                                  ) : (
                                    <div className="size-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                                      <span className="text-xs text-muted-foreground">No Image</span>
                                    </div>
                                  )}

                                  {/* View all images button */}
                                  {getAllImages(participant).length > 0 && (
                                    <Button variant="outline" size="sm" onClick={() => openLightbox(participant)} className="ml-2">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4">{getApprovalStatus(participant.isApproved)}</td>
                              <td className="py-4 px-4">
                                <div className="text-sm">
                                  <p className="text-foreground">{formatDate(participant.createdAt)}</p>
                                  <p className="text-muted-foreground">{formatDistanceToNow(new Date(participant.createdAt), { addSuffix: true })}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <Link to="/profile/$username" params={{ username: participant.profile?.user?.username || "" }}>
                                    <Button variant="outline" size="sm" className="flex-1">
                                      <Eye className="w-4 h-4 mr-1" />
                                      View Profile
                                    </Button>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-4">
                      {participants.map((participant) => (
                        <Card key={participant.id} className="p-4">
                          <div className="flex flex-col items-start gap-2">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                {participant.profile?.user?.image ? (
                                  <img src={participant.profile.user.image} alt={participant.profile.user.name} className="w-12 h-12 rounded-full object-cover" />
                                ) : (
                                  <User className="w-6 h-6 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-semibold text-foreground">{participant.profile?.user?.name || "Unknown User"}</p>
                                    <p className="text-sm text-muted-foreground">{participant.profile?.user?.email}</p>
                                  </div>
                                  {getApprovalStatus(participant.isApproved)}
                                </div>
                              </div>
                            </div>

                            {/* Show cover image */}
                            {participant.coverImage && (
                              <div className="w-full aspect-square rounded-lg overflow-hidden border m-0 mt-2" onClick={() => openLightbox(participant)}>
                                <img src={participant.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                              </div>
                            )}

                            <div className="text-sm text-muted-foreground">Joined {formatDistanceToNow(new Date(participant.createdAt), { addSuffix: true })}</div>

                            <div className="flex items-center space-x-2 pt-2">
                              <Link to="/profile/$username" params={{ username: participant.profile?.user?.username || "" }}>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Profile
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between pt-6 border-t border-border">
                        <div className="text-sm text-muted-foreground">
                          Showing page {currentPage} of {pagination.totalPages}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" disabled={!pagination.hasPreviousPage} onClick={() => handlePageChange(currentPage - 1)}>
                            Previous
                          </Button>
                          <span className="px-3 py-2 text-sm">{currentPage}</span>
                          <Button variant="outline" size="sm" disabled={!pagination.hasNextPage} onClick={() => handlePageChange(currentPage + 1)}>
                            Next
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedParticipant && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation buttons */}
            <button onClick={prevImage} className="absolute left-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors" aria-label="Previous image">
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button onClick={nextImage} className="absolute right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors" aria-label="Next image">
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image display */}
            <div className="max-w-4xl max-h-full p-4">
              {(() => {
                const allImages = getAllImages(selectedParticipant);
                const currentImage = allImages[currentImageIndex];

                if (!currentImage) {
                  return (
                    <div className="text-center text-white">
                      <p>No images available</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <img src={currentImage.url} alt={currentImage.caption || `Image ${currentImageIndex + 1}`} className="max-w-full max-h-[70vh] object-contain mx-auto" />

                    {/* Image info */}
                    <div className="text-center text-white">
                      <p className="text-lg font-medium">{selectedParticipant.profile?.user?.name || "Unknown User"}</p>
                      <p className="text-sm text-gray-300">
                        Image {currentImageIndex + 1} of {allImages.length}
                      </p>
                      {currentImage.caption && <p className="text-sm text-gray-400 mt-2">{currentImage.caption}</p>}
                    </div>

                    {/* Thumbnail navigation */}
                    {allImages.length > 1 && (
                      <div className="flex justify-center space-x-2 mt-4">
                        {allImages.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? "border-primary" : "border-gray-600 hover:border-gray-400"
                            }`}
                          >
                            <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
