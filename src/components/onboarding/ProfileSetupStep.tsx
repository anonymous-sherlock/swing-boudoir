import React, { useState, useRef } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Star
} from 'lucide-react';

export function ProfileSetupStep() {
  const { onboardingData, updateOnboardingData } = useOnboarding();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const profileImageRef = useRef<HTMLInputElement>(null);
  const votingImageRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    updateOnboardingData({
      basicInfo: {
        ...onboardingData.basicInfo,
        [field]: value
      }
    });
  };

  const handleFileUpload = async (type: 'profile' | 'voting', files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Upload to API
      const formData = new FormData();
      formData.append('file', file);

      // const token = localStorage.getItem('token');
      // const response = await fetch('/api/v1/uploadthing', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`
      //   },
      //   body: formData
      // });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // if (!response.ok) {
      //   throw new Error('Upload failed');
      // }

      // const data = await response.json();
      // const imageUrl = data.url || data.imageUrl;

      // Update onboarding data based on type
      // if (type === 'profile') {
      //   updateOnboardingData({
      //     basicInfo: {
      //       ...onboardingData.basicInfo,
      //       profileImage: imageUrl
      //     }
      //   });
      // } else if (type === 'voting') {
      //   updateOnboardingData({
      //     basicInfo: {
      //       ...onboardingData.basicInfo,
      //       votingImage: imageUrl
      //     }
      //   });
      // }

      toast({
        title: "Upload successful",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = (type: 'profile' | 'voting') => {
    if (type === 'profile') {
      updateOnboardingData({
        basicInfo: {
          ...onboardingData.basicInfo,
          profileImage: undefined
        }
      });
    } else if (type === 'voting') {
      updateOnboardingData({
        basicInfo: {
          ...onboardingData.basicInfo,
          votingImage: undefined
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Create Your Profile
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Let's set up your profile to showcase your unique personality and connect with voters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg text-gray-900">
              <User className="w-5 h-5 mr-2 text-purple-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-gray-800">Full Name</Label>
              <Input
                id="name"
                value={onboardingData.basicInfo?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1.5 border-gray-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-sm font-medium text-gray-800">Bio</Label>
              <Textarea
                id="bio"
                value={onboardingData.basicInfo?.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-1.5 border-gray-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 min-h-[100px] resize-none"
              />
            </div>

            <div>
              <Label htmlFor="hobbies" className="text-sm font-medium text-gray-800">Hobbies & Interests</Label>
              <Textarea
                id="hobbies"
                value={onboardingData.basicInfo?.hobbies || ''}
                onChange={(e) => handleInputChange('hobbies', e.target.value)}
                placeholder="What are your hobbies and interests?"
                className="mt-1.5 border-gray-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Profile Images */}
        <Card className="border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg text-gray-900">
              <Camera className="w-5 h-5 mr-2 text-purple-600" />
              Profile Images
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Image */}
            <div className="text-center space-y-3">
              <Label className="text-sm font-medium text-gray-800">Profile Picture</Label>
              <div className="flex justify-center">
                {onboardingData.basicInfo?.profileImage ? (
                  <div className="relative">
                    <img
                      src={onboardingData.basicInfo.profileImage}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-3 border-purple-200"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => removeImage('profile')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => profileImageRef.current?.click()}
                    disabled={isUploading}
                    className="w-32 h-32 rounded-full border-2 border-dashed border-purple-300 hover:border-purple-500 hover:bg-purple-50 flex flex-col items-center justify-center text-purple-600"
                  >
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Upload</span>
                  </Button>
                )}
                <input
                  ref={profileImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('profile', e.target.files)}
                  className="hidden"
                  aria-label="Upload profile picture"
                />
              </div>
            </div>

            {/* Voting Image */}
            <div className="text-center space-y-3">
              <Label className="text-sm font-medium text-gray-800">Voting Image</Label>
              <div className="flex justify-center">
                {onboardingData.basicInfo?.votingImage ? (
                  <div className="relative">
                    <img
                      src={onboardingData.basicInfo.votingImage}
                      alt="Voting"
                      className="w-32 h-32 rounded-xl object-cover border-3 border-pink-200"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0"
                      onClick={() => removeImage('voting')}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => votingImageRef.current?.click()}
                    disabled={isUploading}
                    className="w-32 h-32 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-500 hover:bg-pink-50 flex flex-col items-center justify-center text-pink-600"
                  >
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">Upload</span>
                  </Button>
                )}
                <input
                  ref={votingImageRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('voting', e.target.files)}
                  className="hidden"
                  aria-label="Upload voting image"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Voter Messages */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg text-gray-900">
            <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
            Messages for Voters
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="paidMessage" className="flex items-center text-sm font-medium text-gray-800">
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              Message for Paid Voters
            </Label>
            <Textarea
              id="paidMessage"
              value={onboardingData.basicInfo?.paidVoterMessage || ''}
              onChange={(e) => handleInputChange('paidVoterMessage', e.target.value)}
              placeholder="Thank your premium supporters..."
              className="mt-1.5 border-gray-200 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 min-h-[100px] resize-none"
            />
          </div>
          <div>
            <Label htmlFor="freeMessage" className="flex items-center text-sm font-medium text-gray-800">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Message for Free Voters
            </Label>
            <Textarea
              id="freeMessage"
              value={onboardingData.basicInfo?.freeVoterMessage || ''}
              onChange={(e) => handleInputChange('freeVoterMessage', e.target.value)}
              placeholder="Thank your free voters..."
              className="mt-1.5 border-gray-200 focus:border-red-400 focus:ring-1 focus:ring-red-400 min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <Card className="p-8 max-w-sm w-full mx-4 shadow-xl">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploading...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 font-medium">{uploadProgress}%</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}