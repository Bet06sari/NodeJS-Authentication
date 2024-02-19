import dotenv from 'dotenv';
import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import { createConnection } from 'typeorm';

dotenv.config();

const app = express();
app.use(express.json());

createConnection().then(() => {
  console.log("database connection successful");
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });
  
  app.listen(3000, () => {
    console.log("Example app listening on port 3000!");
  });
});

