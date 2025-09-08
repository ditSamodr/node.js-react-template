import { createFoodService, deleteFoodService, getAllFoodService, updateFoodService } from "../models/foodModel.js";

//Standardized response function
const handleResponse = (res, status, message, data = null) =>{
    res.status(status).json({
        status, message, data,
    });
};

export const createFood = async(req, res, next)=>{
    const { name, descr, price, qty } = req.body;
    try{
        const newFoods = await createFoodService(name, descr, price, qty);
        handleResponse(res, 201, "Food Created Succesfully", newFoods)
    }catch(err){
        next(err);
    }
}

export const getAllFood = async(req, res, next)=>{
    try{
        const foods = await getAllFoodService();
        handleResponse(res, 200, "Food Fetche Succesfully", foods)
    }catch(err){
        next(err);
    }
}

export const updateFood = async(req, res, next)=>{
    const { name, descr, price, qty } = req.body;
    try{
        const updatedFoods = await updateFoodService(req.params.id, name, descr, price, qty);
        handleResponse(res, 200, "Food updated Succesfully", updatedFoods)
    }catch(err){
        next(err);
    }
}

export const deleteFood = async(req, res, next)=>{
    try{
        const deletedFoods = await deleteFoodService(req.params.id);
        handleResponse(res, 200, "Food deleted Succesfully", deletedFoods)
    }catch(err){
        next(err);
    }
}
