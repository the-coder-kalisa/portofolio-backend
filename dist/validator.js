"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = void 0;
const joi_1 = __importDefault(require("joi"));
const emailExistence = require("email-existence");
const validateEmail = (email) => {
    const schema = joi_1.default.string().email().required();
    const { error } = schema.validate(email);
    if (!error) {
        return emailExistence.check(email, (err, response) => {
            return response || !err ? true : false;
        });
    }
    else {
        return false;
    }
};
exports.validateEmail = validateEmail;
