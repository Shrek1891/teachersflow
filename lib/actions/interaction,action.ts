"use server"
import {ViewQuestionParams} from "@/lib/actions/question.action.d"
import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import Interaction from "@/database/interacion,model";

export async function viewQuestion(params: ViewQuestionParams) {
    let existingInteraction;
    try {
        await connectToDB();
        const {questionId, userId} = params
        await Question.findByIdAndUpdate(questionId, {
            $addToSet: {$inc: {views: 1}},
        })

        if (userId) {
                existingInteraction = await Interaction.findOne({
                user: userId,
                action: "view",
                question: questionId
            })
        }
        if (existingInteraction) {
            console.log("viewed")
        } else {
            await Interaction.create({
                user: userId,
                action: "view",
                question: questionId
            })
        }

    } catch (error) {
        console.log(error);
    }
}