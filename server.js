const express = require("express");
const app = express();
const { validateEmail } = require("./validator");
require("dotenv").config();
const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
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
    subject: "hiring",
    text: message,
  };
};
app.get("/", (_req, res) => {
  res.send("backend for my portfolio");
});
app.post("/", (req, res) => {
  const { email, message } = req.body;
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
app.listen(3000, () => {
  console.log(`server started on port 3000`);
});
