import { Router } from "express";
import { UserController } from "../controllers/user";
import { Auth } from "../middleware/auth";

const router = Router();

router.post("/login", UserController.login);
router.post("/user", UserController.signup);
router.post(
  "/deletiontoken",
  Auth.authenticate,
  UserController.authorizeDeletion,
);
router.get("/me", Auth.authenticate, UserController.getMe);
router.put("/me", Auth.authenticate, UserController.editMe);
router.delete("/me", Auth.authenticate, UserController.delete);

export default router;
