import Joi from "joi";

export interface LotGetAllDto {
  limit?: number;
  offset?: number;
}

export const lotGetAllSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  offset: Joi.number().integer().min(0).default(0),
});
