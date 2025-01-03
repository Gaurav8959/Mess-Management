import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";
import dotenv from "dotenv";
import connectDB from "./db/conn.js";
dotenv.config();

const app = express();

// DB Connection
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000", // The URL of your frontend
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use("/api", router);

// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port No: ${process.env.PORT}`);
});
