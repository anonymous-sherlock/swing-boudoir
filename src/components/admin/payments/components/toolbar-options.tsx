"use client";

import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface ToolbarOptionsProps {
  selectedPayments: Array<{
    id: string;
    amount: number;
  }>;
  allSelectedPaymentIds: string[];
  totalSelectedCount: number;
  resetSelection: () => void;
}

export function ToolbarOptions({
  selectedPayments,
  allSelectedPaymentIds,
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) {
  const totalAmount = selectedPayments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {totalSelectedCount} payment{totalSelectedCount !== 1 ? "s" : ""} selected
      </span>
      
      {totalSelectedCount > 0 && (
        <>
          <span className="text-sm text-muted-foreground">
            Total: ${totalAmount.toFixed(2)}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement export functionality
              console.log("Export selected payments:", allSelectedPaymentIds);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // TODO: Implement bulk delete functionality
              console.log("Delete selected payments:", allSelectedPaymentIds);
              resetSelection();
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
}
