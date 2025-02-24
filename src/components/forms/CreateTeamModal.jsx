import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';

const CreateTeamModal = ({ closeModal, addTeam }) => {
    const [name, setName] = useState("");
    const [leader, setLeader] = useState("");
    const [scope, setScope] = useState("");
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_PM_URL}/get-users`)
            .then(response => {
                const managers = response.data.filter(user => user.role === 'gerente');
                setLeaders(managers);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const team = {
            name,
            leader,
            scope
        };

        axios.post(`${import.meta.env.VITE_PM_URL}/create-team`, team)
            .then(response => {
                Swal.fire({
                    title: 'Equipo creado',
                    text: 'El equipo ha sido creado exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                addTeam(response.data);
                closeModal();
            })
            .catch(error => {
                console.error('Error creating team:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al crear el equipo',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const leaderOptions = leaders.map(leader => ({
        value: leader.email,
        label: leader.email
    }));

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Crear equipo</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre del equipo *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Líder *</label>
                        <Select
                            options={leaderOptions}
                            onChange={(selectedOption) => setLeader(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar líder"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Alcance *</label>
                        <input
                            type="text"
                            value={scope}
                            onChange={(e) => setScope(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
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
                            Crear Equipo
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTeamModal;