import express from "express";
import { createFood, deleteFood, getAllFood, updateFood } from "../controller/foodController.js";

const router = express.Router();

router.post("/food", createFood);
router.get("/food", getAllFood);
router.put("/food/:id", updateFood);
router.delete("/food/:id", deleteFood);

export default router;