import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //object of the one who is subscribing
        ref: "User"
    },
    channel: {
        type: Schema.Types.ObjectId,  // one to whom the 'subcriber' is subscribing
        ref: "User"
    }
}, {timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema) 