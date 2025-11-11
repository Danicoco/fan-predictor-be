/** @format */

import { Schema } from "mongoose"
import { mongoosePagination, Pagination } from "mongoose-paginate-ts"

import { db } from "../connection"
import { IPayment } from "../../types"

const PaymentSchema: Schema = new Schema<IPayment>(
    {
        user: { type: "String", required: true, ref: "User" },
        provider: { type: "String", required: true },
        amount: { type: "Number", required: true },
        status: {
            type: "String",
            required: true,
            enum: ["pending", "successful", "failed"],
        },
        currency: { type: "String", required: true, enum: ["usd", "ngn"] },
        meta: { type: "Map", required: true },
        webhookResponse: { type: "Map" },
        deletedAt: { type: "String", default: null },
    },
    {
        autoIndex: true,
        versionKey: false,
        collection: "payments",
    }
)

PaymentSchema.set("timestamps", true)
PaymentSchema.plugin(mongoosePagination)
PaymentSchema.index({ user: 1, provider: 1 })

const PaymentModel = db.model<IPayment, Pagination<IPayment>>(
    "Payment",
    // @ts-ignore
    PaymentSchema
)

export default PaymentModel
