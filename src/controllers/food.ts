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
    res.status(201).json(food);
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
    res.status(200).json(r);
  }

  public static async addWater(req: AuthRequest<{
    volume: number;
  }>, res: Response): Promise<any> {
    const report = ReportController.currentReport(req.user);
    if (!report) return res.status(404).end();
    report.waterDrunkToday += req.body.volume;
    await manager.save(report);
    res.status(204).end();
  }

  public static async getNutrition(
    req: AuthRequest<
      any,
      any,
      {
        id: string;
        type: "recipe" | "product" | "menuItem";
      }
    >,
    res: Response,
  ): Promise<any> {
    if (req.params.type === "recipe") {
      const r = await spoonacular.getRecipeNutrition(req.params.id);
      return res.status(200).json(r);
    }

    if (req.params.type === "product") {
      const r = await spoonacular.getProductNutrition(req.params.id);
      return res.status(200).json(r);
    }

    if (req.params.type === "menuItem") {
      const r = await spoonacular.getMenuItemNutrition(req.params.id);
      return res.status(200).json(r);
    }

    res.status(400).end();
  }

  public static async delete(
    req: AuthRequest<
      any,
      any,
      {
        id: string;
      }
    >,
    res: Response,
  ): Promise<any> {
    const cRep = ReportController.currentReport(req.user);
    await manager
      .getRepository(ReportFood)
      .createQueryBuilder("food")
      .delete()
      .where("food.id = :id", {
        id: req.params.id,
      })
      .andWhere("food.reportId = :report", {
        report: cRep.id,
      })
      .execute();

    res.status(204).end();
  }
}
