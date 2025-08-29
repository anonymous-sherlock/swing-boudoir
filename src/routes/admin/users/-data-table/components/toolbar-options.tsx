import { Button } from "@/components/ui/button";
import { AddUserPopup } from "../actions/add-user-popup";
import { useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ToolbarOptionsProps {
  selectedUsers: Array<{ id: string; name: string }>;
  allSelectedUserIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({ selectedUsers, allSelectedUserIds, totalSelectedCount, resetSelection }: ToolbarOptionsProps) {
  const [userType, setUserType] = useQueryState("type", {
    defaultValue: "all",
    parse: (value) => value || "all",
    serialize: (value) => (value === "all" ? "" : value),
  });
  return (
    <div className="flex items-center gap-2">
      {totalSelectedCount > 0 && (
        <>
          <span className="text-xs text-muted-foreground">{totalSelectedCount} selected</span>
          <Button onClick={resetSelection} size="sm" className="text-xs h-7 px-2">
            Clear selection
          </Button>
        </>
      )}
      <div className="flex items-center gap-2">
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger id="user-type-filter" className="w-28 !h-8 py-0 text-xs">
            <SelectValue placeholder="All types" className="py-0 h-7" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Users
            </SelectItem>
            <SelectItem value="model" className="text-xs">
              Model
            </SelectItem>
            <SelectItem value="voter" className="text-xs">
              Voter
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
