import express from "express"
import { vehiclesController } from "./vehicles.controller";
import auth from "../../middleware/auth";


const router = express.Router();

router.post("/",auth("admin"),vehiclesController.postVehicle);
router.get("/",vehiclesController.getVehicle);
router.get("/:vehicleId",vehiclesController.getVehicleId);
router.put("/:vehicleId",auth("admin"),vehiclesController.updateVehicle);
router.delete("/:vehicleId",auth("admin"),vehiclesController.deleteVehicle);


export const vehiclesRoute=router;
