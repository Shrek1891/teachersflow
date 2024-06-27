import Image from "next/image";
import Link from "next/link";

interface ProfileLinkProps {
    imgURL: string;
    title: string;
    href?: string;
}

const ProfileLink = ({imgURL, title, href}: ProfileLinkProps) => {
    return <div
        className="flex-center gap-2"
    >
        <Image
            src={imgURL}
            alt={title}
            width={20}
            height={20}
        />
        {href ? (<Link href={href || ""} target="_blank" className="text-accent-blue paragraph-medium">
            {title}
        </Link>) : <p className="paragraph-medium text-dark400_light700">{title}</p>}
    </div>;
};

export default ProfileLink;
