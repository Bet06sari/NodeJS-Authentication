import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../entity/user.entity";


export const Register = async (req: Request, res: Response) => {
    try {
        const { first_name, last_name, email, password } = req.body;
    
        const hashedPassword = await bcryptjs.hash(password, 12);
    
        const newUser = new User({
          first_name,
          last_name,
          email,
          password: hashedPassword
        });
    
        // Kullanıcıyı veritabanına kaydetme
        await newUser.save();
        console.log(newUser);
        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu" });
      } catch (error) {
        console.error("Kullanıcı oluşturulurken hata:", error);
        res.status(500).json({ error: "Sunucu hatası" });
      }
};