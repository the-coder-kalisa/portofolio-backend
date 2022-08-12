const express = require("express");
const app = express();
const { validateEmail, mail, transporter } = require("./validator");
require("dotenv").config();
const http = require("http");
const PORT = 5000;
app.get("/me", (_req, res) => {
  res.send("backend for my portfolio");
});
app.get("/", (req, res) => {
  const { email, message } = req.body;
  if (validateEmail(email)) {
    transporter.sendMail(mail(message, email), (err, info) => {
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

const server = http.createServer(app);
server.listen(PORT, () => console.log(`server running on port ${PORT}`))