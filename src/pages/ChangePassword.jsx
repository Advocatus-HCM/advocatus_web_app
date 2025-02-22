import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importar íconos de ojo

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false); // Estado para controlar la visibilidad de la nueva contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para controlar la visibilidad de la confirmación de contraseña
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 8 || !/\d/.test(newPassword)) {
            setError('La contraseña debe tener al menos 8 caracteres y un número.');
            return;
        }

        setIsLoading(true);

        const token = Cookies.get('token'); // Obtenemos el token de las cookies
        const email = Cookies.get('email'); // Obtenemos el email de las cookies

        try {
            const requestBody = {
                query: `
                    mutation UpdateUser($data: JSON!, $token: String!) {
                        updateUser(data: $data, token: $token)
                    }
                `,
                variables: {
                    data: {
                        email: email,       // Email del usuario
                        password: newPassword // Nueva contraseña
                    },
                    token: token, // Token de autenticación
                },
            };

            const response = await fetch(`${import.meta.env.VITE_AG_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            // Manejo de errores
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Si la actualización fue exitosa, redirigimos al dashboard
            if (result.data.updateUser) {
                console.log('Contraseña actualizada exitosamente.');
                navigate('/dashboard');
            } else {
                setError('Error al actualizar la contraseña.');
                console.error('Error: No se pudo actualizar la contraseña.');
            }
        } catch (error) {
            setError('Error al actualizar la contraseña: ' + error.message);
            console.error('Error en la solicitud:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-blue-100 flex items-center justify-center">
            <div className="bg-white p-8 m-5 lg:m-0 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cambiar Contraseña</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input
                            type={showNewPassword ? "text" : "password"} // Cambiar el tipo de input según el estado
                            className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pr-10"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-6"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
                        </span>
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"} // Cambiar el tipo de input según el estado
                            className="w-full rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 pr-10"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer mt-6"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEye className="text-gray-500" /> : <FaEyeSlash className="text-gray-500" />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition duration-300"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;