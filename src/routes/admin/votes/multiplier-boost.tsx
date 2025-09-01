import { DateTimePicker } from "@/components/lingua-time/datetime-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useVoteMultipliers, type VoteMultiplier } from "@/hooks/api/useVoteMultipliers";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { AlertCircle, Clock, Edit, Plus, Trash2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const Route = createFileRoute("/admin/votes/multiplier-boost")({
  component: VotesBoostPage,
});


// Form validation schema
const voteMultiplierSchema = z
  .object({
    multiplierTimes: z.coerce.number().min(2, "Multiplier must be at least 2").max(100, "Multiplier cannot exceed 10"),
    isActive: z.boolean(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

type VoteMultiplierFormData = z.infer<typeof voteMultiplierSchema>;


function VotesBoostPage() {
  const { voteMultipliers, loading, createVoteMultiplier, updateVoteMultiplier, deleteVoteMultiplier } = useVoteMultipliers();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMultiplier, setEditingMultiplier] = useState<VoteMultiplier | null>(null);

  // React Hook Form
  const form = useForm<VoteMultiplierFormData>({
    resolver: zodResolver(voteMultiplierSchema),
    defaultValues: {
      multiplierTimes: 2,
      isActive: true,
      startTime: undefined,
      endTime: undefined,
    },
  });

  const handleCreate = async (data: VoteMultiplierFormData) => {
    const payload = {
      multiplierTimes: data.multiplierTimes,
      isActive: data.isActive,
      startTime: data.startTime?.toISOString() || null,
      endTime: data.endTime?.toISOString() || null,
    };

    const result = await createVoteMultiplier(payload);

    if (result) {
      setIsCreateDialogOpen(false);
      form.reset();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vote multiplier?")) return;

    await deleteVoteMultiplier(id);
  };

  const openEditDialog = (multiplier: VoteMultiplier) => {
    setEditingMultiplier(multiplier);
    form.reset({
      multiplierTimes: multiplier.multiplierTimes,
      isActive: multiplier.isActive,
      startTime: multiplier.startTime ? new Date(multiplier.startTime) : undefined,
      endTime: multiplier.endTime ? new Date(multiplier.endTime) : undefined,
    });
    setIsEditDialogOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getStatus = (multiplier: VoteMultiplier) => {
    const now = new Date();
    const startTime = multiplier.startTime ? new Date(multiplier.startTime) : null;
    const endTime = multiplier.endTime ? new Date(multiplier.endTime) : null;

    if (!multiplier.isActive) {
      return { status: "inactive", label: "Inactive", variant: "secondary" as const };
    }

    if (startTime && now < startTime) {
      return { status: "scheduled", label: "Scheduled", variant: "secondary" as const };
    }

    if (endTime && now > endTime) {
      return { status: "expired", label: "Expired", variant: "secondary" as const };
    }

    if (startTime && endTime && now >= startTime && now <= endTime) {
      return { status: "active", label: "Active", variant: "default" as const };
    }

    if (!startTime && !endTime) {
      return { status: "active", label: "Active", variant: "default" as const };
    }

    return { status: "unknown", label: "Unknown", variant: "secondary" as const };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Votes Boost</h1>
          <p className="text-muted-foreground text-sm">Manage vote multiplier periods to boost engagement during contests.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>
              <Plus className="mr-2 h-4 w-4" />
              Create Boost
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Vote Boost</DialogTitle>
              <DialogDescription>Create a new vote multiplier period to increase engagement.</DialogDescription>
              <div className="mt-2">
                {(() => {
                  const formValues = form.getValues();
                  const now = new Date();
                  const startTime = formValues.startTime;
                  const endTime = formValues.endTime;

                  let status = "unknown";
                  let label = "Unknown";
                  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";

                  if (!formValues.isActive) {
                    status = "inactive";
                    label = "Inactive";
                    variant = "secondary";
                  } else if (startTime && now < startTime) {
                    status = "scheduled";
                    label = "Scheduled";
                    variant = "outline";
                  } else if (endTime && now > endTime) {
                    status = "expired";
                    label = "Expired";
                    variant = "destructive";
                  } else if ((startTime && endTime && now >= startTime && now <= endTime) || (!startTime && !endTime)) {
                    status = "active";
                    label = "Active";
                    variant = "default";
                  }

                  return (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Preview Status:</span>
                      <Badge variant={variant}>
                        {status === "scheduled" && <Clock className="w-3 h-3 mr-1" />}
                        {status === "expired" && <AlertCircle className="w-3 h-3 mr-1" />}
                        {label}
                      </Badge>
                    </div>
                  );
                })()}
              </div>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="multiplierTimes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Multiplier</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field: { name, value, onChange, onBlur, disabled } }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          name={name}
                          dateTime={value}
                          setDateTime={onChange}
                          onBlur={onBlur}
                          disabled={disabled}
                          autoComplete="off"
                          aria-describedby={"Start Time"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field: { name, value, onChange, onBlur, disabled } }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <DateTimePicker name={name} dateTime={value} setDateTime={onChange} onBlur={onBlur} disabled={disabled} autoComplete="off" aria-describedby={"End Date"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">Enable this vote multiplier period</div>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Vote Boosts
              </CardTitle>
              <CardDescription>Manage vote multiplier periods that are currently active, scheduled, or expired.</CardDescription>
            </div>
            {voteMultipliers.length > 0 && (
              <div className="flex gap-2">
                {(() => {
                  const activeCount = voteMultipliers.filter((m) => getStatus(m).status === "active").length;
                  const scheduledCount = voteMultipliers.filter((m) => getStatus(m).status === "scheduled").length;
                  const expiredCount = voteMultipliers.filter((m) => getStatus(m).status === "expired").length;

                  return (
                    <>
                      {activeCount > 0 && (
                        <Badge variant="default" className="text-xs">
                          {activeCount} Active
                        </Badge>
                      )}
                      {scheduledCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {scheduledCount} Scheduled
                        </Badge>
                      )}
                      {expiredCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {expiredCount} Expired
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          ) : voteMultipliers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Zap className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">No vote boosts</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by creating a new vote boost.</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Multiplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {voteMultipliers.map((multiplier) => (
                  <TableRow key={multiplier.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {multiplier.multiplierTimes}x
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const status = getStatus(multiplier);
                        return (
                          <Badge variant={status.variant}>
                            {status.status === "scheduled" && <Clock className="w-3 h-3 mr-1" />}
                            {status.status === "expired" && <AlertCircle className="w-3 h-3 mr-1" />}
                            {status.label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>{formatDate(multiplier.startTime)}</TableCell>
                    <TableCell>{formatDate(multiplier.endTime)}</TableCell>
                    <TableCell>{formatDate(multiplier.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(multiplier)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(multiplier.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <EditVoteBoostDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} multiplier={editingMultiplier} onCancel={() => setIsEditDialogOpen(false)} />
    </div>
  );
}

// Edit Vote Boost Dialog Component
interface EditVoteBoostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiplier: VoteMultiplier | null;
  onCancel: () => void;
}

function EditVoteBoostDialog({ open, onOpenChange, multiplier, onCancel }: EditVoteBoostDialogProps) {
  const { updateVoteMultiplier } = useVoteMultipliers();

  const editForm = useForm<VoteMultiplierFormData>({
    resolver: zodResolver(voteMultiplierSchema),
    defaultValues: {
      multiplierTimes: 2,
      isActive: true,
      startTime: undefined,
      endTime: undefined,
    },
  });

  useEffect(() => {
    if (multiplier) {
      editForm.reset({
        multiplierTimes: multiplier.multiplierTimes,
        isActive: multiplier.isActive,
        startTime: multiplier.startTime ? new Date(multiplier.startTime) : undefined,
        endTime: multiplier.endTime ? new Date(multiplier.endTime) : undefined,
      });
    }
  }, [multiplier?.id, editForm]);

  const handleUpdate = async (data: VoteMultiplierFormData) => {
    if (!multiplier) return;

    // Use form data if provided, otherwise use original multiplier data
    const startTime = data.startTime || (multiplier.startTime ? new Date(multiplier.startTime) : undefined);
    const endTime = data.endTime || (multiplier.endTime ? new Date(multiplier.endTime) : undefined);

    const payload = {
      multiplierTimes: data.multiplierTimes,
      isActive: data.isActive,
      startTime: startTime?.toISOString() || null,
      endTime: endTime?.toISOString() || null,
    };

    const result = await updateVoteMultiplier(multiplier.id, payload);

    if (result) {
      onOpenChange(false);
      onCancel();
    }
  };

  const getStatus = (multiplier: VoteMultiplier) => {
    const now = new Date();
    const startTime = multiplier.startTime ? new Date(multiplier.startTime) : null;
    const endTime = multiplier.endTime ? new Date(multiplier.endTime) : null;

    if (!multiplier.isActive) {
      return { status: "inactive", label: "Inactive", variant: "secondary" as const };
    }

    if (startTime && now < startTime) {
      return { status: "scheduled", label: "Scheduled", variant: "secondary" as const };
    }

    if (endTime && now > endTime) {
      return { status: "expired", label: "Expired", variant: "secondary" as const };
    }

    if (startTime && endTime && now >= startTime && now <= endTime) {
      return { status: "active", label: "Active", variant: "default" as const };
    }

    if (!startTime && !endTime) {
      return { status: "active", label: "Active", variant: "default" as const };
    }

    return { status: "unknown", label: "Unknown", variant: "secondary" as const };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Vote Boost</DialogTitle>
          <DialogDescription>Update the vote multiplier period settings.</DialogDescription>
          {multiplier && (
            <div className="mt-2">
              {(() => {
                const status = getStatus(multiplier);
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current Status:</span>
                    <Badge variant={status.variant}>
                      {status.status === "scheduled" && <Clock className="w-3 h-3 mr-1" />}
                      {status.status === "expired" && <AlertCircle className="w-3 h-3 mr-1" />}
                      {status.label}
                    </Badge>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogHeader>
        <Form {...editForm}>
          <form onSubmit={editForm.handleSubmit(handleUpdate)} className="space-y-4">
            <FormField
              control={editForm.control}
              name="multiplierTimes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Multiplier</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      name={field.name}
                      dateTime={undefined}
                      setDateTime={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      placeholder={multiplier?.startTime ? format(new Date(multiplier.startTime), "MMM d, yyyy 'at' h:mm a") : "Pick a start date"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      name={field.name}
                      dateTime={undefined}
                      setDateTime={field.onChange}
                      onBlur={field.onBlur}
                      disabled={field.disabled}
                      placeholder={multiplier?.endTime ? format(new Date(multiplier.endTime), "MMM d, yyyy 'at' h:mm a") : "Pick an end date"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={editForm.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <div className="text-sm text-muted-foreground">Enable this vote multiplier period</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
