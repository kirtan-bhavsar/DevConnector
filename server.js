import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/api/auth.js";
import postRoutes from "./routes/api/posts.js";
import profileRoutes from "./routes/api/profile.js";
import userRoutes from "./routes/api/users.js";

const app = express();

connectDB();

// Importing Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API Running successfully !"));

app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
