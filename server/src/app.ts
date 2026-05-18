import express, { type Application } from "express";
import compnayRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";

const app : Application = express();

app.use(express.json())

app.use("/api/company", compnayRouter)
app.use("/api/users", userRouter)

export default app;

