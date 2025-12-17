
import cron from "node-cron";
import { Pool } from "pg";
import config from "../config";



cron.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();
    const pool = new Pool({
  connectionString: config.connectionStr,
});

    const query = await pool.query(
      `
      UPDATE bookings
      SET status = 'returned'
      WHERE end_date <= $1
        AND status = 'active'
    `,
      [now]
    );

    if (query.rows.length !== 0) {
      const { vehicle_id } = query.rows[0];

      const query2 = await pool.query(
        `
      UPDATE vehicles
      SET availability_status = 'available'
      WHERE id <= $1'
    `,
        [vehicle_id]
      );
    }

    console.log("Auto-return job executed");
  } catch (error) {
    console.error("Auto-return job failed", error);
  }
});
