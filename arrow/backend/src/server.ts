import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/arrow", {
    dbName: "arrow",
  })
  .then(() => console.log("🟢 MongoDB connecté"))
  .catch((err) => console.error("🔴 Erreur de connexion MongoDB :", err));

app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
