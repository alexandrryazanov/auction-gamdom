import Joi from "joi";

export interface LoginDto {
  email: string;
  password: string;
}

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});
