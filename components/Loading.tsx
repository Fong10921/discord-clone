"use client";

import { cn } from "@/lib/utils";

interface LoadingProps {
  height?: string
}

const Loading: React.FC<LoadingProps> = ({
  height
}) => {
    return (
        <div className={cn(`loaderContainer bg-transparent h-[${height}]`)}>
            <div className="loader loaderdark "></div>
        </div>
    );
}

export default Loading;
