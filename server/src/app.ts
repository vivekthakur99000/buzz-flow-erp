import express, { type Application } from "express";
import compnayRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import supplierRouter from "./routes/supplier.route.js";
import purchaseRouter from "./routes/purchaseOrder.route.js";
import customerRouter from "./routes/customer.route.js";
import hrRouter from "./routes/hr.routes.js";

const app : Application = express();

app.use(express.json())

app.use("/api/company", compnayRouter)
app.use("/api/users", userRouter)
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/purchase-order', purchaseRouter);
app.use('/api/customers', customerRouter);
app.use('/api/hr', hrRouter);

export default app;

