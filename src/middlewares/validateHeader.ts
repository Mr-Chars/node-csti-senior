import { Request, Response, NextFunction } from 'express';

export function validateApiKeyHeader(req: Request, res: Response, next: NextFunction): void {
    const pk = req.header('pk');

    if (!pk) {
        res.status(400).json({ message: 'Falta el pk en el header' });
        return;
    }

    if (pk !== process.env.PK_VALID) {
        res.status(403).json({ message: 'Pk inválido' });
        return;
    }

    next();
}