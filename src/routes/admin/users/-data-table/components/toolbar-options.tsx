"use client";

import { Button } from "@/components/ui/button";
import { AddUserPopup } from "../actions/add-user-popup";

interface ToolbarOptionsProps {
  selectedUsers: Array<{ id: number; name: string }>;
  allSelectedUserIds: number[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({ selectedUsers, allSelectedUserIds, totalSelectedCount, resetSelection }: ToolbarOptionsProps) {
  return (
    <div className="flex items-center gap-2">
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
