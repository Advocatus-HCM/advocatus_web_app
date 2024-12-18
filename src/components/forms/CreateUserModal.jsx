import React, { useState } from "react";
import { MdClose } from "react-icons/md"; 

const CreateUserModal = ({ closeModal }) => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profession, setProfession] = useState("");
    const [superior, setSuperior] = useState("");
    const [team, setTeam] = useState("");
    const [role, setRole] = useState("");

    const teams = ["Derecho Penal", "Derecho Civil", "Recursos Humanos", "Derecho Corporativo"];
    const roles = ["Abogado", "Asistente", "Manager", "RRHH"];
    const professions = [
        "Abogado Corporativo",
        "Asistente Legal",
        "Abogado Civilista",
        "Abogado Penalista",
        "Asistente Administrativo",
        "Psicóloga",
    ];
    const superiors = ["Juan Pérez", "Maria Gómez", "Carlos Soto"];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            name,
            lastName,
            email,
            phoneNumber,
            profession,
            superior,
            team,
            role,
        });
        closeModal();
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                {/* Botón de cerrar */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <MdClose className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Crear usuario</h2> 

                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                    {/* Campos del formulario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Número de teléfono</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profesión</label>
                        <select
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        >
                            <option value="">Seleccionar profesión</option>
                            {professions.map((profession) => (
                                <option key={profession} value={profession}>
                                    {profession}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Superior</label>
                        <select
                            value={superior}
                            onChange={(e) => setSuperior(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        >
                            <option value="">Seleccionar superior</option>
                            {superiors.map((superior) => (
                                <option key={superior} value={superior}>
                                    {superior}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Equipo</label>
                        <select
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        >
                            <option value="">Seleccionar equipo</option>
                            {teams.map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-gray-100 rounded-lg border-gray-300 sm:text-sm p-3"
                        >
                            <option value="">Seleccionar rol</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botones de acción */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                        >
                            Crear Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
