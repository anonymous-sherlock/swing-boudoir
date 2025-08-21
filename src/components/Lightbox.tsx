import { useEffect } from "react";
import { X, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LightboxProps {
  image: {
    url: string;
    caption: string;
  };
  onClose: () => void;
}

export function Lightbox({ image, onClose }: LightboxProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = image.url;
    link.download = image.caption || "portfolio-image";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: image.caption,
          text: "Check out this amazing photo!",
          url: image.url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(image.url);
      alert("Image URL copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 !m-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={handleBackdropClick}>
      {/* Close button */}
      <Button variant="outline" size="sm" className="absolute top-4 right-4 z-10 bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={onClose}>
        <X className="w-4 h-4" />
      </Button>

      {/* Action buttons */}
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleShare}>
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Image container */}
      <div className="relative max-w-7xl max-h-full flex flex-col items-center">
        <img src={image.url} alt={image.caption} className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-lg" />

        {/* Caption */}
        {image.caption && (
          <div className="mt-2 mb-2 border-none outline-none overflow-visible bg-white/10 backdrop-blur-lg rounded-lg px-6 py-2 text-white text-center max-w-2xl">
            <p className="text-xs font-medium">{image.caption}</p>
          </div>
        )}
      </div>

      {/* Navigation hint */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">Press ESC to close • Click outside to close</div>
    </div>
  );
}
