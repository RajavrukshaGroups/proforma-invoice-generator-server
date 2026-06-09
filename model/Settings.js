import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    gstin: String,
    pan: String,
    address: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branch: String,
    phone: String,
    email: String,
    website: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Settings", settingsSchema);