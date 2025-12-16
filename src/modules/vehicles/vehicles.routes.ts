import express from "express"
import { vehiclesController } from "./vehicles.controller";


const router = express.Router();

router.post("/",vehiclesController.postVehicle);
router.get("/",vehiclesController.getVehicle);
router.get("/:vehicleId",vehiclesController.getVehicleId);
router.put("/:vehicleId",vehiclesController.updateVehicle);
router.delete("/:vehicleId",vehiclesController.deleteVehicle);


export const vehiclesRoute=router;
