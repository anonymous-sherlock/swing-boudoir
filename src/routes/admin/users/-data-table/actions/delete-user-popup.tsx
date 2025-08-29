import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

// ** Import 3rd Party Libs
import { toast } from "sonner";

// ** Import UI Components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ** Import API
import { useDeleteUser } from "@/hooks/api/users";

interface DeleteUserPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
  resetSelection?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function DeleteUserPopup({ open, onOpenChange, userId, userName, resetSelection, onLoadingChange }: DeleteUserPopupProps) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      // Notify parent component about loading state
      onLoadingChange?.(true);
      
      if (!userId) return;
      const response = await deleteUser(userId.toString());

      if (response.message) {
        toast.success("User deleted successfully");
        onOpenChange(false);

        // Reset the selection state if the function is provided
        if (resetSelection) {
          resetSelection();
        }
        // Refresh data
        await queryClient.invalidateQueries({ queryKey: ["users"] });
        await queryClient.invalidateQueries({ queryKey: ["users-admin-list"] });
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setIsLoading(false);
      // Notify parent component that loading is complete
      onLoadingChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>Are you sure you want to delete {userName}? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
