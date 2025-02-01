import express from "express";
import bodyParser from "body-parser";
import { AppDataSource } from "./data-source";

import report from "./routers/report";
import user from "./routers/user";
import food from "./routers/food";
import { Spoonacular } from "./spoonacular";
export const manager = AppDataSource.manager;
export const spoonacular = new Spoonacular(process.env.SPOONACULAR_KEY);

export const app = express();
require("dotenv").config();
AppDataSource.initialize()
  .then(async () => {
    // create express app

    app.use(bodyParser.json());

    app.use("/api", user);
    app.use("/api", report);
    app.use("/api/food", food);

    // start express server
    app.listen(80);
  })
  .catch((error) => console.log(error));
