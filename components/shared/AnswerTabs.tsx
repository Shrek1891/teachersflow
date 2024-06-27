import {SearchParamsProps} from "@/types";
import {getUserAnswers} from "@/lib/actions/user.action";
import AnswerdCard from "@/components/cards/AnswerdCard";
import Pagination from "@/components/shared/Pagination";

interface Props extends SearchParamsProps {
    userId: string
    clerkId: string | null
}

const AnswerTabs = async ({searchParams, userId, clerkId}: Props) => {
    const result = await getUserAnswers({userId, page: searchParams?.page ? +searchParams?.page : 1})

    return (
        <>
            {result?.answers?.map((answer: any) => (
                <AnswerdCard
                    key={answer._id}
                    _id={answer._id}
                    clerkId={clerkId}
                    question={answer.question}
                    author={answer.author}
                    upvotes={answer.upvotes.length}
                    createdAt={answer.createdAt}/>
            ))}
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams?.page : 1}
                    isNext={result?.isNextAnswers}
                />
            </div>
        </>
    )
}

export default AnswerTabs