import Image from "next/image"
import Link from "next/link";

interface MetricProps {
    imgUrl: string
    title: string
    value: string | number
    alt: string
    href?: string
    textStyle?: string
    isAuthor?: boolean
}

const Metric = ({imgUrl, title, value, alt, href, textStyle, isAuthor}: MetricProps) => {
    const metricContent = (
        <>
            <Image
                src={imgUrl}
                alt={alt}
                width={20}
                height={20}
                className={`object-contain ${href ? 'rounded-full' : ''}`}
            />
            <p>
                {value}
                <span
                    className={`small-regular line-clamp-1 ${isAuthor ? 'max-sm:hidden' : ''}`}
                >
                          {title}
                 </span>


            </p>

        </>

    )
    if (href) {
        return (
            <Link
                href={href}
                className="flex-center gap-1"
            >
                {metricContent}
            </Link>
        )
    }
    return (
        <div className="flex-center flex-wrap gap-1.5">
            {metricContent}
        </div>
    )
}

export default Metric