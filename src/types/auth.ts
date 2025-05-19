
export type UserRole = "Super User" | "Technical" | "Read and View";

export type Directorate = "DAWS" | "DAAS" | "DOLTS" | "ICT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  directorate: Directorate;
}
