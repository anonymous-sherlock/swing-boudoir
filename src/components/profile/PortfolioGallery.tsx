import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
}

interface PortfolioGalleryProps {
  photos: Photo[];
  onImageClick: (image: { url: string; caption: string }) => void;
}

export const PortfolioGallery = ({ photos, onImageClick }: PortfolioGalleryProps) => {
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">A curated collection of professional photography showcasing versatility and style</p>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {photos.map((photo, index) => (
          <Card
            key={photo.id}
            className="break-inside-avoid relative overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-500 shadow-lg hover:shadow-2xl bg-white border-0"
            onClick={() => onImageClick({ url: photo.url, caption: photo?.caption ?? "" })}
            onMouseEnter={() => setHoveredPhoto(photo.id)}
            onMouseLeave={() => setHoveredPhoto(null)}
          >
            <div className="relative overflow-hidden rounded-lg">
              <img src={photo.url} alt={photo?.caption ?? ""} className="w-full h-auto object-cover" loading={index < 6 ? "eager" : "lazy"} />

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                  hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-medium text-lg">{photo?.caption ?? ""}</p>
                </div>
              </div>

              {/* Click indicator */}
              <div
                className={`absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 transition-opacity duration-300 ${
                  hoveredPhoto === photo.id ? "opacity-100" : "opacity-0"
                }`}
              >
                <Eye className="w-5 h-5 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
