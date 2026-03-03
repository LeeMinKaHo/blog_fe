export interface UserProfile {
  id: number;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
  birthday: string | null;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}
