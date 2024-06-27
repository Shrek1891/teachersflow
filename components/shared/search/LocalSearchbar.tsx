"use client"
import Image from "next/image";
import {Input} from "@/components/ui/input";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import {formUrlQuery, removeKeysFromQuery} from "@/lib/utils";

interface CustumInputProps {
    route: string,
    iconPosition: string,
    imgSrc: string,
    placeholder: string,
    otherClasses: string
}

const LocalSearchbar = ({route, iconPosition, imgSrc, placeholder, otherClasses}: CustumInputProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams()
    const query = searchParams?.get("q")
    const [search, setSearch] = useState(query || "")
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search) {
                const newUrl = formUrlQuery({
                    params: searchParams.toString(),
                    key: "q",
                    value: search,
                });

                router.push(newUrl, { scroll: false });
            } else {
                if (pathname === route) {
                    const newUrl = removeKeysFromQuery({
                        params: searchParams.toString(),
                        keysToRemove: ["q"],
                    });

                    router.push(newUrl, { scroll: false });
                }
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search, route, pathname, router, searchParams, query]);
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
                text-dark400_light700 border-none shadow-none outline-none bg-transparent
                "
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value)
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
