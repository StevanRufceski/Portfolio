import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api, { setAxiosAccessToken } from "../api/axios";
import plainApi from "../api/plainAxios";

// ================================
// Updated User interface
// ================================
export interface User {
  id: string;
  full_name: string;
  email: string;
  role: "Administrator" | "Manager" | "Officer" | "Customer";
  status: "active" | "deactivated";
  email_verified?: boolean;
  title?: string | null;
  description?: string | null;
  phone?: string | null;
  picture?: string | null;
  promoted?: boolean;         // new
  promo_number?: string | null; // new
  created_by?: string | null;  // new
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  accessToken: string | null;
  loadingUser: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  signup: (
    full_name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  adminCreateUser: (
    full_name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    promoted?: boolean,          // allow admin to set promoted
    promo_number?: string | null // allow admin to set promo_number
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const updateAccessToken = (token: string | null) => {
    setAccessToken(token);
    setAxiosAccessToken(token);
  };

  // LOGIN
  const login = async (email: string, password: string) => {
    try {
      const res = await plainApi.post("/auth/login", { email, password });
      updateAccessToken(res.data.accessToken);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Invalid email or password",
      };
    }
  };

  // PUBLIC SIGNUP → Customer only
  const signup = async (
    full_name: string,
    email: string,
    phone: string,
    password: string
  ) => {
    try {
      await plainApi.post("/auth/signup", {
        full_name,
        email,
        phone,
        password,
        role: "Customer",
        promoted: false,     // default false on signup
        promo_number: null,  // default null on signup
        created_by: null     // public signup has no creator
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || "Signup failed" };
    }
  };

  // ADMIN CREATE USER
  const adminCreateUser = async (
    full_name: string,
    email: string,
    phone: string,
    password: string,
    role: string,
    promoted?: boolean,
    promo_number?: string | null
  ) => {
    try {
      await api.post("/admin/create-user", {
        full_name,
        email,
        phone,
        password,
        role,
        promoted: promoted ?? false,
        promo_number: promo_number ?? null,
        created_by: user?.id ?? null // admin creating this user
      });
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.message || "Create user failed",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await plainApi.post("/auth/logout");
    } finally {
      setUser(null);
      updateAccessToken(null);
    }
  };

  // BOOTSTRAP
  useEffect(() => {
    let refreshInterval: number | undefined;

    const bootstrap = async () => {
      setLoadingUser(true);
      try {
        const refreshRes = await plainApi.post("/auth/refresh");
        updateAccessToken(refreshRes.data.accessToken);

        const meRes = await api.get("/auth/me");
        setUser(meRes.data);

        refreshInterval = window.setInterval(async () => {
          try {
            const res = await plainApi.post("/auth/refresh");
            updateAccessToken(res.data.accessToken);
          } catch {
            logout();
          }
        }, 25_000);
      } catch {
        setUser(null);
        updateAccessToken(null);
      } finally {
        setLoadingUser(false);
      }
    };

    bootstrap();

    return () => {
      if (refreshInterval !== undefined) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        loadingUser,
        login,
        signup,
        adminCreateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
