declare global {
  namespace Express {
    interface Request {
      admin?: {
        adminId: string;
      };
    }
  }
}

export {};