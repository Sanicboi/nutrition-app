import { Router } from "express";
import { Auth, AuthRequest } from "../middleware/auth";
import { FoodController } from "../controllers/food";

const router = Router();

router.get("/search", Auth.authenticate, FoodController.search);

router.post(
  "/",
  (req: AuthRequest, res, next) =>
    Auth.authenticate(req, res, next, {
      reports: true,
    }),
  FoodController.add,
);

router.delete(
  "/:id",
  (req: AuthRequest, res, next) =>
    Auth.authenticate(req, res, next, {
      reports: true,
    }),
  FoodController.delete,
);

router.get(
  "/:category/:id/nutrition",
  Auth.authenticate,
  FoodController.getNutrition,
);

export default router;
