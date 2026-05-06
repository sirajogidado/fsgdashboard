import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, AuthState, Directorate, UserRole } from "../types/auth";
import {
  callAuthApi,
  clearSessionToken,
  getSessionToken,
  setSessionToken,
} from "@/lib/authApi";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapUser = (u: any): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phoneNumber: u.phone_number,
  directorate: u.directorate as Directorate,
  role: u.role as UserRole,
  profileImage: u.profile_image,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const init = async () => {
      const token = getSessionToken();
      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      try {
        const { user } = await callAuthApi<{ user: any }>("me");
        setState({ user: mapUser(user), isAuthenticated: true, isLoading: false });
      } catch {
        clearSessionToken();
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };
    init();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((p) => ({ ...p, isLoading: true }));
    try {
      const { user, token } = await callAuthApi<{ user: any; token: string }>(
        "login",
        { email, password },
      );
      setSessionToken(token);
      setState({ user: mapUser(user), isAuthenticated: true, isLoading: false });
      return true;
    } catch (e) {
      console.error("Login error:", e);
      setState((p) => ({ ...p, isLoading: false }));
      return false;
    }
  };

  const refreshUser = async () => {
    if (!getSessionToken()) return;
    try {
      const { user } = await callAuthApi<{ user: any }>("me");
      setState({ user: mapUser(user), isAuthenticated: true, isLoading: false });
    } catch (e) {
      console.error("Refresh user error:", e);
    }
  };

  const logout = () => {
    callAuthApi("logout").catch(() => {});
    clearSessionToken();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, refreshUser }}>
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
