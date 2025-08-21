import { Button } from "@/components/ui/button";

import { VoterAuthModal } from "@/components/auth/VoterAuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/hooks/api/useProfile";
import { ContestParticipation } from "@/types/competitions.types";
import { useRouter } from "@tanstack/react-router";
import { CreditCard, Gift, Star } from "lucide-react";
import { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "../global/modal";
import { Badge } from "../ui/badge";

type VoteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participation: ContestParticipation;
  profile: Profile;
};

const VoteModal = ({ open, onOpenChange, participation, profile }: VoteModalProps) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [selectedVoteType, setSelectedVoteType] = useState<"free" | "single" | "pack5" | "pack10" | "pack25" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get current page URL for callback
  const currentPath = router.state.location.pathname;
  const voteOptions = [
    { id: "free", title: "Free Vote", description: "Daily free vote", votes: 1, price: 0, icon: Gift, available: true },
    { id: "single", title: "1 Vote", description: "Single premium vote", votes: 1, price: 1, icon: Star },
    {
      id: "pack5",
      title: "5 Votes",

      description: "Small vote package",
      votes: 5,
      price: 5,
      icon: Star,
    },
    {
      id: "pack10",
      title: "10 Votes",
      popular: true,
      description: "Popular choice",
      votes: 10,
      price: 10,
      icon: Star,
    },
  ];

  const handleVoteClick = () => {
    if (!selectedVoteType) {
      return; // Button should be disabled anyway, but just in case
    }

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    // TODO: Implement actual voting logic here
    console.log("Voting for:", profile.user.name, "with option:", selectedVoteType);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // The user is now authenticated, they can proceed with voting
    // You might want to automatically trigger the vote or show a success message
  };

  return (
    <>
      <Modal open={open} onOpenChange={onOpenChange} backdrop="opaque" size="lg" classNames={{ content: "max-h-[95%] min-h-[95%] md:max-h-full md:min-h-auto" }}>
        <ModalContent className="overflow-y-auto">
          <ModalHeader>
            <ModalTitle>Vote for {profile.user.name}</ModalTitle>
            <ModalDescription>
              <span className="text-muted-foreground flex flex-wrap justify-between items-center gap-2">
                <span>please select the number of votes you want to buy.</span>
                {!isAuthenticated && <span className="text-orange-600 text-sm font-medium">⚠️ Sign in required to vote</span>}
              </span>
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="grid gap-3">
              {voteOptions.map((option) => {
                const Icon = option.icon;
                const isDisabled = option.id === "free" && !option.available;

                return (
                  <div
                    key={option.id}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                      selectedVoteType === option.id
                        ? "border-blue-500 bg-blue-50"
                        : isDisabled
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                    }`}
                    onClick={() => !isDisabled && setSelectedVoteType(option.id as "free" | "single" | "pack5" | "pack10" | "pack25")}
                  >
                    {option.popular && <Badge className="absolute -top-2 left-4 bg-orange-500 text-white">Most Popular</Badge>}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.id === "free" ? "bg-green-100" : "bg-purple-100"}`}>
                          <Icon className={`w-6 h-6 ${option.id === "free" ? "text-green-600" : "text-purple-600"}`} />
                        </div>

                        <div>
                          <h4 className="font-semibold text-lg">{option.title}</h4>
                          <p className="text-gray-600 text-sm">{option.description}</p>
                          {isDisabled && <p className="text-gray-500 text-sm">Next free vote available in 24h</p>}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold">{option.price === 0 ? "FREE" : `$${option.price}`}</div>
                        <div className="text-sm text-gray-500">
                          {option.votes} vote{option.votes > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ModalFooter className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex space-x-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleVoteClick} disabled={!selectedVoteType || isProcessing}>
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {selectedVoteType === "free" ? <Gift className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                        {!isAuthenticated ? "Sign In to Vote" : selectedVoteType === "free" ? "Cast Free Vote" : "Purchase & Vote"}
                      </div>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center">By voting, you agree to our terms of service and privacy policy</p>
              </div>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Voter Authentication Modal */}
      <VoterAuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} callbackURL={currentPath} />
    </>
  );
};

export default VoteModal;
