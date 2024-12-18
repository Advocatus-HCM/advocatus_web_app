import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import CreateUserModal from "../components/forms/CreateUserModal"

const EmployeeManagement = () => {
    const [teamFilter, setTeamFilter] = useState("Todos");
    const [roleFilter, setRoleFilter] = useState("Todos");
    const [professionFilter, setProfessionFilter] = useState("Todos");

    // Datos de prueba
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: "Juan Pérez",
            role: "Abogado",
            team: "Derecho Penal",
            profession: "Abogado Corporativo",
        },
        {
            id: 2,
            name: "Ana López",
            role: "Asistente",
            team: "Derecho Penal",
            profession: "Asistente Legal",
        },
        {
            id: 3,
            name: "Carlos Ruiz",
            role: "Manager",
            team: "Derecho Civil",
            profession: "Abogado Civilista",
        },
        {
            id: 4,
            name: "Marta Gómez",
            role: "RRHH",
            team: "Recursos Humanos",
            profession: "Psicóloga",
        },
        {
            id: 5,
            name: "Sofía Torres",
            role: "Abogado",
            team: "Derecho Penal",
            profession: "Abogado Penalista",
        },
        {
            id: 6,
            name: "Luis Fernández",
            role: "Abogado",
            team: "Derecho Civil",
            profession: "Abogado Civilista",
        },
        {
            id: 7,
            name: "María González",
            role: "Manager",
            team: "Derecho Penal",
            profession: "Abogado Corporativo",
        },
        {
            id: 8,
            name: "Roberto Méndez",
            role: "Asistente",
            team: "Sin equipo",
            profession: "Asistente Administrativo",
        },
        {
            id: 9,
            name: "Clara Martínez",
            role: "Abogado",
            team: "Derecho Corporativo",
            profession: "Abogado Corporativo",
        },
    ]);

    const [editingRow, setEditingRow] = useState(null);
    const [tempEmployeeData, setTempEmployeeData] = useState({}); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const teams = ["Derecho Penal", "Derecho Civil", "Recursos Humanos", "Derecho Corporativo", "Sin equipo"];
    const roles = ["Abogado", "Asistente", "Manager", "RRHH"];
    const professions = [
        "Abogado Corporativo",
        "Asistente Legal",
        "Abogado Civilista",
        "Abogado Penalista",
        "Asistente Administrativo",
        "Psicóloga",
    ];

    const handleSave = (id) => {
        setEmployees((prev) =>
            prev.map((employee) =>
                employee.id === id ? { ...employee, ...tempEmployeeData } : employee
            )
        );
        setEditingRow(null);
        setTempEmployeeData({});
    };

    const handleChange = (field, value) => {
        setTempEmployeeData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const filteredEmployees = employees.filter((employee) => {
        return (
            (teamFilter === "Todos" || employee.team === teamFilter) &&
            (roleFilter === "Todos" || employee.role === roleFilter) &&
            (professionFilter === "Todos" || employee.profession === professionFilter)
        );
    });

    const openCreateUserModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="lg:ml-64 w-full p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="mb-6 lg:text-left text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de personal</h1>
                    <p className="text-gray-600">Administra y organiza a los empleados de la firma</p>
                </div>

                {/* Botón para crear usuario */}
                <div className="mb-6 lg:text-left text-center">
                    <button
                        onClick={openCreateUserModal}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                    >
                        Crear usuario
                    </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por equipo
                        </label>
                        <select
                            value={teamFilter}
                            onChange={(e) => setTeamFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todos los equipos</option>
                            {teams.map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por rol
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todos los roles</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>
                                    {role}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por profesión
                        </label>
                        <select
                            value={professionFilter}
                            onChange={(e) => setProfessionFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todas las profesiones</option>
                            {professions.map((profession) => (
                                <option key={profession} value={profession}>
                                    {profession}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                    <input
                        type="text"
                        placeholder="Escribe el nombre del empleado..."
                        className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                    />
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>

                {/* Lista de empleados */}
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Equipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Profesión
                                </th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Acciones</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map((employee) => (
                                <tr key={employee.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {employee.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingRow === employee.id ? (
                                            <select
                                                value={tempEmployeeData.team || employee.team}
                                                onChange={(e) =>
                                                    handleChange("team", e.target.value)
                                                }
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                            >
                                                {teams.map((team) => (
                                                    <option key={team} value={team}>
                                                        {team}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            employee.team
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingRow === employee.id ? (
                                            <select
                                                value={tempEmployeeData.role || employee.role}
                                                onChange={(e) =>
                                                    handleChange("role", e.target.value)
                                                }
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            employee.role
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingRow === employee.id ? (
                                            <select
                                                value={tempEmployeeData.profession || employee.profession}
                                                onChange={(e) =>
                                                    handleChange("profession", e.target.value)
                                                }
                                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                            >
                                                {professions.map((profession) => (
                                                    <option key={profession} value={profession}>
                                                        {profession}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            employee.profession
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingRow === employee.id ? (
                                            <button
                                                onClick={() => handleSave(employee.id)}
                                                className="text-green-600 hover:text-green-900 mr-4"
                                            >
                                                Guardar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setEditingRow(employee.id)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Actualizar
                                            </button>
                                        )}
                                        <button className="text-red-600 hover:text-red-900">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Crear Usuario */}
            {isModalOpen && (
                <CreateUserModal closeModal={closeModal} />
            )}
        </div>
    );
};

export default EmployeeManagement;
