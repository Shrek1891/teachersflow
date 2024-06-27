"use server"

import {connectToDB} from "@/lib/mongoose";
import {User} from "@/database/user.model";
import {FilterQuery} from "mongoose";
import {
    CreateUserParams,
    DeleteUserParams,
    GetAllUsersParams,
    GetSavedQuestionsParams,
    GetUserByIdParams,
    GetUserStatsParams,
    ToggleSaveQuestionParams,
    UpdateUserParams,
} from "@/lib/actions/question.action.d";
import {revalidatePath} from "next/cache";
import Question from "@/database/question.model";
import {Tag} from "@/database/tag.models";
import Answer from "@/database/answer.model";
import {BadgeCriteriaType} from "@/types";
import {assignBadges} from "@/lib/utils";


export async function getUserById(params: GetUserByIdParams) {
    try {
        connectToDB();

        const { userId } = params;
        const user = await User.findOne({ clerkId: userId });
        return user;
    } catch (error) {
        console.error("Error getting user by ID:", error);
        throw error;
    }
}

export async function getUserByIdMongo(params: any) {
    try {
        connectToDB();
        const {user} = params;
        const mongoUser = await User.findOne({
            _id: user
        });
        return mongoUser
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function createUser(userDate: CreateUserParams) {
    try {
        connectToDB();
        const newUser = await User.create(userDate);
        return newUser

    } catch (error) {
        console.log(error)
    }
}

export async function updateUser(params: UpdateUserParams) {
    try {
        connectToDB();
        const {clerkId, updateData, path} = params
        await User.findOneAndUpdate({
            clerkId
        }, updateData, {new: true})
        revalidatePath(path)

    } catch (error) {
        console.log(error)
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDB();
        const {clerkId} = params
        const user = await User.findOneAndDelete({
            clerkId
        })
        if (!user) {
            throw new Error('User not found')
        }

        const userQuestionId = await Question.find({
            author: user._id
        }).distinct('_id');
        await Question.deleteMany({
            author: user._id
        })
        const deletedUser = await User.findOneAndDelete({
            clerkId
        })
        return deletedUser

    } catch (error) {
        console.log(error)
    }
}

export async function getAllUsers(params: GetAllUsersParams) {
    try {
        connectToDB();
        const {page = 1, pageSize = 20, filter, searchQuery} = params
        const skipAmount = (page - 1) * pageSize
        const query: FilterQuery<typeof User> = {}

        if (searchQuery) {
            query.$or = [
                {name: {$regex: new RegExp(searchQuery, 'i')}},
                {username: {$regex: new RegExp(searchQuery, 'i')}},
            ]
        }
        let sortOptions = {}
        switch (filter) {
            case "new_users": {
                sortOptions = {joinedAt: -1}
                break
            }
            case "old_users": {
                sortOptions = {joinedAt: 1}
                break
            }
            case "top_contributors": {
                sortOptions = {reputations: -1}
                break
            }

            default: {
                break
            }
        }

        const users = await User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);

        const totalUsers = await User.countDocuments(query)
        const isNext = totalUsers > skipAmount + users.length
        return {users, isNext}
    } catch (error) {
        console.log(error)
    }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
    try {
        connectToDB();
        const {userId, questionId, path} = params
        const user = await User.findById(userId)
        if (!user) {
            throw new Error('User not found')
        }
        const isQuestionSaved = user.saved.includes(questionId)
        if (isQuestionSaved) {
            await User.findByIdAndUpdate(userId, {
                $pull: {saved: questionId},
                new: true
            })
        } else {
            await User.findByIdAndUpdate(userId, {
                $addToSet: {saved: questionId},
                new: true
            })
        }
        revalidatePath(path)


    } catch (error) {
        console.log(error)
    }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
    try {
        await connectToDB();

        const {clerkId, page = 1, pageSize = 10, filter, searchQuery} = params;

        const query: FilterQuery<typeof Question> = searchQuery
            ? {title: {$regex: new RegExp(searchQuery, "i")}}
            : {};

        let sortOptions = {};

        switch (filter) {
            case "most_recent":
                sortOptions = {createdAt: -1};
                break;

            case "oldest":
                sortOptions = {createdAt: 1};
                break;

            case "most_voted":
                sortOptions = {upvotes: -1};
                break;

            case "most_viewed":
                sortOptions = {views: -1};
                break;

            case "most_answered":
                sortOptions = {answers: -1};
                break;

            default:
                // No specific filter
                break;
        }

        const user = await User.findOne({clerkId}).populate({
            path: "saved",
            match: query,
            options: {
                sort: sortOptions,
                skip: (page - 1) * pageSize,
                limit: pageSize + 1, // Fetch one extra to determine if there is a next page
            },
            populate: [
                {path: "tags", model: Tag, select: "_id name"},
                {path: "author", model: User, select: "_id clerkId name picture"},
            ],
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Extract the saved questions from the user
        const savedQuestions = user.saved.slice(0, pageSize);

        // Calculate the isNext indicator
        const isNext = user.saved.length > pageSize;

        return {questions: savedQuestions, isNext};
    } catch (error) {
        console.error("Error fetching saved questions:", error);
        throw error;
    }
}

export async function getUserInfo(params: GetUserByIdParams) {
    try {
        await connectToDB();

        const {userId} = params;

        const user = await User.findOne({clerkId: userId});

        if (!user) {
            throw new Error("User not found");
        }

        const totalQuestions = await Question.countDocuments({author: user._id});
        const totalAnswers = await Answer.countDocuments({author: user._id});
        const [questionUpvotes] = await Question.aggregate([
            {$match: {author: user._id}},
            {
                $project: {
                    _id: 0,
                    upvotes: {$size: "$upvotes"}
                }
            },
            {
                $group: {
                    _id: null,
                    totalUpvotes: {$sum: "$upvotes"}
                }
            }

        ])

        const [answerUpvotes] = await Answer.aggregate([
            {$match: {author: user._id}},
            {
                $project: {
                    _id: 0,
                    upvotes: {$size: "$upvotes"}
                }
            },
            {
                $group: {
                    _id: null,
                    totalUpvotes: {$sum: "$upvotes"}
                }
            }

        ])
        const [questionViews] = await Answer.aggregate([
            {$match: {author: user._id}},
            {
                $group: {
                    _id: null,
                    totalViews: {$sum: "$views"}
                }
            }

        ])

        const criteria = [
            {type: 'QESTION_COUNT' as BadgeCriteriaType, count: totalQuestions},
            {type: 'ANSWER_COUNT' as BadgeCriteriaType, count: totalAnswers},
            {type: 'QUESTION_UPVOTES' as BadgeCriteriaType, count: questionUpvotes?.totalUpvotes || 0},
            {type: 'TOTAL_VIEWS' as BadgeCriteriaType, count: questionViews?.totalViews || 0},
            {type: 'ANSWER_UPVOTES' as BadgeCriteriaType, count: answerUpvotes?.totalUpvotes || 0},

        ]
        const badgesCounts = assignBadges({criteria})

        return {
            user,
            totalQuestions,
            totalAnswers,
            badgesCounts

        };
    } catch (error) {
        console.error("Error getting user info:", error);
        throw error;
    }
}

export async function getUserQuestions(params: GetUserStatsParams) {
    try {
        await connectToDB();
        const {userId, page = 1, pageSize = 10} = params;

        const skipAmount = (page - 1) * pageSize;

        const totalQuestions = await Question.countDocuments({author: userId});

        const userQuestions = await Question.find({author: userId})
            .sort({createdAt: -1, views: -1, upvotes: -1,})
            .skip(skipAmount)
            .limit(pageSize)
            .populate("tags", "_id name")
            .populate("author", "_id clerkId name picture");

        const isNextQuestions = totalQuestions > skipAmount + userQuestions.length;

        return {totalQuestions, questions: userQuestions, isNextQuestions};
    } catch (error) {
        console.error("Error fetching user questions:", error);
        throw error;
    }
}

export async function getUserAnswers(params: GetUserStatsParams) {
    try {
        await connectToDB();
        const {userId, page = 1, pageSize = 10} = params;

        const skipAmount = (page - 1) * pageSize;

        const totalAnswers = await Answer.countDocuments({author: userId});

        const userAnswers = await Answer.find({author: userId})
            .sort({upvotes: -1})
            .skip(skipAmount)
            .limit(pageSize)
            .populate({
                path: "question",
                select: "_id title",
            })
            .populate("author", "_id clerkId name picture");

        const isNextAnswers = totalAnswers > skipAmount + userAnswers.length;

        return {totalAnswers, answers: userAnswers, isNextAnswers};
    } catch (error) {
        console.error("Error fetching user answers:", error);
        throw error;
    }
}






