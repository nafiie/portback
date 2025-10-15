import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // Will store Cloudinary image URL
  link: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Project", projectSchema);
