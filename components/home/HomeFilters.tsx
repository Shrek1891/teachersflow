"use client"
import {HomePageFilters} from "@/constants/filters";
import {Button} from "@/components/ui/button";
import {useRouter, useSearchParams} from "next/navigation";
import {useState} from "react";
import {formUrlQuery} from "@/lib/utils";

const HomeFilters = () => {
    const searchParams = useSearchParams()
    const router = useRouter();
    const [active, setActive] = useState("")
    const handleTypeClick = (item: string) => {
        let newUrl = "";

        if (active === item) {
            setActive("");

            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: null,
            });

            router.push(newUrl, {scroll: false});
        } else {
            setActive(item);

            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "filter",
                value: item.toLowerCase(),
            });
        }

        router.push(newUrl, {scroll: false});
    }


    return (
        <div className="mt-10 hidden flex-wrap gap-3  md:flex">
            {HomePageFilters.map((item) => (
                <Button
                    key={item.name}
                    onClick={() => {
                    }}
                    className={`body-medium wounded-lg px-6 py-3 capitalize 
                    shadow-none ${active === item.value ?
                        "bg-primary-100 text-primary-500 hover:bg-primary-200 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-300"
                        : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"}`}
                    onClickCapture={() => handleTypeClick(item.value)}
                >
                    {item.name}
                </Button>
            ))}

        </div>
    )
}

export default HomeFilters