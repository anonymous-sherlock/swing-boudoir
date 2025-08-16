import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronRight, Camera, Upload, X, Star, User, Instagram, Twitter, Facebook, Youtube, User2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import { FormData } from "./index";
import backgroundVideo from "@/assets/blu.mp4";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import CharacterCounter from "./CharacterCounter";

interface PortfolioSceneProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  onNext: () => void;
  isTransitioning: boolean;
}

const FormSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500, "Bio must be at most 500 characters"),
  categories: z.array(z.string()).min(1, "Select at least one category"),
});

const PortfolioScene: React.FC<PortfolioSceneProps> = ({ formData, updateFormData, onNext }) => {
  const categories = useMemo(() => ["Fashion", "Commercial", "Editorial", "Runway", "Fitness", "Beauty", "Portrait", "Lifestyle", "Art", "Plus Size", "Petite", "Mature"], []);
  
  // Memoize form default values to prevent recreation
  const formDefaultValues = useMemo(() => ({
    bio: formData.bio || "",
    categories: formData.categories || [],
  }), [formData.bio, formData.categories]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: formDefaultValues,
  });

  // Manage object URLs to prevent memory leaks and recreation
  const objectUrlsRef = useRef<Map<File, string>>(new Map());
  
  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
      objectUrlsRef.current.clear();
    };
  }, []);

  // Cleanup object URLs when files are removed
  useEffect(() => {
    const currentFiles = new Set([
      ...(formData.photos || []),
      ...(formData.profileAvatar ? [formData.profileAvatar] : []),
      ...(formData.bannerImage ? [formData.bannerImage] : [])
    ]);

    // Remove URLs for files that no longer exist
    objectUrlsRef.current.forEach((url, file) => {
      if (!currentFiles.has(file)) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(file);
      }
    });
  }, [formData.photos, formData.profileAvatar, formData.bannerImage]);

  // Memoized function to get or create object URL
  const getObjectUrl = useCallback((file: File): string => {
    if (!objectUrlsRef.current.has(file)) {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.set(file, url);
    }
    return objectUrlsRef.current.get(file)!;
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const currentPhotoCount = formData.photos.length;
      const newPhotoCount = currentPhotoCount + acceptedFiles.length;
      
      if (newPhotoCount > 20) {
        const excessCount = newPhotoCount - 20;
        const allowedCount = 20 - currentPhotoCount;
        toast.error(`You can only upload ${allowedCount} more photo(s). You tried to upload ${acceptedFiles.length} but only ${allowedCount} will be added.`);
        
        // Only add the allowed number of photos
        const allowedFiles = acceptedFiles.slice(0, allowedCount);
        const newPhotos = [...formData.photos, ...allowedFiles];
        updateFormData({ photos: newPhotos });
        toast.success(`${allowedFiles.length} photo(s) uploaded successfully!`);
      } else {
        const newPhotos = [...formData.photos, ...acceptedFiles];
        updateFormData({ photos: newPhotos });
        toast.success(`${acceptedFiles.length} photo(s) uploaded successfully!`);
      }
    },
    [formData.photos, updateFormData]
  );

  const onAvatarDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        updateFormData({ profileAvatar: acceptedFiles[0] });
        toast.success("Profile avatar uploaded successfully!");
      }
    },
    [updateFormData]
  );

  // Memoize dropzone configurations
  const dropzoneConfig = useMemo(() => ({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  }), []);

  const avatarDropzoneConfig = useMemo(() => ({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  }), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...dropzoneConfig,
    maxFiles: 20,
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: useCallback((acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        updateFormData({ bannerImage: acceptedFiles[0] });
        toast.success("Banner image uploaded successfully!");
      }
    }, [updateFormData]),
    ...dropzoneConfig,
    maxFiles: 1,
  });

  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
    isDragActive: isAvatarDragActive,
  } = useDropzone({
    onDrop: onAvatarDrop,
    ...avatarDropzoneConfig,
  });

  const removePhoto = useCallback((index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData({ photos: newPhotos });
    toast.success("Photo removed successfully!");
  }, [formData.photos, updateFormData]);

  const removeAvatar = useCallback(() => {
    updateFormData({ profileAvatar: null });
    toast.success("Profile avatar removed successfully!");
  }, [updateFormData]);

  const removeBanner = useCallback(() => {
    updateFormData({ bannerImage: null });
    toast.success("Banner image removed successfully!");
  }, [updateFormData]);

  const toggleCategory = useCallback((category: string) => {
    const currentCategories = form.getValues("categories");
    const newCategories = currentCategories.includes(category) ? currentCategories.filter((c) => c !== category) : [...currentCategories, category];

    form.setValue("categories", newCategories);
    updateFormData({ categories: newCategories });
  }, [form, updateFormData]);

  const onSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
    // Update form data with validated values
    updateFormData({
      bio: data.bio,
      categories: data.categories,
    });

    toast.success("Portfolio information saved successfully!");
    onNext();
  }, [updateFormData, onNext]);

  return (
    <div className="relative">
      {/* Video Background */}
      <div className="scene-background">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="scene-content !pt-28">
        <div className="w-full md:max-w-5xl mx-auto animate-fade-in-up">
          <div className="glass-card-dark">
            <div className="text-center mb-8">
              <Camera className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <h2 className="section-title">Show us your portfolio</h2>
              <p className="text-gray-300">Every picture tells your story</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Banner and Profile Layout */}
                <div>
                      <label className="flex items-center justify-start gap-2 mb-4">
                    <Camera className="w-4 h-4" /> Profile Banner & Avatar
                      </label>

                  {/* Banner Upload Area */}
                  <div className="relative mb-20">
                    <div
                      {...getBannerRootProps()}
                      className={cn(
                        "relative w-full h-48 bg-black/50 border border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400/10 overflow-hidden",
                        isBannerDragActive && "border-yellow-400 bg-yellow-400/20"
                      )}
                    >
                      <input {...getBannerInputProps()} />

                      {formData.bannerImage ? (
                        <>
                          <img src={getObjectUrl(formData.bannerImage)} alt="Profile Banner" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBanner();
                            }}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors z-10"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg mb-2">{isBannerDragActive ? "Drop your banner here" : "Drop your banner here or click to browse"}</p>
                          <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </div>

                    {/* Profile Avatar Overlapping on Left */}
                    <div className="absolute -bottom-16 left-8">
                        <div
                          {...getAvatarRootProps()}
                          className={cn(
                          "relative w-32 h-32 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-200 hover:scale-105",
                          isAvatarDragActive && "ring-4 ring-yellow-400 ring-opacity-50"
                          )}
                        >
                          <input {...getAvatarInputProps()} />
                          
                          {formData.profileAvatar ? (
                            <>
                            <img src={getObjectUrl(formData.profileAvatar)} alt="Profile Avatar" className="w-full h-full rounded-full object-cover" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeAvatar();
                                }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs hover:bg-red-600 transition-colors"
                              >
                              <X className="w-3 h-4" />
                              </button>
                            </>
                          ) : (
                          <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  {/* Bio Section */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem className="mb-8">
                        <FormLabel className="flex gap-2 items-center justify-start text-sm font-medium  mb-2">
                          <User2 className="w-4 h-4" />
                          Bio
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Textarea
                              placeholder="Tell your audience about yourself, your interests, and what kind of stories you love to share. Be authentic and engaging!"
                              className="w-full focus:!ring-[#D4AF37] focus:ring-1 focus:ring-offset-1 focus:ring-offset-transparent focus-visible:!ring-[#D4AF37] focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent p-4 rounded-lg resize-none h-32 bg-black/50 border border-gray-800  text-white/80 placeholder:text-muted-foreground transition-colors"
                              {...field}
                              maxLength={500}
                            />
                          </FormControl>
                          <CharacterCounter current={field.value?.length || 0} min={50} max={500} className="absolute bottom-3 right-3 border border-black/60 backdrop-blur-xl" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Social Media Links */}
                  <div className="mt-8">
                      <label className="flex items-center justify-start gap-2 mb-4">
                        <Star className="w-4 h-4" /> Social Media Links
                      </label>
                      
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <Instagram className="w-5 h-5 text-pink-500" />
                          <input
                            type="text"
                            placeholder="Instagram username"
                            value={formData.instagram}
                            onChange={(e) => updateFormData({ instagram: e.target.value })}
                            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white/80 placeholder:text-gray-500 focus:ring-[#D4AF37] focus:ring-1 focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Twitter className="w-5 h-5 text-blue-400" />
                          <input
                            type="text"
                            placeholder="Twitter/X username"
                            value={formData.twitter}
                            onChange={(e) => updateFormData({ twitter: e.target.value })}
                            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white/80 placeholder:text-gray-500 focus:ring-[#D4AF37] focus:ring-1 focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Facebook className="w-5 h-5 text-blue-600" />
                          <input
                            type="text"
                            placeholder="Facebook profile"
                            value={formData.facebook}
                            onChange={(e) => updateFormData({ facebook: e.target.value })}
                            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white/80 placeholder:text-gray-500 focus:ring-[#D4AF37] focus:ring-1 focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Youtube className="w-5 h-5 text-red-500" />
                          <input
                            type="text"
                            placeholder="YouTube channel"
                            value={formData.youtube}
                            onChange={(e) => updateFormData({ youtube: e.target.value })}
                            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white/80 placeholder:text-gray-500 focus:ring-[#D4AF37] focus:ring-1 focus:border-[#D4AF37] outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="TikTok username"
                            value={formData.tiktok}
                            onChange={(e) => updateFormData({ tiktok: e.target.value })}
                            className="flex-1 bg-black/50 border border-gray-800 rounded-lg px-3 py-2 text-white/80 placeholder:text-gray-500 focus:ring-[#D4AF37] focus:ring-1 focus:border-[#D4AF37] outline-none"
                          />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="flex items-center justify-start gap-2 mb-4">
                    <Upload className="w-4 h-4" /> Portfolio Photos (Up to 20)
                  </label>

                  <div {...getRootProps()} className={`upload-area ${isDragActive ? "dragover" : ""}`}>
                    <input {...getInputProps()} />
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg mb-2">{isDragActive ? "Drop your photos here" : "Drop your photos here or click to browse"}</p>
                    <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB each</p>
                  </div>

                  {formData.photos.length > 0 && (
                    <div className="photo-preview">
                      {formData.photos.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="photo-item">
                          <img src={getObjectUrl(file)} alt={`Portfolio ${index + 1}`} />
                          <button type="button" onClick={() => removePhoto(index)} className="photo-remove">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Categories */}
                <div className="form-group">
                  <label className="flex items-center justify-start gap-2 mb-4">Preferred Categories</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {categories.map((category) => {
                      const isSelected = form.getValues("categories").includes(category);
                      return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-lg border transition-all duration-200 text-sm font-medium ${
                            isSelected
                            ? "bg-gradient-to-r from-yellow-400 to-pink-400 text-black border-yellow-400"
                            : "bg-white/10 text-white border-white/20 hover:border-yellow-400/50"
                        }`}
                      >
                        {category}
                      </button>
                      );
                    })}
                  </div>
                  {form.formState.errors.categories && <p className="text-red-400 text-sm mt-2">{form.formState.errors.categories.message}</p>}
                </div>

                <div className="flex justify-center mt-8">
                  <button type="submit" className="btn-primary flash-effect group">
                    Ready for Spotlight
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioScene;
