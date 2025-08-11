/** @format */

import { z } from "zod"

export const createSchema = z
    .object({
        match: z.string({ required_error: "Enter Match" }).nonempty(),
        competition: z.string({ required_error: "Enter Competition" }).nonempty(),
        outcome: z.enum(["draw", "homeWin", "awayWin"])
    })
    .strict()
