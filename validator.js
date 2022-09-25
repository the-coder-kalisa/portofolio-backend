const joi = require("joi")
const emailExistence = require("email-existence");
const nodemailer = require("nodemailer")
exports.validateEmail = (email) => {
  const schema = joi.string().email().required();
  const { error } = schema.validate(email);
  if(error) return false;
    return true;
};

exports.transporter = nodemailer.createTransport({
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
  exports.mail = (message, email, name) => {
    return {
      from: email,
      to: process.env.GMAIL_ADDRESS,
      subject: "hiring",
      text: `Mr ${name} with email ${email} says: ${message}`,
    };
  };