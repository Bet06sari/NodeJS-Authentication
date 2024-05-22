import { Request, Response } from "express";
import { Reset } from "../entity/reset.entity";
import { createTransport } from "nodemailer";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";

export const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const token = Math.random().toString(20).substring(2, 12);

  const newReset = new Reset({
    email,
    token,
  });
  await newReset.save();

  const transporter = createTransport({
    host: "0.0.0.0",
    port: 1025,
  });

  const url = "http://localhost:3000/reset/" + token;
  await transporter.sendMail({
    from: "from@example.com",
    to: email,
    subject: "Reset Password",
    html: `<a href="${url}">Reset Password</a>`,
  });

  res.send({
    message: "Please check your email",
  });
};

export const ResetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password, password_confirm } = req.body;

    if (password !== password_confirm) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }

    const resetPassword = await Reset.findOne({ token: token });

    if (!resetPassword) {
      return res.status(400).send({
        message: "Invalid link",
      });
    }

    const user = await User.findOne({ email: resetPassword.email });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);
    user.password = hashedPassword;
    await user.save();

    res.send({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).send({
      message: "Internal server error",
    });
  }
};
