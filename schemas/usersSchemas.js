import Joi from "joi";

export const registerUserSchema = Joi.object({
    email: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required(),
});

export const loginUserSchema = Joi.object({
    email: Joi.string().min(1).max(255).required(),
    password: Joi.string().min(1).max(255).required(),
});

export const updateUserSchema = Joi.object({
    email: Joi.string().min(1).max(255),
    password: Joi.string().min(1).max(255),
}).min(1);