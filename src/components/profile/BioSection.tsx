"use client";

import { Calendar, User, Mail, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface BioSectionProps {
  bio: string;
  hobbies: string;
  dateOfBirth: string;
  gender: string;
  email: string;
}

export function BioSection({ bio, hobbies, dateOfBirth, gender, email }: BioSectionProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateString: string) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 my-12">
      {/* Bio */}
      <div className="flex-1 lg:flex-[2]">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl h-full">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">About Me</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{bio}</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <div className="flex-1 space-y-6">
        {/* Personal Info */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Info</h3>
            <div className="space-y-4">
              {dateOfBirth && (
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <p className="font-medium">{formatDate(dateOfBirth)}</p>
                    <p className="text-sm text-gray-500">{calculateAge(dateOfBirth)} years old</p>
                  </div>
                </div>
              )}
              {gender && (
                <div className="flex items-center text-gray-700">
                  <User className="w-5 h-5 mr-3 text-blue-600" />
                  <p className="font-medium capitalize">{gender}</p>
                </div>
              )}
              {email && (
                <div className="flex items-center text-gray-700">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <p className="font-medium">{email}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hobbies & Interests */}
        {hobbies && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-600" />
                Interests & Hobbies
              </h3>
              <div className="flex flex-wrap gap-2">{hobbies}</div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
