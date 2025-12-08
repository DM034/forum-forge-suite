import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import authService from "@/services/authService";

interface User {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authService.login({ email, password });
      const { accessToken, refreshToken,user: userData } = res.data.data;
      
      // Save tokens and user in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));
    
      setUser(userData);

      toast.success("Connexion réussie");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Erreur lors de la connexion";
      toast.error(msg);
      throw error;
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const res = await authService.register({
        email,
        password,
        fullName,
      });

      const { user: userData, accessToken, refreshToken } = res.data.data;

      // Save tokens and user in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);

      toast.success("Compte créé avec succès");
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Erreur lors de la création du compte";
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Déconnexion réussie");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
