export interface RequestUser {
    userId?: string;
    email?: string;
    isAdmin?: boolean;
    [key: string]: any;
  }