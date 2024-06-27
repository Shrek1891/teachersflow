"use client"

import Image from "next/image";
import {deleteQuestion} from "@/lib/actions/question.action";
import {usePathname, useRouter} from "next/navigation";
import {deleteAnswer} from "@/lib/actions/answer.action";

interface Props {
    type: string
    itemId: string
}

const EditDeleteAction = ({type, itemId}: Props) => {
    const pathname = usePathname()
    const router = useRouter()


    const handleEdit = () => {
        router.push(`/question/edit/${JSON.parse(itemId)}`)
    }

    const handleDelete = async () => {

        if (type === "question") {
            await deleteQuestion({questionId: JSON.parse(itemId), path: pathname})
        } else if (type === "answer") {
            await deleteAnswer({answerId: JSON.parse(itemId), path: pathname})

            router.refresh()
        }
    }
    return (
        <div className="flex items-center justify-end gap-3 max-sm:w-full">
            {
                type === "question" && (
                    <Image
                        src="/assets/icons/edit.png"
                        alt="edit"
                        height={14}
                        width={14}
                        className="cursor-pointer object-contain"
                        onClick={handleEdit}
                    />
                )
            }
            <Image
                src="/assets/icons/trash.png"
                alt="delete"
                height={14}
                width={14}
                className="cursor-pointer object-contain"
                onClick={handleDelete}
            />

        </div>
    )
}

export default EditDeleteAction


