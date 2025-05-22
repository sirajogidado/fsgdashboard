
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, AuthState } from "../types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@ncaa.gov.ng",
    phoneNumber: "08012345678",
    directorate: "ICT",
    role: "Super User",
    profileImage: "/placeholder.svg"
  },
  {
    id: "2",
    name: "DAWS User",
    email: "daws@ncaa.gov.ng",
    phoneNumber: "08023456789",
    directorate: "DAWS",
    role: "Technical",
    profileImage: "/placeholder.svg"
  },
  {
    id: "3",
    name: "DAAS User",
    email: "daas@ncaa.gov.ng",
    phoneNumber: "08034567890",
    directorate: "DAAS",
    role: "Technical",
    profileImage: "/placeholder.svg"
  },
  {
    id: "4",
    name: "View Only",
    email: "view@ncaa.gov.ng",
    phoneNumber: "08045678901",
    directorate: "DOLTS",
    role: "Read and View",
    profileImage: "/placeholder.svg"
  },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("ncaa_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("ncaa_user");
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, you would make an API call here
    setState(prev => ({ ...prev, isLoading: true }));
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        
        if (user && password === "password") { // Mock password check
          setState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
          localStorage.setItem("ncaa_user", JSON.stringify(user));
          resolve(true);
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    localStorage.removeItem("ncaa_user");
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
