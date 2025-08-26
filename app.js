const express = require("express");
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./db/connect");
const Quote = require("./models/Quote");
const BASE_URL = "http://localhost:8080";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to QuoteVault API" });
});

// GET ALL QUOTES (no passwords exposed)
app.get("${BASE_URL}/api/v1/quotes", async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    const sanitized = quotes.map((quote) => {
      const q = quote.toObject();
      delete q.password;
      return q;
    });
    res.status(200).json(sanitized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE NEW QUOTE
app.post("${BASE_URL}/api/v1/quotes", async (req, res) => {
  try {
    const { title, content, author, tags, password } = req.body;

    const newQuote = new Quote({
      title,
      content,
      author: author || "Anonymous",
      tags: tags || [],
      password: password?.trim() || undefined,
    });

    const savedQuote = await newQuote.save();
    const quoteToReturn = savedQuote.toObject();
    delete quoteToReturn.password;

    res.status(201).json(quoteToReturn);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET SINGLE QUOTE
app.get("${BASE_URL}/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const { password, includePassword } = req.query;
    const masterPassword = process.env.MASTER_PASSWORD;

    console.log("🚨 MASTER_PASSWORD:", masterPassword);
    console.log("🧪 Incoming password from query:", password);

    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const quoteData = quote.toObject();

    // Return full quote including password if requested explicitly
    if (includePassword === "true") {
      return res.status(200).json(quoteData);
    }

    // Password validation logic
    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    delete quoteData.password;
    res.status(200).json(quoteData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE QUOTE
app.put("${BASE_URL}/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const { title, content, author, tags, password, newPassword } = req.body;
    const masterPassword = process.env.MASTER_PASSWORD;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    quote.title = title;
    quote.content = content;
    quote.author = author;
    quote.tags = tags;

    if (typeof newPassword !== "undefined") {
      const cleanNewPwd = newPassword.trim();
      quote.password = cleanNewPwd !== "" ? cleanNewPwd : undefined;
    }

    const updatedQuote = await quote.save();
    const quoteToReturn = updatedQuote.toObject();
    delete quoteToReturn.password;

    res.status(200).json(quoteToReturn);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE QUOTE
app.delete("${BASE_URL}/api/v1/quotes/:id", async (req, res) => {
  try {
    const id = req.params.id.trim().replace(/\\/g, "");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid quote ID" });
    }

    const password = req.query.password || req.body.password;
    const masterPassword = process.env.MASTER_PASSWORD;
    const quote = await Quote.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    const isPasswordValid =
      password === masterPassword ||
      (!quote.password && !password) ||
      quote.password === password;

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    await quote.deleteOne();
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB();
    console.log("✅ Connected to DATABASE");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
  }
};

start();
