import * as React from "react";
import { cn } from "@/lib/utils";

interface LoadingModalProps {
  isLoading?: boolean;
  finish?: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isLoading, finish }) => {
  // Modal styles ensure it appears in the center of the screen.
  const modalStyles = cn(
    "fixed z-10 inset-0 overflow-y-auto flex items-center justify-center min-h-screen",
    "px-4 py-12",
    "bg-opacity-75 bg-gray-800" // Adjust background and opacity as needed
  );

  // Content styles for the inner content of the modal.
  const contentStyles = cn(
    "bg-white",
    "p-6",
    "rounded-lg",
    "shadow-xl",
    "text-center"
  );

  // Only render the modal when it is active.
  if (!isLoading) return null;

  return (
    <div className={modalStyles}>
      <div className={contentStyles}>
{/*         <StatusIcon isLoading={isLoading} /> */}
        {isLoading && (
          <div id="loader-wrapper">
            <div id="loader"></div>
          </div>
        )}
        {finish && (
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark__circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark__check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        )}

        <p className="text-black">{isLoading ? "Updating..." : "Finished"}</p>
      </div>
    </div>
  );
};

export { LoadingModal };
