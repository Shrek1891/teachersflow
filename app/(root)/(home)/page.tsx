import {Button} from "@/components/ui/button";
import Link from "next/link";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {HomePageFilters} from "@/constants/filters";
import HomeFilters from "@/components/home/HomeFilters";
import NoResult from "@/components/shared/NoResult";
import QestionsCard from "@/components/cards/QestionsCard";
import {getQestions} from "@/lib/actions/question.action";



const Home = async () => {
    const result = await getQestions({});
    return (
        <>
            <div
                className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row"
            >
                <h1 className="h1-bold text-dark100_light900">All questions</h1>

                <Link
                    href="/ask-question"
                    className="flex justify-end max-sm:w-full "
                >
                    <Button
                        className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
                    >
                        Ask a question
                    </Button>
                </Link>
            </div>
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
                    filters={HomePageFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"
                    containerClass="hidden max-md:flex"

                />

            </div>
            <HomeFilters/>
            <div className="mt-10 flex w-full flex-col gap-6">
                {result && result.questions.length > 0  ?
                    result.questions.map((question) => (
                        <QestionsCard
                        id={question.id}
                        title={question.title}
                        tags={question.tags}
                        author={question.author}
                        upvotes={question.upvotes}
                        views={question.views}
                        answers={question.answers}
                        createdAt={question.createdAt}
                        key={question.id}/>
                    )) : <NoResult
                        title={"There is no question to show"}
                        description={"Ask a question"}
                        link={"/ask-question"}
                        linkTitle={"Ask a question"}

                    />
                }
            </div>
        </>

    );
}

export default Home