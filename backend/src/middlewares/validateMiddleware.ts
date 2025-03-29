import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";
import { BadRequestException } from "@/exceptions/HttpException";

type RequestPart = "body" | "query" | "params";
type ValidationSchemas = Partial<Record<RequestPart, Schema>>;

export function validateMiddleware(schemas: ValidationSchemas) {
  return (req: Request, res: Response, next: NextFunction) => {
    const sources: RequestPart[] = ["body", "params", "query"];

    for (const source of sources) {
      const schema = schemas[source];
      if (!schema) continue;

      const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        throw new BadRequestException(
          `Validation error in ${source}`,
          error.details.map((d) => d.message).join(", "),
        );
      }

      req[source] = value;
    }

    next();
  };
}
