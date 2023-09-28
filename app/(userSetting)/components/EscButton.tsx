"use client"

import { XButtonSVG } from "@/components/SVG";
import { useState } from "react";
import Link from "next/dist/client/link";

const ESCButton = () => {
    const [isHovered, setHovered] = useState(false);

    return (
        <Link href="/">
            <div className="group mt-[4rem]"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div className="closeButton-PCZcma border-zinc-400 group-hover:border-zinc-300 transition">
                    <XButtonSVG hovered={isHovered} />
                </div>
                <p className="text-center text-bold text-sm mt-2 text-zinc-400 group-hover:text-zinc-300 transition">ESC</p>
            </div>
        </Link>
    )
}

export default ESCButton