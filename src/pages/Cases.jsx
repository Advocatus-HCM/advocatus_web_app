import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Sidebar from "../components/layout/Sidebar";
import Cookies from "js-cookie"; // Importar js-cookie para manejar las cookies
import CreateCaseModal from "../components/forms/CreateCaseModal";
import UpdateCaseModal from "../components/forms/UpdateCaseModal";

const Cases = () => {
    const [activeTab, setActiveTab] = useState("activos");
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState("Todos");
    const [subtypeFilter, setSubtypeFilter] = useState("Todos");
    const [statusFilter, setStatusFilter] = useState("Todos");
    const [cases, setCases] = useState([]); // Estado para almacenar los casos obtenidos del backend
    const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [type, setType] = useState("");
    const [subtype, setSubtype] = useState("");


    const [selectedCase, setSelectedCase] = useState(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Obtener el token y el email desde las cookies
    const token = Cookies.get("token");
    const email = Cookies.get("email");

    // Función para obtener los casos desde el backend
    // Función para obtener los casos desde el backend
    const fetchCases = async () => {
        if (!token || !email) {
            Swal.fire("Error!", "No se encontró el token o el email en las cookies.", "error");
            setLoading(false);
            return;
        }
    
        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
    
            const graphql = JSON.stringify({
                query: `
                    mutation GetAllCases($userAuth: UserAuth!) {
                        getAllCases(userAuth: $userAuth)
                    }
                `,
                variables: {
                    userAuth: {
                        email: email,
                        token: token,
                    },
                },
            });
    
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
                redirect: "follow",
            };
    
            const response = await fetch("http://localhost:4000", requestOptions);
            const result = await response.json();
    
            console.log("Respuesta completa del backend:", result);
    
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }
    
            // Parse the JSON string returned by the backend
            let casesData = result.data.getAllCases;
            
            // If casesData is a string, parse it
            if (typeof casesData === 'string') {
                try {
                    casesData = JSON.parse(casesData);
                } catch (parseError) {
                    console.error("Error parsing cases data:", parseError);
                    throw new Error("Could not parse cases data");
                }
            }
    
            // Ensure casesData has a response array
            const processedCases = Array.isArray(casesData) 
                ? casesData.map(c => ({
                    ...c,
                    status: c.status || 'in_process',
                    archived: c.archived || 'False',
                    involved_personnel: c.involved_personnel || []
                }))
                : (casesData.response || []).map(c => ({
                    ...c,
                    status: c.status || 'in_process',
                    archived: c.archived || 'False',
                    involved_personnel: c.involved_personnel || []
                }));
    
            setCases(processedCases);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cases:", error);
            Swal.fire("Error!", "Hubo un error al obtener los casos: " + error.message, "error");
            setLoading(false);
        }
    };
    

    // Llamar a fetchCases cuando el componente se monta
    useEffect(() => {
        fetchCases();
    }, []);

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
            confirmButtonText: 'Sí, Archivar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                setCases((prev) => prev.filter((c) => c._id !== caseId));
                Swal.fire("archivado!", "El caso ha sido archivado.", "success");
            } catch (error) {
                console.error("Error deleting case:", error);
                Swal.fire("Error!", "Hubo un error al Archivar el caso.", "error");
            }
        }
    };





    const filteredCases = Array.isArray(cases) ? cases.filter((c) => {
        const isMatchingTab = 
            (activeTab === "activos" && c.archived !== "True" && c.status === "in_process") ||
            (activeTab === "cerrados" && (
                c.status === "Caso Cerrado (Fallo a favor)" || 
                c.status === "Caso Cerrado (Fallo en contra)" || 
                c.status === "Cerrado"
            )) ||
            (activeTab === "archivados" && c.archived === "True");
    
        return (
            isMatchingTab &&
            (type === "" || c.type === type) &&
            (subtype === "" || c.subtype === subtype) &&
            (statusFilter === "Todos" || 
                (activeTab === "activos" && statusFilter === "in_process") || 
                (activeTab === "cerrados" && statusFilter === c.status) ||
                (activeTab === "archivados")) &&
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }) : [];
    // Obtener el encargado del caso (persona con rol "Lawyer")
    const getCaseManager = (involvedPersonnel) => {
        const lawyer = involvedPersonnel.find((person) => person.role === "Abogado");
        return lawyer ? lawyer.name : "Sin asignar";
    };

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="lg:ml-64 w-full p-6 bg-gray-100 min-h-screen flex justify-center items-center">
                    <p>Cargando casos...</p>
                </div>
            </div>
        );
    }





    const openCaseModal = () => {
        setIsModalOpen(true);
    };

    const closeCaseModal = () => {
        setIsModalOpen(false);
      
    };


    const options = {
        "Derecho Penal": ["Homicidio", "Fraude", "Robo", "Delitos informáticos", "Corrupción", "Lavado de dinero", "Agresión y violencia doméstica"],
        "Derecho Civil": ["Divorcio y separación", "Custodia de menores", "Herencias y testamentos", "Responsabilidad civil", "Arrendamientos y desahucios", "Demandas por daños y perjuicios"],
        "Derecho Laboral": ["Despido injustificado", "Acoso laboral", "Reclamaciones salariales", "Incapacidades laborales", "Negociaciones sindicales", "Discriminación en el trabajo"],
        "Derecho Administrativo": ["Sanciones administrativas", "Licencias y permisos", "Recursos administrativos", "Responsabilidad patrimonial del Estado"],
        "Derecho Mercantil": ["Constitución de empresas", "Contratos comerciales", "Competencia desleal", "Protección de marcas y patentes", "Quiebras y concursos de acreedores"],
        "Derecho de la Salud": ["Negligencia médica", "Derechos del paciente", "Responsabilidad sanitaria", "Seguro médico y reclamaciones"],
        "Derecho Internacional": ["Extradición", "Derechos humanos", "Conflictos internacionales", "Comercio y aduanas"],
        "Derecho Inmobiliario": ["Compra-venta de inmuebles", "Hipotecas y embargos", "Conflictos de propiedad", "Regulación de condominios"],
        "Derecho de Propiedad Intelectual": ["Derechos de autor", "Patentes y marcas", "Litigios por plagio"]
    };



    const handleEditCase = (caseData) => {
        setSelectedCase(caseData);
        setIsUpdateModalOpen(true);
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
                            activeTab === "Cerrado"
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
                        onClick={openCaseModal}
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
                                value={type}
                                onChange={(e) => {
                                    setType(e.target.value);
                                    setSubtype("");
                                }}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            >
                                <option value="">Seleccione un tipo</option>
                                {Object.keys(options).map((key) => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Filtrar por subtipo
                        </label>
                        {type && (
                                 <div className="mt-1">
                                     <select
                                         value={subtype}
                                         onChange={(e) => setSubtype(e.target.value)}
                                         className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                     >
                                         <option value="">Seleccione un subtipo</option>
                                         {options[type].map((sub) => (
                                             <option key={sub} value={sub}>{sub}</option>
                                         ))}
                                     </select>
                                 </div>
                             )}
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
                                <option value="in_process">En Proceso</option>
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
                                        {c.name || 'Sin nombre'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.type || 'Sin tipo'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.subtype || 'Sin subtipo'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.created_at 
                                            ? new Date(c.created_at).toLocaleDateString() 
                                            : 'Fecha no disponible'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {c.status === "in_process" 
                                            ? "En Proceso" 
                                            : (c.status || 'Estado no definido')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getCaseManager(c.involved_personnel)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditCase(c)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            Editar
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

            {isModalOpen && <CreateCaseModal closeModal={closeCaseModal}  />}
            {isUpdateModalOpen && selectedCase && (
                <UpdateCaseModal 
                    closeModal={() => {
                        setIsUpdateModalOpen(false);
                        setSelectedCase(null);
                    }} 
                    caseData={selectedCase}
                />
            )}
        </div>
    );
};

export default Cases;