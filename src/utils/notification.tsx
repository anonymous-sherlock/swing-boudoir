import { AlertTriangle, CheckCircle, Bell, Clock, Lightbulb, Star, Trophy, Info } from "lucide-react";
import { Heart } from "lucide-react";
import { Settings } from "lucide-react";

import { Notification, Notification_Type } from "@/types";

export const getNotificationIconByType = (type: keyof Notification_Type): React.ReactNode => {
  switch (type) {
    case "COMPETITION_JOINED":
      return <Trophy className="w-5 h-5 text-blue-500" />;
    case "VOTE_RECEIVED":
      return <Heart className="w-5 h-5 text-red-500" />;
    case "SETTINGS_CHANGED":
      return <Settings className="w-5 h-5 text-green-500" />;
    case "REMINDER":
      return <Clock className="w-5 h-5 text-orange-500" />;
    case "TIP":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "MOTIVATION":
      return <Star className="w-5 h-5 text-purple-500" />;
    case "SYSTEM":
      return <Bell className="w-5 h-5 text-gray-500" />;
    case "COMPETITION_LEFT":
      return <Bell className="w-5 h-5 text-red-500" />;
    case "COMPETITION_CREATED":
      return <Trophy className="w-5 h-5 text-blue-500" />;
    case "COMPETITION_UPCOMING":
      return <Trophy className="w-5 h-5 text-blue-500" />;
    case "VOTE_PREMIUM":
      return <Heart className="w-5 h-5 text-red-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

export const getNotificationBackgroundByType = (type: keyof Notification_Type): string => {
  switch (type) {
    case "COMPETITION_JOINED":
      return "bg-blue-50/50 border-l-blue-500";
    case "COMPETITION_LEFT":
      return "bg-red-50/50 border-l-red-500";
    case "COMPETITION_CREATED":
      return "bg-green-50/50 border-l-green-500";
    case "COMPETITION_UPCOMING":
      return "bg-indigo-50/50 border-l-indigo-500";
    case "VOTE_RECEIVED":
      return "bg-pink-50/50 border-l-pink-500";
    case "VOTE_PREMIUM":
      return "bg-purple-50/50 border-l-purple-500";
    case "SETTINGS_CHANGED":
      return "bg-emerald-50/50 border-l-emerald-500";
    case "REMINDER":
      return "bg-orange-50/50 border-l-orange-500";
    case "TIP":
      return "bg-yellow-50/50 border-l-yellow-500";
    case "MOTIVATION":
      return "bg-violet-50/50 border-l-violet-500";
    case "SYSTEM":
      return "bg-gray-50/50 border-l-gray-500";
    default:
      return "bg-gray-50/50 border-l-gray-500";
  }
};

export const getNotificationIcon = (icon: Notification["icon"]) => {
  switch (icon) {
    case "WARNING":
      return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    case "SUCESS":
      return <CheckCircle className="w-5 h-5 text-red-500" />;
    case "INFO":
      return <Info className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};
