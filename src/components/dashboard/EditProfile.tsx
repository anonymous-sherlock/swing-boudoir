import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Edit, Save, Trash2, X, Trophy, Calendar, User, MessageSquare, Camera, Globe, MapPin, Phone, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    hobbies: "",
    voterMessage: "",
    freeVoterMessage: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    dateOfBirth: "",
    gender: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    website: ""
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileImages, setProfileImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  
  const profileFileInputRef = useRef(null);
  const coverFileInputRef = useRef(null);

  // Mock profile data - replace with your actual data fetching
  const profileData = {
    id: "1",
    userId: "user1",
    profilePhotos: [],
    coverImage: null,
    bio: "Sample bio",
    phone: "+1234567890",
    // ... other mock data
  };
  const profileLoading = false;

  // Mock toast function - replace with your actual toast implementation
  const toast = ({ title, description, variant }) => {
    console.log(`${variant || 'success'}: ${title} - ${description}`);
  };

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
        variant: "default"
      });
    } catch (error) {
      console.error('Update profile error:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (files) => {
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

    setIsUploading(true);
    try {
      // Simulate upload
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result;
          setProfileImages(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      });

      toast({
        title: "Images Uploaded!",
        description: `${files.length} image(s) have been uploaded successfully.`,
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverImageUpload = async (files) => {
    if (!files || !profileData?.id) return;

    setIsUploading(true);
    try {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverImage(e.target?.result);
      };
      reader.readAsDataURL(file);

      toast({
        title: "Cover Image Uploaded!",
        description: "Your cover image has been uploaded successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveCoverImage = async () => {
    setCoverImage(null);
    toast({
      title: "Cover Image Removed",
      description: "Your cover image has been removed successfully.",
    });
  };

  const removeImage = async (index) => {
    setProfileImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "Profile image has been removed successfully.",
    });
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-lg text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-6xl mx-auto space-y-6 sm:p-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
              <p className="text-muted-foreground">Manage your profile information and preferences</p>
            </div>
            <Button 
              onClick={isEditing ? saveProfile : () => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
              disabled={isSaving || isUploading}
              size="lg"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? (isSaving ? "Saving Changes..." : "Save Changes") : "Edit Profile"}
            </Button>
          </div>
          {isEditing && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Edit className="h-4 w-4" />
                You are currently in edit mode. Don't forget to save your changes!
              </p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Profile Images Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cover Image */}
            <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-primary" />
                  Cover Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={coverFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleCoverImageUpload(e.target.files)}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {coverImage ? (
                  <div className="mb-4">
                    <div className="relative group aspect-video w-full rounded-xl overflow-hidden shadow-md">
                      <img
                        src={coverImage}
                        alt="Profile Cover"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button
                          onClick={handleRemoveCoverImage}
                          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200 shadow-lg"
                          title="Remove cover image"
                          disabled={isUploading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/20">
                    <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Upload className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4 font-medium">No cover image uploaded</p>
                    <Button 
                      variant="outline"
                      onClick={() => coverFileInputRef.current?.click()}
                      disabled={isUploading}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isUploading ? "Uploading..." : "Upload Cover"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Photos */}
            <Card className="overflow-hidden shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Camera className="h-5 w-5 text-primary" />
                  Profile Photos
                  <Badge variant="secondary" className="ml-2">
                    {profileImages.length}/20
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={profileFileInputRef}
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={isUploading}
                />
                
                {profileImages.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {profileImages.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                          <img
                            src={image}
                            alt={`Profile ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => removeImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors duration-200 shadow-lg"
                              title={`Remove profile image ${index + 1}`}
                              disabled={isUploading}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-muted/20">
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Upload multiple profile photos to showcase yourself
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => profileFileInputRef.current?.click()}
                    disabled={profileImages.length >= 20 || isUploading}
                    className="transition-all duration-200 hover:scale-105"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Add Photos"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Basic Information & Location */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="lg:col-span-2 shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Profile Name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+1 210 456 2719"
                      className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Bio / Short Introduction
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="Tell people about yourself..."
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"}
                  />
                </div>

                <div>
                  <Label htmlFor="hobbies" className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    Hobbies & Interests
                  </Label>
                  <Textarea
                    id="hobbies"
                    value={profile.hobbies}
                    onChange={(e) => setProfile({ ...profile, hobbies: e.target.value })}
                    disabled={!isEditing}
                    rows={2}
                    placeholder="What do you enjoy doing?"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium mb-2 block">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Manhattan"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div>
                  <Label htmlFor="country" className="text-sm font-medium mb-2 block">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    disabled={!isEditing}
                    placeholder="United States"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium mb-2 block">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Street address"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode" className="text-sm font-medium mb-2 block">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={profile.postalCode}
                    onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                    disabled={!isEditing}
                    placeholder="10001"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div>
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium mb-2 block">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm font-medium mb-2 block">Gender</Label>
                  <Input
                    id="gender"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Gender"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Social Media Links */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-primary" />
                Social Media & Online Presence
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your social media profiles and website
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="instagram" className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4 text-pink-500" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={profile.instagram}
                    onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/yourusername"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiktok" className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-black dark:text-white" />
                    TikTok
                  </Label>
                  <Input
                    id="tiktok"
                    value={profile.tiktok}
                    onChange={(e) => setProfile({ ...profile, tiktok: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://tiktok.com/@yourusername"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4 text-red-500" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    value={profile.youtube}
                    onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://youtube.com/@yourchannel"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter" className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={profile.twitter}
                    onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/yourusername"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook"
                    value={profile.facebook}
                    onChange={(e) => setProfile({ ...profile, facebook: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://facebook.com/yourusername"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={profile.linkedin}
                    onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/yourusername"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-1">
                  <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-600" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                    className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20"}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voter Messages */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-primary" />
                Messages for Voters
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customize messages that will be displayed to different types of voters
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                <Label htmlFor="voterMessage" className="text-sm font-medium mb-2 block text-blue-800 dark:text-blue-200">
                  Message for Paid Voters
                </Label>
                <p className="text-xs text-blue-600 dark:text-blue-300 mb-3">
                  This message will be shown to voters who purchased MAXIM Next votes from your profile
                </p>
                <Textarea
                  id="voterMessage"
                  value={profile.voterMessage}
                  onChange={(e) => setProfile({ ...profile, voterMessage: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Thank you for supporting me with your vote! Your support means everything..."
                  className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none bg-white/70 dark:bg-slate-900/70"}
                />
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200 dark:border-green-800">
                <Label htmlFor="freeVoterMessage" className="text-sm font-medium mb-2 block text-green-800 dark:text-green-200">
                  Message for Free Voters
                </Label>
                <p className="text-xs text-green-600 dark:text-green-300 mb-3">
                  This message will be shown to voters who vote for you using free votes
                </p>
                <Textarea
                  id="freeVoterMessage"
                  value={profile.freeVoterMessage}
                  onChange={(e) => setProfile({ ...profile, freeVoterMessage: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Thank you for your free vote! Every vote counts and I appreciate your support..."
                  className={!isEditing ? "bg-muted/50 cursor-not-allowed" : "transition-all duration-200 focus:ring-2 focus:ring-primary/20 resize-none bg-white/70 dark:bg-slate-900/70"}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button at Bottom */}
          {isEditing && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">Ready to save your changes?</h3>
                    <p className="text-sm text-muted-foreground">Make sure all your information is correct before saving.</p>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={saveProfile}
                      disabled={isSaving || isUploading}
                      className="transition-all duration-200 hover:scale-105 px-6"
                      size="lg"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? "Saving Changes..." : "Save All Changes"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}