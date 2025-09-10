import backgroundVideo from "@/assets/final-video.mp4";
import React from "react";
import { CheckCircle, Sparkles, Star, Camera } from "lucide-react";
import { FormData } from "./index";
import { useProfile } from "@/hooks/api/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
interface FinalSceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const FinalScene: React.FC<FinalSceneProps> = ({ formData }) => {
  const { createProfile, uploadCoverImage, uploadBannerImage, uploadProfilePhotos } = useProfile();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const handleComplete = () => {
    console.log("Finalizing profile with data:", formData);
    if (!isLoading && !user) return;
    createProfile
      .mutateAsync({
        userId: user?.id ?? "",
        bio: formData.bio,
        phone: formData.phone,
        address: formData.address ?? "",
        city: formData.city,
        country: formData.country,
        postalCode: formData.zipcode,
        dateOfBirth: new Date(formData.dateOfBirth),
        gender: formData.gender,
        hobbiesAndPassions: formData.hobbiesAndPassions || "",
        paidVoterMessage: "Welcome to the platform!",
        freeVoterMessage: "Thank you for joining us!",
        instagram: formData.instagram,
        youtube: formData.youtube,
        facebook: formData.facebook,
        twitter: formData.twitter,
        tiktok: formData.tiktok,
        website: "",
        other: "",
      })
      .then((profile) => {
        console.log("Profile created successfully:", profile);

        // Upload profile avatar as cover image
        if (formData.profileAvatar) {
          uploadCoverImage.mutate({ id: profile.id, file: formData.profileAvatar });
        }

        // Upload banner image
        if (formData.bannerImage) {
          uploadBannerImage.mutate({ id: profile.id, file: formData.bannerImage });
        }

        // Upload portfolio photos
        if (formData.photos.length > 0) {
          uploadProfilePhotos.mutate({ id: profile.id, files: formData.photos });
        }

        // Invalidate profile queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        queryClient.invalidateQueries({ queryKey: ["session"] });
        // Show success toast and redirect to dashboard
        toast.success("🎉 Welcome to the modeling platform! Your profile is now live.");

        // Small delay to let user see the toast before redirecting
        setTimeout(() => {
          router.navigate({ to: "/dashboard" });
        }, 1500);
      })
      .catch((error) => {
        console.error("Error creating profile:", error);
        toast.error("There was an error creating your profile. Please try again.");
      });
  };

  return (
    <div className="relative">
      {/* Video Background */}
      <div className="scene-background">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black" />

      </div>

      <div className="scene-content !pt-28">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">

          <h1 className="headline mb-6">
            Your profile is ready
            <br />
            for the spotlight
          </h1>

          <p className="subheading mb-12 max-w-2xl mx-auto !text-base">
            Congratulations! Your modeling journey begins now. Your unique story and stunning portfolio are ready to captivate the world.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.2s" }}>
              <Star className="w-8 h-8 mx-auto mb-4 text-yellow-400" />
              <h3 className="text-lg font-semibold mb-2">Profile Complete</h3>
              <p className="text-gray-300 text-sm">Your stunning profile showcases your unique beauty and talent</p>
            </div>

            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.4s" }}>
              <Camera className="w-8 h-8 mx-auto mb-4 text-pink-400" />
              <h3 className="text-lg font-semibold mb-2">Portfolio Ready</h3>
              <p className="text-gray-300 text-sm">Your photos tell your story and capture your essence</p>
            </div>

            <div className="glass-card animate-fade-in-scale" style={{ animationDelay: "0.6s" }}>
              <Sparkles className="w-8 h-8 mx-auto mb-4 text-purple-400" />
              <h3 className="text-lg font-semibold mb-2">Journey Begins</h3>
              <p className="text-gray-300 text-sm">Step into the spotlight and let your modeling career shine</p>
            </div>
          </div>

          <div className="glass-card-dark inline-block p-8 mb-12 animate-fade-in-scale" style={{ animationDelay: "0.8s" }}>
            <h3 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h3>
            <p className="text-lg text-gray-300 mb-6">
              You're now part of an exclusive community of talented models.
              <br />
              Your journey to stardom starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {formData.categories.slice(0, 4).map((category) => (
                <span key={category} className="px-3 py-1 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 border border-yellow-400/30 rounded-full text-sm">
                  {category}
                </span>
              ))}
            </div>
          </div>

          <button onClick={handleComplete} className="btn-primary flash-effect group text-xl px-12 py-4">
            <Sparkles className="w-6 h-6" />
            Complete & Go Live
            <Sparkles className="w-6 h-6" />
          </button>

          <p className="text-sm text-gray-400 mt-6">By completing your profile, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default FinalScene;
