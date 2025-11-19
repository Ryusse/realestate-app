/* Augment Express Request with `user` property used by controllers */
import 'express';

declare global {
  namespace Express {
    interface User {
      id?: string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
