import dotenv from "dotenv";
dotenv.config();
import express from "express";
import api from "./api";

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: false }));
app.use("/", api);

export default app;
