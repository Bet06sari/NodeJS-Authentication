import dotenv from 'dotenv';
import express from "express";
import { routes } from './routes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(express.json());

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

