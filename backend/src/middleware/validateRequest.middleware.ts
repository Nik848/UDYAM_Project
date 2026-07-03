import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validationParser } from '../parsers/ValidationParser';

export const validateRequest = (
  schema: z.ZodObject<any, any>,
  dynamicMapping?: Record<string, string>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      let finalSchema = schema;
      
      if (dynamicMapping) {
        finalSchema = validationParser.extendSchemaWithDynamicRules(schema, dynamicMapping);
      }

      const parsed = finalSchema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error) {
      next(error);
    }
  };
};
