const express = require("express");
const shortid = require("shortid");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

// MongoDB connection string
const uri = "mongodb+srv://username:pwd@cluster0.ujq0yeu.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

async function startServer() {
  try {
    // Connect to MongoDB
    await client.connect();
    console.log("MongoDB Connected");

    const db = client.db("ProjectDB");
    const urlsCollection = db.collection("urls");

    // Home route
    app.get("/", (req, res) => {
      res.send("URL Shortener API Running");
    });

    // Create short URL
    app.post("/shorten", async (req, res) => {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const shortCode = shortid.generate();

      await urlsCollection.insertOne({
        shortCode: shortCode,
        originalUrl: url
      });

      res.json({
        shortUrl: `http://localhost:5000/${shortCode}`
      });
    });

    // Redirect to original URL
    app.get("/:code", async (req, res) => {
      const result = await urlsCollection.findOne({
        shortCode: req.params.code
      });

      if (result) {
        res.redirect(result.originalUrl);
      } else {
        res.status(404).send("URL not found");
      }
    });

    // Start server
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

startServer();
