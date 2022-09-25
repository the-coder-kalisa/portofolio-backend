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
app.get("/", (_req, res) =>{
  res.status(200).send("my potoflio backend");
})
app.post("/send", (req, res) => {
  const { name, email, message } = req.body;
  const mailOptions = {
    from: email,
    to: process.env.GMAIL_ADDRESS,
    subject: `hiring`,
    text: `name: ${name} email: ${email} message: ${message}`,
  };
  if (
    emailExistence.check(email, (error, response) => {
      if (error) return res.status(500).send(error);
      if (response) {
        transporter.sendMail(mailOptions, (err, data) => {
          if (err) {
            res.status(500).send("something went wrong");
          } else {
            res.status(200).json("Email sent successfully");
          }
        });
      } else {
        res.status(404).send("email does not exist");
      }
    })
  );
});
app.listen(port, () => {console.log(`localhost:${port}`)})
