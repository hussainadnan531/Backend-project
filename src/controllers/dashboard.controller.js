import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { response } from "express"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const { channelId } = req.params
    const totalVideos = await Video.countDocuments({ channel: channelId })

    const totalViewsAggregate = await Video.aggregate(
        [
            {
                $match: {
                    channel: mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$views" }
                }
            }
        ]
    )

    const totalviews = totalViewsAggregate.length > 0 ? totalViewsAggregate[0].totalViews : 0

    const totalSubscribers = await Subscription.countDocuments({ channel: channelId })

    const totalLikesAggregate = await Like.aggregate([
        {
            $match:
                { channel: mongoose.Types.ObjectId(channelId) }
        },
        {
            $group:
                { _id: null, totalLikes: { $sum: 1 } }
        }
    ]);

    const totalLikes = totalLikesAggregate.length > 0 ? totalLikesAggregate[0].totalLikes : 0;

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    totalVideos,
                    totalviews,
                    totalLikes,
                    totalSubscribers
                },
                "Channel stats retrieved successfully"
            )
        )

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { channelId } = req.params

    const videos = await Video.find({ channel: channelId }).sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Channel videos retrieved successfully"
            )
        )
})

export {
    getChannelStats,
    getChannelVideos
}