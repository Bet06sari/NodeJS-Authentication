import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { User } from "../entity/user.entity";
import {sign, verify} from 'jsonwebtoken'


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

export const Login = async  (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ 
        message: "Kullanıcı bulunamadı" 
      });
    }

    if (!user.password) {
      return res.status(400).json({ 
        message: "Kullanıcı şifresi bulunamadı" 
      });
    }

    const isPasswordValid = await bcryptjs.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Şifre hatalı"
      });
    }

    const accessToken = sign({
      id: user.id
    }, process.env.ACCESS_SECRET || '', {expiresIn: '30s'});

    const refreshToken = sign({
      id: user.id
    }, process.env.REFRESH_SECRET || '', {expiresIn: '1w'});

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.send({
      message: 'success'
    });

  } catch (error) {
    console.error("Kullanıcı girişi yapılırken hata:", error);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const AuthenticatedUser = async  (req: Request, res: Response) => {
  try {
    const cookie = req.cookies['access_token'];
    const payload: any = verify(cookie, process.env.ACCESS_SECRET || '');

    if(!payload) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const user = await User.findOne({ _id: payload.id });
    console.log(user);

    if(!user) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const { password, ...data } = user.toObject();  //mongoose modelini js nesnesine dönüştürme
    res.send(data);


  } catch(e) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
}