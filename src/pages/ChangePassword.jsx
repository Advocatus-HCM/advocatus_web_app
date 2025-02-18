import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
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

        console.log('Token obtenido de las cookies:', token); // Log del token
        console.log('Email obtenido de las cookies:', email); // Log del email
        console.log('Nueva contraseña:', newPassword); // Log de la nueva contraseña

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

            console.log('Cuerpo de la solicitud:', JSON.stringify(requestBody, null, 2)); // Log del cuerpo de la solicitud

            const response = await fetch(`${import.meta.env.VITE_AG_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            console.log('Respuesta del servidor:', JSON.stringify(result, null, 2)); // Log de la respuesta del servidor

            // Manejo de errores
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            // Si la actualización fue exitosa, redirigimos al dashboard
            if (result.data.updateUser) {
                console.log('Contraseña actualizada exitosamente.'); // Log de éxito
                navigate('/dashboard');
            } else {
                setError('Error al actualizar la contraseña.');
                console.error('Error: No se pudo actualizar la contraseña.'); // Log de error
            }
        } catch (error) {
            setError('Error al actualizar la contraseña: ' + error.message);
            console.error('Error en la solicitud:', error); // Log de error en la solicitud
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Cambiar Contraseña</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
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