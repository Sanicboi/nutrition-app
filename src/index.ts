import express from "express";
import { AppDataSource } from "./data-source";

import report from "./routers/report";
import user from "./routers/user";
import food from "./routers/food";
import { Spoonacular } from "./spoonacular";
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

    // start express server
    app.listen(80);
  })
  .catch((error) => console.log(error));
