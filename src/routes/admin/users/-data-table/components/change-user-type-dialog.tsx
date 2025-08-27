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
import { useChangeUserType } from "@/hooks/api/users";
import { UserCamelCase } from "../schema";
import { toast } from "sonner";

interface ChangeUserTypeDialogProps {
  user: UserCamelCase;
  isOpen: boolean;
  onClose: () => void;
  newType: "MODEL" | "VOTER";
  onLoadingChange?: (loading: boolean) => void;
}

export function ChangeUserTypeDialog({
  user,
  isOpen,
  onClose,
  newType,
  onLoadingChange,
}: ChangeUserTypeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const changeUserType = useChangeUserType();

  const handleConfirm = async () => {
    setIsLoading(true);
    onLoadingChange?.(true);
    try {
      await changeUserType.mutateAsync({
        id: user.id,
        type: newType,
      });
      
      toast.success(`Successfully changed ${user.name}'s type to ${newType}`);
      onClose();
    } catch (error) {
      toast.error("Failed to change user type. Please try again.");
      console.error("Error changing user type:", error);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const currentType = user.type === "MODEL" ? "Model" : "Voter";
  const typeDisplayName = newType === "MODEL" ? "Model" : "Voter";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Type</DialogTitle>
          <DialogDescription>
            Are you sure you want to change {user.name}'s profile type from{" "}
            <span className="font-medium">{currentType}</span> to{" "}
            <span className="font-medium">{typeDisplayName}</span>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <div className="text-sm text-muted-foreground">
            <p><strong>Current Type:</strong> {currentType}</p>
            <p><strong>New Type:</strong> {typeDisplayName}</p>
            <p className="mt-4 text-xs">
              This action will change the user's profile type and may affect their access to certain features.
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Changing..." : `Change to ${typeDisplayName}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
