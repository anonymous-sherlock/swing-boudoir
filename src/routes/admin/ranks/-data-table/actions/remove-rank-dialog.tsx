import { AlertTriangle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRemoveModelRank } from "@/hooks/api/useModelRanks";
import { toast } from "sonner";
import { RankData } from "../schema";

interface RemoveRankDialogProps {
  model: RankData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function RemoveRankDialog({ model, open, onOpenChange, onLoadingChange }: RemoveRankDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const removeRankMutation = useRemoveModelRank();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      onLoadingChange?.(true);
      await removeRankMutation.mutateAsync(model.profile.id);
      toast.success("Manual rank removed successfully", {
        description: `${model.profile.name}'s manual rank has been removed and will revert to automatic ranking.`,
      });
      onOpenChange(false);
    } catch (error: unknown) {
      toast.error("Failed to remove manual rank", {
        description: (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "An error occurred while removing the manual rank",
      });
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  // Only show the dialog if the model has a manual rank
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Remove Manual Rank
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove the manual rank for {model.profile.name}? This will revert their ranking back to automatic calculation based on votes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-medium">{model.profile.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium">{model.profile.name}</p>
              <p className="text-sm text-muted-foreground">@{model.profile.username}</p>
              <div className="mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Current Manual Rank: #{model.rank}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Warning</p>
                <p>This action will remove the manual rank and the model will be ranked automatically based on their vote count.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={removeRankMutation.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onSubmit} disabled={removeRankMutation.isPending}>
            {removeRankMutation.isPending ? "Removing..." : "Remove Manual Rank"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
