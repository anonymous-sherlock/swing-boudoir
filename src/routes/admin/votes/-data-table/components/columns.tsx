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
import { VoteData } from "../schema";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Heart, Calendar, Trophy, User, DollarSign } from "lucide-react";
import { getImageUrl } from "@/lib/image-helper";

export const getColumns = (handleRowDeselection: ((rowId: string) => void) | null | undefined, currentUserId?: string): ColumnDef<VoteData>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<VoteData>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <div className="truncate text-left">{row.getValue("id")}</div>,
      size: 70,
      enableSorting: false,
    },
    {
      accessorKey: "voter",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Voter" />,
      cell: ({ row }) => {
        const voter = row.original.voter;
        return (
          <Link to="/admin/profiles/$id" params={{ id: voter.id }} className="flex items-center space-x-3 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden">
              <AvatarImage src={voter.profilePicture} alt={voter.name} className="object-cover object-center w-full h-full" />
              <AvatarFallback className="text-xs">{voter.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{voter.name}</p>
              <p className="text-sm text-muted-foreground truncate">@{voter.username}</p>
            </div>
          </Link>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "model",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      cell: ({ row }) => {
        const votee = row.original.votee;
        const optimizedImage = getImageUrl(votee.profilePicture, "avatar");

        return (
          <Link to="/admin/profiles/$id" params={{ id: votee.id }} className="flex items-center space-x-3 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
              <AvatarImage src={optimizedImage} alt={votee.name} className="object-cover object-center w-full h-full" />
              <AvatarFallback className="text-xs">{votee.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{votee.name}</p>
              <p className="text-sm text-muted-foreground truncate">@{votee.username}</p>
            </div>
          </Link>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "contest",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Contest" />,
      cell: ({ row }) => {
        const contest = row.original.contest;
        return (
          <Link to="/competitions/$slug" params={{ slug: contest.slug }} className="flex items-center space-x-2 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Trophy className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            <span className="font-medium truncate">{contest.name}</span>
          </Link>
        );
      },
      size: 180,
      enableSorting: false,
    },
    {
      accessorKey: "type",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Vote Type" />,
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <div className="flex items-center truncate">
            <Badge className={`${type === "PAID" ? "bg-green-100 text-green-800 hover:bg-green-100" : "bg-blue-100 text-blue-800 hover:bg-blue-100"}`}>
              <Heart className="h-3 w-3 mr-1" />
              {type === "PAID" ? "Paid Vote" : "Free Vote"}
            </Badge>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: "count",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Votes" />,
      cell: ({ row }) => {
        const count = row.original.count;
        return (
          <div className="flex items-center truncate">
            <Badge variant="secondary" className="text-sm">
              {count} {count === 1 ? "vote" : "votes"}
            </Badge>
          </div>
        );
      },
      size: 100,
    },
    {
      accessorKey: "payment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Payment" />,
      cell: ({ row }) => {
        const payment = row.original.payment;
        const type = row.original.type;

        if (type === "FREE") {
          return (
            <div className="flex items-center truncate">
              <span className="text-sm text-muted-foreground">N/A</span>
            </div>
          );
        }

        if (!payment) {
          return (
            <div className="flex items-center truncate">
              <span className="text-sm text-red-600">Failed</span>
            </div>
          );
        }

        return (
          <div className="flex items-center space-x-2 truncate">
            <div className="flex items-center space-x-2">
              <p className="font-medium">${payment.amount}</p>
              <p
                className={`text-xs ${payment.status === "COMPLETED" ? "bg-green-50 rounded-lg px-2 text-green-600" : payment.status === "pending" ? "text-yellow-600" : "text-red-600"}`}
              >
                {payment.status}
              </p>
            </div>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      accessorKey: "comment",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Comment" />,
      cell: ({ row }) => {
        const comment = row.original.comment;
        return (
          <div className="flex items-center truncate">
            {comment ? (
              <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={comment}>
                {comment}
              </p>
            ) : (
              <span className="text-sm text-muted-foreground">No comment</span>
            )}
          </div>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        const formattedDate = format(date, "MMM d, yyyy");
        return (
          <div className="flex items-center space-x-2 truncate">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
      },
      size: 120,
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
