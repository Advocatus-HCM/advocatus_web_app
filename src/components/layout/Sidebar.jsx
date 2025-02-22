import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import logo from "../../assets/logo-vector.svg";
import Cookies from "js-cookie";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userName, setUserName] = useState("User"); // Estado para el nombre del usuario
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Función para verificar si la ruta actual coincide con la del enlace
    const isActive = (path) => {
        return location.pathname === path;
    };

    // Obtener los datos del usuario al montar el componente
    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get("token");
            const email = Cookies.get("email");

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
                // console.log("Datos del usuario en Sidebar:", result);

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                // Acceder directamente a los datos del usuario
                const userData = result.data.getUserPersonalManager.response;
                setUserName(`${userData.name} ${userData.last_name}`);
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
            }
        };

        fetchUserData();
    }, []);

    // Función para cerrar sesión
    const handleLogout = () => {
        // Eliminar todas las cookies
        Cookies.remove("token");
        Cookies.remove("email");
        Cookies.remove("role");

        // Redirigir al usuario a la ruta /
        navigate("/");
    };

    return (
        <>
            {/* Botón para abrir/cerrar el menú en pantallas pequeñas */}
            <button
                className="text-white bg-gray-800 p-2 fixed top-4 left-4 z-50 rounded-md lg:hidden"
                onClick={toggleSidebar}
            >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full text-white transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 w-64 z-40`}
                style={{
                    background: "linear-gradient(180deg, #253B56, #0F2A42)"
                }}
            >
                <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:mt-2 lg:ml-0 mt-1 ml-2">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        <span>Advocatus HCM</span>
                    </div>
                </div>
                
                {/* Bienvenida y perfil del usuario */}
                <div className="p-3 text-center border-b border-gray-700">
                    <p className="text-lg font-semibold">Bienvenido</p>
                    <FaUserCircle size={60} className="text-4xl mx-auto my-2" />
                    <p className="text-sm font-medium">{userName}</p> {/* Mostrar el nombre del usuario */}
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/dashboard"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/dashboard") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Panel Principal
                    </Link>
                    <Link
                        to="/employee-management"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/employee-management") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Gestión de Personal
                    </Link>
                    <Link
                        to="/cases"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/cases") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Seguimiento de Casos
                    </Link>
                    <Link
                        to="/attendance"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/attendance") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Control de Asistencias
                    </Link>
                    <Link
                        to="/performance"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/performance") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Eval. de Desempeño
                    </Link>
                    <Link
                        to="/documents"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/documents") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Gest. de Documentación
                    </Link>
                    <Link
                        to="/account-settings"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/account-settings") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Configuración
                    </Link>
                </nav>

                {/* Cerrar sesión al final */}
                <div className="p-4 mt-auto absolute bottom-4 left-0 w-full">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center font-bold text-gray-700 hover:text-gray-800 bg-white rounded-md p-2"
                    >
                        <MdLogout className="mr-2" size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Fondo semitransparente para cerrar el menú al hacer clic fuera */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </>
    );
};

export default Sidebar;