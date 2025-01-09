import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';

const CreateAssistantModal = ({ closeModal, refreshAssistants }) => {
    const [assistant, setAssistant] = useState("");
    const [user, setUser] = useState("");
    const [assistants, setAssistants] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8001/get-users')
            .then(response => {
                const allUsers = response.data;
                setAssistants(allUsers.filter(user => user.role === 'asistente'));
                setUsers(allUsers.filter(user => user.role !== 'asistente'));
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            assistant_email: assistant,
            user_email: user
        };

        axios.post('http://localhost:8001/add-assistant', payload)
            .then(response => {
                Swal.fire({
                    title: 'Asistente asignado',
                    text: 'El asistente ha sido creado exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                refreshAssistants();
                closeModal();
            })
            .catch(error => {
                console.error('Error creating assistant:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al asignar el asistente',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const assistantOptions = assistants.map(assistant => ({
        value: assistant.email,
        label: assistant.email
    }));

    const userOptions = users.map(user => ({
        value: user.email,
        label: user.email
    }));

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Asignar Asistente</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Seleccionar Asistente</label>
                        <Select
                            options={assistantOptions}
                            onChange={(selectedOption) => setAssistant(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar asistente"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asignar a Usuario</label>
                        <Select
                            options={userOptions}
                            onChange={(selectedOption) => setUser(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar usuario"
                            isClearable
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
                            disabled={!assistant || !user}
                        >
                            Asignar Asistente
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssistantModal;
