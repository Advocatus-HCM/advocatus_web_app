import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateContractModal = ({ closeModal, addContract }) => {
    const [userEmail, setUserEmail] = useState("");
    const [type, setType] = useState("");
    const [salary, setSalary] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
    const [probationEndDate, setProbationEndDate] = useState(null);
    const [role, setRole] = useState("");
    const [users, setUsers] = useState([]);
    const [types, setTypes] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8001/get-users")
            .then(response => {
                const inactiveUsers = response.data.filter(user => user.role === "desactivado");
                setUsers(inactiveUsers);
            })
            .catch(error => {
                console.error("Error fetching users:", error);
            });

        axios.get("http://localhost:8001/get-types")
            .then(response => {
                setTypes(response.data);
            })
            .catch(error => {
                console.error("Error fetching contract types:", error);
            });

        axios.get("http://localhost:8001/get-roles")
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error("Error fetching roles:", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const contract = {
            user_email: userEmail,
            type,
            salary,
            start_date: startDate.toISOString().split("T")[0],
            probation_end_date: probationEndDate ? probationEndDate.toISOString().split("T")[0] : null,
            role
        };

        if (type !== "indefinido" && endDate) {
            contract.end_date = endDate.toISOString().split("T")[0];
        }

        axios.post("http://localhost:8001/create-contract", contract)
            .then(response => {
                Swal.fire({
                    title: "Contrato creado",
                    text: "El contrato ha sido creado exitosamente",
                    icon: "success",
                    confirmButtonText: "OK"
                });
                addContract(response.data);
                closeModal();
            })
            .catch(error => {
                console.error("Error creating contract:", error);
                Swal.fire({
                    title: "Error",
                    text: "Hubo un problema al crear el contrato",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            });
    };

    const userOptions = users.map(user => ({
        value: user.email,
        label: user.email
    }));

    const typeOptions = types.map(type => ({
        value: type,
        label: type
    }));

    const roleOptions = roles.map(role => ({
        value: role,
        label: role
    }));

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Crear Contrato</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario *</label>
                        <Select
                            options={userOptions}
                            onChange={(selectedOption) => setUserEmail(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar usuario"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo de Contrato *</label>
                        <Select
                            options={typeOptions}
                            onChange={(selectedOption) => setType(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar tipo de contrato"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Salario *</label>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            dateFormat="yyyy-MM-dd"
                            disabled={type === "indefinido"} 
                            placeholderText={type === "indefinido" ? "No aplica para contrato indefinido" : "Seleccionar fecha"}
                            minDate={startDate}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Fin del Periodo de Prueba *</label>
                        <DatePicker
                            selected={probationEndDate}
                            onChange={(date) => setProbationEndDate(date)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rol *</label>
                        <Select
                            options={roleOptions}
                            onChange={(selectedOption) => setRole(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar rol"
                            isClearable
                        />
                    </div>
                    <div>
                        <center>
                            <span className="text-xs text-gray-500">* Campos obligatorios</span>
                        </center>
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

export default CreateContractModal;