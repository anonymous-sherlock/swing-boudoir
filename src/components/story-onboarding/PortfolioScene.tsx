import backgroundVideo from "@/assets/blu.mp4";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ChevronRight, Facebook, Grid3X3, Instagram, Star, Twitter, Upload, User, User2, X, Youtube } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { FormData } from "./index";

// Import predefined banner images
import onboardingPortfolio from "@/assets/onboarding-portfolio.jpg";
import onboardingWelcome from "@/assets/onboarding-welcome.jpg";

// Import banner images from banners directory
import balletBar from "@/assets/banners/13_ballet_bar.jpg";
import balletRecital from "@/assets/banners/31_ballet_recital.jpg";
import abstractBackground from "@/assets/banners/abstract-backgroud.png";
import beach from "@/assets/banners/beach.jpg";
import beatle from "@/assets/banners/beatle.png";
import bookLove from "@/assets/banners/book-love-symbol.png";
import butterflyRed from "@/assets/banners/butterfly-red-background.png";
import cocktails from "@/assets/banners/cocktails.gif";
import coloredHands from "@/assets/banners/colored-hands.png";
import dancing from "@/assets/banners/dancing.gif";
import dinnerOut from "@/assets/banners/Dinner-Out.gif";
import fountain from "@/assets/banners/fountain.gif";
import girlsNight from "@/assets/banners/GirlsNight.gif";
import haloweenTheme from "@/assets/banners/haloween-theme-illustration.jpg";
import leafsWood from "@/assets/banners/leafs-wood.png";
import modelSpotlight from "@/assets/banners/model-spotlight.jpg";
import modelsPhotoshoot from "@/assets/banners/models-photoshoot.jpg";
import movies from "@/assets/banners/movies.gif";
import paintBrushes from "@/assets/banners/paint-brushes..png";
import purpleCrystal from "@/assets/banners/purple-crystal-balls.png";
import purpleFlower from "@/assets/banners/purple-flower.png";
import redAbstractBrush from "@/assets/banners/red-abstract-brush-strokes.png";
import show1 from "@/assets/banners/Show1.gif";
import waterfall from "@/assets/banners/Waterfall.1200x300.gif";

import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
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

// Predefined banner options
const PREDEFINED_BANNERS = [
  { id: 'onboarding-portfolio', src: onboardingPortfolio, name: 'Portfolio Style' },
  { id: 'onboarding-welcome', src: onboardingWelcome, name: 'Welcome' },
  { id: 'cocktails', src: cocktails, name: 'Cocktails' },
  { id: 'dinner-out', src: dinnerOut, name: 'Dinner Out' },
  { id: 'ballet-bar', src: balletBar, name: 'Ballet Bar' },
  { id: 'ballet-recital', src: balletRecital, name: 'Ballet Recital' },
  { id: 'fountain', src: fountain, name: 'Fountain' },
  { id: 'show1', src: show1, name: 'Show' },
  { id: 'girls-night', src: girlsNight, name: 'Girls Night' },
  { id: 'dancing', src: dancing, name: 'Dancing' },
  { id: 'movies', src: movies, name: 'Movies' },
  { id: 'model-spotlight', src: modelSpotlight, name: 'Model Spotlight' },
  { id: 'leafs-wood', src: leafsWood, name: 'Leafs Wood' },
  { id: 'red-abstract-brush', src: redAbstractBrush, name: 'Red Abstract Brush' },
  { id: 'beatle', src: beatle, name: 'Beatle' },
  { id: 'purple-flower', src: purpleFlower, name: 'Purple Flower' },
  { id: 'models-photoshoot', src: modelsPhotoshoot, name: 'Models Photoshoot' },
  { id: 'haloween-theme', src: haloweenTheme, name: 'Halloween Theme' },
  { id: 'paint-brushes', src: paintBrushes, name: 'Paint Brushes' },
  { id: 'butterfly-red', src: butterflyRed, name: 'Butterfly Red' },
  { id: 'purple-crystal', src: purpleCrystal, name: 'Purple Crystal' },
  { id: 'book-love', src: bookLove, name: 'Book Love' },
  { id: 'colored-hands', src: coloredHands, name: 'Colored Hands' },
  { id: 'abstract-background', src: abstractBackground, name: 'Abstract Background' },
  { id: 'beach', src: beach, name: 'Beach' },
  { id: 'waterfall', src: waterfall, name: 'Waterfall' },
];

const PortfolioScene: React.FC<PortfolioSceneProps> = ({ formData, updateFormData, onNext }) => {
  const [showBannerLibrary, setShowBannerLibrary] = useState(false);
  
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

  // Function to convert image URL to File object
  const urlToFile = useCallback(async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
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
        setShowBannerLibrary(false);
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

  const selectPredefinedBanner = useCallback(async (banner: typeof PREDEFINED_BANNERS[0]) => {
    try {
      const file = await urlToFile(banner.src, `${banner.id}.jpg`);
      updateFormData({ bannerImage: file });
      setShowBannerLibrary(false);
      toast.success(`${banner.name} banner selected successfully!`);
    } catch (error) {
      toast.error("Failed to load banner image. Please try again.");
    }
  }, [updateFormData, urlToFile]);

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
                        "relative w-full aspect-[4/1] bg-black/50 border border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400/10 overflow-hidden",
                        isBannerDragActive && "border-yellow-400 bg-yellow-400/20"
                      )}
                    >
                      <input {...getBannerInputProps()} />

                      {formData.bannerImage ? (
                        <>
                          <img src={getObjectUrl(formData.bannerImage)} alt="Profile Banner" className="w-full h-full object-cover pointer-events-none" />
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowBannerLibrary(true);
                              }}
                              className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-blue-600 transition-colors z-10"
                              title="Choose from library"
                            >
                              <Grid3X3 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeBanner();
                              }}
                              className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm hover:bg-red-600 transition-colors z-10"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg mb-2">{isBannerDragActive ? "Drop your banner here" : "Drop your banner here or click to browse"}</p>
                          <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                        </div>
                      )}
                    </div>
                    

                    {/* Choose from Library Button - Outside dropzone */}
                    <div className="flex justify-end mt-4">
                      <button
                        type="button"
                        onClick={() => setShowBannerLibrary(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-black border border-gray-600 hover:border-yellow-400 text-white rounded-lg transition-colors"
                      >
                        <Grid3X3 className="w-4 h-4" />
                        Choose from Library
                      </button>
                    </div>

                    {/* Profile Avatar Overlapping on Left */}
                    <div className="absolute -bottom-0 left-8">
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
                          <div className="w-full h-full flex-col gap-2 rounded-full bg-gray-800 flex items-center justify-center">
                            <User className="w-10 h-10 text-gray-400" />
                            <span className="text-xs text-gray-400">Upload Avatar</span>
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

      {/* Banner Library Modal */}
      {showBannerLibrary && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-black border border-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h3 className="text-xl font-semibold text-white">Choose Your Banner</h3>
              <button
                onClick={() => setShowBannerLibrary(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PREDEFINED_BANNERS.map((banner) => (
                  <div
                    key={banner.id}
                    className="group cursor-pointer rounded-lg overflow-hidden border-2 border-gray-800 hover:border-yellow-400 transition-all duration-200"
                    onClick={() => selectPredefinedBanner(banner)}
                  >
                    <div className="relative aspect-video">
                      <img
                        src={banner.src}
                        alt={banner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <p className="text-white font-medium text-sm">{banner.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h4 className="text-lg font-medium text-white mb-4">Or upload your own banner</h4>
                <div
                  {...getBannerRootProps()}
                  className={cn(
                    "border-2 border-dashed border-gray-700 rounded-lg p-8 text-center cursor-pointer transition-all duration-200 hover:border-yellow-400 hover:bg-yellow-400/10",
                    isBannerDragActive && "border-yellow-400 bg-yellow-400/20"
                  )}
                >
                  <input {...getBannerInputProps()} />
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2 text-white">
                    {isBannerDragActive ? "Drop your banner here" : "Drop your banner here or click to browse"}
                  </p>
                  <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioScene;
