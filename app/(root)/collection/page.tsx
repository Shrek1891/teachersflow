import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {QuestionFilters} from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import QestionsCard from "@/components/cards/QestionsCard";
import NoResult from "@/components/shared/NoResult";
import {getSavedQuestions} from "@/lib/actions/user.action";
import {auth} from "@clerk/nextjs";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";

const page = async ({searchParams}: SearchParamsProps) => {
    const {userId} = auth()

    if (!userId) {
        return null
    }
    const result = await getSavedQuestions({
        clerkId: userId,
        searchQuery: searchParams?.q,
        filter: searchParams?.filter,
        page: searchParams?.page ? +searchParams?.page : 1
    });
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">Saved Qestions</h1>
            <div className="mt-11 flex justify-between gap-5
                max-sm:flex-col sm:items-center
            ">
                <LocalSearchbar
                    route="/"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.png"
                    placeholder="Search questions"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={QuestionFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                />

            </div>
            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6">
                {result && result.questions.length > 0 ?
                    result.questions.map((question:any) => (
                        <QestionsCard
                            _id={question.id}
                            title={question.title}
                            tags={question.tags}
                            author={question.author}
                            upvotes={question.upvotes.length}
                            views={question.views}
                            answers={question.answers}
                            createdAt={question.createdAt}
                            key={question.id}/>
                    )) : <NoResult
                        title={"There is no question saved to show"}
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

export default page