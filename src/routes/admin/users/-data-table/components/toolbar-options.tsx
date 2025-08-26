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
      <div className="flex items-center gap-2">
        <Select value={userType} onValueChange={setUserType}>
          <SelectTrigger id="user-type-filter" className="w-32 !h-9 py-0">
            <SelectValue placeholder="All types" className="py-0 h-9" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="model">Model</SelectItem>
            <SelectItem value="voter">Voter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AddUserPopup />

      {totalSelectedCount > 0 && (
        <>
          <span className="text-sm text-muted-foreground">{totalSelectedCount} selected</span>
          <Button onClick={resetSelection} className="text-sm">
            Clear selection
          </Button>
        </>
      )}
    </div>
  );
}
