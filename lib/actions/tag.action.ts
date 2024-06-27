"use server"

import {connectToDB} from "@/lib/mongoose";
import {GetAllTagsParams, GetQuestionsByTagIdParams, GetTopInteractedTagsParams} from "@/lib/actions/question.action.d";
import {User} from "@/database/user.model";
import {ITag, Tag} from "@/database/tag.models";
import Question from "@/database/question.model";
import {FilterQuery} from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
    try {
        connectToDB()
        const {userId} = params
        const user = await User.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        return [{_id: '1', name: 'test'}]
    } catch (error) {
        console.log(error)
    }

}

export async function getAllTags(params: GetAllTagsParams) {
    try {
        connectToDB()
        const {searchQuery, filter, page = 1, pageSize = 20} = params
        const skipAmount = (page - 1) * pageSize;
        const query: FilterQuery<typeof Tag> = {}

        if (searchQuery) {
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, 'i')}},
            ]
        }
        let sortOptions = {}

        switch (filter) {
            case "popular":
                sortOptions = {questions: 1};
                break;

            case "recent":
                sortOptions = {createdAt: -1};
                break;

            case "old":
                sortOptions = {createdAt: 1};
                break;

            case "name":
                sortOptions = {name: 1};
                break;

            default:
                // No specific filter
                break;
        }
        const totalTags = await Tag.countDocuments(query);
        const tags = await Tag.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        const isNext = totalTags > skipAmount + tags.length;
        return {tags, isNext};
    } catch (error) {
        console.log(error)
    }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
    try {
        await connectToDB();

        const {tagId, page = 1, pageSize = 10, searchQuery} = params;

        const skipAmount = (page - 1) * pageSize;

        // Create a filter for the tag by ID
        const tagFilter: FilterQuery<ITag> = {_id: tagId};

        // Find the tag by ID and populate the questions field
        const tag = await Tag.findOne(tagFilter).populate({
            path: "questions",
            model: Question,
            match: searchQuery
                ? {title: {$regex: searchQuery, $options: "i"}}
                : {},
            options: {
                skip: skipAmount,
                limit: pageSize + 1, // Fetch one extra to determine if there is a next page
            },
            populate: [
                {path: "tags", model: Tag, select: "_id name"}, // Populate the tags field of questions
                {path: "author", model: User, select: "_id clerkId name picture"}, // Populate the author field of questions
            ],
        });

        if (!tag) {
            throw new Error("Tag not found");
        }

        // Extract the list of questions from the tag
        const questions = tag.questions.slice(0, pageSize);

        // Calculate the isNext indicator
        const isNext = tag.questions.length > pageSize;

        return {tagTitle: tag.name, questions, isNext};
    } catch (error) {
        console.error("Error fetching questions by tag ID:", error);
        throw error;
    }
}


export async function getTopPopularTags() {
    try {
        await connectToDB();

        const popularTags = await Tag.aggregate([
            {
                $project: {
                    name: 1,
                    numberOfQuestions: {$size: "$questions"},
                },
            },
            {
                $sort: {numberOfQuestions: -1},
            },
            {
                $limit: 5,
            },
        ]);

        return popularTags;
    } catch (error) {
        console.error("Error fetching top popular tags:", error);
        throw error;
    }
}
