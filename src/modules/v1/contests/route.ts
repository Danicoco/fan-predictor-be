/** @format */

import { Router } from "express"

import { createSchema, fetchSchema, joinSchema } from "./validation"
import { create, fetch, join, } from "./controller"
import { validator } from "../../common/utils"
import { validateCreate } from "./middleware"

const contestRouter = Router({
    caseSensitive: true,
    strict: true,
})

contestRouter.post(
    "/",
    validator.body(createSchema),
    validateCreate,
    create
)

contestRouter.post(
    "/join",
    validator.body(joinSchema),
    join
)

contestRouter.get(
    "/",
    validator.query(fetchSchema),
    fetch
)

export default contestRouter
