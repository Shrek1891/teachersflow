import {SearchParamsProps} from "@/types";
import {getUserQuestions} from "@/lib/actions/user.action";
import QestionsCard from "@/components/cards/QestionsCard";
import Pagination from "@/components/shared/Pagination";

interface Props extends SearchParamsProps {
    userId: string
    clerkId: string | null
}

const QuestionTab = async ({searchParams, userId, clerkId}: Props) => {
    const result = await getUserQuestions({
        userId,
        page: searchParams?.page ? +searchParams?.page : 1,
    })
    return (
        <div>
            {result?.questions?.map((question: any) => (
                <QestionsCard
                    key={question._id}
                    clerkId={clerkId}
                    _id={question._id}
                    title={question.title}
                    tags={question.tags}
                    author={question.author}
                    upvotes={question.upvotes.length}
                    views={question.views}
                    answers={question.answers}
                    createdAt={question.createdAt}
                />
            ))}
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams?.page : 1}
                    isNext={result?.isNextQuestions}
                />
            </div>
        </div>
    )
}

export default QuestionTab