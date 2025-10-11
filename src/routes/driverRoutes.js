import express from "express";
import driverController from "../controllers/driverController.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/profile", verifyToken, authorizeRoles("driver","admin"), driverController.createProfile);
router.get("/profile/:id", verifyToken, driverController.getProfile);

export default router;