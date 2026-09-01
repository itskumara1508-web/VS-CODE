import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/** Validate request body against a Zod schema. */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      res.status(400).json({
        error: 'validation_error',
        message: 'Invalid request body.',
        code: 400,
        timestamp: new Date().toISOString(),
        details: { errors },
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

/** Validate request query against a Zod schema. */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = (result.error as ZodError).issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      }));
      res.status(400).json({
        error: 'validation_error',
        message: 'Invalid query parameters.',
        code: 400,
        timestamp: new Date().toISOString(),
        details: { errors },
      });
      return;
    }
    req.query = result.data as unknown as Request['query'];
    next();
  };
}
