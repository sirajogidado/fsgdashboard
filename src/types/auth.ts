
export type UserRole = "Super User" | "Technical" | "Read and View";

export type Directorate = "DAWS" | "DAAS" | "DOLTS" | "ICT" | "AOC" | "ATO" | "DACL" | "AMO" | "FOCC";

export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  profileImage?: string;
  role: UserRole;
  directorate: Directorate;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
