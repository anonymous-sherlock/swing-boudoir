import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row, Table } from "@tanstack/react-table";
import { User, UserCheck, Vote, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate } from "@tanstack/react-router";
import { UserCamelCase } from "../schema";
import { ChangeUserStatusDialog } from "./change-user-status-dialog";
import { ChangeUserTypeDialog } from "./change-user-type-dialog";
import { DeleteUserPopup } from "../actions/delete-user-popup";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  table: Table<TData>;
}

export function DataTableRowActions<TData extends UserCamelCase>({ row }: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const [changeTypeDialog, setChangeTypeDialog] = useState<{
    isOpen: boolean;
    newType: "MODEL" | "VOTER";
  } | null>(null);
  const [changeStatusDialog, setChangeStatusDialog] = useState<{
    isOpen: boolean;
    newStatus: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteUserPopupOpen, setIsDeleteUserPopupOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleChangeType = (newType: "MODEL" | "VOTER") => {
    setChangeTypeDialog({ isOpen: true, newType });
  };

  const closeChangeTypeDialog = () => {
    setChangeTypeDialog(null);
  };

  const handleChangeStatus = (newStatus: boolean) => {
    setChangeStatusDialog({ isOpen: true, newStatus });
  };

  const closeChangeStatusDialog = () => {
    setChangeStatusDialog(null);
  };

  const user = row.original;
  const currentType = user.type;
  
  // Common disabled state for all actions when any operation is in progress
  // This prevents users from triggering multiple actions simultaneously
  const isAnyActionLoading = isLoading || isDeleteLoading;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted" disabled={isAnyActionLoading}>
            {isAnyActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DotsHorizontalIcon className="h-4 w-4" />}
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[250px]">
          <DropdownMenuItem onClick={() => navigate({ to: "/profile/$username", params: { username: row.original.username } })} disabled={isAnyActionLoading}>
            <User className="mr-2 h-4 w-4" />
            View Public Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate({ to: "/admin/profiles/$id", params: { id: row.original.profile.id ?? "" } })} disabled={isAnyActionLoading}>
            <UserCheck className="mr-2 h-4 w-4" />
            View Profile Details
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Status Submenu */}
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CheckCircle className="mr-2 h-4 w-4" />
              Status: {user.isActive ? "Active" : "Inactive"}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={user.isActive}
                onClick={() => handleChangeStatus(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Active
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={!user.isActive}
                onClick={() => handleChangeStatus(false)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Inactive
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub> */}

          {/* Role Submenu */}
          {/* <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield className="mr-2 h-4 w-4" />
              Role: {user.role}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem
                checked={user.role === "USER"}
                onClick={() => console.log("Change role to USER for", user.id)}
              >
                <User className="mr-2 h-4 w-4" />
                User
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={user.role === "MODERATOR"}
                onClick={() => console.log("Change role to MODERATOR for", user.id)}
              >
                <Shield className="mr-2 h-4 w-4" />
                Moderator
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={user.role === "ADMIN"}
                onClick={() => console.log("Change role to ADMIN for", user.id)}
              >
                <Crown className="mr-2 h-4 w-4" />
                Admin
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator /> */}

          {/* User Type Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={isAnyActionLoading}>
              <Vote className="mr-2 h-4 w-4" />
              Type: {currentType === "MODEL" ? "Model" : "Voter"}
              {isAnyActionLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuCheckboxItem checked={currentType === "MODEL"} onClick={() => handleChangeType("MODEL")} className="text-purple-600" disabled={isLoading}>
                <User className="mr-2 h-4 w-4" />
                Model
                {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={currentType === "VOTER"} onClick={() => handleChangeType("VOTER")} className="text-yellow-600" disabled={isLoading}>
                <Vote className="mr-2 h-4 w-4" />
                Voter
                {isLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
              </DropdownMenuCheckboxItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" disabled={isAnyActionLoading} onClick={() => setIsDeleteUserPopupOpen(true)}>
            <XCircle className="mr-2 h-4 w-4" />
            Delete
            {isDeleteLoading && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Change User Type Dialog */}
      {changeTypeDialog && (
        <ChangeUserTypeDialog user={user} isOpen={changeTypeDialog.isOpen} onClose={closeChangeTypeDialog} newType={changeTypeDialog.newType} onLoadingChange={setIsLoading} />
      )}

      {/* Change User Status Dialog */}
      {changeStatusDialog && (
        <ChangeUserStatusDialog
          user={user}
          isOpen={changeStatusDialog.isOpen}
          onClose={closeChangeStatusDialog}
          newStatus={changeStatusDialog.newStatus}
          onLoadingChange={setIsLoading}
        />
      )}

      <DeleteUserPopup
        open={isDeleteUserPopupOpen}
        onOpenChange={setIsDeleteUserPopupOpen}
        userId={row.original.id}
        userName={row.original.username}
        resetSelection={() => {
          console.log("Reset selection");
        }}
        onLoadingChange={setIsDeleteLoading}
      />
    </>
  );
}
