import dotenv from 'dotenv';
import express from "express";
import { routes } from './routes';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: ['http://localhost:4200', 'https://localhost:8080', 'https://localhost:8000'],
  credentials: true
}));

const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI!, {
}).then(() => {
  console.log("MongoDB'ye bağlantı başarılı");
}).catch((err) => {
  console.error("MongoDB'ye bağlanırken hata oluştu:", err);
  process.exit(1);
});

routes(app);
  
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });

