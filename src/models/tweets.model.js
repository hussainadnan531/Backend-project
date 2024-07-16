import mongoose, {mongo, Schema} from "mongoose";
import { refreshAccessToken } from "../controllers/user.controller";


const tweetSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
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