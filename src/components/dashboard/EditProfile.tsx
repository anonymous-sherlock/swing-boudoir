import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Edit, Save, Trash2, X, Trophy, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing, uploadFiles } from "@/lib/uploadthing";
import { useCompetitions } from "@/hooks/useCompetitions";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { UpdateProfileRequest } from "@/hooks/useProfile";

// Charity options - this could come from an API in the future
const charities = [
  { value: "american-red-cross", label: "American Red Cross" },
  { value: "unicef", label: "UNICEF" },
  { value: "doctors-without-borders", label: "Doctors Without Borders" },
  { value: "world-wildlife-fund", label: "World Wildlife Fund" },
  { value: "habitat-for-humanity", label: "Habitat for Humanity" },
];

export function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    charity: "",
    charityReason: "",
    hobbies: "",
    voterMessage: "",
    freeVoterMessage: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Use the profile hook
  const { 
    useProfileByUserId, 
    updateProfile, 
    uploadProfilePhotos, 
    removeProfilePhoto,
    uploadCoverImage,
    removeCoverImage
  } = useProfile();

  // Get profile data for the current user
  const { data: profileData, isLoading: profileLoading } = useProfileByUserId(user?.id || '');

  // Update local profile state when profile data changes
  useEffect(() => {
    if (profileData) {
      setProfile({
        name: profileData.bio || "",
        bio: profileData.bio || "",
        charity: "", // This field doesn't exist in the API profile
        charityReason: "", // This field doesn't exist in the API profile
        hobbies: profileData.hobbiesAndPassions || "",
        voterMessage: profileData.paidVoterMessage || "",
        freeVoterMessage: profileData.freeVoterMessage || ""
      });

      // Set profile images from API data
      if (profileData.profilePhotos && profileData.profilePhotos.length > 0) {
        setProfileImages(profileData.profilePhotos.map(photo => photo.url));
      } else {
        setProfileImages([]);
      }
    }
  }, [profileData]);

  const { startUpload, routeConfig } = useUploadThing("profileImages", {
    onUploadBegin: (fileName) => {
      console.log("upload has begun for", fileName);
    },
  });

  const saveProfile = async () => {
    if (!profileData?.id) {
      toast({
        title: "Error",
        description: "Profile not found. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateProfileRequest = {
        bio: profile.bio,
        hobbiesAndPassions: profile.hobbies,
        paidVoterMessage: profile.voterMessage,
        freeVoterMessage: profile.freeVoterMessage,
        // Note: charity and charityReason are not part of the API profile model
        // These would need to be added to the API or stored separately
      };

      await updateProfile.mutateAsync({ id: profileData.id, data: updateData });
      
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !profileData?.id) return;

    const maxImages = 20;
    const currentImages = profileImages.length;

    if (currentImages + files.length > maxImages) {
      toast({
        title: "Too Many Images",
        description: `You can only upload up to ${maxImages} profile images.`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Upload files to the API
      await uploadProfilePhotos.mutateAsync({ 
        id: profileData.id, 
        files: Array.from(files) 
      });

      // Update local state for immediate UI feedback
      Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File",
            description: "Please select only image files.",
            variant: "destructive"
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          setProfileImages(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      });

      toast({
        title: "Images Uploaded!",
        description: `${files.length} image(s) have been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCoverImageUpload = async (files: FileList | null) => {
    if (!files || !profileData?.id) return;

    try {
      await uploadCoverImage.mutateAsync({ 
        id: profileData.id, 
        file: Array.from(files)[0] 
      });

      toast({
        title: "Cover Image Uploaded!",
        description: "Your cover image has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveCoverImage = async () => {
    if (!profileData?.id) return;

    try {
      await removeCoverImage.mutateAsync({ id: profileData.id });
      toast({
        title: "Cover Image Removed",
        description: "Your cover image has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove cover image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeImage = async (index: number) => {
    if (!profileData?.id) return;

    try {
      // If we have the image ID from the API, we can remove it
      // For now, we'll just remove from local state
      // In a real implementation, you'd need to get the image ID
      setProfileImages(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "Image Removed",
        description: "Profile image has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveExistingPhoto = async (photoId: string) => {
    if (!profileData?.id) return;

    try {
      await removeProfilePhoto.mutateAsync({ id: profileData.id, imageId: photoId });
      toast({
        title: "Profile Photo Removed",
        description: "Profile photo has been removed successfully.",
      });
      // Update local state to remove the deleted photo
      setProfileImages(prev => prev.filter(url => url !== profileData.profilePhotos?.find(p => p.id === photoId)?.url));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove profile photo. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <Button 
          onClick={isEditing ? saveProfile : () => setIsEditing(true)}
          className="flex items-center gap-2"
          disabled={isSaving || updateProfile.isPending}
          size="sm"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? (isSaving || updateProfile.isPending ? "Saving..." : "Save Changes") : "Edit Profile"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Profile Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                disabled={!isEditing}
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
            
            <div>
              <Label htmlFor="bio">Bio / Short Introduction</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>

            <div>
              <Label htmlFor="hobbies">Hobbies</Label>
              <Textarea
                id="hobbies"
                value={profile.hobbies}
                onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                disabled={!isEditing}
                rows={2}
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
        </Card>

        {/* Charity Information */}
        <Card>
          <CardHeader>
            <CardTitle>Charity Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="charity">Which charity would you like to support if you win?</Label>
              <Select 
                value={profile.charity}
                onValueChange={(value) => setProfile({ ...profile, charity: value })}
                disabled={!isEditing}
              >
                <SelectTrigger className={!isEditing ? "bg-muted cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select a charity" />
                </SelectTrigger>
                <SelectContent>
                  {charities.map((charity) => (
                    <SelectItem key={charity.value} value={charity.value}>
                      {charity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="charityReason">Why did you choose this cause?</Label>
              <Textarea
                id="charityReason"
                value={profile.charityReason}
                onChange={(e) => setProfile({ ...profile, charityReason: e.target.value })}
                disabled={!isEditing}
                rows={3}
                className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Messages for Voters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="voterMessage">Message for voters who purchased MAXIM Next votes from your profile</Label>
            <Textarea
              id="voterMessage"
              value={profile.voterMessage}
              onChange={(e) => setProfile({ ...profile, voterMessage: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
            />
          </div>

          <div>
            <Label htmlFor="freeVoterMessage">Message for Free Voters</Label>
            <Textarea
              id="freeVoterMessage"
              value={profile.freeVoterMessage}
              onChange={(e) => setProfile({ ...profile, freeVoterMessage: e.target.value })}
              disabled={!isEditing}
              rows={3}
              className={!isEditing ? "bg-muted cursor-not-allowed" : ""}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Cover Image</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            id="coverImageInput"
            accept="image/*"
            onChange={(e) => handleCoverImageUpload(e.target.files)}
            className="hidden"
            aria-label="Upload profile cover image"
            disabled={uploadCoverImage.isPending}
          />
          
          {profileData?.coverImage?.url && (
            <div className="mb-4">
              <div className="relative group aspect-w-1 aspect-h-1 w-48 mx-auto">
                <img
                  src={profileData.coverImage.url}
                  alt="Profile Cover"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    console.error('Failed to load cover image:', e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  onClick={handleRemoveCoverImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove cover image"
                  title="Remove cover image"
                  disabled={removeCoverImage.isPending}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {profileData?.coverImage?.url ? "Cover image uploaded" : "No cover image uploaded"}
            </p>
            <Button 
              variant="outline"
              onClick={() => document.getElementById('coverImageInput')?.click()}
              disabled={uploadCoverImage.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadCoverImage.isPending ? "Uploading..." : "Upload Cover Image"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Photos Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photos (Up to 20 images)</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={profileFileInputRef}
            multiple
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
            aria-label="Upload profile photos"
            disabled={uploadProfilePhotos.isPending}
          />
          
          {profileImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {profileImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Profile ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Failed to load local profile image:', e);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove profile image ${index + 1}`}
                    title={`Remove profile image ${index + 1}`}
                    disabled={removeProfilePhoto.isPending}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {/* Show existing profile photos from API */}
          {profileData?.profilePhotos && profileData.profilePhotos.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">Existing Profile Photos:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {profileData.profilePhotos.map((photo, index) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.url}
                      alt={`Profile Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        console.error('Failed to load profile photo:', e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <button
                      onClick={() => handleRemoveExistingPhoto(photo.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Remove profile photo ${index + 1}`}
                      title={`Remove profile photo ${index + 1}`}
                      disabled={removeProfilePhoto.isPending}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {profileImages.length}/20 images uploaded
            </p>
            <Button 
              variant="outline"
              onClick={() => profileFileInputRef.current?.click()}
              disabled={profileImages.length >= 20 || uploadProfilePhotos.isPending}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploadProfilePhotos.isPending ? "Uploading..." : "Upload Profile Photos"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Competition Enrollments - Removed mock data, showing empty state */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Competition Enrollments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-semibold mb-2">No Competitions Registered</h4>
            <p className="text-muted-foreground mb-4">
              You haven't registered for any competitions yet.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/competitions'}>
              Browse Competitions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}