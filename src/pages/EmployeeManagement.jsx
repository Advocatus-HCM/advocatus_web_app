import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/layout/Sidebar";
import CreateUserModal from "../components/forms/CreateUserModal";
import CreateTeamModal from "../components/forms/CreateTeamModal";
import CreateAssistantModal from "../components/forms/CreateAssistantModal";

const EmployeeManagement = () => {
    const [teamFilter, setTeamFilter] = useState("Todos");
    const [roleFilter, setRoleFilter] = useState("Todos");
    const [professionFilter, setProfessionFilter] = useState("Todos");
    const [activeTab, setActiveTab] = useState("usuarios");
    const [editingTeam, setEditingTeam] = useState(null);
    const [tempTeamData, setTempTeamData] = useState({});

    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);
    const [roles, setRoles] = useState([]);
    const [professions, setProfessions] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [tempEmployeeData, setTempEmployeeData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [assistantSearchQuery, setAssistantSearchQuery] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchTeams();
        fetchRoles();
        fetchProfessions();
        fetchAssistants();
    }, []);

    const addUser = (user) => {
        setEmployees((prev) => [...prev, user]);
        setSearchQuery(""); 
        setTeamFilter("Todos"); 
        setRoleFilter("Todos"); 
        setProfessionFilter("Todos"); 
    };

    const addTeam = (team) => {
        setTeams((prev) => [...prev, team]);
    };

    const addAssistant = (assistant) => {
        setTeams((prev) => [...prev, assistant]);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8001/get-users");
            console.log(response.data);
            setEmployees(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get("http://localhost:8001/get-teams");
            setTeams(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:8001/get-roles");
            setRoles(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching roles:", error);
        }
    };

    const fetchProfessions = async () => {
        try {
            const response = await axios.get("http://localhost:8001/get-professions");
            setProfessions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching professions:", error);
        }
    };

    const fetchAssistants = async () => {
        try {
            const response = await fetch('http://localhost:8001/get-all-assistants');
            const data = await response.json();
            setAssistants(data.assistants);
        } catch (error) {
            console.error('Error fetching assistants:', error);
        }
    };

    const handleSave = async (email) => {
        try {
            const dataToSend = { ...tempEmployeeData };
            if (dataToSend.team === "") {
                delete dataToSend.team;
            }
            await axios.patch(`http://localhost:8001/update-user/${email}`, dataToSend);
            setEmployees((prev) =>
                prev.map((employee) =>
                    employee.email === email ? { ...employee, ...tempEmployeeData } : employee
                )
            );
            setEditingRow(null);
            setTempEmployeeData({});
            Swal.fire("Actualizado!", "El usuario ha sido actualizado.", "success");
        } catch (error) {
            console.error("Error updating user:", error);
            Swal.fire("Error!", "Hubo un error al actualizar el usuario.", "error");
        }
    };


    const handleChange = (field, value) => {
        setTempEmployeeData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleTeamChange = (field, value) => {
        setTempTeamData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    
    const handleSaveTeam = async (teamName) => {
        try {
            const dataToSend = { ...tempTeamData };
            if (dataToSend.name === "") {
                delete dataToSend.name;
            }
            if (dataToSend.leader === "") {
                delete dataToSend.leader;
            }
            if (dataToSend.scope === "") {
                delete dataToSend.scope;
            }
            await axios.patch(`http://localhost:8001/update-team/${teamName}`, dataToSend);
            setTeams((prev) =>
                prev.map((team) =>
                    team.name === teamName ? { ...team, ...tempTeamData } : team
                )
            );
            setEditingTeam(null);
            setTempTeamData({});
            Swal.fire("Actualizado!", "El equipo ha sido actualizado.", "success");
        } catch (error) {
            console.error("Error updating team:", error);
            Swal.fire("Error!", "Hubo un error al actualizar el equipo.", "error");
        }
    };

    const openCreateUserModal = () => {
        setIsModalOpen(true);
    };

    const openCreateTeamModal = () => {
        setIsTeamModalOpen(true);
    };

    const openAssistantModal = () => {
        setIsAssistantModalOpen(true);
    };

    const closeUserModal = () => {
        setIsModalOpen(false);
        fetchUsers();
    };

    const closeTeamModal = () => {
        setIsTeamModalOpen(false);
        fetchTeams();
    };

    const closeAssistantModal = () => {
        setIsAssistantModalOpen(false);
        fetchAssistants();
    };

    const handleDeleteUser = async (userEmail) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8001/delete-user/${userEmail}`);
                setEmployees((prev) => prev.filter((employee) => employee.email !== userEmail));
                Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el usuario.", "error");
            }
        }
    };

    const handleDeleteAssistant = async (assistantEmail, userEmail) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete('http://localhost:8001/remove-assistant', {
                    data: {
                        assistant_email: assistantEmail,
                        user_email: userEmail
                    }
                });
                setAssistants((prev) => prev.filter((assistant) => assistant.email !== assistantEmail));
                Swal.fire("Eliminado!", "El asistente ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error deleting assistant:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el asistente.", "error");
            }
        }
    };

    const handleDeleteTeam = async (teamName) => {
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8001/delete-team/${teamName}`);
                setTeams((prev) => prev.filter((team) => team.name !== teamName));
                Swal.fire("Eliminado!", "El equipo ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error deleting team:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el equipo.", "error");
            }
        }
    };

    const filteredEmployees = employees ? employees.filter((employee) => {
        return (
            employee &&
            employee.email &&
            (teamFilter === "Todos" || employee.team === teamFilter) &&
            (roleFilter === "Todos" || employee.role === roleFilter) &&
            (professionFilter === "Todos" || employee.profession === professionFilter) &&
            employee.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }) : [];
    

    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [leaderFilter, setLeaderFilter] = useState('');
    const filteredTeams = teams ? teams.filter((team) => {
        return (
            team &&
            typeof team.name === 'string' &&
            team.name.toLowerCase().includes(teamSearchQuery.toLowerCase()) &&
            (leaderFilter === '' || team.leader === leaderFilter)
        );
    }) : [];
    
    const filteredAssistants = assistants ? assistants.filter((assistant) => {
        return (
            assistant &&
            assistant.email &&
            assistant.email.toLowerCase().includes(assistantSearchQuery.toLowerCase()) &&
            (leaderFilter === '' || assistant.assist_to === leaderFilter)
        );
    }) : [];

    const leaders = employees.filter(employee => employee.role !== 'asistente');

    const leaderEmails = employees
    .filter((employee) => employee.role === 'gerente')
    .map((employee) => employee.email);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchQuery(''); 
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

                {/* Pestañas */}
                <div className="mb-6 flex justify-center">
                    <button
                        onClick={() => handleTabChange("usuarios")}
                        className={`px-4 py-2 text-lg font-medium ${activeTab === "usuarios" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    >
                        Usuarios
                    </button>
                    <button
                        onClick={() => handleTabChange("equipos")}
                        className={`px-4 py-2 text-lg font-medium ${activeTab === "equipos" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    >
                        Equipos
                    </button>
                    <button
                        onClick={() => handleTabChange("asistentes")}
                        className={`px-4 py-2 text-lg font-medium ${activeTab === "asistentes" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
                    >
                        Asistentes
                    </button>
                </div>
                {/* Contenido de la pestaña de Usuarios */}
                {activeTab === "usuarios" && (
                    <>
                        {/* Buscador */}
                        <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                            <input
                                type="text"
                                placeholder="Escribe el correo del empleado..."
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
                                    {teams.filter(team => team && team.name).map((team) => (
                                        <option key={team.name} value={team.name}>
                                            {team.name}
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

                        {/* Lista de empleados */}
                        <div className="overflow-x-auto bg-white shadow rounded-lg max-h-96 overflow-y-auto">
                            <table className="min-w-full table-fixed divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Apellido
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Equipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Rol
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Profesión
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.email}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 min-w-[100px]">
                                                {editingRow === employee.email ? (
                                                    <input
                                                        type="text"
                                                        value={tempEmployeeData.name !== undefined ? tempEmployeeData.name : employee.name}
                                                        onChange={(e) => handleChange("name", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    employee.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[100px]">
                                                {editingRow === employee.email ? (
                                                    <input
                                                        type="text"
                                                        value={tempEmployeeData.last_name !== undefined ? tempEmployeeData.last_name : employee.last_name}
                                                        onChange={(e) => handleChange("last_name", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    employee.last_name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px]">
                                                {editingRow === employee.email ? (
                                                    <input
                                                        type="text"
                                                        value={tempEmployeeData.email !== undefined ? tempEmployeeData.email : employee.email}
                                                        onChange={(e) => handleChange("email", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    employee.email
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[120px]">
                                                {editingRow === employee.email ? (
                                                    <select
                                                        value={tempEmployeeData.team !== undefined ? tempEmployeeData.team : employee.team}
                                                        onChange={(e) => handleChange("team", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    >
                                                        <option value="">Sin equipo</option>
                                                        {teams.map((team) => (
                                                            <option key={team.name} value={team.name}>
                                                                {team.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    employee.team || "Sin equipo"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[100px]">
                                                {employee.role}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px]">
                                                {editingRow === employee.email ? (
                                                    <input
                                                        type="text"
                                                        value={tempEmployeeData.profession !== undefined ? tempEmployeeData.profession : employee.profession}
                                                        onChange={(e) => handleChange("profession", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    employee.profession
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium min-w-[100px]">
                                                {editingRow === employee.email ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSave(employee.email)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingRow(null);
                                                                setTempEmployeeData({});
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingRow(employee.email);
                                                                setTempEmployeeData(employee);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteUser(employee.email)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Contenido de la pestaña de Equipos */}
                {activeTab === "equipos" && (
                    <>
                        {/* Buscador */}
                        <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                            <input
                                type="text"
                                placeholder="Escribe el nombre del equipo..."
                                className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                value={teamSearchQuery}
                                onChange={(e) => setTeamSearchQuery(e.target.value)}
                            />
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                            >
                                Buscar
                            </button>
                        </div>

                        <div className="mb-6">
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                                onClick={openCreateTeamModal}
                            >
                                Crear equipo
                            </button>
                        </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filtrar por líder
                                    </label>
                                    <select
                                        value={leaderFilter}
                                        onChange={(e) => setLeaderFilter(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                    >
                                        <option value="">Todos los líderes</option>
                                        {leaderEmails.map((email) => (
                                            <option key={email} value={email}>
                                                {email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        <div className="overflow-x-auto bg-white shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Equipo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Líder
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Alcance
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTeams.map((team) => (
                                        <tr key={team.name}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 min-w-[150px]">
                                                {editingTeam === team.name ? (
                                                    <input
                                                        type="text"
                                                        value={tempTeamData.name !== undefined ? tempTeamData.name : team.name}
                                                        onChange={(e) => handleTeamChange("name", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    team.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px]">
                                                {editingTeam === team.name ? (
                                                    <select
                                                        value={tempTeamData.leader !== undefined ? tempTeamData.leader : team.leader}
                                                        onChange={(e) => handleTeamChange("leader", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    >
                                                        <option value="">Selecciona un líder</option>
                                                        {leaderEmails.map((email) => (
                                                            <option key={email} value={email}>
                                                                {email}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    team.leader
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[150px]">
                                                {editingTeam === team.name ? (
                                                    <input
                                                        type="text"
                                                        value={tempTeamData.scope !== undefined ? tempTeamData.scope : team.scope}
                                                        onChange={(e) => handleTeamChange("scope", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    team.scope
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium min-w-[100px]">
                                                {editingTeam === team.name ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveTeam(team.name)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingTeam(null);
                                                                setTempTeamData({});
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setEditingTeam(team.name);
                                                                setTempTeamData(team);
                                                            }}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteTeam(team.name)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* Contenido de la pestaña de Asistentes */}
                {activeTab === "asistentes" && (
                    <>
                        {/* Buscador */}
                        <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                            <input
                                type="text"
                                placeholder="Escribe el nombre del asistente..."
                                className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                value={assistantSearchQuery}
                                onChange={(e) => setAssistantSearchQuery(e.target.value)}
                            />
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                            >
                                Buscar
                            </button>
                        </div>
                    
                        <div className="mb-6">
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                                onClick={openAssistantModal}
                            >
                                Añadir asistente
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filtrar por líder
                                    </label>
                                    <select
                                        value={leaderFilter}
                                        onChange={(e) => setLeaderFilter(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                    >
                                        <option value="">Todos los líderes</option>
                                        {leaders.map((leader) => (
                                            <option key={leader.email} value={leader.email}>
                                                {leader.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        <div className="overflow-x-auto bg-white shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Asiste a
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAssistants.map((assistant) => (
                                        <tr key={assistant.email}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {assistant.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {assistant.assist_to}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => handleDeleteAssistant(assistant.email, assistant.assist_to)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Modal para crear usuario */}
            {isModalOpen && <CreateUserModal closeModal={closeUserModal} addUser={addUser} />}
            {isTeamModalOpen && <CreateTeamModal closeModal={closeTeamModal} addTeam={addTeam} />}
            {isAssistantModalOpen && <CreateAssistantModal closeModal={closeAssistantModal} refreshAssistants={addAssistant} />}
        </div>
    );
};

export default EmployeeManagement;
