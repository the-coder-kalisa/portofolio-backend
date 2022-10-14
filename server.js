require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const emailExistence = require("email-existence");
const nodemailer = require("nodemailer");
app.use(express.json()).use(express.urlencoded()).use(cors());
const port = process.env.PORT || 5000;
const transporter = nodemailer.createTransport({
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
    expires: Number.parseInt(process.env.GMAIL_OAUTH_TOKEN_EXPIRE, 10),
  },
});
app.get("/", (_req, res) => {
  res.status(200).send("my potoflio backend");
});
app.post("/", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || name === "") return res.status(400).send("name is required");
  if (
    !email ||
    email === "" ||
    !/[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim.test(email)
  )
    return res.status(400).send("email must be valid");
  if (!message || message === "")
    return res.status(400).send("message is required");
  const mailOptions = {
    from: email,
    to: process.env.GMAIL_ADDRESS,
    subject: `hiring`,
    text: `name: ${name} email: ${email} message: ${message}`,
  };
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      res.status(500).send("Email was not sent check your email or network");
    } else {
      if (data.accepted.includes(email)) {
        res.status(200).send("Email sent successfully");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
