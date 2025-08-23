/** @format */

import { endOfDay, startOfDay } from "date-fns"
import { Types } from "mongoose"
import { IPrediction } from "../../../types";

export const leaderboardPipeline = (
    competition: string,
    userIds = [] as string[],
    fromDate: string,
    toDate: string,
    contest: string
) => [
    {
        $match: {
            ...(contest && {
                _id: { $in: userIds.map(userId => new Types.ObjectId(userId)) },
            }),
        },
    },
    {
        $limit: 50,
    },
    {
        $lookup: {
            let: {
                userId: { $toString: "$_id" },
            },
            from: "predictions",
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user", "$$userId"] },
                                {
                                    ...(competition && {
                                        $eq: ["$competition", competition],
                                    }),
                                    ...(fromDate &&
                                        toDate && {
                                            $and: [
                                                {
                                                    $gte: [
                                                        "$createdAt",
                                                        startOfDay(
                                                            new Date(fromDate)
                                                        ),
                                                    ],
                                                },
                                                {
                                                    $gte: [
                                                        "$createdAt",
                                                        endOfDay(
                                                            new Date(toDate)
                                                        ),
                                                    ],
                                                },
                                            ],
                                        }),
                                },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: "$user",
                        totalPoints: { $sum: "$point" },
                    },
                },
            ],
            as: "predictions",
        },
    },
    {
        $addFields: {
            predictions: {
                $ifNull: [
                    { $arrayElemAt: ["$predictions", 0] },
                    { _id: null, totalPoints: 0 },
                ],
            },
        },
    },
    {
        $sort: {
            "predictions.totalPoints": -1,
        },
    },
]

export const calculatePredictionPoint = (
    homeScore: number,
    awayScore: number,
    outcome: string
) => {
    let point = 0;

    if (outcome === "homeWin" && homeScore > awayScore) point = 3;
    if (outcome === "draw" && homeScore === awayScore) point = 3;
    if (outcome === "awayWin" && homeScore === awayScore) point = 3;

    return point
}

export const composePredictionPoints = (predictions: IPrediction[], homeScore: number, awayScore: number) => {
    return predictions.map(({ outcome, _id }) => ({
        updateOne: {
            filter: {
                _id
            },
            update: {
                $set: { status: "completed", point: calculatePredictionPoint(homeScore, awayScore, outcome) }
            }
        }
    }));
};