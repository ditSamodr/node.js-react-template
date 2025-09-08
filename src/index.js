import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";

import foodRoute from "./routes/foodRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import createFoodTable from "./data/createFoodTable.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api", foodRoute);

//Error handling
app.use(errorHandling);

//Create table
createFoodTable();

//Testing
app.get("/", async(req, res)=>{
    const result = await pool.query("SELECT current_database()");
    //res.send('The database name is: ${}'[result.rows[0].current_database])
    res.send(`The database name is: ${result.rows[0].current_database}`)
})

//Server
app.listen(port, ()=>{
    console.log('server is running on :',{port});
});