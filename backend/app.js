import express from "express";
import cors from "cors";
import router from "./routes/router.js";
import dotenv from "dotenv";
import connectDB from "./db/conn.js";
import path from 'path';
import { fileURLToPath } from "url";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.use((express.static(path.join(__dirname,"../client/dist"))))
app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,"../client/dist/index.html"))
});
// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port No: ${process.env.PORT}`);
});
