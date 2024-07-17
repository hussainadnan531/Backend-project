import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    const { userId } = req.user

    if (!channelId) {
        throw new ApiError(400, "Invalid channel ID")
    }

    existingSubscription = await Subscription.findOne({ channel: channelId, subscriber: userId })

    if (existingSubscription) {
        await existingSubscription.remove()
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    "Unsubscribed successfully"
                )
            )
    } else {
        const subscription = new Subscription({ channel: channelId, subscriber: userId })
        await subscription.save()
        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    subscription,
                    "Subscribed successfully"
                )
            )

    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID")
    }

    const subscribers = await Subscription.find({ channel: channelId }).populate("subscriber")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Subscribers retrieved successfully"
            )
        )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID");
    }

    const subscriptions = await Subscription.find({ subscriber: subscriberId }).populate('channel');

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                "Subscribed channels retrieved successfully",
                subscriptions));
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}