import express, { type Application } from "express";
import compnayRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";

const app : Application = express();

app.use(express.json())

app.use("/api/company", compnayRouter)
app.use("/api/users", userRouter)
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

export default app;

