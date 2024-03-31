"use server"

import {connectToDB} from "@/lib/mongoose";
import {User} from "@/database/user.model";
import {CreateUserParams, DeleteUserParams, UpdateUserParams} from "@/lib/actions/question.action.d";
import {revalidatePath} from "next/cache";
import Question from "@/database/question.model";


export async function getUserById(params: any) {
    console.log(params)
    try {
        connectToDB();
        const {user} = params;
        const mongoUser = await User.findOne({
            clerkId: user
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

