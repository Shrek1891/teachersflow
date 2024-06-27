import LocalSearchbar from "@/components/shared/search/LocalSearchbar";
import Filter from "@/components/shared/Filter";
import {TagFilters, UserFilters} from "@/constants/filters";
import NoResult from "@/components/shared/NoResult";
import {getAllTags} from "@/lib/actions/tag.action";
import Link from "next/link";
import {SearchParamsProps} from "@/types";
import Pagination from "@/components/shared/Pagination";

const page = async ({searchParams}: SearchParamsProps) => {
    const result = await getAllTags({
        searchQuery: searchParams?.q,
        filter: searchParams?.filter,
        page: searchParams?.page ? +searchParams?.page : 1,
    });
    return (
        <>
            <h1 className="h1-bold text-dark100_light900">All tags</h1>
            <div className="mt-11 flex justify-between gap-5
                max-sm:flex-col sm:items-center
            ">
                <LocalSearchbar
                    route="/tags"
                    iconPosition="left"
                    imgSrc="/assets/icons/search.png"
                    placeholder="Search tags"
                    otherClasses="flex-1"
                />
                <Filter
                    filters={TagFilters}
                    otherClasses="min-h-[56px] sm:min-w-[170px]"

                />

            </div>
            <section className="mt-12 flex flex-wrap gap-4">

                {result?.tags && result?.tags.length > 0 ? (
                    result?.tags.map((tag) => (
                        <Link
                            className="shadow-light100_darknone"
                            href={`/tags/${tag._id}`}
                            key={tag._id}

                        >
                            <article
                                className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 py-10 sm:w-[260px]"
                            >
                                <div className="background-light800_dark400 w-fit rounded-sm px-5 py-1.5">
                                    <p className="paragraph-semibold text-dark300_light900">
                                        {tag.name}
                                    </p>
                                </div>
                                <p className="smal-medium text-dark400_light500 mt-3.5">
                                    <span
                                        className="body-semibold primary-text-gradient mr-2.5"
                                    >
                                        {tag.questions.length}+ Question
                                    </span>
                                </p>

                            </article>
                        </Link>

                    ))
                ) : (
                    <NoResult
                        title="No tags"
                        description="It looks like there are no tags"
                        link="/ask-question"
                        linkTitle="Ask a question"/>
                )}
            </section>
            <div className="mt-10">
                <Pagination
                    pageNumber={searchParams?.page ? +searchParams?.page : 1}
                    isNext={result?.isNext}
                />
            </div>
        </>
    )
}

export default page