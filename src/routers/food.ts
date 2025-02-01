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

export default router;
