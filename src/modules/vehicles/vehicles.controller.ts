import { Request, Response } from "express";
import { vehiclesService } from "./vehicles.service";



const postVehicle = async (req: Request, res: Response) => {
  try {
    const result =await vehiclesService.postVehicle(req.body);
    res.status(200).json({
      success: true,
      message: "Vehicle Created Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getVehicle = async (req: Request, res: Response) => {
  try {
    const result =await vehiclesService.getVehicle();
    res.status(200).json({
      success: true,
      message: "All Vehicle Fetched Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getVehicleId = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);
  try {
    
    const result =await vehiclesService.getVehicleId(id);
    res.status(200).json({
      success: true,
      message: "User Created Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);

  try {
    const result =await vehiclesService.updateVehicle(id, req.body);
    res.status(200).json({
      success: true,
      message: "Vehicle Updated Succesfully!",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  const id = Number(req.params.vehicleId);

  try {
    const result =await vehiclesService.deleteVehicle(id);
    res.status(200).json({
      success: true,
      message: "Vehicle Delete Succesfully!",
       data: `Vehicle_id:${id} is ${result} Succesfully`,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
export const vehiclesController = {
  postVehicle,
  getVehicle,
 getVehicleId,
 deleteVehicle,
 updateVehicle
};
