import { toast } from "@/components/ui/sonner";
import { CheckCircleIcon } from "lucide-react";

export const shareProfile = async (username: string) => {
  try {
    const profileUrl = `${window.location.origin}/profile/${username}`;
    await navigator.clipboard.writeText(profileUrl);

    toast.success("Profile link copied!", {
      icon: <CheckCircleIcon className="w-4 h-4" />,
      description: "Share this link with your supporters to get more votes",
    });
  } catch (error) {
    console.error("Error sharing profile:", error);
    toast("Error sharing profile", {
      description: "Failed to copy profile link to clipboard.",
    });
  }
};
