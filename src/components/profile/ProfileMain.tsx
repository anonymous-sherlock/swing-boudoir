"use client";

import { Button } from "@/components/ui/button";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Globe, MapPin, Phone, Share2 } from "lucide-react";
import { Icons } from "../icons";
import { getSocialMediaUrls } from "@/utils/social-media";
import { toast } from "@/hooks/use-toast";

interface HeroSectionProps {
  name: string;
  username: string;
  city: string;
  country: string;
  phone: string;
  bannerImage: string;
  coverImage: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    website?: string;
    tiktok?: string;
  };
}

const socialIcons = {
  instagram: Icons.instagram,
  twitter: Icons.x,
  facebook: Icons.facebook,
  youtube: Icons.youtube,
  linkedin: LinkedInLogoIcon,
  website: Globe,
  tiktok: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
    </svg>
  ),
};

export function PublicProfileHeroSection({ name, username, city, country, phone, bannerImage, coverImage, socialMedia }: HeroSectionProps) {
  const socialUrls = getSocialMediaUrls(socialMedia);

  const shareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${username}`;
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile link copied!",
        description: "Share this link with your supporters to get more votes.",
      });
    } catch (error) {
      console.error("Error sharing profile:", error);
      toast({
        title: "Error sharing profile",
        description: "Failed to copy profile link to clipboard.",
        variant: "destructive",
      });
    }
  };
  const getSocialLinks = () => {
    return Object.entries(socialUrls)
      .filter(([_, url]) => url)
      .map(([platform, url]) => {
        const Icon = socialIcons[platform as keyof typeof socialIcons];
        if (!Icon) return null;

        return (
          <Button
            key={platform}
            variant="outline"
            size="sm"
            className="bg-black/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-300"
            onClick={() => window.open(url!, "_blank")}
          >
            <Icon className="w-4 h-4" />
          </Button>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
      {/* Banner Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${bannerImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                <img src={coverImage} alt={name} className="w-full h-full object-cover" />
              </div>
              {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"> </div> */}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg"> {name} </h1>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center md:justify-start text-white/90">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-lg">
                    {" "}
                    {city}, {country}{" "}
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center justify-center md:justify-start space-x-3">{getSocialLinks()}</div>
            </div>

            {/* Quick Actions */}
            <div className="absolute bottom-6 right-6 flex space-x-2">
              <Button onClick={shareProfile} variant="outline" size="sm" className="bg-white/90 hover:bg-white text-gray-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}
