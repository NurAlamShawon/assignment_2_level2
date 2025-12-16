import {Pool} from "pg"
import config from "."
const pool= new Pool ({
    connectionString:config.connectionStr
});

export const  initDb = async()=>{
    await pool.query(`
        CREATE TABLE IF NOT EXIST users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL CHECK(email ~ '^[a-z]+$),
        password TEXT NOT NULL CHECK(LENGTH(password)>=6),
        phone VARCHAR(15) NOT NULL,
        role VARCHAR(20) CHECK (role IN ('admin', 'customer')),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW(),
        )



       CREATE TABLE IF NOT EXIST vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20)  CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(100) UNIQUE NOT NULL,
        daily_rent_price INT CHECK (daily_rent_price > 0) NOT NULL,
        availability_status VARCHAR(20) CHECK (availability_status IN ('available', 'booked')),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW(),
        )


        CREATE TABLE IF NOT EXIST bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCAD,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCAD,
        rent_start_date DATE  NOT NULL,
        rent_end_date DATE CHECK (rent_end_date > rent_start_date) NOT NULL,
        total_price INT CHECK (total_price > 0),
        status VARCHAR(100) CHECK (status IN ('active','cancelled','returned')),
        createdAt TIMESTAMP DEFAULT NOW(),
        updatedAt TIMESTAMP DEFAULT NOW(),
        )


        
        
        `)
}