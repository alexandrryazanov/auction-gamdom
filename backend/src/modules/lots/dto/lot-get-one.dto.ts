import Joi from "joi";

export interface LotGetOneDto {
  id: number;
}

export const lotGetOneSchema = Joi.object({
  id: Joi.number().integer(),
});
