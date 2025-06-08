
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, AuthState, Directorate, UserRole } from "../types/auth";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Fetch user profile from our users table
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .eq('is_active', true)
            .single();

          if (userProfile && !error) {
            const user: User = {
              id: userProfile.id,
              name: userProfile.name,
              email: userProfile.email,
              phoneNumber: userProfile.phone_number,
              directorate: userProfile.directorate as Directorate,
              role: userProfile.role as UserRole,
              profileImage: userProfile.profile_image
            };

            setState({
              user,
              isAuthenticated: true,
              isLoading: false
            });
          } else {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false
            });
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // The auth state change listener will handle the rest
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // First check if user exists and is active in our users table
      const { data: userCheck, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (userError || !userCheck) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // For demo purposes, we'll use a simple password check
      // In production, you'd want proper password hashing
      if (userCheck.password_hash !== password) {
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Create a session by signing in with Supabase auth
      // For demo, we'll use the user's email as both email and a generated session
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'demo-password-123' // Using a fixed password for demo
      });

      if (error) {
        // If user doesn't exist in auth, create them
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: 'demo-password-123',
          options: {
            data: {
              name: userCheck.name
            }
          }
        });

        if (signUpError) {
          setState(prev => ({ ...prev, isLoading: false }));
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
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
