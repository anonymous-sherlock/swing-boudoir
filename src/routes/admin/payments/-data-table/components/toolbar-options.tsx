import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, Trash2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useState } from "react";
import { BulkDeletePaymentsPopup } from "../actions/bulk-delete-popup";

interface ToolbarOptionsProps {
  selectedPayments: Array<{
    id: string;
    payerName: string;
    amount: number;
  }>;
  allSelectedPaymentIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({ selectedPayments, allSelectedPaymentIds, totalSelectedCount, resetSelection }: ToolbarOptionsProps) {
  const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useQueryState("status", {
    defaultValue: "all",
    parse: (value) => value || "all",
    serialize: (value) => (value === "all" ? "" : value),
  });

  const handleBulkDelete = () => {
    setShowBulkDeletePopup(true);
  };

  const handleConfirmBulkDelete = () => {
    // TODO: Implement bulk delete functionality
    console.log("Bulk delete payments:", allSelectedPaymentIds);
    setShowBulkDeletePopup(false);
    resetSelection();
  };

  const handleExportSelected = () => {
    // TODO: Implement export selected functionality
    console.log("Export selected payments:", selectedPayments);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select value={paymentStatus} onValueChange={setPaymentStatus}>
          <SelectTrigger id="payment-status-filter" className="w-32 !h-8 py-0 text-xs">
            <SelectValue placeholder="All statuses" className="py-0 h-7" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">
              All Payments
            </SelectItem>
            <SelectItem value="COMPLETED" className="text-xs">
              Completed
            </SelectItem>
            <SelectItem value="PENDING" className="text-xs">
              Pending
            </SelectItem>
            <SelectItem value="FAILED" className="text-xs">
              Failed
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <BulkDeletePaymentsPopup isOpen={showBulkDeletePopup} onClose={() => setShowBulkDeletePopup(false)} onConfirm={handleConfirmBulkDelete} selectedCount={totalSelectedCount} />
    </>
  );
}
