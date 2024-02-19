import { Request, Response } from "express"
import { Reset } from "../entity/reset.entity";


export const Forgot = async (req: Request, res: Response) => {
    const {email} = req.body;
    const token = Math.random().toString(20).substring(2,12);

    const newReset = new Reset({
        email,
        token
    });
    await newReset.save();

    res.send(newReset);
}