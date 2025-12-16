import express from "express"
import { bookingController } from "./bookings.controller";


const router = express.Router();

router.post("/",bookingController.postBooking);
router.get("/",bookingController.getBooking);
router.put("/:userId",bookingController.updateBooking);



export const bookingsRoute=router;
