import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies(); 

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    // Configurar Axios para incluir el JWT automáticamente
    const token = cookies.get("authToken"); 
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    // Método para autenticar al usuario
    const login = async (credentials) => {
        try {
            const response = await axios.post("/api/auth/login", credentials);
            const { user, roles, token } = response.data;

            cookies.set("authToken", token, { path: "/", sameSite: "strict" });

            setUser(user);
            setRoles(roles);
            setIsAuthenticated(true);

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            } catch (error) {
            console.error("Error al iniciar sesión:", error);
            logout();
        }
    };

    // Método para desautenticar al usuario
    const logout = () => {
        try {
            cookies.remove("authToken", { path: "/" });
            setUser(null);
            setRoles([]);
            setIsAuthenticated(false);
            delete axios.defaults.headers.common["Authorization"];
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    // Verificar el estado de autenticación al cargar la aplicación
    const verifyAuth = async () => {
        try {
            if (!token) throw new Error("No token found");

            const response = await axios.get("/api/auth/verify");
            const { user, roles } = response.data;

            setUser(user);
            setRoles(roles);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Usuario no autenticado o token inválido:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                roles,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
        {loading ? <p>Cargando...</p> : children}
        </AuthContext.Provider>
    );
    };
