import express from "express";
import vehicleController from "../controllers/vehicleController.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/", verifyToken, authorizeRoles("driver"), vehicleController.createVehicle);
router.get("/:id", vehicleController.getVehicle);

export default router;