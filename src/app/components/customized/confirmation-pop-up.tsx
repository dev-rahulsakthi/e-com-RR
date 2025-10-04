'use client';
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/app/components/ui/dialog';
import { Button } from '@/src/app/components/ui/button';

interface ConfirmationProps {
  open: boolean;
  tittle: string;
  onYes: () => void;
  onNo: () => void;
  disabled?: boolean;
  name?: string;
}

export default function ConfirmationPopup(props: ConfirmationProps) {
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      props.onNo();
    }
  };

  const handleNo = () => {
    setOpen(false);
    props.onNo();
  };

  const handleYes = () => {
    props.onYes();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {props.tittle}
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className="flex justify-end space-x-2 sm:justify-end">
          <Button
            variant="outline"
            onClick={handleNo}
            type="button"
          >
            No
          </Button>
          <Button
            disabled={props?.disabled}
            onClick={handleYes}
            type="button"
          >
            {props.name?.trim() || "Yes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}