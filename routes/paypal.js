const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const verify = require('../config/verifyToken');

dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

const router = express.Router();

const generateAccessToken = async () => {
    try {
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
        console.log(auth);
        const response = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
        });

        return response.data.access_token;
    } catch (error) {
        throw new Error("Failed to generate Access Token");
    }
};

const handleResponse = async (response) => {
    return {
        jsonResponse: response.data,
        httpStatusCode: response.status,
    };
};

const createOrder = async (productType) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders`;

    const prices = {
        Premium: "60",
        Professionist: "240",
    };

    const price = prices[productType] || "0"; // Default to "0" if productType is not recognized

    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: "EUR",
                    value: price,
                },
            },
        ],
        application_context: {
            return_url: "https://nutriverse-b13w.onrender.com/",
            cancel_url: "https://nutriverse-b13w.onrender.com/",
        },
    };

    const response = await axios.post(url, payload, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
};

const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await axios.post(url, {}, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
};

router.post("/", verify,async (req, res) => {
    const { productType } = req.body;
    try {
        const { jsonResponse, httpStatusCode } = await createOrder(productType);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to create order:", error);
        res.status(500).json({ message: "Failed to create order" });
    }
});

router.post("/:orderID", verify,async (req, res) => {
    const orderID = req.params.orderID;
    try {
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
        res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
        console.error("Failed to capture order:", error);
        res.status(500).json({ message: "Failed to capture order" });
    }
});

module.exports = router;
