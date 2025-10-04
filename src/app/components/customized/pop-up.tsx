import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/app/components/ui/dialog";
import { Button } from "@/src/app/components/ui/button";
import { X } from "lucide-react";

interface PopupProps {
  open: boolean;
  title?: string;
  content: React.ReactNode;
  onConfirm: (value: boolean) => void;
  onClose: (value: boolean) => void;
  note?: string;
  showOKButton?: boolean;
  showNoButton?: boolean;
  confirmText?: string;
  noText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  width?: string; // Now properly implemented
}

export function Popup({
  open,
  title,
  content,
  onConfirm,
  onClose,
  note,
  showOKButton = false,
  showNoButton = false,
  confirmText = "Ok",
  noText = "No",
  isLoading = false,
  disabled = false,
  width = "auto", // Default value
}: PopupProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose(false);
    }
  };

  const handleConfirm = () => {
    onConfirm(true);
    onClose(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onConfirm(false);
    onClose(false);
    setIsOpen(false);
  };

  const handleCloseButton = () => {
    onClose(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-0 bg-background border shadow-lg [&>button]:hidden"
        style={{
          width: width,
          maxWidth: "90vw",
        }}
      >
        <DialogHeader className="flex flex-row items-center justify-between p-3 border-b">
          <DialogTitle className="text-base font-semibold m-0">
            {title}
          </DialogTitle>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCloseButton}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </DialogHeader>

        <div className="px-4 pb-4">
          {content}
        </div>

        {(note || showOKButton || showNoButton) && (
          <div
            className={`flex items-center p-2 border-t gap-3 ${
              note ? "justify-between" : "justify-end"
            }`}
          >
            {note && (
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{note}</p>
              </div>
            )}

            <div className="flex gap-2">
              {showNoButton && (
                <Button
                  onClick={handleCancel}
                  disabled={disabled || isLoading}
                  variant="outline"
                  size="sm"
                >
                  {noText}
                </Button>
              )}

              {showOKButton && (
                <Button
                  onClick={handleConfirm}
                  disabled={disabled || isLoading}
                  variant="default"
                  size="sm"
                >
                  {isLoading ? "Loading..." : confirmText}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}