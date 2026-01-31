import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: number;
  minecraft_username: string;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  login: (username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string) => {
    setIsLoading(true);
    try {
      // First, try to find existing user
      let { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('minecraft_username', username)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw fetchError;
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{ minecraft_username: username }])
          .select()
          .single();

        if (insertError) throw insertError;
        existingUser = newUser;
      }

      setUser(existingUser);
      localStorage.setItem('user', JSON.stringify(existingUser));
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: UserContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
