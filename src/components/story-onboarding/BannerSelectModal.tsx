import { cn } from "@/lib/utils";
import { Upload, X } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
import paintBrushes from "@/assets/banners/paint-brushes.png";
import purpleCrystal from "@/assets/banners/purple-crystal-balls.png";
import purpleFlower from "@/assets/banners/purple-flower.png";
import redAbstractBrush from "@/assets/banners/red-abstract-brush-strokes.png";
import show1 from "@/assets/banners/Show1.gif";
import waterfall from "@/assets/banners/Waterfall.1200x300.gif";

// Predefined banner options
const PREDEFINED_BANNERS = [
  { id: "onboarding-portfolio", src: onboardingPortfolio, name: "Portfolio Style" },
  { id: "onboarding-welcome", src: onboardingWelcome, name: "Welcome" },
  { id: "cocktails", src: cocktails, name: "Cocktails" },
  { id: "dinner-out", src: dinnerOut, name: "Dinner Out" },
  { id: "ballet-bar", src: balletBar, name: "Ballet Bar" },
  { id: "ballet-recital", src: balletRecital, name: "Ballet Recital" },
  { id: "abstract-background", src: abstractBackground, name: "Abstract Background" },
  { id: "beatle", src: beatle, name: "Beatle" },
  { id: "book-love", src: bookLove, name: "Book Love" },
  { id: "butterfly-red", src: butterflyRed, name: "Butterfly Red" },
  { id: "colored-hands", src: coloredHands, name: "Colored Hands" },
  { id: "dancing", src: dancing, name: "Dancing" },
  { id: "fountain", src: fountain, name: "Fountain" },
  { id: "girls-night", src: girlsNight, name: "Girls Night" },
  { id: "haloween-theme", src: haloweenTheme, name: "Halloween Theme" },
  { id: "leafs-wood", src: leafsWood, name: "Leafs Wood" },
  { id: "model-spotlight", src: modelSpotlight, name: "Model Spotlight" },
  { id: "models-photoshoot", src: modelsPhotoshoot, name: "Models Photoshoot" },
  { id: "movies", src: movies, name: "Movies" },
  { id: "paint-brushes", src: paintBrushes, name: "Paint Brushes" },
  { id: "purple-crystal", src: purpleCrystal, name: "Purple Crystal" },
  { id: "purple-flower", src: purpleFlower, name: "Purple Flower" },
  { id: "red-abstract-brush", src: redAbstractBrush, name: "Red Abstract Brush" },
  { id: "show1", src: show1, name: "Show 1" },
  { id: "beach", src: beach, name: "Beach" },
  { id: "waterfall", src: waterfall, name: "Waterfall" },
];

export type BannerType = (typeof PREDEFINED_BANNERS)[0];
export interface BannerSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bannerImage: File | null;
  onBannerSelect: (file: File | null) => void;
  getObjectUrl: (file: File | null) => string;
}

const BannerSelector: React.FC<BannerSelectorProps> = ({ bannerImage, onBannerSelect, getObjectUrl, open, onOpenChange }) => {
  // Function to convert image URL to File object
  const urlToFile = useCallback(async (url: string, filename: string): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }, []);

  // Dropzone configuration
  const dropzoneConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  };

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
  } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          onBannerSelect(acceptedFiles[0]);
          toast.success("Banner image uploaded successfully!");
          onOpenChange(false);
        }
      },
      [onBannerSelect, onOpenChange]
    ),
    ...dropzoneConfig,
  });

  const selectPredefinedBanner = useCallback(
    async (banner: (typeof PREDEFINED_BANNERS)[0]) => {
      try {
        const file = await urlToFile(banner.src, `${banner.id}.jpg`);
        onBannerSelect(file);
        onOpenChange(false);
        toast.success(`${banner.name} banner selected successfully!`);
      } catch (error) {
        toast.error("Failed to load banner image. Please try again.");
      }
    },
    [onBannerSelect, urlToFile, onOpenChange]
  );

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      size="5xl"
      backdrop="blur"
      classNames={{
        backdrop: "z-[999999]",
      }}
    >
      <DialogContent showCloseButton={false} className="bg-black border-gray-800 max-h-[90vh] overflow-hidden !z-[999999] sm:max-w-4xl p-0">
        <DialogHeader className="p-4 px-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-lg font-semibold text-white">Choose Your Banner</DialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-gray-400 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </DialogHeader>

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
                    loading="lazy"
                    decoding="async"
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
              <p className="text-lg mb-2 text-white">{isBannerDragActive ? "Drop your banner here" : "Drop your banner here or click to browse"}</p>
              <p className="text-sm text-gray-400">JPG, PNG, WEBP up to 10MB</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerSelector;
