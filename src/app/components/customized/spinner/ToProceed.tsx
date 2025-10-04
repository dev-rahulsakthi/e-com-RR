"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/app/components/ui/dialog";
import progressImage from "@/src/app/assets/images/gif/progress.gif";
import Image from "next/image";

interface ToProceedProps {
  title: string;
  description?: string;
  message?: string;
}

export default function ToProceed(props: ToProceedProps): React.ReactElement {
  const { title, description, message } = props;
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogContent
            className="sm:max-w-[425px]"
            aria-description="To Proceed Dialog"
          >
            <div className="bg-white p-4 mt-2">
              <DialogTitle className="text-base text-center font-semibold text-gray-900">
                {title}
                <div className="flex justify-center items-center">
                  <Image
                    src={progressImage}
                    alt="Loading..."
                    className="mt-[20%] "
                    unoptimized
                  />
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                {description}
              </DialogDescription>
            </div>
          </DialogContent>
        </div>
      </div>
    </Dialog>
  );
}
