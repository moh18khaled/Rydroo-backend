import express from "express";
import tripController from "../controllers/tripController.js";
import verifyToken from "../middlewares/verifyToken.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post("/request", verifyToken, authorizeRoles("user"), tripController.requestTrip);
router.get("/:id", verifyToken, tripController.getTrip);
router.post("/:id/assign", verifyToken, authorizeRoles("driver","admin"), tripController.assignDriver);
router.patch("/:id/start", verifyToken, authorizeRoles("driver"), tripController.startTrip);
router.patch("/:id/complete", verifyToken, authorizeRoles("driver"), tripController.completeTrip);

export default router;