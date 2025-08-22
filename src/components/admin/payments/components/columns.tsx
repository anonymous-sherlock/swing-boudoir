import { ColumnDef } from "@tanstack/react-table";
import { PaymentCamelCase } from "../schema";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/data-table/column-header";

export function getColumns(handleRowDeselection?: ((rowId: string) => void) | null | undefined): ColumnDef<PaymentCamelCase, unknown>[] {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment ID" />,
      cell: ({ row }) => {
        const id = row.getValue("id") as string;
        return <div className="font-mono text-sm">{id.slice(0, 8)}...</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "payer",
      accessorFn: (data) => data.payer.user.name,
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payer" />,
      cell: ({ row }) => {
        const payerName = row.getValue("payer") as string;
        return <div className="text-sm font-medium">{payerName}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        return <div className="text-sm font-medium">${amount.toFixed(2)}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const getStatusColor = (status: string) => {
          switch (status) {
            case "COMPLETED":
              return "bg-green-100 text-green-800 hover:bg-green-100";
            case "PENDING":
              return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
            case "FAILED":
              return "bg-red-100 text-red-800 hover:bg-red-100";
            default:
              return "bg-gray-100 text-gray-800 hover:bg-gray-100";
          }
        };
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "votes",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Votes" />,
      cell: ({ row }) => {
        const votes = row.getValue("votes") as PaymentCamelCase["votes"];
        const paidVotes = votes.filter((vote) => vote.count).length;

        return (
          <div className="text-sm">
            <div>{votes.reduce((acc, vote) => acc + (vote.count || 0), 0)} Votes</div>  
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "contests",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contests" />,
      cell: ({ row }) => {
        const votes = row.getValue("votes") as PaymentCamelCase["votes"];
        const contests = [...new Set(votes.map((vote) => vote.contest.name))];

        return (
          <div className="text-sm">
            {contests.slice(0, 2).join(", ")}
            {contests.length > 2 && <span className="text-gray-500"> +{contests.length - 2} more</span>}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string;
        return <div className="text-sm">{format(new Date(date), "MMM dd, yyyy")}</div>;
      },
      enableSorting: true,
      enableHiding: true,
    },
  ];
}
