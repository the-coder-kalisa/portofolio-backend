import joi from "joi";
const emailExistence = require("email-existence");
export const validateEmail = (email: string): boolean => {
  const schema = joi.string().email().required();
  const { error } = schema.validate(email);
  if (!error) {
    return emailExistence.check(
      email,
      (err: Error | null, response: string) => {
        return response || !err ? true : false;
      }
    );
  } else {
    return false;
  }
};
