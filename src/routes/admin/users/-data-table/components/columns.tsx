// ** Import 3rd Party Libs
import { format } from "date-fns";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// ** Import Components
import { DataTableColumnHeader } from "@/components/data-table/column-header";

// ** Import UI Components
import { Checkbox } from "@/components/ui/checkbox";

// ** Import Schema
import { UserCamelCase } from "../schema";

// ** Import Table Row Actions
import { DataTableRowActions } from "./row-actions";

export const getColumns = (handleRowDeselection: ((rowId: string) => void) | null | undefined, currentUserId?: string): ColumnDef<UserCamelCase>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<UserCamelCase>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => <div className="truncate text-left">{row.getValue("id")}</div>,
      size: 70,
      enableSorting: false,
    },
    {
      accessorKey: "image",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Image" />,
      cell: ({ row }) => (
        <div className="font-medium truncate text-left w-10 h-10 rounded-full flex items-center justify-center">
          <Avatar className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <AvatarImage src={row.getValue("image")} className="object-cover object-center w-full h-full " />
            <AvatarFallback className="capitalize">{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      ),
      size: 50,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
      cell: ({ row }) => {
        const isCurrentUser = currentUserId && row.original.id === currentUserId;
        return (
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium truncate">{row.getValue("name")}</span>
            {isCurrentUser && <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">You</span>}
          </div>
        );
      },
      size: 200,
      enableSorting: false,
    },

    {
      accessorKey: "email",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2 truncate">
            <span className="truncate font-medium">{row.getValue("email")}</span>
          </div>
        );
      },
      size: 250,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
      cell: ({ row }) => {
        return (
          <div className="flex items-center truncate">
            <span className="truncate">{row.getValue("phone")}</span>
          </div>
        );
      },
      size: 150,
      enableHiding: true,
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const role = row.original.role;
        return (
          <div className="flex items-center truncate">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                role === "ADMIN" ? "bg-red-100 text-red-800" : role === "USER" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {role}
            </span>
          </div>
        );
      },
      size: 100,
      enableHiding: true,
    },
    {
      accessorKey: "emailVerified",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Email Verified" />,
      cell: ({ row }) => {
        const isVerified = row.original.emailVerified;
        return (
          <div className="flex items-center truncate">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {isVerified ? "Verified" : "Pending"}
            </span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "hasProfile",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Onboarding" />,
      cell: ({ row }) => {
        const hasProfile = row.original.hasProfile;
        return (
          <div className="flex items-center truncate">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${hasProfile ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
              {hasProfile ? "Completed" : "Pending"}
            </span>
          </div>
        );
      },
      size: 120,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        // Format date as "MMM d, yyyy" (e.g., "Mar 16, 2025")
        const formattedDate = format(date, "MMM d, yyyy");
        return <div className="max-w-full text-left truncate">{formattedDate}</div>;
      },
      size: 120,
    },
    {
      id: "actions",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 100,
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
