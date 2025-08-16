import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/contests/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddNewContestPage />;
}

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
import { useCreateContest, useUploadContestImages } from "@/hooks/api/useContests";
import { FileTextIcon, ImageIcon, CalendarIcon, TargetIcon } from "@radix-ui/react-icons";
import { GripVertical, Plus, Trash2, Trophy, Upload, X, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Contest_Status, Contest_Visibility, ContestInsertSchema } from "@/lib/validations/contest.schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ContestFormValues = z.infer<typeof ContestInsertSchema>;

export default function AddNewContestPage() {
  const [newTag, setNewTag] = React.useState("");
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [galleryImages, setGalleryImages] = React.useState<File[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const navigate = useNavigate();
  const createContest = useCreateContest();
  const uploadContestImages = useUploadContestImages();
  const form = useForm<ContestFormValues>({
    resolver: zodResolver(ContestInsertSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      awards: [{ name: "", icon: "🏆", position: 1 }],
      tags: [],
      status: Contest_Status.DRAFT,
      visibility: Contest_Visibility.PUBLIC,
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

  const onSubmit = async (values: ContestFormValues) => {
    try {
      // Create contest with JSON payload
      const payload = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        prizePool: values.prizePool,
        awards: values.awards,
        visibility: values.visibility,
        status: values.status,
      };

      const created = await createContest.mutateAsync(payload);

      // Upload images if provided
      if (galleryImages.length) {
        await uploadContestImages.mutateAsync({ id: created.id, files: galleryImages });
      }

      toast.success("Contest created successfully!");
      navigate({ to: "/admin/contests" });
    } catch (error) {
      console.error("Failed to create contest:", error);
      toast.error("Failed to create contest. Please try again.");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validImages = acceptedFiles.filter((file) => file.type.startsWith("image/"));
    if (validImages.length !== acceptedFiles.length) {
      toast.error("Some files were not valid images");
    }
    setGalleryImages((prev) => [...prev, ...validImages]);
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
  };

  const addAward = () => {
    appendAward({ name: "", icon: "🏆", position: awardFields.length + 1 });
  };

  const moveAward = (fromIndex: number, toIndex: number) => {
    const awards = form.getValues("awards");
    const [movedAward] = awards.splice(fromIndex, 1);
    awards.splice(toIndex, 0, movedAward);

    // Update positions
    awards.forEach((award, index) => {
      award.position = index + 1;
    });

    form.setValue("awards", awards);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
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
              {/* Gallery Images */}
              <div className="space-y-2">
                <Label className="text-sm">Gallery Images</Label>
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
                    <Label className="text-xs font-medium">Selected Images ({galleryImages.length})</Label>
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
                      <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} min="0" step="0.01" placeholder="10000" className="h-9 text-sm" />
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

          <Button type="submit" className="w-full">
            Create Contest
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate({ to: "/admin/contests" })} size="sm">
            Cancel
          </Button>
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
          {/* Categories & Tags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TargetIcon className="w-5 h-5" />
                Categories & Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label className="text-sm">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="h-8 text-sm flex-1"
                  />
                  <EmojiPicker onEmojiSelect={(emoji) => setNewTag((prev) => prev + emoji)} size="md" />
                  <Button type="button" variant="outline" onClick={addTag} size="sm" className="h-8 text-xs">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">
                        <X className="w-2 h-2" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </Form>
  );
}
