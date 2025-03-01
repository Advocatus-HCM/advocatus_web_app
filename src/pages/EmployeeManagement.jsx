import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/layout/Sidebar";
import Select from "react-select";
import CreateUserModal from "../components/forms/CreateUserModal";
import CreateTeamModal from "../components/forms/CreateTeamModal";
import CreateAssistantModal from "../components/forms/CreateAssistantModal";
import CreateContractModal from "../components/forms/CreateContractModal";
import Cookies from 'js-cookie';

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
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [assistantSearchQuery, setAssistantSearchQuery] = useState('');
    const [contracts, setContracts] = useState([]);
    const [contractTypes, setContractTypes] = useState([]);
    const [tempContractData, setTempContractData] = useState({});
    const [userEmails, setUserEmails] = useState([]);
    const [editingContract, setEditingContract] = useState(null);
    const [managers, setManagers] = useState([]);
    const token = Cookies.get('token');


    useEffect(() => {
        fetchUsers();
        fetchTeams();
        fetchRoles();
        fetchProfessions();
        fetchAssistants();
        fetchContracts();
        fetchUserEmails();
        fetchContractTypes();
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

    const addContract = (contract) => {
        setContracts((prev) => [...prev, contract]);
    };

    const fetchUsers = async () => {
        try {
            const token = Cookies.get('token'); 
            const email = Cookies.get('email'); 
    
            const response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetAllUsersPersonalManager($userAuth: UserAuth!) {
                            getAllUsersPersonalManager(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            console.log("API Response:", response.data); 
    
            const allUsers = Array.isArray(response.data.data.getAllUsersPersonalManager.response) 
                ? response.data.data.getAllUsersPersonalManager.response 
                : [];
    
            setEmployees(allUsers);
            setManagers(allUsers.filter(user => user.role === "gerente"));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };
    
    const fetchUserEmails = async () => { //Nicolas
        const token = Cookies.get('token'); 
        const email = Cookies.get('email'); 
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetAllUsersPersonalManager($userAuth: UserAuth!) {
                            getAllUsersPersonalManager(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de los Usuarios:", error);
        }
        const result = response.data;
        //Verificar Exito o Error
        if(result!=null && result.data.getAllUsersPersonalManager.success){
            const emails = Array.isArray(result.data.getAllUsersPersonalManager.response) ? result.data.getAllUsersPersonalManager.response.map((user) => ({ label: user.email, value: user.email })) : [];
            setUserEmails(emails);
        }else{
            console.error("Error fetching user emails:", result.data.getAllUsersPersonalManager.response);
        }
    };

    const fetchContractTypes = async () => { //Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetContractTypes($userAuth: UserAuth!) {
                            getContractTypes(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la Obtención de los Tipos de Contrato:", error);
        }

        const result = response.data;

        //Verificar Exito o Error
        if(result!=null && result.data.getContractTypes.success){
            setContractTypes(result.data.getContractTypes.response);
        }else{
            console.error("Error fetching contract types:", result.data.getContractTypes.response);
        }
    };

    const fetchTeams = async () => { // Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetTeams($userAuth: UserAuth!) {
                            getTeams(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de los Equipos:", error);
        }
        const result = response.data;
        //Verificar Exito o Error
        if(result!=null && result.data.getTeams.success){
            const teams = Array.isArray(result.data.getTeams.response) ? result.data.getTeams.response : [];
            setTeams(Array.isArray(result.data.getTeams.response) ? result.data.getTeams.response : []);
        }else{
            console.error("Error fetching teams:", result.data.getTeams.response);
        }
    };

    const fetchRoles = async () =>{ //Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetRoles($userAuth: UserAuth!) {
                            getRoles(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de los Roles:", error);
        }

        const result = response.data;
        if(result!=null && result.data.getRoles.success){
            setRoles(Array.isArray(result.data.getRoles.response) ? result.data.getRoles.response : []);
        }else{
            console.error("Error fetching roles:", result.data.getRoles.response);
        }

    };

    const fetchProfessions = async () => { //Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetProfessions($userAuth: UserAuth!) {
                            getProfessions(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de las Profesiones:", error);
        }
        
        const result = response.data;
        //Verificar Exito o Error
        if(result!=null && result.data.getProfessions.success){
            setProfessions(Array.isArray(result.data.getProfessions.response) ? result.data.getProfessions.response : []);
        }else{
            console.error("Error fetching professions:", result.data.getProfessions.response);
        }
    };

    const fetchAssistants = async () => { // Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetAllAssistants($userAuth: UserAuth!) {
                            getAllAssistants(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de los Asistentes:", error);
        }

        const result = response.data;
        console.log(result);
        //Verificar Exito o Error
        if(result!=null && result.data.getAllAssistants.success){
            setAssistants(Array.isArray(result.data.getAllAssistants.response.assistants) ? result.data.getAllAssistants.response.assistants : []);
        }else{
            console.error("Error fetching assistants:", result.data.getAllAssistants.response);
        }
    };


    const fetchContracts = async () => { // Nicolas
        const token = Cookies.get('token');
        const email = Cookies.get('email');
        let response = null;
        try{
            response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation GetAllContracts($userAuth: UserAuth!) {
                            getAllContracts(userAuth: $userAuth)
                        }
                    `,
                    variables: {
                        userAuth: {
                            email: email, 
                            token: token 
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
        }catch(error){
            console.error("No se pudo realizar la Petición al API Gateway en la obtención de los Contratos:", error);
        }
        const result = response.data;
        //Verificar Exito o Error
        if(result!=null && result.data.getAllContracts.success){
            setContracts(Array.isArray(result.data.getAllContracts.response) ? result.data.getAllContracts.response : []);
        }else{
            console.error("Error fetching contracts:", result.data.getAllContracts.response);
        }
    };

    // const handleSave = async (email) => { // Gabriel
    //     try {
    //         const dataToSend = { ...tempEmployeeData };
    //         if (dataToSend.team === "") {
    //             delete dataToSend.team;
    //         }
    //         await axios.patch(`${import.meta.env.VITE_PM_URL}/update-user/${email}`, dataToSend);
    //         setEmployees((prev) =>
    //             prev.map((employee) =>
    //                 employee.email === email ? { ...employee, ...tempEmployeeData } : employee
    //             )
    //         );
    //         setEditingRow(null);
    //         setTempEmployeeData({});
    //         Swal.fire("Actualizado!", "El usuario ha sido actualizado.", "success");
    //     } catch (error) {
    //         console.error("Error updating user:", error);
    //         Swal.fire("Error!", "Hubo un error al actualizar el usuario.", "error");
    //     }
    // };
    const handleSave = async (email) => { // Gabriel
        try {
            const dataToSend = { ...tempEmployeeData };
            if (dataToSend.team === "") {
                delete dataToSend.team;
            }
    
            const token = Cookies.get('token'); 
            const userEmail = Cookies.get('email'); 
    
            const response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation UpdateUserPersonalManager($email: String!, $input: JSON!, $userAuth: UserAuth!) {
                            updateUserPersonalManager(email: $email, input: $input, userAuth: $userAuth) {
                                message
                                success
                                response
                            }
                        }
                    `,
                    variables: {
                        email: email,
                        input: dataToSend,
                        userAuth: {
                            email: userEmail,
                            token: token
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            const result = response.data.data.updateUserPersonalManager;
    
            if (result.success) {
                setEmployees((prev) =>
                    prev.map((employee) =>
                        employee.email === email ? { ...employee, ...tempEmployeeData } : employee
                    )
                );
                setEditingRow(null);
                setTempEmployeeData({});
                Swal.fire("Actualizado!", "El usuario ha sido actualizado.", "success");
            } else {
                throw new Error(result.message);
            }
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

        setTempContractData((prev) => ({
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

    const handleEditContract = (contract) => {
        setEditingContract(contract.user_email);
        setTempContractData({ ...contract });
    };

    // const handleSaveContract = async (contractEmail) => { // Gabriel
    //     try {
    //         const dataToSend = Object.keys(tempContractData).reduce((acc, key) => {
    //             if (tempContractData[key] !== contracts.find((c) => c.user_email === contractEmail)[key]) {
    //                 acc[key] = tempContractData[key];
    //             }
    //             return acc;
    //         }, {});

    //         if (Object.keys(dataToSend).length > 0) {
    //             await axios.patch(`${import.meta.env.VITE_PM_URL}/update-contract/${contractEmail}`, dataToSend);
    //             setContracts((prev) =>
    //                 prev.map((contract) =>
    //                     contract.user_email === contractEmail ? { ...contract, ...dataToSend } : contract
    //                 )
    //             );
    //             Swal.fire("Actualizado!", "El contrato ha sido actualizado.", "success");
    //         }
    //         setEditingContract(null);
    //         setTempContractData({});
    //     } catch (error) {
    //         console.error("Error updating contract:", error);
    //         Swal.fire("Error!", "Hubo un error al actualizar el contrato.", "error");
    //     }
    // };
    const handleSaveContract = async (contractEmail) => { // Gabriel
        try {
            const dataToSend = Object.keys(tempContractData).reduce((acc, key) => {
                if (tempContractData[key] !== contracts.find((c) => c.user_email === contractEmail)[key]) {
                    acc[key] = tempContractData[key];
                }
                return acc;
            }, {});
    
            if (Object.keys(dataToSend).length > 0) {
                const token = Cookies.get('token'); 
                const userEmail = Cookies.get('email'); 
    
                const response = await axios.post(
                    `${import.meta.env.VITE_AG_URL}`, 
                    {
                        query: `
                            mutation UpdateContract($email: String!, $input: JSON!, $userAuth: UserAuth!) {
                                updateContract(email: $email, input: $input, userAuth: $userAuth) {
                                    message
                                    success
                                    response
                                }
                            }
                        `,
                        variables: {
                            email: contractEmail,
                            input: dataToSend,
                            userAuth: {
                                email: userEmail,
                                token: token
                            }
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const result = response.data.data.updateContract;
    
                if (result.success) {
                    setContracts((prev) =>
                        prev.map((contract) =>
                            contract.user_email === contractEmail ? { ...contract, ...dataToSend } : contract
                        )
                    );
                    Swal.fire("Actualizado!", "El contrato ha sido actualizado.", "success");
                } else {
                    throw new Error(result.message);
                }
            }
            setEditingContract(null);
            setTempContractData({});
        } catch (error) {
            console.error("Error updating contract:", error);
            Swal.fire("Error!", "Hubo un error al actualizar el contrato.", "error");
        }
    };

    // const handleSaveTeam = async (teamName) => { // Gabriel
    //     try {
    //         const dataToSend = { ...tempTeamData };
    //         if (dataToSend.name === "") {
    //             delete dataToSend.name;
    //         }
    //         if (dataToSend.leader === "") {
    //             delete dataToSend.leader;
    //         }
    //         if (dataToSend.scope === "") {
    //             delete dataToSend.scope;
    //         }
    //         await axios.patch(`${import.meta.env.VITE_PM_URL}/update-team/${teamName}`, dataToSend);
    //         setTeams((prev) =>
    //             prev.map((team) =>
    //                 team.name === teamName ? { ...team, ...tempTeamData } : team
    //             )
    //         );
    //         setEditingTeam(null);
    //         setTempTeamData({});
    //         Swal.fire("Actualizado!", "El equipo ha sido actualizado.", "success");
    //     } catch (error) {
    //         console.error("Error updating team:", error);
    //         Swal.fire("Error!", "Hubo un error al actualizar el equipo.", "error");
    //     }
    // };
    const handleSaveTeam = async (teamName) => { // Gabriel
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
    
            const token = Cookies.get('token'); 
            const userEmail = Cookies.get('email'); 
    
            const response = await axios.post(
                `${import.meta.env.VITE_AG_URL}`, 
                {
                    query: `
                        mutation UpdateTeam($name: String!, $input: JSON!, $userAuth: UserAuth!) {
                            updateTeam(name: $name, input: $input, userAuth: $userAuth) {
                                message
                                success
                                response
                            }
                        }
                    `,
                    variables: {
                        name: teamName,
                        input: dataToSend,
                        userAuth: {
                            email: userEmail,
                            token: token
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            const result = response.data.data.updateTeam;
    
            if (result.success) {
                setTeams((prev) =>
                    prev.map((team) =>
                        team.name === teamName ? { ...team, ...tempTeamData } : team
                    )
                );
                setEditingTeam(null);
                setTempTeamData({});
                Swal.fire("Actualizado!", "El equipo ha sido actualizado.", "success");
            } else {
                throw new Error(result.message);
            }
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

    const openContractModal = () => {
        setIsContractModalOpen(true);
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

    const closeContractModal = () => {
        setIsContractModalOpen(false);
        fetchContracts();
    };

    // const handleDeleteUser = async (userEmail) => { // Gabriel
    //     const result = await Swal.fire({
    //         title: '¿Estás seguro?',
    //         text: "No podrás revertir esto",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, eliminar',
    //         cancelButtonText: 'Cancelar'
    //     });
    
    
    //     if (result.isConfirmed) {
    //         try {
    //             await axios.delete(`${import.meta.env.VITE_PM_URL}/delete-user/${userEmail}`);
    //             setEmployees((prev) => prev.filter((employee) => employee.email !== userEmail));
    //             Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
    //         } catch (error) {
    //             console.error("Error deleting user:", error);
    //             Swal.fire("Error!", "Hubo un error al eliminar el usuario.", "error");
    //         }
    //     }
    // };
    const handleDeleteUser = async (userEmail) => { // Gabriel
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
                const token = Cookies.get('token'); 
                const email = Cookies.get('email'); 
    
                const response = await axios.post(
                    `${import.meta.env.VITE_AG_URL}`, 
                    {
                        query: `
                            mutation DeleteUserPersonalManager($email: String!, $userAuth: UserAuth!) {
                                deleteUserPersonalManager(email: $email, userAuth: $userAuth) {
                                    message
                                    success
                                    response
                                }
                            }
                        `,
                        variables: {
                            email: userEmail,
                            userAuth: {
                                email: email,
                                token: token
                            }
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const result = response.data.data.deleteUserPersonalManager;
    
                if (result.success) {
                    setEmployees((prev) => prev.filter((employee) => employee.email !== userEmail));
                    Swal.fire("Eliminado!", "El usuario ha sido eliminado.", "success");
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error deleting user:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el usuario.", "error");
            }
        }
    };
    

    // const handleDeleteAssistant = async (assistantEmail, userEmail) => { // Gabriel
    //     const result = await Swal.fire({
    //         title: '¿Estás seguro?',
    //         text: "No podrás revertir esto",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, eliminar',
    //         cancelButtonText: 'Cancelar'
    //     });
    
    //     if (result.isConfirmed) {
    //         try {
    //             await axios.delete(`${import.meta.env.VITE_PM_URL}/remove-assistant`, {
    //                 data: {
    //                     assistant_email: assistantEmail,
    //                     user_email: userEmail
    //                 }
    //             });
    //             setAssistants((prev) => prev.filter((assistant) => assistant.email !== assistantEmail));
    //             Swal.fire("Eliminado!", "El asistente ha sido eliminado.", "success");
    //         } catch (error) {
    //             console.error("Error deleting assistant:", error);
    //             Swal.fire("Error!", "Hubo un error al eliminar el asistente.", "error");
    //         }
    //     }
    // };
    const handleDeleteAssistant = async (assistantEmail, userEmail) => { // Gabriel
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
                const token = Cookies.get('token'); 
                const email = Cookies.get('email'); 
    
                const response = await axios.post(
                    `${import.meta.env.VITE_AG_URL}`, 
                    {
                        query: `
                            mutation DeleteAssistant($assistantEmail: String!, $userEmail: String!, $userAuth: UserAuth!) {
                                deleteAssistant(assistantEmail: $assistantEmail, userEmail: $userEmail, userAuth: $userAuth) {
                                    message
                                    success
                                    response
                                }
                            }
                        `,
                        variables: {
                            assistantEmail: assistantEmail,
                            userEmail: userEmail,
                            userAuth: {
                                email: email,
                                token: token
                            }
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const result = response.data.data.deleteAssistant;
    
                if (result.success) {
                    setAssistants((prev) => prev.filter((assistant) => assistant.email !== assistantEmail));
                    Swal.fire("Eliminado!", "El asistente ha sido eliminado.", "success");
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error deleting assistant:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el asistente.", "error");
            }
        }
    };

    // const handleDeleteTeam = async (teamName) => { // Gabriel
    //     const result = await Swal.fire({
    //         title: '¿Estás seguro?',
    //         text: "No podrás revertir esto",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, eliminar',
    //         cancelButtonText: 'Cancelar'
    //     });
    
    //     if (result.isConfirmed) {
    //         try {
    //             await axios.delete(`${import.meta.env.VITE_PM_URL}/delete-team/${teamName}`);
    //             setTeams((prev) => prev.filter((team) => team.name !== teamName));
    //             Swal.fire("Eliminado!", "El equipo ha sido eliminado.", "success");
    //         } catch (error) {
    //             console.error("Error deleting team:", error);
    //             Swal.fire("Error!", "Hubo un error al eliminar el equipo.", "error");
    //         }
    //     }
    // };
    const handleDeleteTeam = async (teamName) => { // Gabriel
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
                const token = Cookies.get('token'); 
                const email = Cookies.get('email'); 
    
                const response = await axios.post(
                    `${import.meta.env.VITE_AG_URL}`, 
                    {
                        query: `
                            mutation DeleteTeam($name: String!, $userAuth: UserAuth!) {
                                deleteTeam(name: $name, userAuth: $userAuth) {
                                    message
                                    success
                                    response
                                }
                            }
                        `,
                        variables: {
                            name: teamName,
                            userAuth: {
                                email: email,
                                token: token
                            }
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const result = response.data.data.deleteTeam;
    
                if (result.success) {
                    setTeams((prev) => prev.filter((team) => team.name !== teamName));
                    Swal.fire("Eliminado!", "El equipo ha sido eliminado.", "success");
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error deleting team:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el equipo.", "error");
            }
        }
    };

    // const handleDeleteContract = async (contractEmail) => { // Gabriel
    //     const result = await Swal.fire({
    //         title: '¿Estás seguro?',
    //         text: "No podrás revertir esto",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Sí, eliminar',
    //         cancelButtonText: 'Cancelar'
    //     });

    //     if (result.isConfirmed) {
    //         try {
    //             await axios.delete(`${import.meta.env.VITE_PM_URL}/delete-contract/${contractEmail}`);
    //             setContracts((prev) => prev.filter((contract) => contract.user_email !== contractEmail));
    //             Swal.fire("Eliminado!", "El contrato ha sido eliminado.", "success");
    //         } catch (error) {
    //             console.error("Error deleting contract:", error);
    //             Swal.fire("Error!", "Hubo un error al eliminar el contrato.", "error");
    //         }
    //     }
    // };
    const handleDeleteContract = async (contractEmail) => { // Gabriel
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
                const token = Cookies.get('token'); 
                const email = Cookies.get('email'); 
    
                const response = await axios.post(
                    `${import.meta.env.VITE_AG_URL}`, 
                    {
                        query: `
                            mutation DeleteContract($email: String!, $userAuth: UserAuth!) {
                                deleteContract(email: $email, userAuth: $userAuth) {
                                    message
                                    success
                                    response
                                }
                            }
                        `,
                        variables: {
                            email: contractEmail,
                            userAuth: {
                                email: email,
                                token: token
                            }
                        }
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
    
                const result = response.data.data.deleteContract;
    
                if (result.success) {
                    setContracts((prev) => prev.filter((contract) => contract.user_email !== contractEmail));
                    Swal.fire("Eliminado!", "El contrato ha sido eliminado.", "success");
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error("Error deleting contract:", error);
                Swal.fire("Error!", "Hubo un error al eliminar el contrato.", "error");
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
                        Equipos
                    </button>
                    <button
                        onClick={() => handleTabChange("asistentes")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "asistentes"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Asistentes
                    </button>
                    <button
                        onClick={() => handleTabChange("contratos")}
                        className={`w-full sm:w-auto px-4 py-2 text-center text-lg font-medium ${
                            activeTab === "contratos"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-600"
                        }`}
                    >
                        Contratos
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Superior
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

                        <div className="mb-6 lg:text-left text-center">
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
                    
                        <div className="mb-6 lg:text-left text-center">
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
                {activeTab === "contratos" && (
                    <>
                        <div className="flex flex-row justify-center items-center gap-4 mb-6 w-full">
                            <input
                                type="text"
                                placeholder="Buscar por correo electrónico..."
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

                        <div className="mb-6 lg:text-left text-center">
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
                                onClick={openContractModal}
                            >
                                Crear contrato
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filtrar por tipo de contrato
                                </label>
                                <select
                                    value={contractTypeFilter}
                                    onChange={(e) => setContractTypeFilter(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                                >
                                    <option value="Todos">Todos los tipos</option>
                                    {Array.isArray(contractTypes) && contractTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto bg-white shadow rounded-lg max-h-96 overflow-y-auto">
                            <table className="min-w-full table-fixed divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salario</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Fin</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin Prueba</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredContracts.map((contract, index) => (
                                        <tr key={contract._id || index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {editingContract === contract.user_email ? (
                                                    <Select
                                                        options={userEmails}
                                                        value={userEmails.find((email) => email.value === tempContractData.user_email)}
                                                        onChange={(selectedOption) => handleChange("user_email", selectedOption.value)}
                                                    />
                                                ) : (
                                                    contract.user_email
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <select
                                                        value={tempContractData.type}
                                                        onChange={(e) => handleChange("type", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    >
                                                        {contractTypes.map((type) => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    contract.type
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <input
                                                        type="number"
                                                        value={tempContractData.salary}
                                                        onChange={(e) => handleChange("salary", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    contract.salary
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <input
                                                        type="date"
                                                        value={tempContractData.start_date}
                                                        onChange={(e) => handleChange("start_date", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    contract.start_date
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <input
                                                        type="date"
                                                        value={tempContractData.end_date}
                                                        onChange={(e) => handleChange("end_date", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    contract.end_date
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <input
                                                        type="date"
                                                        value={tempContractData.probation_end_date}
                                                        onChange={(e) => handleChange("probation_end_date", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    />
                                                ) : (
                                                    contract.probation_end_date
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {editingContract === contract.user_email ? (
                                                    <select
                                                        value={tempContractData.role}
                                                        onChange={(e) => handleChange("role", e.target.value)}
                                                        className="border border-gray-300 rounded-md p-2 w-full"
                                                    >
                                                        {roles.map((role) => (
                                                            <option key={role} value={role}>{role}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    contract.role
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {editingContract === contract.user_email ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleSaveContract(contract.user_email)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setEditingContract(null);
                                                                setTempContractData({});
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleEditContract(contract)}
                                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            className="text-red-600 hover:text-red-900"
                                                            onClick={() => handleDeleteContract(contract.user_email)}
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
            </div>

            {/* Modal para crear usuario */}
            {isModalOpen && <CreateUserModal closeModal={closeUserModal} addUser={addUser} />}
            {isTeamModalOpen && <CreateTeamModal closeModal={closeTeamModal} addTeam={addTeam} />}
            {isAssistantModalOpen && <CreateAssistantModal closeModal={closeAssistantModal} refreshAssistants={addAssistant} />}
            {isContractModalOpen && <CreateContractModal closeModal={closeContractModal} addContract={addContract} />}
        </div>
    );
};

export default EmployeeManagement;
