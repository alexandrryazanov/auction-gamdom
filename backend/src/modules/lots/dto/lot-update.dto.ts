import Joi from "joi";

export interface LotUpdateDto {
  minPriceStep: number;
  maxPriceStep: number;
  name: string;
}

export const lotUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  minPriceStep: Joi.number().min(1).required(),
  maxPriceStep: Joi.number().min(Joi.ref("minPriceStep")).required().messages({
    "number.min":
      '"maxPriceStep" must be greater than or equal to "minPriceStep"',
  }),
});
