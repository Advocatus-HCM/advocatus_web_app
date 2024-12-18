import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFoundPage = () => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white text-center p-6"
        >
            <div className="max-w-md">
                <h1 className="text-7xl font-extrabold text-gray-300 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-2">
                    Página no encontrada
                </h2>
                <p className="text-gray-400 mb-6">
                    Lo sentimos, la página que buscas no existe o fue movida.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 text-lg font-medium text-gray-900 bg-white rounded-lg shadow-md hover:bg-gray-100 focus:ring focus:ring-blue-500"
                >
                    <FaHome className="mr-2" size={20} />
                    Volver al inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
