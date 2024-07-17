import mongoose, { mongo, Schema } from "mongoose";
import { refreshAccessToken } from "../controllers/user.controller";


const tweetSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


export const Tweet = mongoose.model("Tweet", tweetSchema)