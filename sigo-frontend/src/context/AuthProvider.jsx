import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logoutUser } from "./authService";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const login = async ({ email, password }) => {
    try {
      const { token, usuario } = await loginUser({ email, password });
      setToken(token);
      setUser(usuario);

      if (usuario.rol === "Admin" || usuario.rol === "Orientador" || usuario.rol === "AsistenteSocial") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Manejo específico para diferentes tipos de errores
      if (error.response?.status === 429) {
        toast.error("⚠️ Demasiados intentos de login. Espera 15 minutos antes de intentar nuevamente.");
      } else if (error.response?.status === 401) {
        toast.error("❌ Credenciales inválidas");
      } else if (error.response?.status >= 500) {
        toast.error("🔧 Error del servidor. Intenta nuevamente más tarde.");
      } else {
        toast.error(error.response?.data?.error || "❌ Error de conexión");
      }
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!token, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
