const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  author: { type: String, required: true, default: "Anonymous" },
  tags: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Blog", blogSchema);
