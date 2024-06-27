'use client'
import Image from "next/image";
import {formatNumber} from "@/lib/utils";
import {downvoteQuestion, upvoteQuestion} from "@/lib/actions/question.action";
import {usePathname, useRouter} from "next/navigation";
import {downvoteAnswer, upvoteAnswer} from "@/lib/actions/answer.action";
import {toggleSaveQuestion} from "@/lib/actions/user.action";
import {useEffect} from "react";
import {viewQuestion} from "@/lib/actions/interaction,action";
import {toast} from "@/components/ui/use-toast";

interface Props {
    type: string;
    itemId: string;
    userId: string;
    hasupVoted: boolean;
    downvotes: number;
    hasSaved?: boolean;
    upvotes: number;
    hasdownvoted: boolean;
}


const Votes = ({
                   type,
                   itemId,
                   userId,
                   hasupVoted,
                   downvotes,
                   hasSaved,
                   upvotes,
                   hasdownvoted
               }: Props) => {
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        viewQuestion({
            questionId: JSON.parse(itemId),
            userId: userId ? JSON.parse(userId) : undefined,
        })
    }, [itemId, userId, pathname, router])

    const handleVote = async (action: string) => {
        if (!userId) {
            return toast({
                title: "Login required",
                description: "Please login to vote",
            })
        }
        if (action === "upvote") {
            if (type === "Question") {
                await upvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted: hasdownvoted,
                    path: pathname,
                })
            } else if (type === "Answer") {
                await upvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted: hasdownvoted,
                    path: pathname,
                })
        return toast({
                    title:`Upvote ${!hasupVoted ? "added" : "removed"}`,
                    variant: !hasupVoted ? "default" : "destructive",
                })
            }
        }
        if (action === "downvote") {
            if (type === "Question") {
                await downvoteQuestion({
                    questionId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted: hasdownvoted,
                    path: pathname,
                })
            } else if (type === "Answer") {
                await downvoteAnswer({
                    answerId: JSON.parse(itemId),
                    userId: JSON.parse(userId),
                    hasupVoted,
                    hasdownVoted: hasdownvoted,
                    path: pathname,
                })
            }
            return toast({
                title:`Downvote ${!hasupVoted ? "added" : "removed"}`,
                variant: !hasupVoted ? "default" : "destructive",
            })
        }
    }

    const handleSave = async () => {
        await toggleSaveQuestion({
            questionId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
        })
        return toast({
            title:`${!hasSaved ? "Saved" : "Unsaved"}`,
            variant: !hasSaved ? "default" : "destructive",
        })
    }
    return (
        <div
            className="flex gap-5">
            <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                    <Image src={hasupVoted ? "/assets/icons/upvoid-fill.png" : "/assets/icons/upvoid.png"}
                           alt="upvote"
                           width={18}
                           height={18}
                           className="cursor-pointer"
                           onClick={() => handleVote("upvote")}
                    />
                    <div
                        className="flex-center background-light700_dark400
                    min-w-[18px]
                    rounded-sm p-1
                    "
                    >
                        <p
                            className="subtle-medium text-dark400_light900"
                        >
                            {formatNumber(+upvotes)}
                        </p>
                    </div>
                </div>
                <div className="flex-center gap-1.5">
                    <Image src={hasdownvoted ? "/assets/icons/downvoite-fill.png" : "/assets/icons/downvoite.png"}
                           alt="hasdownVoted"
                           width={18}
                           height={18}
                           className="cursor-pointer"
                           onClick={() => handleVote("downvote")}
                    />
                    <div
                        className="flex-center background-light700_dark400
                    min-w-[18px]
                    rounded-sm p-1
                    "
                    >
                        <p
                            className="subtle-medium text-dark400_light900"
                        >
                            {formatNumber(+downvotes)}
                        </p>
                    </div>
                </div>
            </div>
            {type === "Question" && <Image src={hasSaved ? "/assets/icons/save-fill.gif" : "/assets/icons/save.gif"}
                                           alt="hasdownVoted"
                                           width={18}
                                           height={18}
                                           className="cursor-pointer"
                                           onClick={() => handleSave()}
            />}
        </div>
    )
}

export default Votes