import { Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ToolbarOptionsProps {
  selectedRanks: Array<{
    id: string;
    modelName: string;
    username: string;
  }>;
  allSelectedRankIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({
  selectedRanks,
  allSelectedRankIds,
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) {
  if (totalSelectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="secondary" className="px-2 py-1">
        {totalSelectedCount} selected
      </Badge>
      
      <Button
        variant="outline"
        size="sm"
        onClick={resetSelection}
        className="h-8"
      >
        <Crown className="h-4 w-4 mr-2" />
        Clear Selection
      </Button>
    </div>
  );
}
