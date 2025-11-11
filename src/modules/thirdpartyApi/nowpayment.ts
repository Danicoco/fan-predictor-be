/** @format */

import axios from "axios"
import { createReference } from "../common/utils"
import { configs } from "../common/utils/config";

class NowPayment {
    private http = axios.create({
        baseURL: "https://api.nowpayments.io",
        headers: {
            "x-api-key": configs.NOW_PAYMENT_API || "",
            "Content-Type": "application/json",
        },
    })
    constructor() {}

    public async createPayment(amount: number, fee: number) {
        const values = {
            price_amount: Number(amount) + Number(fee),
            price_currency: "usd",
            pay_currency: "usdtsol",
            order_id: createReference(),
            order_description: `Deposit of ${amount} for PvP`,
            ipn_callback_url: "https://api.predictcontest.com/v1/now/ipn",
            success_url: "https://predictcontest.com/deposit-successful",
            cancel_url: "https://predictcontest.com/deposit-failed",
        }
        const { data } = await this.http.post("/v1/invoice", values).catch((e) => {
            console.log(e.response.data);
            throw new Error("Error creating payment");
        });
        return data;
    }
}

export default NowPayment;
