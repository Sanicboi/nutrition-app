import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { ReportController } from "./report";
import { ReportFood } from "../entity/ReportFood";
import { manager, spoonacular } from "..";

export class FoodController {
  public static async add(
    req: AuthRequest<{
      proteins: number;
      fats: number;
      carbs: number;
      mass: number;
      calories: number;
      name: string;
    }>,
    res: Response,
  ): Promise<any> {
    const report = ReportController.currentReport(req.user);
    if (!report) return res.status(404).end();
    const food = new ReportFood();
    food.name = req.body.name;
    food.fats = req.body.fats;
    food.carbs = req.body.carbs;
    food.mass = req.body.mass;
    food.calories = req.body.calories;
    food.report = report;
    food.reportId = report.id;
    await manager.save(food);
  }

  public static async search(
    req: AuthRequest<
      any,
      {
        q: string;
      }
    >,
    res: Response,
  ): Promise<any> {
    const r = await spoonacular.search(req.query.q);
    const remade = 
    res.status(200).json();
  }
}
