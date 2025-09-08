import pool from "../config/db.js"

//READ
export const getAllFoodService = async() =>{
    const result = await pool.query("SELECT * FROM foods");
    return result.rows;
};

//CREATE
export const createFoodService = async(name, descr, price, qty) =>{
    const result = await pool.query("INSERT INTO foods (name, descr, price, qty) VALUES ($1, $2, $3, $4) RETURNING *", [name, descr, price, qty]);
    return result.rows[0];
};

//UPDATE
export const updateFoodService = async(id, name, descr, price, qty) =>{
    const result = await pool.query("UPDATE foods SET name=$1, descr=$2, price=$3, qty=$4 WHERE id=$5 RETURNING *", [name, descr, price, qty, id]);
    return result.rows[0];
    
};

//DELETE from id
export const deleteFoodService = async(id) =>{
    const result = await pool.query("DELETE FROM foods WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
};