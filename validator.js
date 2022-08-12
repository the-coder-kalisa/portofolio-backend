const joi = require("joi")
const emailExistence = require("email-existence");
exports.validateEmail = (email) => {
  const schema = joi.string().email().required();
  const { error } = schema.validate(email);
  if (!error) {
    return emailExistence.check(
      email,
      (err, response) => {
        return response || !err ? true : false;
      }
    );
  } else {
    return false;
  }
};
