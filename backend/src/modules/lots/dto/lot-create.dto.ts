import Joi from "joi";

export interface LotCreateDto {
  startPriceInCents: number;
  minPriceStep: number;
  maxPriceStep: number;
  name: string;
  timeInSec: number;
}

export const lotCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  minPriceStep: Joi.number().min(1).required(),
  maxPriceStep: Joi.number().min(Joi.ref("minPriceStep")).required().messages({
    "number.min":
      '"maxPriceStep" must be greater than or equal to "minPriceStep"',
  }),
  startPriceInCents: Joi.number().min(100).required(),
  timeInSec: Joi.number().min(5).required(),
});
