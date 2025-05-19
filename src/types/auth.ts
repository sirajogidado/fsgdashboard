
export type UserRole = "Super User" | "Technical" | "Read and View";

export type Directorate = "DAWS" | "DAAS" | "ICT" | "DOLTS";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  directorate: Directorate;
  role: UserRole;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
