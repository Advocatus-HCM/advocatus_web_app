import React, { useState } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/layout/Sidebar";

const Cases = () => {
    const [activeTab, setActiveTab] = useState("activos");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("Todos");
    const [subtypeFilter, setSubtypeFilter] = useState("Todos");
    const [statusFilter, setStatusFilter] = useState("Todos");

    // Datos de prueba hardcodeados
    const [cases, setCases] = useState([
        {
            _id: "65b9a3f9e9c1d47b5e8e9a3d",
            name: "Corporate Fraud Investigation",
            description: "Investigating fraudulent activities in the company.",
            start_date: "2024-01-30",
            type: "Derecho Penal",
            subtype: "Homicidio",
            status: "En Proceso",
            archived: false,
            involved_personnel: [
                { person_id: "12345", name: "John Doe", role: "Lawyer" },
                { person_id: "67890", name: "Jane Smith", role: "Investigator" },
            ],
            created_at: "2024-01-30T10:15:00Z",
            updated_at: "2024-01-30T10:15:00Z",
        },
        {
            _id: "65b9a3f9e9c1d47b5e8e9a3e",
            name: "Tax Evasion Case",
            description: "Handling tax evasion allegations.",
            start_date: "2024-02-01",
            type: "Derecho Fiscal",
            subtype: "Evasión Fiscal",
            status: "Caso Cerrado (Fallo a favor)",
            archived: false, // Este caso está cerrado pero no archivado
            involved_personnel: [
                { person_id: "54321", name: "Alice Johnson", role: "Accountant" },
                { person_id: "98765", name: "Bob Brown", role: "Lawyer" },
            ],
            created_at: "2024-02-01T09:30:00Z",
            updated_at: "2024-02-01T09:30:00Z",
        },
        {
            _id: "65b9a3f9e9c1d47b5e8e9a3f",
            name: "Contract Dispute",
            description: "Resolving a contract dispute between two parties.",
            start_date: "2024-02-05",
            type: "Derecho Civil",
            subtype: "Contratos",
            status: "Caso Cerrado (Fallo en contra)",
            archived: true, // Este caso está cerrado y archivado
            involved_personnel: [
                { person_id: "11223", name: "Charlie Davis", role: "Lawyer" },
                { person_id: "44556", name: "Diana Evans", role: "Mediator" },
            ],
            created_at: "2024-02-05T08:45:00Z",
            updated_at: "2024-02-05T08:45:00Z",
        },
    ]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchQuery("");
        setStatusFilter("Todos"); // Resetear el filtro de estado al cambiar de pestaña
    };

    const handleDeleteCase = async (caseId) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                setCases((prev) => prev.filter((c) => c._id !== caseId));
                Swal.fire("Eliminado!", "El caso ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error deleting case:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el caso.", "error");
            }
        }
    };

    const filteredCases = cases.filter((c) => {
        return (
            c &&
            c.name &&
            (activeTab === "activos" ? !c.archived && c.status === "En Proceso" : 
             activeTab === "cerrados" ? (c.status === "Caso Cerrado (Fallo a favor)" || c.status === "Caso Cerrado (Fallo en contra)") : 
             c.archived) &&
            (typeFilter === "Todos" || c.type === typeFilter) &&
            (subtypeFilter === "Todos" || c.subtype === subtypeFilter) &&
            (statusFilter === "Todos" || c.status === statusFilter) &&
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Obtener el encargado del caso (persona con rol "Lawyer")
    const getCaseManager = (involvedPersonnel) => {
        const lawyer = involvedPersonnel.find((person) => person.role === "Lawyer");
        return lawyer ? lawyer.name : "Sin asignar";
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="lg:ml-64 w-full p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="mb-6 lg:text-left text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Seguimiento de casos</h1>
                    <p className="text-gray-600">Administra y organiza los diferentes casos de la firma</p>
                </div>

                {/* Pestañas */}
                <div className="mb-6 flex flex-wrap justify-center sm:flex-nowrap">
                    <button
                        onClick={() => handleTabChange("activos")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "activos"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Casos Activos
                    </button>
                    <button
                        onClick={() => handleTabChange("cerrados")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "cerrados"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Casos Cerrados
                    </button>
                    <button
                        onClick={() => handleTabChange("archivados")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "archivados"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Casos Archivados
                    </button>
                </div>

                {/* Buscador */}
                <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                    <input
                        type="text"
                        placeholder="Escribe el nombre del caso..."
                        className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                    >
                        Buscar
                    </button>
                </div>

                {/* Botón para crear caso */}
                <div className="mb-6 lg:text-left text-center">
                    <button
                        onClick={() => {}}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                    >
                        Crear caso
                    </button>
                </div>

                {/* Filtros */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por tipo
                        </label>
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todos los tipos</option>
                            <option value="Derecho Penal">Derecho Penal</option>
                            <option value="Derecho Fiscal">Derecho Fiscal</option>
                            <option value="Derecho Civil">Derecho Civil</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por subtipo
                        </label>
                        <select
                            value={subtypeFilter}
                            onChange={(e) => setSubtypeFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todos los subtipos</option>
                            <option value="Homicidio">Homicidio</option>
                            <option value="Evasión Fiscal">Evasión Fiscal</option>
                            <option value="Contratos">Contratos</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por estado
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                        >
                            <option value="Todos">Todos los estados</option>
                            {activeTab === "activos" ? (
                                <option value="En Proceso">En Proceso</option>
                            ) : (
                                <>
                                    <option value="Caso Cerrado (Fallo a favor)">Caso Cerrado (Fallo a favor)</option>
                                    <option value="Caso Cerrado (Fallo en contra)">Caso Cerrado (Fallo en contra)</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>

                {/* Tabla de casos */}
                <div className="overflow-x-auto bg-white shadow rounded-lg max-h-96 overflow-y-auto">
                    <table className="min-w-full table-fixed divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subtipo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha de inicio
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Encargado
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredCases.map((c) => (
                                <tr key={c._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {c.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.type}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.subtype}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.start_date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.status}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getCaseManager(c.involved_personnel)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {}}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Ver caso
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-900"
                                            onClick={() => handleDeleteCase(c._id)}
                                        >
                                            Archivar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Cases;