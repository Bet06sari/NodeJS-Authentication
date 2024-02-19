import { Request, Response } from "express"
import { Reset } from "../entity/reset.entity";
import { createTransport } from "nodemailer";




export const Forgot = async (req: Request, res: Response) => {
    const {email} = req.body;
    const token = Math.random().toString(20).substring(2,12);

    const newReset = new Reset({
        email,
        token
    });
    await newReset.save();

    const transporter = createTransport({
        host: '0.0.0.0',
        port: 1025
    });

    const url = 'http://localhost:8000/reset/' + token;
    await transporter.sendMail({
        from: 'from@example.com',
        to: email,
        subject: 'Reset Password',
        html: `<a href="${url}">Reset Password</a>`
    });

    res.send({
        message: 'Please check your email'
    });
}