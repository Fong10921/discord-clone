import * as React from 'react';
import { cn } from "@/lib/utils";

const StatusIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGAttributes<SVGSVGElement> & { isLoading: boolean }
>(({ isLoading, ...props }, ref) => {
  const iconStyles = cn("w-6 h-6", isLoading ? "animate-spin" : "");

  // Replace the 'circle' and 'check' with your actual icons
  const icon = isLoading ? (
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className='bg-black' />
  ) : (
    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" />
  );

  return (
    <svg
      ref={ref}
      className={iconStyles}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {icon}
    </svg>
  );
});
StatusIcon.displayName = "StatusIcon";

export { StatusIcon };
