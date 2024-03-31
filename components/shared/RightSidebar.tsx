import Link from "next/link";
import Image from "next/image";
import RenderTag from "@/components/shared/RenderTag";

const hotQuestions = [
    {id: 1, title: "What is React?"},
    {id: 2, title: "What is Next.js?"},
    {id: 3, title: "What is Tailwind CSS?"},
    {id: 4, title: "What is TypeScript?"},
];

const popularTags = [
    {id: "1", title: "React", totalQuestions: 5},
    {id: "2", title: "Next.js", totalQuestions: 5},
    {id: "3", title: "Tailwind CSS", totalQuestions: 5},
    {id: "4", title: "TypeScript", totalQuestions: 5},
    {id: "5", title: "JavaScript", totalQuestions: 5},
]
const RightSidebar = () => {

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
                                href={`/questions/${question.id}`} key={question.id}>
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
                                title={tag.title}
                                totalQuestions={tag.totalQuestions}
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

