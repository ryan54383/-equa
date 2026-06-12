import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { sendError } from '../utils/response';

export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Run all validations
    await Promise.all(validations.map((v) => v.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formatted = errors.array().map((e) => ({
        field: 'path' in e ? String(e.path) : 'unknown',
        message: e.msg,
      }));
      sendError(res, 'Validation failed', 422, formatted);
      return;
    }
    next();
  };
}
