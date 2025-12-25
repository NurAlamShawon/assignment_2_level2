import { Pool } from "pg";
import config from "../../config";
import jwt, { JwtPayload } from "jsonwebtoken";

const pool = new Pool({
  connectionString: config.connectionStr,
});

type VehiclePayload = {
  vehicle_name: string;
  type: string;
  registration_number: string;
  daily_rent_price: number;
  availability_status: string;
};

const postVehicle = async (payload: VehiclePayload , token :string) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

   const decoded = jwt.decode(token) as JwtPayload;
  const role = decoded.role;
  if (role != "admin") {
    return "You dont have access to Create Vehicles";
  }
  try {
    const result = await pool.query(
      `INSERT INTO vehicles(vehicle_name, "type", registration_number, daily_rent_price , availability_status)   VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
      ]
    );

    return result.rows[0];
  } catch (err) {
    return err;
  }
};

const getVehicle = async () => {
  try {
    const result = await pool.query(`
        SELECT * FROM vehicles
        `);
    return result.rows;
  } catch (err) {
    return err;
  }
};

const getVehicleId = async (id: Number) => {
  try {
    const result = await pool.query(
      `
        SELECT * FROM vehicles WHERE id=$1
        `,
      [id]
    );
    return result.rows[0];
  } catch (err) {
    return err;
  }
};

const updateVehicle = async (id: Number, payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_name=$1 ,type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return null;
    } else {
      return result.rows[0];
    }
  } catch (err) {
    return err;
  }
};

const deleteVehicle = async (id: Number, token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;
  const role = decoded.role;
  if (role != "admin") {
    return "You dont have access to Delete Vehicles";
  }
  try {
    const test = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [id]);

    console.log(test);

    if (!(test.rows[0].availability_status === "booked")) {
      const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [id]);

      console.log(result);

      if (result.rowCount === 1) {
        return result.command;
      } else {
        return "Unsuccessfull";
      }
    }else{
      return "Vehicle is booked stage!";
    }
  } catch (err) {
    return err;
  }
};

export const vehiclesService = {
  postVehicle,
  getVehicle,
  getVehicleId,
  deleteVehicle,
  updateVehicle,
};
