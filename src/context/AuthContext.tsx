
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { User, AuthState } from "../types/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState & { session: Session | null }>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    session: null
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ? mapSupabaseUserToUser(session.user) : null,
        isAuthenticated: !!session,
        isLoading: false
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ? mapSupabaseUserToUser(session.user) : null,
          isAuthenticated: !!session,
          isLoading: false
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToUser = (supabaseUser: SupabaseUser): User => {
    // Determine role and directorate based on email
    let role: User['role'] = "Read and View";
    let directorate: User['directorate'] = "ICT";
    
    if (supabaseUser.email === "sirajo.gidado@ncaa.gov.ng") {
      role = "Super User";
      directorate = "ICT";
    }

    return {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || "User",
      email: supabaseUser.email || "",
      phoneNumber: supabaseUser.user_metadata?.phone || undefined,
      profileImage: supabaseUser.user_metadata?.avatar_url || "/placeholder.svg",
      role,
      directorate
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      return true;
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
