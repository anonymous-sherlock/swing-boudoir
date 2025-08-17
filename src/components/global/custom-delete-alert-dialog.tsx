import { useModal } from "@/providers/modal-provider";
import { CircleAlertIcon, Loader } from "lucide-react";

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CustomAlertDailogProps {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  isDefaultOpen?: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  actionText: string;
}
export const CustomDeleteAlertDailog = ({ title, description, isDefaultOpen, isDeleting, onDelete, actionText }: CustomAlertDailogProps) => {
  const { isOpen, setClose, setOpen } = useModal();

  function handleClick() {
    setClose();
    onDelete();
  }
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent autoFocus={isOpen}>
        <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel color="danger" onClick={() => setClose()}>
            Cancel
          </AlertDialogCancel>
          <Button variant="destructive" onClick={handleClick} disabled={isDeleting}>
            {isDeleting ? <Loader className="w-4 h-4 mr-2 animate-spin" /> : actionText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
