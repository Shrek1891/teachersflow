"use server"

import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import {Tag} from "@/database/tag.models";
import {
    CreateQuestionParams,
    DeleteQuestionParams,
    EditQuestionParams,
    GetQestionsParams,
    GetQuestionByIdParams,
    QuestionVoteParams,
    RecommendedParams

} from "@/lib/actions/question.action.d";
import {User} from "@/database/user.model";
import {revalidatePath} from "next/cache";
import Answer from "@/database/answer.model";
import Interaction from "@/database/interacion,model";
import {FilterQuery} from "mongoose";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDB();
        const {title, content, tags, author, path} = params;
        const question = await Question.create({title, content, author});

        const tagDocuments = [];
        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate(
                {name: {$regex: new RegExp(`^&{${tag}}$`, 'i')}},
                {$setOnInsert: {name: tag}, $push: {questions: question._id}},
                {upsert: true, new: true}
            );
            tagDocuments.push(existingTag._id);
        }
        await Question.findByIdAndUpdate(question._id,
            {$push: {tags: {$each: tagDocuments}}},);
        await Interaction.create({
            user: author,
            action: "ask_question",
            question: question._id,
            tags: tagDocuments,
        })
        await User.findByIdAndUpdate(author, {
            $inc: {reputation: 5}
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }

}

export async function getQuestions(params: GetQestionsParams) {

    try {
        connectToDB();
        const {searchQuery, filter, page = 1, pageSize = 20} = params
        const skipAmount = (page - 1) * pageSize
        const query: FilterQuery<typeof Question> = {}
        if (searchQuery) {
            query.$or = [
                {title: {$regex: new RegExp(searchQuery, 'i')}},
                {content: {$regex: new RegExp(searchQuery, 'i')}},
            ]
        }
        let sortOptions = {}
        switch (filter) {
            case "newest": {
                sortOptions = {createdAt: -1}
                break
            }
            case "frequent": {
                sortOptions = {views: -1}
                break
            }
            case "unanswered": {
                sortOptions = {$size: 0}
                break
            }
            default: {
                break
            }
        }
        const questions = await Question.find(query)
            .populate({
                path: "tags", model: Tag,
            })
            .populate({path: "author", model: User})
            .skip(skipAmount)
            .limit(pageSize)
            .sort(sortOptions);
        const totalQuestions = await Question.countDocuments(query)
        const isNext = totalQuestions > skipAmount + questions.length
        return {questions, isNext}
    } catch (error) {
        console.log(error)
    }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
    try {
        connectToDB();
        const {questionId} = params
        const question = await Question.findById(questionId)
            .populate({
                path: "tags", model: Tag,
                select: "_id name",
            })
            .populate({path: "author", model: User, select: '_id clerlId'});
        return question

    } catch (error) {
        console.log(error)
    }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDB();
        const {questionId, userId, hasupVoted, hasdownVoted, path} = params
        let updateQuery = {}

        if (hasupVoted) {
            updateQuery = {$pull: {upvotes: userId}}
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: {downvotes: userId},
                $push: {upvotes: userId}
            }
        } else {

            updateQuery = {
                $addToSet: {upvotes: userId}
            }

        }
        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
            new: true
        })
        if (!question) {
            throw new Error("Question not found")
        }
        await User.findByIdAndUpdate(userId, {
            $inc: {reputation: hasupVoted ? -1 : +1},
        })
        await User.findByIdAndUpdate(question.author, {
            $inc: {reputation: hasupVoted ? -10 : +10},
        })

        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
    try {
        connectToDB();
        const {questionId, userId, hasupVoted, hasdownVoted, path} = params
        let updateQuery = {}

        if (hasdownVoted) {
            updateQuery = {$pull: {downvotes: userId}}
        } else if (hasupVoted) {
            updateQuery = {
                $pull: {upvotes: userId},
                $push: {downvotes: userId}
            }
        } else {

            updateQuery = {
                $addToSet: {downvotes: userId}
            }
        }

        const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
            new: true
        })
        if (!question) {
            throw new Error("Question not found")
        }
        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
    try {
        await connectToDB();

        const {questionId, path} = params;

        // Delete the question
        await Question.deleteOne({_id: questionId});

        // Delete all answers associated with the question
        await Answer.deleteMany({question: questionId});

        // Delete interactions related to the question
        await Interaction.deleteMany({question: questionId});

        // Update tags to remove references to the deleted question
        await Tag.updateMany(
            {questions: questionId},
            {$pull: {questions: questionId}}
        );

        revalidatePath(path);
    } catch (error) {
        console.error("Error deleting question:", error);
        throw error;
    }
}


export async function editQuestion(params: EditQuestionParams) {
    try {
        await connectToDB();

        const {questionId, title, content, tags, path} = params;

        // Find the question to be edited
        const question = await Question.findById(questionId).populate("tags");

        if (!question) {
            throw new Error("Question not found");
        }

        // Update question fields
        question.title = title;
        question.content = content;
        await question.save();

        const newTags = tags.map((tag: string) => tag.toLowerCase());
        const existingTags = question.tags.map((tag: any) =>
            tag.name.toLowerCase()
        );

        const tagUpdates = {
            tagsToAdd: [] as string[],
            tagsToRemove: [] as string[],
        };

        for (const tag of newTags) {
            if (!existingTags.includes(tag.toLowerCase())) {
                tagUpdates.tagsToAdd.push(tag);
            }
        }

        for (const tag of question.tags) {
            if (!newTags.includes(tag.name.toLowerCase())) {
                tagUpdates.tagsToRemove.push(tag._id);
            }
        }

        // Add new tags and link them to the question
        const newTagDocuments = [];

        for (const tag of tagUpdates.tagsToAdd) {
            const newTag = await Tag.findOneAndUpdate(
                {name: {$regex: new RegExp(`^${tag}$`, "i")}},
                {$setOnInsert: {name: tag}, $push: {questions: question._id}},
                {upsert: true, new: true}
            );

            newTagDocuments.push(newTag._id);
        }

        console.log({tagUpdates});

        // Remove question reference for tagsToRemove from the tag
        if (tagUpdates.tagsToRemove.length > 0) {
            await Tag.updateMany(
                {_id: {$in: tagUpdates.tagsToRemove}},
                {$pull: {questions: question._id}}
            );
        }

        if (tagUpdates.tagsToRemove.length > 0) {
            await Question.findByIdAndUpdate(question._id, {
                $pull: {tags: {$in: tagUpdates.tagsToRemove}},
            });
        }

        if (newTagDocuments.length > 0) {
            await Question.findByIdAndUpdate(question._id, {
                $push: {tags: {$each: newTagDocuments}},
            });
        }

        revalidatePath(path);
    } catch (error) {
        console.error("Error editing question:", error);
        throw error;
    }
}


export async function getHotQuestions() {
    try {
        await connectToDB();

        // Find top hot questions based on views and upvotes
        const hotQuestions = await Question.find({})
            .sort({views: -1, upvotes: -1}) // Sort by views in descending order, then upvotes in descending order
            .limit(5);

        return hotQuestions;
    } catch (error) {
        console.error("Error fetching hot questions:", error);
        throw error;
    }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
    try {
        await connectToDB();

        const { userId, page = 1, pageSize = 20, searchQuery } = params;

        // find user
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("user not found");
        }

        const skipAmount = (page - 1) * pageSize;

        // Find the user's interactions
        const userInteractions = await Interaction.find({ user: user._id })
            .populate("tags")
            .exec();

        // Extract tags from user's interactions
        const userTags = userInteractions.reduce((tags, interaction) => {
            if (interaction.tags) {
                tags = tags.concat(interaction.tags);
            }
            return tags;
        }, []);

        // Get distinct tag IDs from user's interactions
        const distinctUserTagIds = [
            ...new Set(userTags.map((tag: any) => tag._id)),
        ];

        const query: FilterQuery<typeof Question> = {
            $and: [
                { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
                { author: { $ne: user._id } }, // Exclude user's own questions
            ],
        };

        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: "i" } },
                { content: { $regex: searchQuery, $options: "i" } },
            ];
        }

        const totalQuestions = await Question.countDocuments(query);

        const recommendedQuestions = await Question.find(query)
            .populate({
                path: "tags",
                model: Tag,
            })
            .populate({
                path: "author",
                model: User,
            })
            .skip(skipAmount)
            .limit(pageSize);

        const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

        return { questions: recommendedQuestions, isNext };
    } catch (error) {
        console.error("Error getting recommended questions:", error);
        throw error;
    }
}

