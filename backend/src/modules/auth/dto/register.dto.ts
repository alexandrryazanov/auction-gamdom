import Joi from "joi";

export interface RegisterDto {
  email: string;
  password: string;
}

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});
