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
import { Trash2 } from "lucide-react";

interface BulkDeleteVotesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isLoading?: boolean;
}

export function BulkDeleteVotesPopup({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
}: BulkDeleteVotesPopupProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Multiple Votes</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete {selectedCount} vote{selectedCount === 1 ? "" : "s"}? 
            This action cannot be undone and will permanently remove all selected votes from the system.
            <br />
            <br />
            <strong>Warning:</strong> This will affect vote counts, contest results, and user statistics.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete {selectedCount} Vote{selectedCount === 1 ? "" : "s"}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
