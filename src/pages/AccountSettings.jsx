import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";

const AccountSettings = () => {
    const [userInfo, setUserInfo] = useState({
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        phone: "+57 300 123 4567",
        role: "Abogado",
        profession: "Abogado Corporativo",
        team: "Derecho Penal",
        superior: "Carlos Ruiz", 
    });

    const [isEditing, setIsEditing] = useState(false); 

    // Manejadores de eventos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        console.log("Información guardada:", userInfo);
        setIsEditing(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="lg:ml-64 w-full p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="mb-6 lg:text-left text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Configuración del perfil</h1>
                    <p className="text-gray-600">
                        Actualiza tu información personal y las preferencias de tu cuenta
                    </p>
                </div>

                {/* Información de la cuenta */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Información Personal</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={userInfo.name}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 ${
                                    isEditing ? "" : "bg-gray-100 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={userInfo.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 ${
                                    isEditing ? "" : "bg-gray-100 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={userInfo.phone}
                                onChange={handleChange}
                                disabled={!isEditing}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 ${
                                    isEditing ? "" : "bg-gray-100 cursor-not-allowed"
                                }`}
                            />
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={userInfo.role}
                                onChange={handleChange}
                                disabled
                                className="w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Profesión */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profesión
                            </label>
                            <input
                                type="text"
                                name="profession"
                                value={userInfo.profession}
                                onChange={handleChange}
                                disabled
                                className="w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Equipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Equipo
                            </label>
                            <input
                                type="text"
                                name="team"
                                value={userInfo.team}
                                onChange={handleChange}
                                disabled
                                className="w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Superior (nuevo campo) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Superior
                            </label>
                            <input
                                type="text"
                                name="superior"
                                value={userInfo.superior}
                                onChange={handleChange}
                                disabled
                                className="w-full rounded-lg border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end gap-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Guardar Cambios
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Editar Información
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;
