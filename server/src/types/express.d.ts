import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      email?: string; // Optional property
    }
  }
}
