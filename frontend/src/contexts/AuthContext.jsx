import { createContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("emberdesk_user");
    const token = localStorage.getItem("emberdesk_token");
    if (stored && token) return JSON.parse(stored);
  } catch {
    return null;
  }
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("emberdesk_token", data.token);
    localStorage.setItem("emberdesk_user", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("emberdesk_token");
    localStorage.removeItem("emberdesk_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
