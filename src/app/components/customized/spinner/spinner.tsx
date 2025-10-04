import { cn } from "@/src/app/ui/lib/utils";
import React from "react";
const SpinnerCircle4 = () => (
  <div className="w-full flex justify-center">
    <div className="w-10 h-10 border-[4px] border-primary/15 border-t-primary border-b-primary rounded-full animate-spin" />
    {/* <div className="flex mt-2">Fetching...Please wait...</div> */}
  </div>
);
export default SpinnerCircle4;

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  className,
  size = 48,
  ...props
}: ISVGProps) => {
  return (
    <svg
      height={size}
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={cn("animate-spin", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};
