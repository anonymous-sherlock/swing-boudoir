import React from 'react';
import { CheckCircle, Sparkles, Star, Camera } from 'lucide-react';
import { FormData } from './index';
import { useProfile } from '@/hooks/api/useProfile';
import { useAuth } from '@/contexts/AuthContext';

interface FinalSceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const FinalScene: React.FC<FinalSceneProps> = ({ formData }) => {
  const { createProfile, uploadCoverImage, uploadProfilePhotos } = useProfile();
  const { user, isLoading } = useAuth();
  const handleComplete = () => {
    console.log('Finalizing profile with data:', formData);
    if (!isLoading && !user) return;
    createProfile
      .mutateAsync({
        userId: user?.id ?? '',
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address ?? '',
        city: formData.city,
        country: formData.country,
        postalCode: '123456',
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        hobbiesAndPassions: '',
        paidVoterMessage: '',
        freeVoterMessage: '',
        instagram: '',
        youtube: '',
        facebook: '',
        twitter: '',
        website: '',
        other: '',
      })
      .then(profile => {
        if (formData.profileAvatar) {
          uploadCoverImage.mutate({ id: profile.id, file: formData.profileAvatar });
          uploadProfilePhotos.mutate({ id: profile.id, files: [formData.profileAvatar] });
        }
      });
    // Here you would typically submit the form data to your backend
    console.log('Form completed with data:', formData);
    alert('Welcome to the modeling platform! Your profile is now live.');
  };

  return (
    <div className="relative">
      <div
        className="scene-background"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
        }}
      />

      <div className="scene-content">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="mb-8">
            <div className="relative inline-block">
              <CheckCircle className="w-20 h-20 text-green-400 animate-pulse" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-bounce" />
            </div>
          </div>

          <h1 className="headline mb-6">
            Your profile is ready
            <br />
            for the spotlight
          </h1>

          <p className="subheading mb-12 max-w-2xl mx-auto">
            Congratulations! Your modeling journey begins now. Your unique story and stunning
            portfolio are ready to captivate the world.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
              <Star className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Profile Complete</h3>
              <p className="text-gray-300 text-sm">
                Your stunning profile showcases your unique beauty and talent
              </p>
            </div>

            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: '0.4s' }}>
              <Camera className="w-8 h-8 mx-auto mb-4 text-pink-400" />
              <h3 className="text-lg font-semibold mb-2">Portfolio Ready</h3>
              <p className="text-gray-300 text-sm">
                Your photos tell your story and capture your essence
              </p>
            </div>

            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Journey Begins</h3>
              <p className="text-gray-300 text-sm">
                Step into the spotlight and let your modeling career shine
              </p>
            </div>
          </div>

          <div
            className="glass-card-dark inline-block p-8 mb-12 animate-fade-in-scale"
            style={{ animationDelay: '0.8s' }}
          >
            <h3 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h3>
            <p className="text-lg text-gray-300 mb-6">
              You're now part of an exclusive community of talented models.
              <br />
              Your journey to stardom starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {formData.categories.slice(0, 4).map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 border border-yellow-400/30 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="btn-primary flash-effect group text-xl px-12 py-4"
          >
            <Sparkles className="w-6 h-6" />
            Complete & Go Live
            <Sparkles className="w-6 h-6" />
          </button>

          <p className="text-sm text-gray-400 mt-6">
            By completing your profile, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalScene;
