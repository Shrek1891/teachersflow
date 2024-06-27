import {getQuestionById} from "@/lib/actions/question.action";
import {getUserById, getUserByIdMongo} from "@/lib/actions/user.action";
import Link from "next/link";
import Image from "next/image";
import Metric from "@/components/Metric";
import {formatNumber, getTimeStamp} from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/forms/Answer";
import {auth} from "@clerk/nextjs";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";
import {URLProps} from "@/types";

const Page = async ({params, searchParams} : URLProps) => {
    const {userId: clerkId} = auth();

    let mongoUser;
    if (clerkId) {
        mongoUser = await getUserById({ userId: clerkId });
    }

    const question = await getQuestionById({questionId: params.id})
    const author = await getUserByIdMongo({user:question.author._id})

    return (
        <>
            <div className="flex-start w-full flex-col">
                <div
                    className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2"
                >
                    <Link
                        className="flex items-center justyfy-start gap-2"
                        href={`/profile/${question.author._id}`}>
                        <Image
                            src={author.picture}
                            alt={author.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                        <p className="paragraph-semibold text-dark300_light700">
                            {author.name}
                        </p>
                    </Link>
                    <div className="flex justify-end">
                        <Votes
                            type="Question"
                            upvotes={question.upvotes.length}
                            downvotes={question.downvotes.length}
                            itemId={JSON.stringify(question._id)}
                            userId={JSON.stringify(mongoUser?._id)}
                            hasupVoted={question.upvotes.includes(mongoUser._id)}
                            hasdownvoted={question.downvotes.includes(mongoUser._id)}
                            hasSaved={mongoUser?.saved.includes(question._id)}
                        />
                    </div>
                </div>
                <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
                    {question.title}
                </h2>
            </div>
            <div className="mb-8 mt-5 flex flex-wrap gap-4">
                <Metric
                    imgUrl="/assets/icons/clock.png"
                    title=" Asked"
                    alt="clock"
                    value={` asked ${getTimeStamp(question.createdAt)}`}
                    textStyle="small-regular text-dark400_light700"
                />
                <Metric
                    imgUrl="/assets/icons/message.png"
                    title=" Answers"
                    alt="messages"
                    value={formatNumber(question.answers.length)}
                    textStyle="small-medium text-dark400_light700"
                />
                <Metric
                    imgUrl="/assets/icons/eye.png"
                    title=" Views"
                    alt="Upvotes"
                    value={formatNumber(question.views)}
                    textStyle="small-medium text-dark400_light700"
                />

            </div>
            <ParseHTML data={question.content}/>
            <div className="mt-8 flex flex-wrap gap-2">
                {question.tags.map((tag: any) => (
                    <RenderTag
                        key={tag._id}
                        id={tag._id}
                        title={tag.name}
                        showCount={false}
                    />
                ))}
            </div>
            <AllAnswers
                questionId={question._id}
                authorId={JSON.stringify((question.author.id))}
                totalAnswers={question.answers.length}
                userId={mongoUser?._id}
                page={searchParams?.page}
                filter={searchParams?.filter}
            />
            <Answer
                question={question.content}
                questionId={JSON.stringify(question._id)}
                authorId={JSON.stringify((mongoUser?.id))}
            />
        </>
    )
}


export default Page