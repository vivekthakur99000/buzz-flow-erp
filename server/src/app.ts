import express, { type Application } from "express";
import companyRouter from "./routes/company.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import orderRouter from "./routes/order.routes.js";
import supplierRouter from "./routes/supplier.routes.js";
import purchaseRouter from "./routes/purchaseOrder.routes.js";
import customerRouter from "./routes/customer.routes.js";
import hrRouter from "./routes/hr.routes.js";
import employeeProfileRouter from "./routes/employeeProfile.routes.js";
import dashboardRouter from "./routes/dashboard.route.js";
import cors from "cors"

const app : Application = express();

// 2. Add the CORS middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your Vite frontend URL
    credentials: true, // Allows cookies and authorization headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
  })
);

app.use(express.json())

app.use("/api/company", companyRouter)
app.use("/api/users", userRouter)
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/suppliers', supplierRouter);
app.use('/api/purchase-order', purchaseRouter);
app.use('/api/customers', customerRouter);
app.use('/api/hr', hrRouter);
app.use('/api/employee-profile', employeeProfileRouter);
app.use('/api/dashboard', dashboardRouter);

export default app;

