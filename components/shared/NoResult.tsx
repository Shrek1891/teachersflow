import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";

interface Props {
    title: string,
    description: string,
    link: string,
    linkTitle: string
}

const NoResult = ({title, description,link, linkTitle}:Props) => {
    return (
        <div className="mt-10 flex w-fullflex-col items-center justify-center">
            <Image
                src="/assets/images/no-result-light.png"
                alt="no result"
                width={270}
                height={200}
                className="block object-contain "
            />
            <h2 className="h2-bold text-dark200_light900">{title}</h2>
            <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
                {description}
            </p>
            <Link href={link}>
                <Button
                    className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 text-light-900
                    hover:bg-primary-500 dark:bg-primary-500 dark:text-light-900"
                >
                    {linkTitle}
                </Button>
            </Link>
        </div>
    )
}

export default NoResult
