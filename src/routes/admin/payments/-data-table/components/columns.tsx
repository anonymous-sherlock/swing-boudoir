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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
              {model.user.username && <p className="text-sm text-muted-foreground truncate">@{model.user.username}</p>}
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
      enableSorting: false,
    },
    {
      accessorKey: "provider",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Provider" />,
      cell: ({ row }) => {
        const provider = row.original.provider;
        if (provider === "PAYPAL") {
          return (
            <Badge variant="outline" className="flex w-fit items-center gap-1 border-blue-200 bg-blue-50 text-[#022B87] hover:bg-blue-50 hover:text-blue-700">
              <svg
                className="size-4 p-[2px]"
                width="24px"
                height="24px"
                viewBox="-3.5 0 48 48"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <defs></defs>
                <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Color-" transform="translate(-804.000000, -660.000000)" fill="#022B87">
                    <path
                      d="M838.91167,663.619443 C836.67088,661.085983 832.621734,660 827.440097,660 L812.404732,660 C811.344818,660 810.443663,660.764988 810.277343,661.801472 L804.016136,701.193856 C803.892151,701.970844 804.498465,702.674333 805.292267,702.674333 L814.574458,702.674333 L816.905967,688.004562 L816.833391,688.463555 C816.999712,687.427071 817.894818,686.662083 818.95322,686.662083 L823.363735,686.662083 C832.030541,686.662083 838.814901,683.170138 840.797138,673.069296 C840.856106,672.7693 840.951363,672.194809 840.951363,672.194809 C841.513828,668.456868 840.946827,665.920407 838.91167,663.619443 Z M843.301017,674.10803 C841.144899,684.052874 834.27133,689.316292 823.363735,689.316292 L819.408334,689.316292 L816.458414,708 L822.873846,708 C823.800704,708 824.588458,707.33101 824.733611,706.423525 L824.809211,706.027531 L826.284927,696.754676 L826.380183,696.243184 C826.523823,695.335698 827.313089,694.666708 828.238435,694.666708 L829.410238,694.666708 C836.989913,694.666708 842.92604,691.611256 844.660308,682.776394 C845.35583,679.23045 845.021677,676.257496 843.301017,674.10803 Z"
                      id="Paypal"
                    ></path>
                  </g>
                </g>
              </svg>
              PayPal
            </Badge>
          );
        }
        return (
          <Badge variant="outline" className="flex w-fit items-center gap-1 border-[#635BFF]/20 bg-[#635BFF]/10 text-[#635BFF] hover:bg-[#635BFF]/10 hover:text-[#635BFF]">
            <img src="/stripe_icon.svg" alt="Stripe Logo" className="size-4 p-[2px] object-contain" />
            Stripe
          </Badge>
        );
      },
      size: 130,
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
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
                label: "Completed",
              };
            case "PENDING":
              return {
                className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
                icon: <Clock className="h-3 w-3 mr-1" />,
                label: "Pending",
              };
            case "FAILED":
              return {
                className: "bg-red-100 text-red-800 hover:bg-red-100",
                icon: <AlertCircle className="h-3 w-3 mr-1" />,
                label: "Failed",
              };
            default:
              return {
                className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
                icon: null,
                label: status,
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
      accessorKey: "sessionId",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Session/Order ID" />,
      cell: ({ row }) => {
        const sessionId = row.original.stripeSessionId ?? row.original.paypalOrderId ?? "N/A";
        return (
          <div className="flex items-center space-x-2 truncate">
            <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
        const sessionId = payment.stripeSessionId ?? payment.paypalOrderId;

        const copyStripeSessionId = async () => {
          try {
            if (!sessionId) {
              toast.error("No Session or Order ID found");
              return;
            }
            await navigator.clipboard.writeText(sessionId);
            toast.success("Session or Order ID copied to clipboard");
            console.log("Session or Order ID copied to clipboard");
          } catch (err) {
            console.error("Failed to copy: ", err);
            toast.error("Failed to copy Session or Order ID");
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
