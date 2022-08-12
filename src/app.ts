import express, { Application, Request, Response } from "express";
import { body } from "./types";
import { validateEmail } from "./validator";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
require("dotenv").config();
const app: Application = express();
const PORT: number = 5000;
const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_ADDRESS!,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID!,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET!,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN!,
    accessToken: process.env.GMAIL_OAUTH_ACCESS_TOKEN!,
    expires: parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE!),
  },
});
const mail = (message: string, email: string): Mail.Options => {
  return {
    from: email,
    to: process.env.GMAIL_ADDRESS!,
    subject: "hiriing",
    text: message,
  };
};
app.get("/", (_req: Request, res: Response) =>{
  res.send("backend for my portfolio");
})
app.post("/", (req: Request, res: Response): void => {
  const { email, message }: body = req.body;
  if (validateEmail(email)) {
    transport.sendMail(mail(message, email), (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.status(200).send(info.response);
      }
    });
  } else {
    res.status(400).send("Invalid email");
  }
});
app.listen(PORT, (): void => {
  console.log(`http://localhost:${PORT}`);
});
