import dotenv from "dotenv";
dotenv.config();
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import { bookingsRoute } from "./modules/bookings/bookings.routes";
import { userRoutes } from "./modules/users/users.routes";
import { vehiclesRoute } from "./modules/vehicles/vehicles.routes";
import { initDb } from "./config/dB";


const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded())

initDb();

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingsRoute);
app.use("/api/v1/vehicles", vehiclesRoute);

app.listen(config.port, () => {
  console.log(`Example app listening on port ${config.port}`)
})
