"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validator_1 = require("./validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = 5000;
const transport = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_ADDRESS,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN,
        expires: parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE),
    },
});
const mail = (message, email) => {
    return {
        from: email,
        to: process.env.GMAIL_ADDRESS,
        subject: "hiriing",
        text: message,
    };
};
app.post("/", (req, res) => {
    const { email, message } = req.body;
    if ((0, validator_1.validateEmail)(email)) {
        transport.sendMail(mail(message, email), (err, info) => {
            if (err) {
                res.status(500).send(err.message);
            }
            else {
                res.status(200).send(info.response);
            }
        });
    }
    else {
        res.status(400).send("Invalid email");
    }
});
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
