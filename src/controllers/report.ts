import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { manager } from "..";
import { DailyReport } from "../entity/DailyReport";
import dayjs from "dayjs";
import { User } from "../entity/User";

export class ReportController {
  public static currentReport(user: User): DailyReport | null {
    let now = dayjs();
    let d = new Date(`${now.format("YYYY-MM-DD")}T00:00:00.000`);
    return user.reports.find((el) => el.date === d);
  }

  public static async getReport(req: AuthRequest, res: Response): Promise<any> {
    let now = dayjs();
    let d = new Date(`${now.format("YYYY-MM-DD")}T00:00:00.000`);
    const report = req.user.reports.find((el) => el.date === d);
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
    const reports = req.user.reports.filter(
      (el) => el.date >= dayjs(d).subtract(1, "month").toDate(),
    );
    if (reports.length === 0) return res.status(404).end();
    res.status(200).json(reports.map((el) => el.toSerialized()));
  }
}
