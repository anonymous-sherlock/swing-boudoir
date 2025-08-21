import { Button } from "@/components/ui/button";

import { ContestParticipation } from "@/types/competitions.types";
import { CreditCard, Gift, Star } from "lucide-react";
import { useState } from "react";
import { Modal, ModalBody, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle } from "../global/modal";
import { Badge } from "../ui/badge";
import { Profile } from "@/hooks/api/useProfile";

type VoteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  participation: ContestParticipation;
  profile: Profile;
};

const VoteModal = ({ open, onOpenChange, participation, profile }: VoteModalProps) => {
  const [selectedVoteType, setSelectedVoteType] = useState<"free" | "single" | "pack5" | "pack10" | "pack25" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
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
    {
      id: "pack25",
      title: "25 Votes",

      description: "Best value package",
      votes: 25,
      price: 25,
      icon: Star,
    },
  ];
  return (
    <Modal open={open} onOpenChange={onOpenChange} backdrop="opaque" size="lg">
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Vote for {profile.user.name}</ModalTitle>
          <ModalDescription>
            <p className="text-muted-foreground flex flex-wrap justify-between items-center gap-2">
              <span>please select the number of votes you want to buy.</span>
            </p>
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
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => {}} disabled={!selectedVoteType || isProcessing}>
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      {selectedVoteType === "free" ? <Gift className="w-4 h-4 mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
                      {selectedVoteType === "free" ? "Cast Free Vote" : "Purchase & Vote"}
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
  );
};

export default VoteModal;
