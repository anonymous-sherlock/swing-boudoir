import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { InfoIcon, Loader, RotateCcw, Save } from "lucide-react";

interface UnsavedChangesBarProps {
  isVisible: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
  className?: string;
}

export function UnsavedChangesBar({ isVisible, onSave, onReset, isSaving = false, className }: UnsavedChangesBarProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%]  md:max-w-xl rounded-lg right-0 z-50 bg-black/95 backdrop-blur-lg text-white shadow-xl border-t border-black",
        "transform transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "translate-y-full",
        className
      )}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20">
              <InfoIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onReset} disabled={isSaving} className=" bg-red-600 text-xs hover:bg-red-700 text-white gap-1 ">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button variant="secondary" size="sm" onClick={onSave} disabled={isSaving} className="bg-accent text-xs text-black hover:bg-accent/90 gap-1">
              {isSaving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
