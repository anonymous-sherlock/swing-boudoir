import React, { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContestJoinImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (file: File | null) => void;
  contestName: string;
  isLoading?: boolean;
}

export const ContestJoinImageDialog: React.FC<ContestJoinImageDialogProps> = ({ isOpen, onClose, onJoin, contestName, isLoading = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleJoin = async () => {
    setIsUploading(true);

    try {
      // Call the join function with the selected file
      await onJoin(selectedFile);
    } catch (error) {
      console.error("Error joining contest:", error);
      // Still try to join without image
      await onJoin(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const isProcessing = isLoading || isUploading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join {contestName}</DialogTitle>
          <DialogDescription>Upload a cover image for your contest participation. This image is required and will be displayed on your contest entry.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image Upload Area */}
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200 group",
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary hover:bg-primary/5",
              previewUrl && "border-green-500 bg-green-50"
            )}
          >
            <input {...getInputProps()} />

            {previewUrl ? (
              <div className="space-y-4">
                <div className="relative inline-block group">
                  <div className="relative overflow-hidden rounded-xl shadow-lg ring-2 ring-green-200 ring-offset-2 ring-offset-white">
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-3 -right-3 w-7 h-7 p-0 rounded-full shadow-lg hover:scale-110 transition-transform duration-200 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-green-700">Image selected successfully!</p>
                  <p className="text-xs text-gray-500">Click to change or drag a new image</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="absolute inset-0 w-20 h-20 mx-auto rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-700">
                    {isDragActive ? "Drop your image here" : "Drop your image here or click to browse"}
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP up to 10MB</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button type="button" onClick={handleJoin} disabled={isProcessing || !selectedFile} className="min-w-[100px]">
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isUploading ? "Uploading..." : "Joining..."}
              </div>
            ) : (
              "Join Contest"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContestJoinImageDialog;
