import Joi from "joi";

const requiredFields = ["name", "email", "phone"];

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});


export const updateContactSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
  })
    .or(...requiredFields)
    .messages({
        "object.missing": `Body must have at least one field: ${requiredFields.join(", ")}`,
        "any.required": `Body must have at least one field: ${requiredFields.join(", ")}`,
        "object.or": `Body must have at least one field: ${requiredFields.join(", ")}`,
    });