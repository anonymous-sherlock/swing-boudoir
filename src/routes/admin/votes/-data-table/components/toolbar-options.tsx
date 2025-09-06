import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { BulkDeleteVotesPopup } from "../actions/bulk-delete-popup";
import { ContestCombobox } from "@/components/contest-combobox";

interface ToolbarOptionsProps {
  selectedVotes: Array<{
    id: string;
    voterName: string;
    voteeName: string;
  }>;
  allSelectedVoteIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({ selectedVotes, allSelectedVoteIds, totalSelectedCount, resetSelection }: ToolbarOptionsProps) {
  const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);
  const [voteType, setVoteType] = useQueryState("type", {
    defaultValue: "all",
    parse: (value) => value || "all",
    serialize: (value) => (value === "all" ? "" : value),
  });
  const [selectedContest, setSelectedContest] = useQueryState("contestId", {
    defaultValue: "",
    parse: (value) => value || "",
    serialize: (value) => value || "",
  });
  const handleBulkDelete = () => {
    setShowBulkDeletePopup(true);
  };

  const handleConfirmBulkDelete = () => {
    // TODO: Implement bulk delete functionality
    console.log("Bulk delete votes:", allSelectedVoteIds);
    setShowBulkDeletePopup(false);
    resetSelection();
  };

  const handleExportSelected = () => {
    // TODO: Implement export selected functionality
    console.log("Export selected votes:", selectedVotes);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <ContestCombobox
          value={selectedContest}
          onValueChange={setSelectedContest}
          placeholder="All contests"
          className="w-64 !h-8 text-xs"
          showFilters={true}
        />
        <Select value={voteType} onValueChange={setVoteType}>
          <SelectTrigger id="user-type-filter" className="w-28 !h-8 py-0 text-xs">
            <SelectValue placeholder="All types" className="py-0 h-7" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Votes
            </SelectItem>
            <SelectItem value="FREE" className="text-xs">
              Free Votes
            </SelectItem>
            <SelectItem value="PAID" className="text-xs">
              Paid Votes
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BulkDeleteVotesPopup isOpen={showBulkDeletePopup} onClose={() => setShowBulkDeletePopup(false)} onConfirm={handleConfirmBulkDelete} selectedCount={totalSelectedCount} />
    </>
  );
}
