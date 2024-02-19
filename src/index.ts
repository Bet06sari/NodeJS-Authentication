import dotenv from 'dotenv';
import express, { Request, Response } from "express";
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


app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
