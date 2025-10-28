import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { loading } = useAuth();

  // Mock protected route - always allows access
  if (loading) {
    return null;
  }

  return <>{children}</>;
};
