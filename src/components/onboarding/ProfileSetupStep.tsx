import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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

      const token = localStorage.getItem('token');
      const response = await fetch('/api/v1/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const imageUrl = data.url || data.imageUrl;

      // Update onboarding data based on type
      if (type === 'profile') {
        updateOnboardingData({
          basicInfo: {
            ...onboardingData.basicInfo,
            profileImage: imageUrl
          }
        });
      } else if (type === 'voting') {
        updateOnboardingData({
          basicInfo: {
            ...onboardingData.basicInfo,
            votingImage: imageUrl
          }
        });
      }

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8"
    >
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto"
        >
          <User className="w-8 h-8 text-white" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900"
        >
          Create Your Profile
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Let's set up your profile to showcase your unique personality and connect with voters
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={onboardingData.basicInfo?.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={onboardingData.basicInfo?.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="mt-1 min-h-[80px]"
                />
              </div>

              <div>
                <Label htmlFor="hobbies">Hobbies & Interests</Label>
                <Textarea
                  id="hobbies"
                  value={onboardingData.basicInfo?.hobbies || ''}
                  onChange={(e) => handleInputChange('hobbies', e.target.value)}
                  placeholder="What are your hobbies and interests?"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Images */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Camera className="w-5 h-5 mr-2" />
                Profile Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Image */}
              <div>
                <Label>Profile Picture</Label>
                <div className="mt-2">
                  {onboardingData.basicInfo?.profileImage ? (
                    <div className="relative inline-block">
                      <img
                        src={onboardingData.basicInfo.profileImage}
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-purple-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full p-0"
                        onClick={() => removeImage('profile')}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => profileImageRef.current?.click()}
                      disabled={isUploading}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed border-gray-300 hover:border-purple-500 flex flex-col items-center justify-center"
                    >
                      <Upload className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                      <span className="text-xs sm:text-sm">Upload</span>
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
              <div>
                <Label>Voting Image</Label>
                <div className="mt-2">
                  {onboardingData.basicInfo?.votingImage ? (
                    <div className="relative inline-block">
                      <img
                        src={onboardingData.basicInfo.votingImage}
                        alt="Voting"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover border-4 border-pink-200"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full p-0"
                        onClick={() => removeImage('voting')}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => votingImageRef.current?.click()}
                      disabled={isUploading}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg border-2 border-dashed border-gray-300 hover:border-pink-500 flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 mb-1" />
                      <span className="text-xs sm:text-sm">Upload</span>
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
        </motion.div>
      </div>

      {/* Voter Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messages for Voters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paidMessage" className="flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                Message for Paid Voters
              </Label>
              <Textarea
                id="paidMessage"
                value={onboardingData.basicInfo?.paidVoterMessage || ''}
                onChange={(e) => handleInputChange('paidVoterMessage', e.target.value)}
                placeholder="Thank your premium supporters..."
                className="mt-1 min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="freeMessage" className="flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Message for Free Voters
              </Label>
              <Textarea
                id="freeMessage"
                value={onboardingData.basicInfo?.freeVoterMessage || ''}
                onChange={(e) => handleInputChange('freeVoterMessage', e.target.value)}
                placeholder="Thank your free voters..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upload Progress */}
      {isUploading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <Card className="p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Uploading...</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
} 