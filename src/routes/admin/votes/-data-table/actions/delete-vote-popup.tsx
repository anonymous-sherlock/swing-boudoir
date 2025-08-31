import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { VoteData } from "../schema";

interface DeleteVotePopupProps {
  vote: VoteData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteVotePopup({
  vote,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteVotePopupProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vote</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this vote? This action cannot be undone.
            <br />
            <br />
            <strong>Voter:</strong> {vote.voter.name} (@{vote.voter.username})
            <br />
            <strong>Votee:</strong> {vote.votee.name} (@{vote.votee.username})
            <br />
            <strong>Contest:</strong> {vote.contest.name}
            <br />
            <strong>Type:</strong> {vote.type === "PAID" ? "Paid Vote" : "Free Vote"}
            <br />
            <strong>Count:</strong> {vote.count} {vote.count === 1 ? "vote" : "votes"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : "Delete Vote"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useDeleteVotePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVote, setSelectedVote] = useState<VoteData | null>(null);

  const openDeletePopup = (vote: VoteData) => {
    setSelectedVote(vote);
    setIsOpen(true);
  };

  const closeDeletePopup = () => {
    setIsOpen(false);
    setSelectedVote(null);
  };

  return {
    isOpen,
    selectedVote,
    openDeletePopup,
    closeDeletePopup,
  };
}
