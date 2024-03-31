import {SidebarLink} from "@/types";

export const themes = [
    { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
    { value: "dark", label: "Dark", icon: "/assets/icons/moon.png" },
    { value: "system", label: "System", icon: "/assets/icons/computer.png" },
]

export const sidebarLinks: SidebarLink[] = [
    {
        imgURL: "/assets/icons/home.png",
        route: "/",
        label: "Home",
    },
    {
        imgURL: "/assets/icons/users.png",
        route: "/community",
        label: "Community",
    },
    {
        imgURL: "/assets/icons/star.png",
        route: "/collection",
        label: "Collections",
    },
    {
        imgURL: "/assets/icons/suitcase.png",
        route: "/jobs",
        label: "Find Jobs",
    },
    {
        imgURL: "/assets/icons/tag.png",
        route: "/tags",
        label: "Tags",
    },
    {
        imgURL: "/assets/icons/user.png",
        route: "/profile",
        label: "Profile",
    },
    {
        imgURL: "/assets/icons/question.png",
        route: "/ask-question",
        label: "Ask a question",
    },
]

export const BADGE_CRITERIA = {

    QUESTION_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_COUNT: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    QUESTION_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    ANSWER_UPVOTES: {
        BRONZE: 10,
        SILVER: 50,
        GOLD: 100,
    },
    TOTAL_VIEWS: {
        BRONZE: 1000,
        SILVER: 10000,
        GOLD: 100000,
    },
};