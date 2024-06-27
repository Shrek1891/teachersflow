import Filter from "@/components/shared/Filter";
import {AnswerFilters} from "@/constants/filters";
import {getAnswers} from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import {getTimeStamp} from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import Votes from "@/components/shared/Votes";
import Pagination from "@/components/shared/Pagination";

interface Props {
    questionId: string
    authorId: string
    totalAnswers: number
    page?: number | string
    filter?: string
    userId: string
}

const AllAnswers = async ({questionId, authorId, totalAnswers, page, filter, userId}: Props) => {
    const result = await getAnswers({
        questionId,
        page: page ? +page : 1,
        sortBy: filter

    })
    return (
        <div className="mt-11">
            <div
                className="flex justify-between items-center"
            >
                <h3
                    className="primary-text-gradient"
                >{totalAnswers} Answers</h3>

                <Filter filters={AnswerFilters}/>
            </div>
            <div>
                {result.answers.map((answer) => (
                    <article
                        className="light-gradient border-b py-10"
                        key={answer._id}>

                        <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row
                            sm:items-center sm:gap-2
                            ">
                            <Link
                                className="flex flex-1 items-start gap-1  sm:items-center"
                                href={`/profile/${answer.author.clerkId}`}
                            >

                                <Image
                                    src={answer.author.picture}
                                    alt={answer.author.name}
                                    width={20}
                                    height={20}
                                    className="rounded-full object-cover max-sm:mt-0.5"
                                />
                                <div
                                    className="flex flex-col sm:flex-row sm:items-center"
                                >
                                    <p className="body-semibold text-dark300_light700">
                                        {answer.author.name}
                                    </p>
                                    <p className="small-regular text-dark400_light500 mt-0.5 line-clamp-1 ml-0.5">
                                             <span className="max-sm:hiden">
                                                {"   "}
                                                 -
                                             </span>
                                        answered {"   "}
                                        {getTimeStamp(answer.createdAt)}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex justify-end">
                                <Votes
                                    type="Answer"
                                    upvotes={answer.upvotes.length}
                                    downvotes={answer.downvotes.length}
                                    itemId={JSON.stringify(answer._id)}
                                    userId={JSON.stringify(userId)}
                                    hasupVoted={answer.upvotes.includes(userId)}
                                    hasdownvoted={answer.downvotes.includes(userId)}
                                />
                            </div>
                        </div>

                        <ParseHTML data={answer.content}/>
                    </article>
                ))}
            </div>
            <div className="mt-10">
                <Pagination
                    pageNumber={page ? +page : 1}
                    isNext={result?.isNextAnswers}
                />
            </div>
        </div>
    )
}


export default AllAnswers