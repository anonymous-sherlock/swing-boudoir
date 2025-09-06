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
import { RankData } from "../schema";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Crown, Calendar, Trophy, User, Heart } from "lucide-react";

// ** Import Table Row Actions
import { DataTableRowActions } from "./row-actions";

export const getColumns = (handleRowDeselection: ((rowId: string) => void) | null | undefined, currentUserId?: string): ColumnDef<RankData>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<RankData>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <div className="truncate text-left">{row.getValue("id")}</div>,
      size: 70,
      enableSorting: false,
    },
    {
      accessorKey: "rank",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Rank" />,
      cell: ({ row }) => {
        const rank = row.getValue("rank") as number | "N/A";
        const isManualRank = row.original.isManualRank;
        
        return (
          <div className="flex items-center gap-2">
            {rank === "N/A" ? (
              <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                N/A
              </Badge>
            ) : (
              <Badge 
                variant={isManualRank ? "default" : "outline"}
                className={isManualRank ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-blue-100 text-blue-800 border-blue-200"}
              >
                <Trophy className="h-3 w-3 mr-1" />
                #{rank}
                {isManualRank && <span className="ml-1 text-xs">(Manual)</span>}
              </Badge>
            )}
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "profile",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Model" />,
      cell: ({ row }) => {
        const profile = row.original.profile;
        return (
          <Link to="/admin/profiles/$id" params={{ id: profile.id }} className="flex items-center space-x-3 truncate hover:bg-gray-50 p-1 rounded transition-colors">
            <Avatar className="h-8 w-8 bg-gray-200 flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
              <AvatarImage src={profile.image} alt={profile.name} className="object-cover object-center w-full h-full flex-shrink-0" />
              <AvatarFallback className="text-xs flex-shrink-0">{profile.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{profile.name}</p>
              <p className="text-sm text-muted-foreground truncate">@{profile.username}</p>
            </div>
          </Link>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "profile.bio",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Bio" />,
      cell: ({ row }) => {
        const bio = row.original.profile.bio;
        return (
          <div className="flex items-center truncate">
            {bio ? (
              <p className="text-sm text-muted-foreground max-w-[200px] truncate" title={bio}>
                {bio}
              </p>
            ) : (
              <span className="text-sm text-muted-foreground">No bio</span>
            )}
          </div>
        );
      },
      size: 200,
      enableSorting: false,
    },
    {
      accessorKey: "stats",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Votes" />,
      cell: ({ row }) => {
        const stats = row.original.stats;
        const totalVotes = stats.freeVotes + stats.paidVotes;
        return (
          <div className="flex items-center space-x-2 truncate">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                <Heart className="h-3 w-3 mr-1" />
                {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
              </Badge>
            </div>
            <div className="flex flex-col text-xs text-muted-foreground">
              <span>Free: {stats.freeVotes}</span>
              <span>Paid: {stats.paidVotes}</span>
            </div>
          </div>
        );
      },
      size: 150,
      enableSorting: false,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Updated At" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        const formattedDate = format(date, "MMM d, yyyy hh:mm a");
        return (
          <div className="flex items-center space-x-2 truncate">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formattedDate}</span>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
    },
    {
      id: "actions",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 20,
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
