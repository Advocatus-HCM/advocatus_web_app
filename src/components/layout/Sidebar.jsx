import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo-vector.svg";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Obtiene la ubicación actual

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Función para verificar si la ruta actual coincide con la del enlace
    const isActive = (path) => {
        return location.pathname === path;
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
        background: "linear-gradient(180deg, #253B56, #0F2A42)" // Gradiente con sutil claridad
    }}
>




                <div className="p-4 text-xl font-bold border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center space-x-2 lg:mt-2 lg:ml-0 mt-1 ml-2">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        <span>Advocatus HCM</span>
                    </div>
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
                        to="/employees"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/employees") ? "bg-gray-600" : "hover:bg-gray-600"
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
                        Evaluaciones de Desempeño
                    </Link>
                    <Link
                        to="/documents"
                        className={`block px-4 py-2 rounded-md ${
                            isActive("/documents") ? "bg-gray-600" : "hover:bg-gray-600"
                        }`}
                        onClick={toggleSidebar}
                    >
                        Gestión de Documentación
                    </Link>
                </nav>

                {/* Cerrar sesión al final */}
                <div className="p-4 mt-auto">
                    <button className="w-full font-bold text-gray-700 hover:text-gray-800 bg-white rounded-md p-2">
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


