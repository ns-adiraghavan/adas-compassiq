import { createContext, useContext, useState } from "react";
import { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: false,
  signOut: async () => {},
  userRole: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Mock user - always authenticated
  const mockUser: User = {
    id: "mock-user-id",
    email: "user@compassiq.com",
    aud: "authenticated",
    role: "authenticated",
    created_at: new Date().toISOString(),
    app_metadata: {},
    user_metadata: {},
  } as User;

  const mockSession: Session = {
    access_token: "mock-token",
    token_type: "bearer",
    user: mockUser,
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    refresh_token: "mock-refresh",
  } as Session;

  const [user] = useState<User | null>(mockUser);
  const [session] = useState<Session | null>(mockSession);
  const [loading] = useState(false);
  const [userRole] = useState<string | null>("admin");

  const signOut = async () => {
    // Mock sign out - does nothing
    console.log("Mock sign out");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
