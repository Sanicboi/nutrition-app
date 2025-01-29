import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { manager } from "..";
import { DailyReport } from "../entity/DailyReport";
import dayjs from "dayjs";

export class FoodRouter {
  public static async getReport(req: AuthRequest, res: Response): Promise<any> {
    let now = dayjs();
    let d = new Date(`${now.format("YYYY-MM-DD")}T00:00:00.000`);
    console.log(d.toString());
    const report = await manager
      .getRepository(DailyReport)
      .createQueryBuilder("report")
      .select()
      .where("report.userId = :uid", {
        uid: req.user.username,
      })
      .andWhere("report.date = :date", {
        date: d,
      })
      .leftJoinAndSelect("report.food", "repf")
      .leftJoinAndSelect("report.exercises", "repex")
      .leftJoinAndSelect("repex.exercise", "exercise")
      .getOne();
    if (!report) return res.status(404).end();
    res.status(200).json(report.toSerialized());
  }

  public static async createReport(
    req: AuthRequest,
    res: Response,
  ): Promise<any> {
    let now = dayjs();
    let d = new Date(`${now.format("YYYY-MM-DD")}T00:00:00.000`);
    const prev = await manager.findOneBy(DailyReport, {
      userId: req.user.username,
      date: d,
    });
    if (prev) return res.status(409).end();
    const report = new DailyReport();
    report.date = d;
    report.user = req.user;
    report.userId = req.user.username;
    await manager.save(report);
    res.status(201).end();
  }

  public static async getMonthReports(
    req: AuthRequest,
    res: Response,
  ): Promise<any> {
    let now = dayjs();
    let d = new Date(`${now.format("YYYY-MM-DD")}T00:00:00.000`);
    const reports = await manager
      .getRepository(DailyReport)
      .createQueryBuilder("report")
      .select()
      .where("report.userId = :id", {
        id: req.user.username,
      })
      .andWhere("report.date >= :start", {
        start: dayjs(d).subtract(1, "month").toDate(),
      })
      .leftJoinAndSelect("report.food", "repf")
      .leftJoinAndSelect("report.exercises", "repex")
      .leftJoinAndSelect("repex.exercise", "exercise")
      .getMany();
    if (reports.length === 0) return res.status(404).end();
    res.status(200).json(reports.map((el) => el.toSerialized()));
  }

  public static async addFood(
    req: AuthRequest<{
      id: number;
    }>,
    res: Response,
  ): Promise<any> {}
}
