import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";
import {getHotQuestions} from "@/lib/actions/question.action";
import {getTopPopularTags} from "@/lib/actions/tag.action";




const RightSidebar =async () => {
    const hotQuestions = await getHotQuestions()
    const popularTags = await getTopPopularTags()
    return (
        <section
            className='custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen
            w-fit flex-col overflow-y-auto border-l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden lg:w-[350px]'
        >
            <div>
                <h3
                    className='h3-bold text-dark200_light900'
                >Top Questions</h3>
                <div className="mt-7 flex w-full flex-col gap-[30px]">
                    {hotQuestions.map((question) => {
                        return (
                            <Link
                                className='flex cursor-pointer items-center justify-between gap-7'
                                href={`/question/${question.id}`} key={question.id}>
                                <p
                                    className='text-dark500_light700 body-medium'
                                >{question.title}</p>
                                <Image
                                    className="invert-colors"
                                    src="/assets/icons/arrow-right.png" alt="arrow"
                                    width={20}
                                    height={20}
                                />
                            </Link>
                        )
                    })}
                </div>
            </div>
            <div className="mt-16">
                <h3 className="h3-bold text-dark200_light900">
                    Tags Questions
                </h3>
                <div className="mt-7 flex flex-col gap-4">
                    {popularTags.map((tag) =>{
                        return (
                            <RenderTag
                                key={tag.id}
                                id={tag.id}
                                title={tag.name}
                                totalQuestions={tag.numberOfQuestions}
                                showCount
                            />
                        )
                    })
                    }

                </div>
            </div>

        </section>
    )
}

export default RightSidebar

