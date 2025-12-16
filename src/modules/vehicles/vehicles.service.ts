import { Pool } from "pg";
import config from "../../config";

const pool = new Pool({
  connectionString: config.connectionStr,
});



const postVehicle = async (payload: Record <string,unknown>) => {

    const {vehicle_name, type, registration_number, daily_rent_price , availability_status} = payload;


  try {
    const result = await pool.query(
      `
        INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price , availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
      [vehicle_name, type, registration_number, daily_rent_price , availability_status]
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
    return result.rows[0];
  } catch (err) {
    return err;
  }
};

const getVehicleId = async (id : string) => {
  try {
    const result = await pool.query(`
        SELECT * FROM vehicles WHERE id=$1
        `,[id]);
    return result.rows[0];
  } catch (err) {
    return err;
  }
};

const updateVehicle =async (id: string, payload: Record<string, unknown>) => {
 const {vehicle_name, type, registration_number, daily_rent_price , availability_status} = payload;


  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_name=$1 ,type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`,
      [vehicle_name, type, registration_number, daily_rent_price , availability_status, id]
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

const deleteVehicle = async (id: string) => {


  try {
    const result = await pool.query(
      `DELETE FROM vehicles WHERE id=$1`,
      [ id]
    );

    if (result.rows.length === 0) {
      return "Vehicle Not Found!";
    } else {
      return result.rows[0];
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
 updateVehicle
};
