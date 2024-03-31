import {Schema, model, Document, models} from "mongoose";

export interface IUser extends Document{
    clerkId: string;
    name: string;
    username: string;
    email: string;
    password?: string;
    bio?: string;
    picture: string;
    portfolioWebsite?: string;
    location?: string;
    profilePicture?: string;
    reputation: number;
    saved: Schema.Types.ObjectId[];
    createdAt: Date;


}

export const UserSchema = new Schema({
    clerkId: {type: String, required: true},
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String},
    bio: {type: String},
    picture: {type: String, required: true},
    portfolioWebsite: {type: String},
    location: {type: String},
    profilePicture: {type: String},
    reputation: {type: Number, default: 0},
    saved: [{type: Schema.Types.ObjectId, ref: "Question"}],
    createdAt: {type: Date, default: Date.now},
})

export const User = models.User || model ("User", UserSchema)