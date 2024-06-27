'use server'
import {
    AnswerVoteParams,
    CreateAnswerParams,
    DeleteAnswerParams,
    GetAnswersParams
} from "@/lib/actions/question.action.d";
import {connectToDB} from "@/lib/mongoose";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import {revalidatePath} from "next/cache";
import {User} from "@/database/user.model";
import Interaction from "@/database/interacion,model";

export async function createAnswer(params: CreateAnswerParams) {

    try {
        const {content, author, question, path} = params;

        // Create the answer
        const newAnswer = await Answer.create({
            content,
            author,
            question,
        });


        const questionObject = await Question.findByIdAndUpdate(question, {
                $push: {answers: newAnswer._id}
            }
        )

        await Interaction.create({
            user: author,
            action: "answer",
            question,
            answer: newAnswer._id,
            tags:questionObject.tags
        })

        await User.findByIdAndUpdate(author, {
            $inc: {reputation: 10}
        })
        revalidatePath(path)

    } catch (error) {
        console.log(error)
        throw error
    }

}


export async function getAnswers(params: GetAnswersParams) {

    try {

        connectToDB()
        const {questionId, sortBy, page = 1, pageSize = 20} = params
        let sortOptions = {};
        const skipAmount = (page - 1) * pageSize;
        switch (sortBy) {
            case "highestUpvotes":
                sortOptions = {upvotes: -1};
                break;
            case "lowestUpvotes":
                sortOptions = {upvotes: 1};
                break;
            case "recent":
                sortOptions = {createdAt: -1};
                break;
            case "old":
                sortOptions = {createdAt: 1};
                break;
            default:
                break;
        }

        const answers = await Answer.find({
            question: questionId
        }).populate('author', "_id clerkId name picture")
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize)

        const totalAnswers = await Answer.countDocuments({
            question: questionId
        })

        const isNextAnswers = totalAnswers > skipAmount + answers.length
        return {answers, isNextAnswers}
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDB();

        const {answerId, userId, hasupVoted, hasdownVoted, path} = params;

        let updateQuery = {};

        if (hasupVoted) {
            updateQuery = {$pull: {upvotes: userId}};
        } else if (hasdownVoted) {
            updateQuery = {
                $pull: {downvotes: userId},
                $addToSet: {upvotes: userId},
            };
        } else {
            updateQuery = {$addToSet: {upvotes: userId}};
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) {
            throw new Error("Answer not found");
        }

        // Increment author's reputation by +2/-2 for upvoting/revoking upvoting a answer
        await User.findByIdAndUpdate(userId, {
            $inc: {reputation: hasupVoted ? -2 : +2},
        });

        // Increment answer author's reputation by +10/-10 for receiving an upvote
        await User.findByIdAndUpdate(answer.author, {
            $inc: {reputation: hasupVoted ? -10 : +10},
        });

        revalidatePath(path);
    } catch (error) {
        console.error("Error upvoting answer:", error);
        throw error;
    }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        await connectToDB();

        const {answerId, userId, hasupVoted, hasdownVoted, path} = params;

        let updateQuery = {};

        if (hasdownVoted) {
            updateQuery = {$pull: {downvotes: userId}};
        } else if (hasupVoted) {
            updateQuery = {
                $pull: {upvotes: userId},
                $addToSet: {downvotes: userId},
            };
        } else {
            updateQuery = {$addToSet: {downvotes: userId}};
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
            new: true,
        });

        if (!answer) {
            throw new Error("Answer not found");
        }

        // Decrement author's reputation by -2/+2 for downvoting/revoking downvoting a answer
        await User.findByIdAndUpdate(userId, {
            $inc: {reputation: hasdownVoted ? +2 : -2},
        });

        // Decrement answer author's reputation by -2/+2 for receiving a downvote
        await User.findByIdAndUpdate(answer.author, {
            $inc: {reputation: hasdownVoted ? +2 : -2},
        });

        revalidatePath(path);
    } catch (error) {
        console.error("Error downvoting answer:", error);
        throw error;
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
    try {
        await connectToDB();

        const {answerId, path} = params;

        // Find the answer to be deleted
        const answer = await Answer.findById(answerId);

        if (!answer) {
            throw new Error("Answer not found");
        }

        // Delete the answer
        await Answer.deleteOne({_id: answerId});

        // Remove the answer reference from its question
        await Question.updateMany(
            {_id: answer.question},
            {$pull: {answers: answerId}}
        );

        // Delete interactions related to the answer
        await Interaction.deleteMany({answer: answerId});

        revalidatePath(path);
    } catch (error) {
        console.error("Error deleting answer:", error);
        throw error;
    }
}



