import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateUser } from "@/hooks/api/users";
import { UserCamelCase } from "../schema";
import { toast } from "sonner";

interface ChangeUserStatusDialogProps {
  user: UserCamelCase;
  isOpen: boolean;
  onClose: () => void;
  newStatus: boolean;
  onLoadingChange?: (loading: boolean) => void;
}

export function ChangeUserStatusDialog({
  user,
  isOpen,
  onClose,
  newStatus,
  onLoadingChange,
}: ChangeUserStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const updateUser = useUpdateUser();

  const handleConfirm = async () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { isActive: newStatus },
      });
      
      const statusText = newStatus ? "Active" : "Inactive";
      toast.success(`Successfully changed ${user.name}'s status to ${statusText}`);
      onClose();
    } catch (error) {
      toast.error("Failed to change user status. Please try again.");
      console.error("Error changing user status:", error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const currentStatus = user.isActive;
  const statusDisplayName = newStatus ? "Active" : "Inactive";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Status</DialogTitle>
          <DialogDescription>
            Are you sure you want to change {user.name}'s status from{" "}
            <span className="font-medium">{currentStatus ? "Active" : "Inactive"}</span> to{" "}
            <span className="font-medium">{statusDisplayName}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-sm text-muted-foreground">
            <p><strong>Current Status:</strong> {currentStatus ? "Active" : "Inactive"}</p>
            <p><strong>New Status:</strong> {statusDisplayName}</p>
            <p className="mt-2 text-xs">
              {newStatus 
                ? "Activating the user will restore their access to the platform."
                : "Deactivating the user will restrict their access to the platform."
              }
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={newStatus ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {isLoading ? "Changing..." : `Change to ${statusDisplayName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
