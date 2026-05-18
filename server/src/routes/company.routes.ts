import { type Application, Router } from "express";
import { createCompany } from "../controller/company.controller.js";

const compnayRouter = Router();

compnayRouter.post("/create", createCompany);

export default compnayRouter;