// app/types/user.ts
export interface User {
  id: string | number;
  email: string;
  name?: string;
  role?: string;
  roles?: string[];
  avatar?: string;
  createdAt?: string;
  isVerified?: boolean;
}
