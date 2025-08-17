import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmojiPicker } from "@/components/ui/emoji-picker";

import { DateTimePicker } from "@/components/lingua-time/datetime-picker";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormLabel as ShadFormLabel } from "@/components/ui/form";
import { useUpdateContest, useUploadContestImages, useRemoveContestImage } from "@/hooks/api/useContests";
import { FileTextIcon, ImageIcon, CalendarIcon } from "@radix-ui/react-icons";
import { GripVertical, Plus, RotateCcw, Trash2, Trophy, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Contest_Status, Contest_Visibility, ContestEditSchema, ContestSchema } from "@/lib/validations/contest.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { UnsavedChangesBar } from "@/components/UnsavedChangesBar";

export const Route = createFileRoute("/admin/contests/$id/edit")({
  loader: async ({ params: { id } }) => {
    const response = await api.get(`/api/v1/contest/${id}`);

    return response.data as z.infer<typeof ContestSchema>;
  },
  component: EditNewContestPage,
});

type ContestFormValues = z.infer<typeof ContestEditSchema>;

function EditNewContestPage() {
  const fetchContestResponse = Route.useLoaderData();
  const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
  const [existingImages, setExistingImages] = React.useState<Array<{ id: string; key: string; url: string }>>([]);
  const [imagesToDelete, setImagesToDelete] = React.useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const updateContest = useUpdateContest();
  const uploadContestImages = useUploadContestImages();
  const removeContestImage = useRemoveContestImage();

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const isLoading = updateContest.isPending || uploadContestImages.isPending;

  const form = useForm<ContestFormValues>({
    resolver: zodResolver(ContestEditSchema),
    defaultValues: {
      name: "",
      description: "",
      slug: "",
      rules: "",
      startDate: undefined,
      endDate: undefined,
      prizePool: 0,
      awards: [],
      status: "DRAFT",
      visibility: "PRIVATE",
    },
  });

  const {
    fields: awardFields,
    append: appendAward,
    remove: removeAward,
  } = useFieldArray({
    control: form.control,
    name: "awards",
  });

  React.useEffect(() => {
    if (fetchContestResponse) {
      form.reset({
        name: fetchContestResponse.name,
        description: fetchContestResponse.description ?? "",
        slug: fetchContestResponse.slug ?? "",
        rules: fetchContestResponse.rules ?? "",
        startDate: fetchContestResponse.startDate ? new Date(fetchContestResponse.startDate) : undefined,
        endDate: fetchContestResponse.endDate ? new Date(fetchContestResponse.endDate) : undefined,
        prizePool: fetchContestResponse.prizePool,
        awards: [],
        status: fetchContestResponse.status,
        visibility: fetchContestResponse.visibility,
      });

      // Set existing images if available
      if (fetchContestResponse.images && fetchContestResponse.images.length > 0) {
        setExistingImages(fetchContestResponse.images);
      }
    }
  }, [fetchContestResponse, form]);

  React.useEffect(() => {
    if (fetchContestResponse && fetchContestResponse.awards && fetchContestResponse.awards.length > 0) {
      appendAward(
        fetchContestResponse.awards.map((award, index) => ({
          name: award.name,
          icon: award.icon,
          position: index + 1,
        }))
      );
    }
  }, []);

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (type === "change") {
        setHasUnsavedChanges(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const onSubmit = async (values: ContestFormValues) => {
    try {
      if (isLoading) return;

      const created = await updateContest.mutateAsync({
        id: fetchContestResponse.id,
        data: {
          name: values.name,
          description: values.description,
          slug: values.slug,
          rules: values.rules,
          startDate: values.startDate?.toISOString(),
          endDate: values.endDate?.toISOString(),
          prizePool: values.prizePool,
          awards: values.awards,
          visibility: values.visibility,
          status: values.status,
        },
      });

      // Delete marked images if any
      if (imagesToDelete.size > 0) {
        for (const imageId of imagesToDelete) {
          try {
            await removeContestImage.mutateAsync({
              id: created.id,
              imageId: imageId,
            });
          } catch (error) {
            console.error(`Failed to delete image ${imageId}:`, error);
            toast.error(`Failed to delete one or more images. Please try again.`);
            return;
          }
        }
      }

      // Upload images if provided
      if (galleryImages.length) {
        await uploadContestImages.mutateAsync({ id: created.id, files: galleryImages });
      }

      setHasUnsavedChanges(false);
      setImagesToDelete(new Set());
      toast.success("Contest updated successfully!");
      navigate({ to: "/admin/contests" });
    } catch (error) {
      console.error("Failed to update contest:", error);
      toast.error("Failed to update contest. Please try again.");
    }
  };

  const handleReset = () => {
    if (fetchContestResponse) {
      form.reset({
        name: fetchContestResponse.name,
        description: fetchContestResponse.description ?? "",
        slug: fetchContestResponse.slug ?? "",
        rules: fetchContestResponse.rules ?? "",
        startDate: fetchContestResponse.startDate ? new Date(fetchContestResponse.startDate) : undefined,
        endDate: fetchContestResponse.endDate ? new Date(fetchContestResponse.endDate) : undefined,
        prizePool: fetchContestResponse.prizePool,
        awards: [],
        status: fetchContestResponse.status,
        visibility: fetchContestResponse.visibility,
      });

      // Reset awards
      if (fetchContestResponse.awards && fetchContestResponse.awards.length > 0) {
        const awardsData = fetchContestResponse.awards.map((award, index) => ({
          name: award.name,
          icon: award.icon,
          position: index + 1,
        }));
        appendAward(awardsData);
      }

      setGalleryImages([]);
      setImagesToDelete(new Set());
      setHasUnsavedChanges(false);
      toast.success("Form reset to original values");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validImages = acceptedFiles.filter((file) => file.type.startsWith("image/"));
    if (validImages.length !== acceptedFiles.length) {
      toast.error("Some files were not valid images");
    }
    setGalleryImages((prev) => [...prev, ...validImages]);
    setHasUnsavedChanges(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    multiple: true,
  });

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const removeExistingImage = (index: number) => {
    const image = existingImages[index];
    if (!image) return;

    setImagesToDelete((prev) => new Set(prev).add(image.id));
    setHasUnsavedChanges(true);
    toast.success("Image marked for deletion. Submit form to confirm.");
  };

  const addAward = () => {
    appendAward({ name: "", icon: "🏆" });
    setHasUnsavedChanges(true);
  };

  const moveAward = (fromIndex: number, toIndex: number) => {
    const awards = form.getValues("awards");
    if (!awards) return;

    const [movedAward] = awards.splice(fromIndex, 1);
    awards.splice(toIndex, 0, movedAward);

    form.setValue("awards", awards);
    setHasUnsavedChanges(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6 mb-16">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contest Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter contest name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} placeholder="Contest description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rules & Guidelines</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Enter contest rules and guidelines..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* URL and Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileTextIcon className="w-5 h-5" />
                URL and Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contest Slug</FormLabel>
                    <FormControl>
                      <div className="*:not-first:mt-2">
                        <div className="flex rounded-md shadow-xs">
                          <span className="border-input bg-gray-200 text-black inline-flex items-center rounded-s-md border px-3 text-sm">{"https://localhost:9999/contests"}</span>
                          <Input className="-ms-px rounded-s-none shadow-none" placeholder="google.com" type="text" {...field} />
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Images Upload */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Contest Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Existing Images ({existingImages.length}){imagesToDelete.size > 0 && <span className="ml-2 text-red-500">({imagesToDelete.size} marked for deletion)</span>}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {existingImages.map((image, index) => {
                      const isMarkedForDeletion = imagesToDelete.has(image.id);
                      return (
                        <div key={image.id} className="relative group">
                          <div className={cn("aspect-square rounded-lg overflow-hidden bg-muted", isMarkedForDeletion && "opacity-50")}>
                            <img src={image.url} alt={`Existing ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                          {isMarkedForDeletion ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 bg-green-500 text-white hover:bg-green-600"
                              onClick={() => {
                                setImagesToDelete((prev) => {
                                  const newSet = new Set(prev);
                                  newSet.delete(image.id);
                                  return newSet;
                                });
                                setHasUnsavedChanges(true);
                              }}
                            >
                              <RotateCcw className="w-3 h-3" />
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                              onClick={() => removeExistingImage(index)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                          <p className={cn("text-xs text-muted-foreground mt-1 truncate", isMarkedForDeletion && "text-red-500 font-medium")}>
                            {isMarkedForDeletion ? "Marked for deletion" : `Existing Image ${index + 1}`}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gallery Images */}
              <div className="space-y-2">
                <Label className="text-sm">Add New Gallery Images</Label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Drop gallery images here, or click to browse</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB each</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = Array.from((e.target as HTMLInputElement).files || []);
                            if (files.length > 0) onDrop(files as File[]);
                          };
                          input.click();
                        }}
                        className="h-7 text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Gallery Images Preview */}
                {galleryImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">New Images ({galleryImages.length})</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Gallery ${index + 1}`}
                              className={`w-full h-full object-cover ${isDragActive ? "opacity-50" : "opacity-100"}`}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 truncate">{image.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Prize Pool & Awards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Prize Pool & Awards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <FormField
                control={form.control}
                name="prizePool"
                render={({ field }) => (
                  <FormItem>
                    <ShadFormLabel className="text-sm">Total Prize Pool ($) *</ShadFormLabel>
                    <FormControl>
                      <div className="*:not-first:mt-2">
                        <div className="relative flex rounded-md shadow-xs">
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm z-10">$</span>
                          <Input
                            className="relative -me-px rounded-e-none ps-6 shadow-none z-[2]"
                            placeholder="0.00"
                            type="number"
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <span className="relative border-input bg-background text-muted-foreground z-0 bg-gray-200 inline-flex items-center rounded-e-md border px-3 text-sm">
                            USD
                          </span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Awards</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addAward} className="h-7 text-xs">
                    <Plus className="w-3 h-3 mr-1" />
                    Add Award
                  </Button>
                </div>

                {awardFields.map((award, index) => (
                  <div
                    key={award.id}
                    className={cn(
                      "border rounded-lg p-3 space-y-2 cursor-grab active:cursor-grabbing transition-all hover:shadow-md",
                      form.watch(`awards.${index}.icon`) && "border-primary/20 bg-primary/5"
                    )}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString());
                      e.currentTarget.style.opacity = "0.5";
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "hsl(var(--primary))";
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.style.borderColor = "";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.borderColor = "";
                      const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
                      if (fromIndex !== index) {
                        moveAward(fromIndex, index);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            const element = e.currentTarget.closest(".border") as HTMLElement;
                            if (element) {
                              element.style.cursor = "grabbing";
                            }
                          }}
                          onMouseUp={(e) => {
                            const element = e.currentTarget.closest(".border") as HTMLElement;
                            if (element) {
                              element.style.cursor = "grab";
                            }
                          }}
                        >
                          <GripVertical className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2">
                          {form.watch(`awards.${index}.icon`) && <span className="text-lg">{form.watch(`awards.${index}.icon`)}</span>}
                          <span className="text-xs font-medium">Award #{index + 1}</span>
                          <EmojiPicker onEmojiSelect={(emoji) => form.setValue(`awards.${index}.icon`, emoji)} size="sm" />
                        </div>
                      </div>
                      {awardFields.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAward(index)} className="text-red-600 hover:text-red-700 h-6 w-6 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name={`awards.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-xs">Name *</Label>
                            <FormControl>
                              <Input {...field} placeholder="1st Place" className="h-8 text-xs" />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`awards.${index}.icon`}
                        render={({ field }) => (
                          <FormItem>
                            <Label className="text-xs">Icon</Label>
                            <FormControl>
                              <div className="flex gap-2">
                                <div className="relative flex-1">
                                  <Input {...field} placeholder="🏆" className="h-8 text-xs" />
                                </div>
                                <EmojiPicker value={field.value} onEmojiSelect={field.onChange} size="md" />
                              </div>
                            </FormControl>
                            <p className="text-xs text-muted-foreground mt-1">Click the emoji button to pick an icon, or type directly</p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <span className="text-xs font-medium">Total Prize Pool:</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <span className="text-xs font-semibold">${(form.watch("prizePool") || 0).toLocaleString()}</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right-hand Switch Panel */}
        <div className="space-y-6">
          {/* Dates & Timing */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Dates & Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field: { name, value, onChange, onBlur, disabled } }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          name={name}
                          dateTime={value}
                          setDateTime={onChange}
                          onBlur={onBlur}
                          disabled={disabled}
                          autoComplete="off"
                          aria-describedby={"Start Date"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field: { name, value, onChange, onBlur, disabled } }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <DateTimePicker name={name} dateTime={value} setDateTime={onChange} onBlur={onBlur} disabled={disabled} autoComplete="off" aria-describedby={"End Date"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contest Status */}
          <Card>
            <CardHeader>
              <CardTitle>Contest Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(Contest_Status).map(([key, value]) => (
                          <SelectItem key={value} value={value}>
                            {key.charAt(0) + key.slice(1).toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a visibility" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(Contest_Visibility).map(([key, value]) => {
                          return (
                            <SelectItem key={value} value={value}>
                              {key
                                .toLowerCase()
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Unsaved Changes Bar */}
      <UnsavedChangesBar isVisible={hasUnsavedChanges} onSave={form.handleSubmit(onSubmit)} onReset={handleReset} isSaving={isLoading} />
    </Form>
  );
}
