import express from "express"
import { bookingController } from "./bookings.controller";
import auth from "../../middleware/auth";


const router = express.Router();

router.post("/",auth("admin","customer"),bookingController.postBooking);
router.get("/",bookingController.getBooking);
router.put("/:userId",bookingController.updateBooking);



export const bookingsRoute=router;
