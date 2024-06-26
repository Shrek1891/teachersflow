import {Document, model, models, Schema} from "mongoose";

export interface IQuestion extends Document {
    title: string;
    explanation: string;
    tags: { _id: string; name: string; }[];
    views: number;
    upvotes: Schema.Types.ObjectId[];
    downvotes: Schema.Types.ObjectId[];
    answers: Schema.Types.ObjectId[];
    author: { _id: string; clerkId: string; name: string; picture: string; }
    createdAt: Date;

}

const QuestionSchema = new Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    tags: [{type: Schema.Types.ObjectId, ref: "Tag"}],
    views: {type: Number, default: 0},
    upvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
    downvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
    answers: [{type: Schema.Types.ObjectId, ref: "Answer"}],
    author: {type: Schema.Types.ObjectId, ref: "User"},
    createdAt: {type: Date, default: Date.now},
})

const Question = models.Question || model("Question", QuestionSchema)

export default Question