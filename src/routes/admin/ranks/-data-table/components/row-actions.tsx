import { Row } from "@tanstack/react-table";
import { MoreHorizontal, Crown, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { RankData } from "../schema";
import { AssignRankDialog } from "../actions/assign-rank-dialog";
import { RemoveRankDialog } from "../actions/remove-rank-dialog";
import { useState } from "react";

interface DataTableRowActionsProps {
  row: Row<RankData>;
  table: unknown;
}

export function DataTableRowActions({ row, table }: DataTableRowActionsProps) {
  const model = row.original;
  const [assignRankDialogOpen, setAssignRankDialogOpen] = useState(false);
  const [removeRankDialogOpen, setRemoveRankDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" className="h-8 w-8 p-0 flex-shrink-0" onClick={() => setAssignRankDialogOpen(true)}>
        <Crown className="h-4 w-4" />
        <span className="sr-only">Assign rank</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(model.id)}>Copy ID</DropdownMenuItem>

          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(model.profile.username)}>Copy Username</DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setAssignRankDialogOpen(true)}>
            <div className="flex items-center gap-2 text-sm">
              <Crown className="h-4 w-4" />
              Assign Rank
            </div>
          </DropdownMenuItem>
          {model.isManualRank && (
            <DropdownMenuItem onClick={() => setRemoveRankDialogOpen(true)}>
              <div className="flex items-center gap-2 text-destructive text-sm">
                <Trash2 className="h-4 w-4" />
                Remove Manual Rank
              </div>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AssignRankDialog model={model} open={assignRankDialogOpen} onOpenChange={setAssignRankDialogOpen} />
      <RemoveRankDialog model={model} open={removeRankDialogOpen} onOpenChange={setRemoveRankDialogOpen} onLoadingChange={setIsLoading} />
    </div>
  );
}
