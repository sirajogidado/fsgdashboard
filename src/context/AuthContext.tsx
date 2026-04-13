
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, AuthState, Directorate, UserRole } from "../types/auth";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("ncaa_user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("ncaa_user");
        setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .eq('is_active', true)
        .single();

      if (error || !users) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      const user: User = {
        id: users.id,
        name: users.name,
        email: users.email,
        phoneNumber: users.phone_number,
        directorate: users.directorate as Directorate,
        role: users.role as UserRole,
        profileImage: users.profile_image
      };

      setState({ user, isAuthenticated: true, isLoading: false });
      localStorage.setItem("ncaa_user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const refreshUser = async () => {
    if (!state.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', state.user.id)
        .single();

      if (error || !data) return;

      const updatedUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        phoneNumber: data.phone_number,
        directorate: data.directorate as Directorate,
        role: data.role as UserRole,
        profileImage: data.profile_image
      };

      setState({ user: updatedUser, isAuthenticated: true, isLoading: false });
      localStorage.setItem("ncaa_user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  };

  const logout = () => {
    setState({ user: null, isAuthenticated: false, isLoading: false });
    localStorage.removeItem("ncaa_user");
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
