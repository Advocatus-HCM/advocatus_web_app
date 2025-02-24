import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importar íconos de ojo

const AccountSettings = () => {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        phone: "",
        role: "",
        profession: "",
    });

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); // Estado para controlar la visibilidad de la nueva contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar la visibilidad de la confirmación de contraseña

    const token = Cookies.get("token");
    const email = Cookies.get("email");

    // Obtener los datos del usuario al montar el componente
    useEffect(() => {
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
                // console.log("Datos del usuario:", result);

                if (result.errors) {
                    throw new Error(result.errors[0].message);
                }

                // Acceder directamente a los datos del usuario
                const userData = result.data.getUserPersonalManager.response;
                setUserInfo({
                    name: `${userData.name} ${userData.last_name}`,
                    email: userData.email,
                    phone: userData.phone_number,
                    role: userData.role,
                    profession: userData.profession,
                });
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error);
                Swal.fire("Error", "No se pudieron cargar los datos del usuario.", "error");
            }
        };

        fetchUserData();
    }, [email, token]);

    // Manejador para cambiar la contraseña
    const handleChangePassword = async () => {
        setError("");

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (newPassword.length < 8 || !/\d/.test(newPassword)) {
            setError("La contraseña debe tener al menos 8 caracteres y un número.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_AG_URL}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `
                        mutation UpdateUser($data: JSON!, $token: String!) {
                            updateUser(data: $data, token: $token)
                        }
                    `,
                    variables: {
                        data: {
                            email: email,
                            password: newPassword,
                        },
                        token: token,
                    },
                }),
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            if (result.data.updateUser) {
                Swal.fire("Éxito", "Contraseña actualizada correctamente.", "success");
                setIsEditingPassword(false);
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setError("Error al actualizar la contraseña.");
            }
        } catch (error) {
            setError("Error al actualizar la contraseña: " + error.message);
        } finally {
            setIsLoading(false);
        }
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
                                value={userInfo.name}
                                disabled
                                className="w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Correo Electrónico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                value={userInfo.email}
                                disabled
                                className="w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={userInfo.phone}
                                disabled
                                className="w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Rol */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <input
                                type="text"
                                value={userInfo.role}
                                disabled
                                className="w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>

                        {/* Profesión */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profesión
                            </label>
                            <input
                                type="text"
                                value={userInfo.profession}
                                disabled
                                className="w-full rounded-lg border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm p-2"
                            />
                        </div>
                    </div>

                    {/* Botón para cambiar la contraseña */}
                    <div className="mt-6">
                        <button
                            onClick={() => setIsEditingPassword(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                </div>

                {/* Modal para cambiar la contraseña */}
                {isEditingPassword && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h2>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <div className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nueva Contraseña
                                </label>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pr-10"
                                />
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-6"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
                                </span>
                            </div>
                            <div className="mb-6 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Contraseña
                                </label>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pr-10"
                                />
                                <span
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-6"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
                                </span>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => setIsEditingPassword(false)}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Guardando..." : "Guardar Cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountSettings;