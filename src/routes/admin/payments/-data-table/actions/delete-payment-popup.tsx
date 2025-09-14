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
import { PaymentData } from "../schema";

interface DeletePaymentPopupProps {
  payment: PaymentData;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeletePaymentPopup({
  payment,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeletePaymentPopupProps) {
  const totalVotes = payment.votes.reduce((acc, vote) => acc + (vote.count || 0), 0);
  const contests = [...new Set(payment.votes.map(vote => vote.contest.name))];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Payment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this payment? This action cannot be undone.
            <br />
            <br />
            <strong>Payer:</strong> {payment.payer.user.name}
            <br />
            <strong>Amount:</strong> ${payment.amount.toFixed(2)}
            <br />
            <strong>Status:</strong> {payment.status}
            <br />
            <strong>Votes:</strong> {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
            <br />
            <strong>Contests:</strong> {contests.join(", ")}
            <br />
            <strong>Stripe Session:</strong> {payment.stripeSessionId.slice(0, 12)}...
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Deleting..." : "Delete Payment"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useDeletePaymentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);

  const openDeletePopup = (payment: PaymentData) => {
    setSelectedPayment(payment);
    setIsOpen(true);
  };

  const closeDeletePopup = () => {
    setIsOpen(false);
    setSelectedPayment(null);
  };

  return {
    isOpen,
    selectedPayment,
    openDeletePopup,
    closeDeletePopup,
  };
}
