const express = require("express");
const app = express();
const { validateEmail, mail, transporter } = require("./validator");
require("dotenv").config();
const cors = require("cors");
const emailExistence = require("email-existence");
app.use(express.json()).use(express.urlencoded());
app.use(cors());
app.get("/", (_req, res) => {
  res.send("backend for my portfolio");
});
var port = process.env.PORT || 5000;
app.post("/", (req, res) => {
  const { email, message, name } = req.body;

  if (validateEmail(email)) {
    emailExistence.check(email, (err, response) => {
      if (err) return res.status(500).send("something went wrong");
      if (response) {
        transporter.sendMail(mail(message, email, name), (err, info) => {
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
app.listen(port, () => {
  console.log("localhost:" + port);
});
