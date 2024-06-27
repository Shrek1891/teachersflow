import Link from "next/link";
import RenderTag from "@/components/shared/RenderTag";
import Metric from "@/components/Metric";
import {formatNumber, getTimeStamp} from "@/lib/utils";
import {SignedIn} from "@clerk/nextjs";
import EditDeleteAction from "@/components/shared/EditDeleteAction";

export interface Props {
    clerkId?: string | null;
    _id: string;
    title: string;
    tags: {
        _id: string;
        name: string;
    }[];
    author: {
        _id: string;
        clerkId: string;
        name: string;
        picture: string;
    };
    upvotes: number;
    views: number;
    answers: Array<object>;
    createdAt: Date;
}

const QestionsCard = ({_id, title, tags, author, upvotes, views, answers, createdAt, clerkId}: Props) => {
    const showActionButtons = clerkId && clerkId === author.clerkId
    console.log(
        tags, author
    )
    return (
        <div
            className="card-wrapper rounded-[10px] p-9 sm:px-11"
        >
            <div
                className="flex  flex-col-reverse items-start justify-between gap-5 sm:flex-row"
            >
                <div>
                    <span
                        className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden"
                    >
                        {getTimeStamp(createdAt)}
                    </span>
                    <Link href={`/question/${_id}`}>
                        <h3
                            className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1"
                        >{title}</h3>
                    </Link>
                </div>
                <SignedIn>
                    {showActionButtons && (
                        <EditDeleteAction
                            type="question"
                            itemId={JSON.stringify(_id)}
                        />
                    )}
                </SignedIn>
            </div>
            <div
                className="mt-3.5 flex flex-wrap gap-2"
            >
                {
                    tags.map((tag) => (
                        <RenderTag
                            key={tag._id}
                            title={tag.name}
                            id={tag._id}
                        />
                    ))
                }

            </div>
            <div
                className="flex-between mt-3.5 w-full flex-wrap gap-3"
            >
                <Metric
                    imgUrl={author?.picture}
                    title=" - asked "
                    alt="user"
                    value={author?.name}
                    textStyle="body-medium text-dark400_light700"
                    href={`/user/${author?._id}`}
                    isAuthor
                />
                <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
                    <Metric
                        imgUrl="/assets/icons/like.png"
                        title=" Votes"
                        alt="Votes"
                        value={formatNumber(upvotes)}
                        textStyle="small-medium text-dark400_light800"
                    />

                    <Metric
                        imgUrl="/assets/icons/message.png"
                        title=" Upvotes"
                        alt="messages"
                        value={formatNumber(answers.length)}
                        textStyle="small-medium text-dark400_light800"
                    />
                    <Metric
                        imgUrl="/assets/icons/eye.png"
                        title=" Views"
                        alt="Upvotes"
                        value={formatNumber(views)}
                        textStyle="small-medium text-dark400_light800"
                    />
                </div>
            </div>
        </div>
    )
}

export default QestionsCard