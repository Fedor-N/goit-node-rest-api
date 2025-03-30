import Joi from "joi";

const requiredFields = ["name", "email", "phone"];

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().min(3).max(255).required(),
    phone: Joi.string().min(3).max(255).required(),
    favorite: Joi.boolean()
});


export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(255),
    email: Joi.string().email().min(3).max(255),
    phone: Joi.string().min(3).max(255),
    favorite: Joi.boolean()
  })
    .or(...requiredFields)
    .messages({
        "object.missing": `Body must have at least one field: ${requiredFields.join(", ")}`,
        "any.required": `Body must have at least one field: ${requiredFields.join(", ")}`,
        "object.or": `Body must have at least one field: ${requiredFields.join(", ")}`,
    });

    export const updateFavoriteSchema = Joi.object({
        favorite: Joi.boolean().required()
    });