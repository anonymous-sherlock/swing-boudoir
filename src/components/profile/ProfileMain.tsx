"use client";

import { Button } from "@/components/ui/button";
import { shareProfile } from "@/utils";
import { getSocialMediaUrls } from "@/utils/social-media";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Globe, MapPin, Share2, User, User2 } from "lucide-react";
import { Icons, socialIcons } from "../icons";
import { cn } from "@/lib/utils";

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

const socialColors = {
  instagram: "bg-gradient-to-br from-pink-600 via-purple-700 to-orange-500 from-5% via-70% to-90% fill-white",
  twitter: "from-black to-black fill-white",
  facebook: "from-blue-600 to-blue-800 fill-white",
  youtube: "from-red-600 to-red-800",
  linkedin: "from-blue-700 to-blue-900",
  website: "from-gray-600 to-gray-800",
  tiktok: "from-black to-black",
};

export function PublicProfileHeroSection({ name, username, city, country, phone, bannerImage, coverImage, socialMedia }: HeroSectionProps) {
  const socialUrls = getSocialMediaUrls(socialMedia);

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
            className="bg-grey backdrop-blur-lg border-white/30 hover:bg-white/10 transition-all duration-300 p-0 w-8 h-8"
            onClick={() => window.open(url!, "_blank")}
          >
            <Icon />
          </Button>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className="relative h-[60vh] min-h-[500px]">
      {/* Banner Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center" style={{ backgroundImage: `url(${bannerImage})` }}>
        {!bannerImage ? <User className="size-40 text-gray-400   object-cover" /> : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image - Hidden on mobile, shown on desktop */}
            <div className="relative hidden md:block">
              <div className={cn("w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl", !coverImage && "flex justify-center items-center bg-gray-200")}>
                {coverImage ? <img src={coverImage} alt={name} className="w-full h-full object-cover" /> : <User className="size-16 text-gray-400   object-cover" />}
              </div>
              {/* <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full"> </div> */}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <h1 className="text-2xl md:text-5xl font-bold mb-2 drop-shadow-lg"> {name} </h1>
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
            <div className="absolute bottom-2 right-2 md:bottom-6 md:right-6 flex space-x-2">
              <Button onClick={() => shareProfile(username)} variant="outline" size="sm" className="bg-white/90 hover:bg-white text-gray-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile Image - Positioned at bottom with half overlay */}
      <div className="relative md:hidden">
        <div className="absolute -bottom-5 left-1/2  transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
            <img src={coverImage} alt={name} className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
