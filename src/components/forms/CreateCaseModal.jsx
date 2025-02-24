import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import Cookies from "js-cookie";
const myToken = Cookies.get("token");

const CreateCaseModal = ({ closeModal, involvedPersonnel,setInvolvedPersonnel }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [subtype, setSubtype] = useState("");
    const [status, setStatus] = useState("in_process");
    const [archived, setArchived] = useState("False");

    
    const queryGet= `
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
           
        const allUsers = Array.isArray(response.data.data.getAllUsersPersonalManager.response) ? response.data.data.getAllUsersPersonalManager.response : [];

        const personnel = allUsers.filter(user => ["Abogado"].includes(user.profession))
            .map(user => ({
                label: `${user.name} ${user.last_name}`,  
                value: user.email 
            }));
        setInvolvedPersonnel(personnel);
        console.log("personal manin",personnel)

    } catch (error) {
        console.error("Error fetching users:", error);
    }
};
   


const handleSubmit = async (e) => {
    e.preventDefault();

    const caseData = {
        data: {
            name,
            description,
            start_date: "2024-01-30", 
            type,
            subtype,
            status,
            archived,
            involved_personnel: involvedPersonnel,
           
        },
        userAuth: {
            email: "admin@admin.com",
            token: myToken, 
        }
    };

    const query = `
        mutation CreateCase($data: JSON!, $userAuth: UserAuth!) {
            createCase(data: $data, userAuth: $userAuth)
        }
    `;

    try {
        const response = await axios.post(`${import.meta.env.VITE_AG_URL}/`, {
            query,
            variables: caseData,
        });

        Swal.fire({
            title: 'Éxito',
            text: 'Caso creado exitosamente',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        console.log("Respuesta del servidor:", response.data); // Verifica la respuesta del servidor
        closeModal();
    } catch (error) {
        console.error("Error al crear el caso:", error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al crear el caso',
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
    
    const [personnelInputs, setPersonnelInputs] = useState([0]); 
    const handleAddPersonnelField = () => {
        // Añadir un nuevo campo vacío al arreglo personnelInputs
        setPersonnelInputs([...personnelInputs, '']);
    };
    
    const handleRemovePersonnelField = (index) => {
        // Crear una copia del estado involvedPersonnel y eliminar el encargado en la posición index
        const updatedPersonnel = involvedPersonnel.filter((_, i) => i !== index);
        setInvolvedPersonnel(updatedPersonnel);
    
        // Eliminar el campo de entrada correspondiente
        const updatedPersonnelInputs = personnelInputs.filter((_, i) => i !== index);
        setPersonnelInputs(updatedPersonnelInputs);
    };


    const handlePersonnelChange = (selectedOption, index) => {
        const updatedPersonnel = [...involvedPersonnel];
        updatedPersonnel[index] = selectedOption;
        setInvolvedPersonnel(updatedPersonnel);
    };


    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Crear Caso</h2>
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
                        <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                        <textarea
                             type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
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
                               <option value="Proceso">En Proceso</option>
                               <option value="Cerrado">Cerrado</option>
                           </select>
                        </div>

                        <div>
                    <label className="block text-sm font-medium text-gray-700">Encargados</label>
                    {personnelInputs.map((input, index) => (
                        <div key={index} className="mt-2 flex items-center">
                            <Select
                                options={involvedPersonnel}
                                onChange={(selectedOption) => handlePersonnelChange(selectedOption, index)}
                                className="block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                placeholder="Seleccionar encargado"
                               
                            />
                            <button
                                type="button"
                                onClick={() => handleRemovePersonnelField(index)}
                                className="ml-2 text-red-500 hover:text-red-700"
                            >
                                <MdClose className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPersonnelField}
                        className="mt-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Añadir otro encargado
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                    >
                        Crear
                    </button>
                </div>

                </form>
            </div>
        </div>
    );
};
export default CreateCaseModal;