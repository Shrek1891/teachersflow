'use client'
import {Button} from "@/components/ui/button";
import {formUrlQuery} from "@/lib/utils";
import {useRouter, useSearchParams} from "next/navigation";

interface Props {
    pageNumber: number
    isNext: boolean | undefined
}

const Pagination = ({pageNumber, isNext}: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handleNavigation = (type: "prev" | "next") => {
        const nextPageNumber = type === "prev" ? pageNumber - 1 : pageNumber + 1;
        const value = nextPageNumber > 1 ? nextPageNumber.toString() : null;
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: 'page',
            value: value
        })
        router.push(newUrl)
    }
    if (!isNext && pageNumber === 1) return null;
    return (
        <div
            className="flex w-full items-center justify-center gap-4"
        >
            <Button
                disabled={isNext}
                onClick={() => handleNavigation('prev')}
                className="light-border-2 btn border flex min-h-[36px] items-center
                gap-2 justify-center "

            >
                <p
                    className="body-medium text-dark200_light800"
                >Prev Page</p>
            </Button>
            <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
                <p
                    className="body-semibold text-light-900"
                >{pageNumber}</p>
            </div>
            <Button
                disabled={isNext}
                onClick={() => handleNavigation('next')}
                className="light-border-2 btn border flex min-h-[36px] items-center
                gap-2 justify-center "

            >
                <p
                    className="body-medium text-dark200_light800"
                >Next Page</p>
            </Button>
        </div>
    )
}

export default Pagination