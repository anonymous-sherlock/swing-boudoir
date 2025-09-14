// ** Import 3rd Party Libs
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// ** Import Components
import { DataTableColumnHeader } from "@/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// ** Import Schema
import { PaymentData } from "../schema";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CreditCard, Calendar, Trophy, User, DollarSign, CheckCircle, AlertCircle, Clock, MoreHorizontal, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/image-helper";

export const getColumns = (handleRowDeselection: ((rowId: string) => void) | null | undefined, currentUserId?: string): ColumnDef<PaymentData>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<PaymentData>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment ID" />,
      cell: ({ row }) => <div className="truncate text-left font-mono text-sm">{row.original.id.slice(0, 8)}...</div>,
      size: 100,
      enableSorting: false,
    },
    {
      accessorKey: "model",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      cell: ({ row }) => {
        const model = row.original.model;
        const optimizedImage = getImageUrl(model.user.image || "", "avatar");
        return (
          <Link to="/admin/profiles/$id" params={{ id: model.id }} className="flex items-center space-x-3 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
              <AvatarImage src={optimizedImage} alt={model.user.name || ""} className="object-cover object-center w-full h-full flex-shrink-0" />
              <AvatarFallback className="text-xs flex-shrink-0">{model.user.name?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{model.user.name || "Unknown"}</p>
              {model.user.username && (
                <p className="text-sm text-muted-foreground truncate">@{model.user.username}</p>
              )}
            </div>
          </Link>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "payer",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payer" />,
      cell: ({ row }) => {
        const payer = row.original.payer;
        return (
          <Link to="/admin/profiles/$id" params={{ id: payer.id }} className="flex items-center space-x-3 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
              <AvatarFallback className="text-xs flex-shrink-0">{payer.user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{payer.user.name}</p>
              <p className="text-sm text-muted-foreground truncate">ID: {payer.id.slice(0, 8)}...</p>
            </div>
          </Link>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" />,
      cell: ({ row }) => {
        const amount = row.original.amount;
        return (
          <div className="flex items-center truncate">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="font-medium">{amount.toFixed(2)}</span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.original.status;
        const getStatusConfig = (status: string) => {
          switch (status) {
            case "COMPLETED":
              return {
                className: "bg-green-100 text-green-800 hover:bg-green-100",
                icon: <CheckCircle className="h-3 w-3 mr-1" />,
                label: "Completed"
              };
            case "PENDING":
              return {
                className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                icon: <Clock className="h-3 w-3 mr-1" />,
                label: "Pending"
              };
            case "FAILED":
              return {
                className: "bg-red-100 text-red-800 hover:bg-red-100",
                icon: <AlertCircle className="h-3 w-3 mr-1" />,
                label: "Failed"
              };
            default:
              return {
                className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
                icon: null,
                label: status
              };
          }
        };
        const config = getStatusConfig(status);
        return (
          <div className="flex items-center truncate">
            <Badge className={config.className}>
              {config.icon}
              {config.label}
            </Badge>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },

    {
      accessorKey: "contest",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contest" />,
      cell: ({ row }) => {
        const contest = row.original.contest;
        if (!contest) {
          return (
            <div className="flex items-center space-x-2 truncate">
              <span className="text-sm text-muted-foreground">No contest</span>
            </div>
          );
        }
        
        return (
          <div className="flex items-center space-x-2 truncate">
            <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="text-sm truncate">{contest.name}</span>
          </div>
        );
      },
      size: 180,
      enableSorting: false,
    },
    {
      accessorKey: "voteCount",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vote Count" />,
      cell: ({ row }) => {
        const voteCount = row.original.voteCount;
        return (
          <div className="flex items-center space-x-2 truncate">
            <span className="text-sm font-medium">
              {voteCount || 0} {voteCount === 1 ? "vote" : "votes"}
            </span>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: "stripeSessionId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Stripe Session" />,
      cell: ({ row }) => {
        const sessionId = row.original.stripeSessionId;
        return (
          <div className="flex items-center space-x-2 truncate">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">{sessionId.slice(0, 12)}...</span>
          </div>
        );
      },
      size: 150,
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        const formattedDate = format(date, "MMM d, yyyy 'at' h:mm a");
        return (
          <div className="flex items-center space-x-2 truncate">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
      },
      size: 150,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const payment = row.original;
        
        const copyStripeSessionId = async () => {
          try {
            await navigator.clipboard.writeText(payment.stripeSessionId);
            toast.success("Stripe Session ID copied to clipboard");
            console.log("Stripe Session ID copied to clipboard");
          } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy Stripe Session ID");
          }
        };

        const copyPayerId = async () => {
          try {
            await navigator.clipboard.writeText(payment.payer.id);
            toast.success("Payer ID copied to clipboard");
            console.log("Payer ID copied to clipboard");
          } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy Payer ID");
          }
        };

        return (
          <div className="flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyStripeSessionId}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Stripe Session ID
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyPayerId}>
                  <User className="mr-2 h-4 w-4" />
                  Copy Payer ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 80,
      enableSorting: false,
      enableHiding: false,
    },
  ];

  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="pl-2 truncate">
            <Checkbox
              checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
