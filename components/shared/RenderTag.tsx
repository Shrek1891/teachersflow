import Link from "next/link";
import {Badge} from "@/components/ui/badge";

interface Props {
    id: string
    title: string
    totalQuestions?: number
    showCount?: boolean
}

const RenderTag = ({id, title, totalQuestions, showCount}: Props) => {
    return (
        <Link href={`/tags/${id}`}
              className="flex justify-between gap-2">
            <Badge
                className="subtle-medium background-light800_dark300
                text-light400_light500 rounded-md border-none
                px-4 py-2 uppercase"
            >
                {title}
            </Badge>
            {showCount && <p className="small-medium text_dark500_light700">
                {totalQuestions}
            </p>}
        </Link>
    )
}

export default RenderTag