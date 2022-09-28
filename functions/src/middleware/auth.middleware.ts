import { NextFunction, Request, Response } from 'express';
import { auth } from '../firebase';

const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req.params;
    const bearerToken = req.headers.authorization;
    if (!bearerToken || (bearerToken && bearerToken.split(' ').length !== 2))
        return res.status(403).json({ err: 'Invalid Authorization Token' });
    const jwt = bearerToken.split(' ')[1];
    try {
        const claims = await auth.verifyIdToken(jwt);
        if (claims.uid !== userId)
            return res.status(403).json({ err: 'Invalid user' });
        return next();
    } catch (error) {
        return res.status(500).json({ err: (error as Error).message });
    }
};

export default authMiddleware;
