import { useState, useCallback, useRef, useEffect } from "react";
import { Crown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAssignModelRank } from "@/hooks/api/useModelRanks";
import { RankData } from "../schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const assignRankFormSchema = z.object({
  profileId: z.string(),
  manualRank: z.number().min(1).max(5),
});

type AssignRankFormValues = z.infer<typeof assignRankFormSchema>;

interface AssignRankDialogProps {
  model: RankData;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AssignRankDialog({ model, open: controlledOpen, onOpenChange }: AssignRankDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const assignRankMutation = useAssignModelRank();

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const form = useForm<AssignRankFormValues>({
    resolver: zodResolver(assignRankFormSchema),
    defaultValues: {
      profileId: model.profile.id,
      manualRank: typeof model.rank === "number" && model.rank <= 5 ? model.rank : 1,
    },
  });

  const onSubmit = useCallback(
    async (inputData: AssignRankFormValues) => {
      // Prevent multiple submissions with ref, mutation state, and local state
      if (isSubmittingRef.current || assignRankMutation.isPending || isSubmitting) {
        console.log("Assignment already in progress, skipping...");
        return;
      }

      // Validate form data
      if (!inputData.profileId || !inputData.manualRank || inputData.manualRank < 1 || inputData.manualRank > 5) {
        toast.error("Invalid form data", {
          description: "Please select a valid rank between 1 and 5",
        });
        return;
      }

      // Check if trying to assign the same rank
      if (typeof model.rank === "number" && model.rank === inputData.manualRank && model.isManualRank) {
        toast.error("Same rank already assigned", {
          description: `${model.profile.name} already has rank #${inputData.manualRank}`,
        });
        return;
      }

      console.log("Submitting assign rank data:", {
        profileId: inputData.profileId,
        manualRank: inputData.manualRank,
      });

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      try {
        const data = await assignRankMutation.mutateAsync({
          profileId: inputData.profileId,
          manualRank: inputData.manualRank,
        });

        if (!data.success) {
          toast.error("Failed to assign rank", {
            description: data.message,
          });
          return;
        }
        toast.success("Rank assigned successfully", {
          description: `${model.profile.name} has been assigned rank #${data.rank.rank}`,
        });
        setOpen(false);
        form.reset();
      } catch (error: unknown) {
        console.error("Assign rank error:", error);
        const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "An error occurred while assigning the rank";
        toast.error("Failed to assign rank", {
          description: errorMessage,
        });
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
    },
    [assignRankMutation, isSubmitting, model.profile.name, model.rank, model.isManualRank, setOpen, form]
  );

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
      // Reset submission state when dialog closes
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // Reset submission state when dialog opens
  useEffect(() => {
    if (open) {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" />
            Assign Manual Rank
          </DialogTitle>
          <DialogDescription>Assign a manual rank (1-5) to {model.profile.name}. Manual ranks take precedence over automatic ranking.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="size-12 rounded-full bg-primary/10 flex items-center justify-center border-2">
                  <AvatarImage src={model.profile.image} className="object-cover object-center w-full h-full flex-shrink-0" />
                  <AvatarFallback className="bg-white">{model.profile.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium">{model.profile.name}</p>
                  <p className="text-sm text-muted-foreground">@{model.profile.username}</p>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="manualRank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manual Rank</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a rank (1-5)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((rank) => (
                        <SelectItem key={rank} value={rank.toString()}>
                          Rank #{rank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Only ranks 1-5 can be manually assigned. This will override the automatic ranking.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={assignRankMutation.isPending || isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={assignRankMutation.isPending || isSubmitting}>
                {assignRankMutation.isPending || isSubmitting ? "Assigning..." : "Assign Rank"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
