import { Request, Response, NextFunction } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid authorization format' });
    }

    const token = parts[1];
    // Nota: aquí podrías verificar el token (JWT/Supabase) si lo deseas.
    // Por ahora aceptamos la presencia de un token Bearer válido sintácticamente.
    // Guardamos token para usos posteriores
    res.locals.token = token;
    // También asignamos un `user` mínimo en `req` para que los controllers lo consuman.
    // Si implementas verificación de JWT, reemplaza `id: token` por el `sub`/id real.
    (req as any).user = { id: token };
    return next();
  } catch (err) {
    return res.status(500).json({ error: 'Auth middleware error' });
  }
};
