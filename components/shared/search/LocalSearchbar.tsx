"use client"
import Image from "next/image";
import {Input} from "@/components/ui/input";

interface CustumInputProps {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses: string
}

const LocalSearchbar = ({route, iconPosition, imgSrc, placeholder, otherClasses}: CustumInputProps) => {
    return (
        <div
            className={`background-light800_darkgradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
        >
            {iconPosition === "left" && <Image
                src={imgSrc}
                alt="search"
                width={24}
                height={24}
                className="cursor-pointer"
            />}
            <Input
                type="text"
                placeholder={placeholder}
                className="paragraph-regular no-focus placeholder
                background-light800_darkgradient border-none shadow-none outline-none
                "
                value=""
                onChange={() => {
                }}
            />
            {iconPosition === "right" && <Image
                src={imgSrc}
                alt="search"
                width={24}
                height={24}
                className="cursor-pointer"
            />}
        </div>
    )
}

export default LocalSearchbar