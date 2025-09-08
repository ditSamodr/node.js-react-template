import pool from "../config/db.js";

const createFoodTable = async () =>{
    const queryText = `
    CREATE TABLE IF NOT EXISTS foods(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    descr VARCHAR(100) NOT NULL,
    price VARCHAR(100) NOT NULL,
    qty INT,
    created_at TIMESTAMP DEFAULT NOW()
)
    `;

    try{
        pool.query(queryText);
        console.log("User table created if not exist")
    }catch(error){
        console.log("Error creating users table: ", error)
    }
};

export default createFoodTable;