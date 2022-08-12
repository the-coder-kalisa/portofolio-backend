const express = require("express");
const app = express();
const { validateEmail, mail, transporter } = require("./validator");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const emailExistence = require("email-existence");
const PORT = 5000;
app.use(express.json()).use(express.urlencoded());
app.use(cors());
app.get("/", (_req, res) => {
  res.send("backend for my portfolio");
});
app.post("/", (req, res) => {
  const { email, message } = req.body;

  if (validateEmail(email)) {
    emailExistence.check(email, (err, response) => {
      if (err) return res.status(500).send("something went wrong");
      if (response) {
        transporter.sendMail(mail(message, email), (err, info) => {
          if (err) {
            console.log(err);
            res.status(500).send("something went wrong");
          } else {
            console.log(info);
            res.send("email sent");
          }
        });
      } else {
        res.status(404).send("email not found");
      }
    });
  } else {
    res.status(400).send("Invalid email");
  }
});

const server = http.createServer(app);
server.listen(PORT, () => console.log(`server running on port ${PORT}`));
