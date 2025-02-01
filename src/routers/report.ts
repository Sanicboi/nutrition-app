import express from "express";
import { Auth, AuthRequest } from "../middleware/auth";
import { ReportController } from "../controllers/report";

const router = express.Router();

router.get(
  "/report",
  (req: AuthRequest, res, next) =>
    Auth.authenticate(req, res, next, {
      reports: {
        food: true,
        exercises: {
          exercise: true,
        },
      },
    }),
  ReportController.getReport,
);

router.get(
  "/reports",
  (req: AuthRequest, res, next) =>
    Auth.authenticate(req, res, next, {
      reports: {
        food: true,
        exercises: {
          exercise: true,
        },
      },
    }),
  ReportController.getMonthReports,
);

router.post(
  "/report",
  (req: AuthRequest, res, next) =>
    Auth.authenticate(req, res, next, {
      reports: true,
    }),
  ReportController.createReport,
);

export default router;
