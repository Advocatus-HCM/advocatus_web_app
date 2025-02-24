import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Importar useNavigate para redirecciones

// Crear el contexto
export const AuthContext = createContext();

// Crear el proveedor
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado para los datos del usuario
    const [loading, setLoading] = useState(true); // Estado para manejar la carga
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado para la autenticación
    const [isCheckingAuth, setIsCheckingAuth] = useState(true); // Estado para verificar la autenticación antes de renderizar
    const navigate = useNavigate(); // Hook para redirecciones

    // Obtener el token y el email de las cookies
    const token = Cookies.get("token");
    const email = Cookies.get("email");

    // Método para obtener los datos del usuario desde el API Gateway
    const fetchUserData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_AG_URL}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation GetUserPersonalManager($email: String!, $userAuth: UserAuth!) {
                            getUserPersonalManager(email: $email, userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        email: email,
                        userAuth: {
                            email: "admin@admin.com",
                            token: token,
                        },
                    },
                }),
            });

            const result = await response.json();
            // console.log("Datos del usuario en AuthContext:", result);

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            const userData = result.data.getUserPersonalManager.response;
            setUser({
                name: userData.name,
                last_name: userData.last_name,
                email: userData.email,
                role: userData.role,
            });
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Error al obtener los datos del usuario:", error);
            logout();
        } finally {
            setLoading(false);
            setIsCheckingAuth(false); // Finalizar la verificación de autenticación
        }
    };

    // Método para iniciar sesión
    const login = async (email, token) => {
        Cookies.set("token", token, { path: "/" });
        Cookies.set("email", email, { path: "/" });
        await fetchUserData(); // Actualizar los datos del usuario después de iniciar sesión
    };

    // Método para cerrar sesión
    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("role");
        setUser(null);
        setIsAuthenticated(false);
        navigate("/"); // Redirigir al usuario a la página de inicio después de cerrar sesión
    };

    // Verificar la autenticación al cargar la aplicación
    useEffect(() => {
        if (token && email) {
            fetchUserData();
        } else {
            setLoading(false);
            setIsCheckingAuth(false); // Finalizar la verificación de autenticación
        }
    }, [token, email]);

    // Redirigir al usuario si intenta acceder a una ruta protegida sin estar autenticado
    useEffect(() => {
        const currentPath = window.location.pathname;

        // Rutas que no requieren autenticación
        const publicRoutes = ["/", "/login", "/change-password", "/dashboard"]; // Agregar /dashboard

        if (!isCheckingAuth && !isAuthenticated && !publicRoutes.includes(currentPath)) {
            navigate("/"); // Redirigir al usuario a la página de inicio si no está autenticado y no está en una ruta pública
        }
    }, [isCheckingAuth, isAuthenticated, navigate]);

    // Rueda de carga con estilos personalizados
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
            }}
        >
            {isCheckingAuth || loading ? <LoadingSpinner /> : children}
        </AuthContext.Provider>
    );
};