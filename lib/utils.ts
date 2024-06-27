import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import qs from "query-string";
import {BADGE_CRITERIA} from "@/constants";
import {BadgeCounts} from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}


export const getTimeStamp = (createdAt: Date): string => {
    const date = new Date(createdAt);
    const now = new Date();

    const diffMilliseconds = now.getTime() - date.getTime();
    const diffSeconds = Math.round(diffMilliseconds / 1000);
    if (diffSeconds < 60) {
        return `${diffSeconds} seconds ago`;
    }

    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) {
        return `${diffMinutes} mins ago`;
    }

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hours ago`;
    }

    const diffDays = Math.round(diffHours / 24);

    return `${diffDays} days ago`;
};


export function formatDate(createdAt: Date) {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
        createdAt
    );
    return formattedDate;
}

export function formatNumber(number: number) {
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    } else {
        return number.toString();
    }
}

interface UrlQueryParams {
    params: string;
    key: string;
    value: string | null;
}


export function getJoinedDate(joinedAt: Date | undefined) {
    if (!joinedAt) {
        return "Joined";
    }

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const year = joinedAt.getFullYear();
    const month = months[joinedAt.getMonth()];

    return `Joined ${month} ${year}`;
}

interface UrlQueryParams {
    params: string;
    key: string;
    value: string | null;
}

export function formUrlQuery({params, key, value}: UrlQueryParams) {
    const currentUrl = qs.parse(params);

    currentUrl[key] = value;

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        {skipNull: true}
    );
}

interface RemoveUrlQueryParams {
    params: string;
    keysToRemove: string[];
}

export function removeKeysFromQuery({
                                        params,
                                        keysToRemove,
                                    }: RemoveUrlQueryParams) {
    const currentUrl = qs.parse(params);

    keysToRemove.forEach((key) => {
        delete currentUrl[key];
    });

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        {skipNull: true}
    );
}

interface BadgeParams {
    criteria: {
        type: keyof typeof BADGE_CRITERIA,
        count: number
    }[]
}

export const assignBadges = (params: BadgeParams) => {
    const badgeCounts: BadgeCounts = {
        GOLD: 0,
        SILVER: 0,
        BRONZE: 0,
    };

    const {criteria} = params
    criteria?.forEach((item) => {
        const {type, count} = item
        const badgeLevels:any = BADGE_CRITERIA[type]
        if (badgeLevels) {
            Object.keys(badgeLevels).forEach((level: any) => {
                if (count >= badgeLevels[level]) {
                    badgeCounts[level as keyof BadgeCounts] += 1
                }
            })
        }

    })
    return badgeCounts
};


