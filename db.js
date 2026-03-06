const { MongoClient } = require("mongodb");

// MongoDB connection string
const uri = "mongodb+srv://username:pwd@cluster0.ujq0yeu.mongodb.net/?appName=Cluster0";
//const uri = "mongodb+srv://username:pwd@cluster0.ujq0yeu.mongodb.net/ProjectDB?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let db;

async function connectDB() {
  try {
    await client.connect();
    console.log("MongoDB Connected");

    db = client.db("ProjectDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  return db;
}

module.exports = { connectDB, getDB };


