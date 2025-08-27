import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BackdropType = "opaque" | "blur" | "transparent" | "gradient";

export interface DialogProps extends React.ComponentProps<typeof DialogPrimitive.Root> {
  backdrop?: BackdropType;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  classNames?: {
    backdrop?: string;
    content?: string;
  };
}

const DialogContext = React.createContext<{
  backdrop: BackdropType;
  size: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
  classNames?: {
    backdrop?: string;
    content?: string;
  };
}>({
  backdrop: "gradient",
  size: "md",
});

function Dialog({ backdrop = "gradient", classNames, size = "md", ...props }: DialogProps) {
  return (
    <DialogContext.Provider value={{ backdrop, classNames, size }}>
      <DialogPrimitive.Root data-slot="dialog" {...props} />
    </DialogContext.Provider>
  );
}

function DialogTrigger({ ...props }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { backdrop, classNames } = React.useContext(DialogContext);

  const backdropStyles: Record<BackdropType, string> = {
    opaque: "bg-black/50",
    blur: "backdrop-blur-sm backdrop-saturate-150 bg-black/50",
    transparent: "bg-transparent",
    gradient: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
  };

  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "grid place-items-center py-6 px-4 overflow-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        backdropStyles[backdrop],
        "w-screen h-screen fixed inset-0",
        className,
        classNames?.backdrop
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  const { classNames, size } = React.useContext(DialogContext);

  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay>
        <DialogPrimitive.Content
          ref={ref}
          data-slot="dialog-content"
          className={cn(
            "bg-background relative data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            size === "sm" && "max-w-sm",
            size === "md" && "max-w-md",
            size === "lg" && "max-w-lg",
            size === "xl" && "max-w-xl",
            size === "2xl" && "max-w-2xl",
            size === "3xl" && "max-w-3xl",
            size === "4xl" && "max-w-4xl",
            size === "5xl" && "max-w-5xl",
            size === "full" && "max-w-full",
            className,
            classNames?.content
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="hover:bg-gray-300/30 p-1 rounded-full ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-2 right-2 opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogOverlay>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-2 text-center sm:text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-lg leading-none font-semibold", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={cn("text-muted-foreground text-sm", className)} {...props} />;
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
