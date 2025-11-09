/** @format */

import { Router } from "express"

import { get, initializeNowPayment, initializeSarepayPayment, verifyTransaction } from "./controller"
import { Authenticate } from "../../common/utils"

const walletRouter = Router({
    caseSensitive: true,
    strict: true,
})

walletRouter.get("/", Authenticate, get)
walletRouter.post("/", Authenticate, initializeSarepayPayment)
walletRouter.post("/now", Authenticate, initializeNowPayment)
walletRouter.post("/verify-payment", verifyTransaction)

export default walletRouter
