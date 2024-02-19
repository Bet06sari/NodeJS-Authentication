import mongoose from "mongoose";

const ResetSchema = new mongoose.Schema({
    email: String,
    token: { type: String, unique: true },
});

export const Reset = mongoose.model("Reset", ResetSchema);
