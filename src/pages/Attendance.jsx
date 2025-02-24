import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/layout/Sidebar";
import Select from "react-select";
import InsertAttendanceModal from "../components/forms/InsertAttendanceModal";
import InsertAbsenceModal from "../components/forms/InsertAbsenceModal";
import ShowReport from "../components/forms/ShowReport";
import UpdateAbsence from "../components/forms/UpdateAbsence";

const Attendance = () => {
    const [teamFilter, setTeamFilter] = useState("Todos");
    const [professionFilter, setProfessionFilter] = useState("Todos");
    const [activeTab, setActiveTab] = useState("usuarios");
    const [editingTeam, setEditingTeam] = useState(null);
    const [tempTeamData, setTempTeamData] = useState({});

    const [employees, setEmployees] = useState([]);
    const [attendances, setAttendances] = useState([]);
    const [absences, setAbsences] = useState([]);

    const [teams, setTeams] = useState([]);
    const [professions, setProfessions] = useState([]);
    const [assistants, setAssistants] = useState([]);
    const [editingRow, setEditingRow] = useState(null);
    const [tempEmployeeData, setTempEmployeeData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const[isModalAbsenceOpen, setIsModalAbsenceOpen] = useState(false);
    const[isModalReportOpen, setIsModalReportOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [contracts, setContracts] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [tempContractData, setTempContractData] = useState({});
    const [userEmails, setUserEmails] = useState([]);
    const [editingContract, setEditingContract] = useState(null);
    const [managers, setManagers] = useState([]);

    const [abogadoId, setAbogadoId] = useState("");
    const [selectedUserEmail, setSelectedUserEmail] = useState("");

    useEffect(() => {
        fetchUsers();
        fetchTeams();
        fetchProfessions();
        fetchUserEmails();
        fetchContractTypes();
        fetchAttendances();
        fetchAbsences();
    }, []);

    const attendanceData = {
        abogado_id: selectedUserEmail,
        email: selectedUserEmail
    };


    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PM_URL}/get-users`);
            const allUsers = Array.isArray(response.data) ? response.data : [];
            setEmployees(allUsers);
            setManagers(allUsers.filter(user => user.role === "gerente"));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const fetchUserEmails = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PM_URL}/get-users`);
            const emails = response.data.map((user) => ({ label: user.email, value: user.email }));
            setUserEmails(emails);
        } catch (error) {
            console.error("Error fetching user emails:", error);
        }
    };

    const fetchContractTypes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PM_URL}/get-types`);
            setContractTypes(response.data);
        } catch (error) {
            console.error("Error fetching contract types:", error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PM_URL}/get-teams`);
            setTeams(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    const fetchProfessions = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_PM_URL}/get-professions`);
            setProfessions(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching professions:", error);
        }
    };

    const handleSave = async (email) => {
        try {
            const dataToSend = { ...tempEmployeeData };
            if (dataToSend.team === "") {
                delete dataToSend.team;
            }
            await axios.patch(`${import.meta.env.VITE_PM_URL}/update-user/${email}`, dataToSend);
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

    const openReportModal = (email) =>{
        setIsModalReportOpen(true);
        setSelectedUserEmail(email);
    }
     const closeReportModal = () => {
        setIsModalReportOpen(false);
        fetchUsers();
    };
    const openAbsenceModal = (email) =>{
        setIsModalAbsenceOpen(true);
        setSelectedUserEmail(email);
    }
     const closeAbsenceModal = () => {
        setIsModalAbsenceOpen(false);
        fetchUsers();
    };
    const openAttendanceModal = (email) =>{
        setIsModalOpen(true);
        setSelectedUserEmail(email);
    }
    const closeUserModal = () => {
        setIsModalOpen(false);
        fetchUsers();
    };

    const filteredEmployees = employees ? employees.filter((employee) => {
        return (
            employee &&
            employee.email &&
            (teamFilter === "Todos" || employee.team === teamFilter) &&
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

    const [contractTypeFilter, setContractTypeFilter] = useState("Todos");

    const filteredContracts = contracts ? contracts.filter((contract) =>
        contract &&
        typeof contract.user_email === 'string' && 
        contract.user_email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (contractTypeFilter === "Todos" || contract.type === contractTypeFilter)
    ) : [];
    
    const leaders = employees.filter(employee => employee.role !== 'asistente');

    const leaderEmails = employees
    .filter((employee) => employee.role === 'gerente')
    .map((employee) => employee.email);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchQuery(''); 
    };    


    const [emailFilter, setEmailFilter] = useState("");
    
    const [emailFilter2, setEmailFilter2] = useState("");

const fetchAttendances = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_AT_URL}/get-attendances`);
        let allAttendances = Array.isArray(response.data) ? response.data : [];

        if (emailFilter) {
            allAttendances = allAttendances.filter(attendance => 
                attendance.abogado_id.toLowerCase().includes(emailFilter.toLowerCase())
            );
        }

        setAttendances(allAttendances);
    } catch (error) {
        console.error("Error fetching attendances:", error);
    }
};

const fetchAbsences = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_AT_URL}/get-absences`);
        let allAbsences = Array.isArray(response.data) ? response.data : [];

        if (emailFilter2) {
            allAbsences = allAbsences.filter(absence => 
                absence.abogado_id.toLowerCase().includes(emailFilter2.toLowerCase())
            );
        }

        setAbsences(allAbsences);
    } catch (error) {
        console.error("Error fetching absences:", error);
    }
};

// Llamar a las funciones automáticamente cuando cambie el emailFilter

useEffect(() => {
    fetchAbsences();
}, [emailFilter2]); // Se ejecuta cada vez que cambia emailFilter


useEffect(() => {
    fetchAttendances();
}, [emailFilter]); // Se ejecuta cada vez que cambia emailFilter



const deleteAbsence = async (abogadoId) => {
    try {
        // Check if we have a valid abogadoId
        if (!abogadoId) {
            Swal.fire("Error", "No se ha seleccionado un usuario para eliminar la ausencia", "error");
            return;
        }

        const response = await axios.delete(`${import.meta.env.VITE_AT_URL}/delete-absence`, {
            data: { abogado_id: abogadoId }
        });

        Swal.fire("Eliminado", response.data.message, "success");
        fetchAbsences(); // Refrescar la lista de ausencias
    } catch (error) {
        Swal.fire("Error", "Hubo un problema al eliminar la ausencia", "error");
        console.error("Error al eliminar la ausencia:", error);
    }
};


const [selectedAbsence, setSelectedAbsence] = useState(null);
const [isEditingAbsence, setIsEditingAbsence] = useState(false);

// Replace the existing handleEditAbsence function with:
const handleEditAbsence = (absence) => {
    setSelectedAbsence(absence);
    setIsEditingAbsence(true);
};

// Add a function to close the edit modal:
const closeEditAbsenceModal = () => {
    setIsEditingAbsence(false);
    setSelectedAbsence(null);
    fetchAbsences();
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

                <div className="mb-6 flex flex-wrap justify-center sm:flex-nowrap">
                    <button
                        onClick={() => handleTabChange("usuarios")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "usuarios"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Usuarios
                    </button>
                    <button
                        onClick={() => handleTabChange("equipos")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "equipos"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Asistencias
                    </button>
                    <button
                        onClick={() => handleTabChange("asistentes")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "asistentes"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Ausencias
                    </button>
                </div>

                {/* Contenido de la pestaña de Usuarios */}
                {activeTab === "usuarios" && (
                    <>
                        {/* Buscador */}
                        <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                            <input
                                type="text"
                                placeholder="Escribe el correo del usuario..."
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Superior
                                        </th>
                                        
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Profesión
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Registrar - Ver
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[25px] max-w-[25px] overflow-hidden text-ellipsis">
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 min-w-[25px] max-w-[25px] overflow-hidden text-ellipsis">
                                                {editingRow === employee.email ? (
                                                    <select
                                                        value={tempEmployeeData.superior !== undefined ? tempEmployeeData.superior : employee.superior}
                                                        onChange={(e) => handleChange("superior", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    >
                                                        <option value="">Sin superior</option>
                                                        {managers.map((manager) => (
                                                            <option key={manager.email} value={manager.email}>
                                                                {manager.email}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span title={employee.superior}>{employee.superior || "Sin superior"}</span>
                                                )}
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
                                                          onClick={() => openAttendanceModal(employee.email)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                         Asistencia
                                                        </button>

                                                        <button
                                                          onClick={() => openAbsenceModal(employee.email)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                         Ausencia
                                                        </button>

                                                        <button
                                                            onClick={() => openReportModal(employee.email)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                        Ver Reporte
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

                {/* Contenido de la pestaña de attendance */}
                {activeTab === "equipos" && (
                    <>
                        {/* Buscador */}
                     <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
    <input
        type="text"
        placeholder="Escribe el correo del usuario..."
        className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
        value={emailFilter}
        onChange={(e) => setEmailFilter(e.target.value)}
    />
         <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                            >
                                Buscar
                            </button>
</div>
                        <div className="overflow-x-auto bg-white shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Entrada
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Salida
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tardanza
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tipo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white divide-y divide-gray-200">
                                   {attendances.map((attendance, index) => (
                                       <tr key={attendance._id || index}>
                                           <td className="px-6 py-4 text-sm text-gray-900">{attendance.abogado_id}</td>
                                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(attendance.fecha).toLocaleDateString()}</td>
                                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(attendance.entrada).toLocaleTimeString()}</td>
                                           <td className="px-6 py-4 text-sm text-gray-500">{new Date(attendance.salida).toLocaleTimeString()}</td>
                                           <td className="px-6 py-4 text-sm text-gray-500">
                                               {attendance.tardanza ? "Sí" : "No"}
                                           </td>
                                           <td className="px-6 py-4 text-sm text-gray-500">{attendance.tipo}</td>
                                           <td className="px-6 py-4 text-sm text-gray-500">{attendance.motivo}</td>
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
                                placeholder="Escribe el correo del usuario..."
                                className="w-full sm:w-3/4 lg:w-2/5 max-w-lg rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                value={emailFilter2}
                                onChange={(e) => setEmailFilter2(e.target.value)}
                            />
                                 <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                            >
                                Buscar
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            
                            </div>
                        <div className="overflow-x-auto bg-white shadow rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Tipo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Motivo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Documento de respaldo
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                           Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {absences.map((absence, index) => (
                                        <tr key={absence._id}>
                                    

                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {absence.abogado_id}
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {new Date(absence.fecha).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {absence.tipo}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {absence.motivo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">


                                            <button
                                                    className="text-blue-600 hover:text-black-900"
                                                    onClick={() => handleEditAbsence(absence)}
                                                >
                                                    Editar
                                                </button>
                                                <br />

                                                <button
                                                    className="text-red-600 hover:text-red-900"
                                                    onClick={() => deleteAbsence(absence.abogado_id)}
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
            {isModalOpen && (
            <InsertAttendanceModal 
            closeModal={() => {
                closeUserModal();
                fetchAttendances();
            }} 
            attendanceData={{ email: selectedUserEmail }} />)}

            {isModalAbsenceOpen &&( 
                <InsertAbsenceModal 
                closeModal={() =>{
                    closeAbsenceModal();
                    fetchAbsences();
                }}
            attendanceData={{ email: selectedUserEmail }} />)}
            {isModalReportOpen && <ShowReport closeModal={closeReportModal} attendanceData={{ email: selectedUserEmail }} />}


            {isEditingAbsence && (
            <UpdateAbsence
            closeModal={closeEditAbsenceModal}
            attendanceData={{ email: selectedAbsence.abogado_id }}
            isEditing={true}
            absenceToEdit={selectedAbsence}
            />
        )}
      
      
      
        </div>
    );
};

export default Attendance;
