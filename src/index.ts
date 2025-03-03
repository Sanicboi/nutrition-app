import express from "express";
import { AppDataSource } from "./data-source";

import report from "./routers/report";
import user from "./routers/user";
import food from "./routers/food";
import { Spoonacular } from "./spoonacular";
import { Auth, AuthRequest } from "./middleware/auth";
import { ReportController } from "./controllers/report";
require("dotenv").config();
export const manager = AppDataSource.manager;
export const spoonacular = new Spoonacular(process.env.SPOONACULAR_KEY);

export const app = express();

AppDataSource.initialize()
  .then(async () => {
    // create express app

    app.use(express.json());

    app.use("/api", user);
    app.use("/api", report);
    app.use("/api/food", food);
    app.post('/api/water', (req: AuthRequest, res, next) => Auth.authenticate(req, res, next, {
      reports: true,
    }), async (req: AuthRequest<{
      water: number
    }>, res) => {
      const report = ReportController.currentReport(req.user);
      report.waterDrunkToday += req.body.water / 100;
      await manager.save(report);
      res.status(204).end();
    })

    // start express server
    app.listen(80);
  })
  .catch((error) => console.log(error));
