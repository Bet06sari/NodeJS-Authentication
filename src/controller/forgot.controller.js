"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPassword = exports.ForgotPassword = void 0;
const reset_entity_1 = require("../entity/reset.entity");
const nodemailer_1 = require("nodemailer");
const user_entity_1 = require("../entity/user.entity");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ForgotPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const token = Math.random().toString(20).substring(2, 12);
    const newReset = new reset_entity_1.Reset({
      email,
      token,
    });
    yield newReset.save();
    const transporter = (0, nodemailer_1.createTransport)({
      host: "0.0.0.0",
      port: 1025,
    });
    const url = "http://localhost:3000/reset/" + token;
    yield transporter.sendMail({
      from: "from@example.com",
      to: email,
      subject: "Reset Password",
      html: `<a href="${url}">Reset Password</a>`,
    });
    res.send({
      message: "Please check your email",
    });
  });
exports.ForgotPassword = ForgotPassword;
const ResetPassword = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const { token, password, password_confirm } = req.body;
      if (password !== password_confirm) {
        return res.status(400).send({
          message: "Passwords do not match",
        });
      }
      const resetPassword = yield reset_entity_1.Reset.findOne({
        token: token,
      });
      if (!resetPassword) {
        return res.status(400).send({
          message: "Invalid link",
        });
      }
      const user = yield user_entity_1.User.findOne({
        email: resetPassword.email,
      });
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
      const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
      user.password = hashedPassword;
      yield user.save();
      res.send({
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).send({
        message: "Internal server error",
      });
    }
  });
exports.ResetPassword = ResetPassword;
