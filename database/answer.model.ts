import {Document, model, models, Schema} from "mongoose";

export interface IAnswer extends Document {
    author: Schema.Types.ObjectId;
    question: Schema.Types.ObjectId;
    content: string;
    downvotes: Schema.Types.ObjectId[];
    upvotes: Schema.Types.ObjectId[];
    createdAt: Date;
}

const AnswerSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: "User",required: true},
    question: {type: Schema.Types.ObjectId, ref: "Question",required: true},
    content: {type: String},
    downvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
    upvotes: [{type: Schema.Types.ObjectId, ref: "User"}],
    createdAt: {type: Date, default: Date.now}
})

const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema)


export default Answer