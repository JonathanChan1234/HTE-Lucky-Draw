import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ValidationChain } from 'express-validator/src/chain';

const validationMiddleware = (validations: Array<ValidationChain>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) next();
        else
            res.status(422).json({
                success: 0,
                message: errors
                    .array()
                    .map((error) => error.msg)
                    .join(','),
            });
    };
};

export default validationMiddleware;
