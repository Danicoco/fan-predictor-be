/** @format */

import { Request, Response, NextFunction } from "express"
import { catchError, tryPromise } from "../../common/utils"
import ContestService from "./service"

export const validateCreate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name } = req.body
    try {
        const [contest, error] = await tryPromise(
            new ContestService({ name }).findOne()
        )

        if (error) throw catchError("Error processing request", 400)
        if (contest) throw catchError("Name already taken. Use another name", 400)

        return next()
    } catch (error) {
        next(error)
    }
}
