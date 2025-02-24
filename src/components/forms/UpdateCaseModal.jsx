import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import Cookies from "js-cookie";

const UpdateCaseModal = ({ closeModal, caseData }) => {
    const myToken = Cookies.get("token");

    // Pre-fill states with caseData
    const [name, setName] = useState(caseData.name || "");
    const [description, setDescription] = useState(caseData.description || "");
    const [type, setType] = useState(caseData.type || "");
    const [subtype, setSubtype] = useState(caseData.subtype || "");
    const [status, setStatus] = useState(caseData.status || "in_process");
    const [archived, setArchived] = useState(caseData.archived || "False");
    const [involvedPersonnel, setInvolvedPersonnel] = useState([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState([]);

    const queryGet = `
        mutation GetAllUsersPersonalManager($userAuth: UserAuth!) {
         getAllUsersPersonalManager(userAuth: $userAuth)
        }
    `;

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_AG_URL}/`, 
                {
                    query: queryGet, 
                    variables: {
                        userAuth: {
                            email: "admin@admin.com",
                            token: myToken, 
                        },
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
           
            const allUsers = Array.isArray(response.data.data.getAllUsersPersonalManager.response) 
                ? response.data.data.getAllUsersPersonalManager.response 
                : [];

            const personnel = allUsers
                .filter(user => ["Abogado"].includes(user.profession))
                .map(user => ({
                    label: `${user.name} ${user.last_name}`,  
                    value: user.email 
                }));

            setInvolvedPersonnel(personnel);

            // Pre-fill selected personnel if case has involved personnel
            if (caseData.involved_personnel && caseData.involved_personnel.length > 0) {
                const preSelectedPersonnel = caseData.involved_personnel.map(person => ({
                    label: person.label || `${person.name} ${person.last_name}`,
                    value: person.value || person.email
                }));
                setSelectedPersonnel(preSelectedPersonnel);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updateData = {
            data: {
                name,
                description,
                type,
                subtype,
                status,
                archived,
                involved_personnel: selectedPersonnel,
            },
            caseid: caseData._id,
            userAuth: {
                email: "admin@admin.com",
                token: myToken, 
            }
        };

        const query = `
            mutation UpdateCase($caseid: String!, $data: JSON!, $userAuth: UserAuth!) {
                updateCase(caseid: $caseid, data: $data, userAuth: $userAuth)
            }
        `;

        try {
            const response = await axios.post(`${import.meta.env.VITE_AG_URL}/`, {
                query,
                variables: updateData,
            });

            Swal.fire({
                title: 'Éxito',
                text: 'Caso actualizado exitosamente',
                icon: 'success',
                confirmButtonText: 'OK'
            });

            console.log("Respuesta del servidor:", response.data);
            closeModal();
        } catch (error) {
            console.error("Error al actualizar el caso:", error);
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al actualizar el caso',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
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

    const handlePersonnelChange = (selectedOptions) => {
        setSelectedPersonnel(selectedOptions);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Editar Caso</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo *</label>
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
                        {type && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700">Subtipo *</label>
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
                        <label className="block text-sm font-medium text-gray-700">Estado *</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        >
                            <option value="">Seleccione un estado</option>
                            <option value="in_process">En Proceso</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Encargados</label>
                        <Select
                            isMulti
                            options={involvedPersonnel}
                            value={selectedPersonnel}
                            onChange={handlePersonnelChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm"
                            placeholder="Seleccionar encargados"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                        >
                            Actualizar Caso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCaseModal;