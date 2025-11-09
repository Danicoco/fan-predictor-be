/** @format */

import { IPayment } from "../../../types"
import { PaymentModel } from "../../../databases"
import BaseRepository from "../../common/repositories/BaseRepository"
import { FilterQuery } from "mongoose"

class PaymentService extends BaseRepository<IPayment> {
    constructor(params: Partial<IPayment> | FilterQuery<IPayment>) {
        super(PaymentModel, params)
    }
}

export default PaymentService
