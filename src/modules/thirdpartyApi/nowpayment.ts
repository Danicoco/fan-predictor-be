/** @format */

import axios from "axios"
import { createReference } from "../common/utils"
import { configs } from "../common/utils/config";
import { NowPaymentStatusResponse } from "../../types";

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
            is_fixed_rate: true,
            is_fee_paid_by_user: true,
            order_id: createReference(),
            order_description: `Deposit of ${amount} to fund your account`,
            ipn_callback_url: "https://api.predictcontest.com/v1/now/ipn",
            success_url: "https://predictcontest.com/deposit-successful",
            cancel_url: "https://predictcontest.com/deposit-failed",
        }
        console.log(values, "VALUES")
        const { data } = await this.http.post("/v1/invoice", values).catch((e) => {
            console.log(e.response);
            throw new Error("There was an issue on our end. Please try again");
        });
        return data;
    }

    public async getPaymentStatus(paymentId: string): Promise<NowPaymentStatusResponse> {
        const { data } = await this.http.get(`/v1/payment/${paymentId}`).catch((e) => {
            console.log(e.response);
            throw new Error("Error retrieving payment");
        });
        return data;

    }
}

export default NowPayment;
