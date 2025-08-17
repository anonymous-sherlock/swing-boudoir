import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Profile, useProfiles, useDeleteProfile } from '@/hooks/useProfiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/profiles')({
  component: () => <ProfilesPage />,
});

function ProfilesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(20);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);

  const {
    data: profilesData,
    isLoading: useProfilesIsLoading,
    error: useProfilesError,
  } = useProfiles(page, limit);
  const { mutateAsync: deleteProfileMutateAsync, isPending: deleteProfileIsPending } =
    useDeleteProfile();

  const handleDeleteProfile = async () => {
    if (!profileToDelete) return;
    try {
      await deleteProfileMutateAsync(profileToDelete.id);
      setIsDeleteOpen(false);
      setProfileToDelete(null);
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
  };

  const filteredProfiles =
    profilesData?.data.filter(
      profile =>
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.country?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  if (useProfilesIsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
            <p className="text-muted-foreground">Manage all user profiles in the system.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (useProfilesError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">Manage all user profiles in the system.</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading profiles. Please try again.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">
            Manage all user profiles in the system. Total: {profilesData?.pagination.total || 0}
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Profile
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Profiles Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map(profile => {
          return (
            <Card key={profile.id} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={profile.coverImage?.url || undefined}
                        className="object-cover w-full h-full"
                      />
                      <AvatarFallback>
                        {profile.user.username.charAt(0)?.toUpperCase() || 'P'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {profile.user.username.substring(0, 20) || 'No Bio'}
                        {profile.user.username && profile.user.username.length > 20 && '...'}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        ID: {profile.userId.substring(0, 8)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Link to={'/profile/$id'} params={{ id: profile.user.username }}>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setProfileToDelete(profile);
                        setIsDeleteOpen(true);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/*
                  {profile.coverImage && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={profile.coverImage.url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  */}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {profile.city || 'No City'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {profile.country || 'No Country'}
                      </Badge>
                    </div>

                    {profile.phone && (
                      <p className="text-sm text-muted-foreground">📞 {profile.phone}</p>
                    )}

                    {profile.gender && (
                      <p className="text-sm text-muted-foreground">👤 {profile.gender}</p>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Created: {format(new Date(profile.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {profilesData && profilesData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * limit + 1} to{' '}
            {Math.min(page * limit, profilesData.pagination.total)} of{' '}
            {profilesData.pagination.total} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!profilesData.pagination.hasPreviousPage}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm">
              Page {page} of {profilesData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!profilesData.pagination.hasNextPage}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete{' '}
              <strong>{profileToDelete?.id ?? 'this profile'}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProfileIsPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProfile}
              disabled={deleteProfileIsPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteProfileIsPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
