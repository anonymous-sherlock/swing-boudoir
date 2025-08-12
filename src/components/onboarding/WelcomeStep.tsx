import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Trophy, 
  Users, 
  Heart, 
  Star, 
  Camera, 
  Globe,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export function WelcomeStep() {
  const features = [
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Win Competitions",
      description: "Participate in contests and win prizes"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Build Your Fanbase",
      description: "Connect with voters and grow your community"
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: "Get Voted",
      description: "Receive votes and climb the leaderboards"
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Showcase Talent",
      description: "Display your portfolio and best work"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Global Reach",
      description: "Connect with people worldwide"
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: "Premium Features",
      description: "Access exclusive tools and analytics"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Models" },
    { number: "50K+", label: "Happy Voters" },
    { number: "100+", label: "Competitions" },
    { number: "1M+", label: "Votes Cast" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-3 py-1 bg-purple-50 rounded-full border border-purple-100">
          <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
          <span className="text-purple-700 text-sm font-medium">Welcome to Swing Boudoir</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          Your Journey <span className="text-purple-600">Starts Here</span>
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join thousands of models who have found success, built their fanbase, and won amazing prizes. 
          Create your profile and start your path to stardom.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Free to Join
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Instant Setup
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Global Community
          </Badge>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-4">
            <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">
              {stat.number}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card key={feature.title} className="border border-gray-200 hover:border-purple-200 hover:shadow-sm transition-all">
            <CardContent className="p-4 text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto text-purple-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Card className="bg-purple-50 border border-purple-100">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Get Started?
            </h2>
            
            <p className="text-gray-600 max-w-xl mx-auto">
              Let's set up your profile and get you ready to compete. 
              It only takes a few minutes to create your perfect profile!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}