"use server"

import {connectToDB} from "@/lib/mongoose";
import Question from "@/database/question.model";
import {Tag} from "@/database/tag.models";
import {CreateQuestionParams, GetQestionsParams} from "@/lib/actions/question.action.d";
import {User} from "@/database/user.model";
import {revalidatePath} from "next/cache";

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
        revalidatePath(path)
    } catch (error) {
        console.log(error)
    }

}

export async function getQestions(params: GetQestionsParams) {
    try {
        connectToDB();
        const questions = await Question.find({})
            .populate({
                path: "tags", model: Tag,
            })
            .populate({path: "author", model: User})
            .sort({createdAt: -1});
        return {questions}
    } catch (error) {
        console.log(error)
    }
}