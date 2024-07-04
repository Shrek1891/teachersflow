import {getQuestionsByTagId} from "@/lib/actions/tag.action";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import HomeFilters from "@/components/home/HomeFilters";
import QestionsCard from "@/components/cards/QestionsCard";
import NoResult from "@/components/shared/NoResult";
import {IQuestion} from "@/database/question.model";
import {URLProps} from "@/types";
import Pagination from "@/components/shared/Pagination";

const Page = async ({params, searchParams}: URLProps) => {
    const result = await getQuestionsByTagId(
        {
            tagId: params.id,
            page: searchParams.page ? +searchParams.page : 1,
            searchQuery: searchParams.q,
        }
    )
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">{result.tagTitle}</h1>
            <div className="mt-11 w-full
            ">
                <LocalSearchbar
                    route={`/tags/${params.id}`}
                    iconPosition="left"
                    imgSrc="/assets/icons/search.png"
                    placeholder="Search tag questions"
                    otherClasses="flex-1"
                />
            </div>
            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6">
                {result && result.questions.length > 0 ?
                    result.questions.map((question: IQuestion) => (
                        <QestionsCard
                            _id={question.id}
                            title={question.title}
                            tags={question?.tags}
                            author={question?.author}
                            upvotes={question.upvotes.length}
                            views={question.views}
                            answers={question.answers}
                            createdAt={question.createdAt}
                            key={question.id}/>
                    )) : <NoResult
                        title={"There is no tag  question saved to show"}
                        description={"Ask a question"}
                        link={"/ask-question"}
                        linkTitle={"Ask a question"}

                    />
                }
            </div>
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams?.page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </>
    );
}

export default Page