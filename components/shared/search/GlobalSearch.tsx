import Image from "next/image";
import {Input} from "@/components/ui/input";

const GlobalSearch = () => {
    return (
        <div className="relative w-full max-w-[600px] max-lg:hidden">
            <div
                className="background-light800_darkgradient relative flex
                     min-h-[56px] grow items-center gap-1 rounded-x1 px-4"
            >
                <Image src="/assets/icons/search.png" alt="search"
                       width={24}
                       height={24}
                       className="cursor-pointer"
                />
                <Input
                    placeholder="Search..."
                    className="paragraph-regular no-focus placeholder
                         border-none shadow-none outline-none
                        background-light800_darkgradient
                    "
                    type="text"
                    name="search"
                    id="search"
                />

            </div>

        </div>
    )
}

export default GlobalSearch