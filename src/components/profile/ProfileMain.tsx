"use client";

import { Button } from "@/components/ui/button";
import { shareProfile } from "@/utils";
import { getSocialMediaUrls } from "@/utils/social-media";
import { LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Globe, MapPin, Share2, User, User2 } from "lucide-react";
import { Icons } from "../icons";
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

const socialIcons = {
  instagram: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="url(#instagram-gradient)">
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  twitter: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1DA1F2">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  facebook: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  youtube: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#FF0000">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  linkedin: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0A66C2">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  website: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#4285F4">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1 20.945v-8.935H1.055C1.504 17.675 6.053 20.945 11 20.945zM1.055 10.01H11V1.055C6.053 1.055 1.504 4.325 1.055 10.01zM13 1.055v8.935h9.945C22.496 4.325 17.947 1.055 13 1.055zM13 20.945c5.947 0 10.496-3.27 10.945-8.935H13v8.935z"/>
    </svg>
  ),
  tiktok: () => (
    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
    </svg>
  ),
};

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
