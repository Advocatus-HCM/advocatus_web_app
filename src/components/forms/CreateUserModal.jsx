import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';

const CreateUserModal = ({ closeModal, addUser }) => {
    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profession, setProfession] = useState("");
    const [superior, setSuperior] = useState("");
    const [team, setTeam] = useState("");
    const [superiors, setSuperiors] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-users`)
            .then(response => {
                const managers = response.data.filter(user => user.role === 'gerente');
                setSuperiors(managers);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/get-teams`)
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const user = {
            name,
            last_name: lastName,
            email,
            phone_number: phoneNumber,
            profession,
        };

        if (superior !== "") {
            user.superior = superior;
        }

        if (team !== "") {
            user.team = team;
        }

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/create-user`, user)
            .then(response => {
                Swal.fire({
                    title: 'Usuario creado',
                    text: 'El usuario ha sido creado exitosamente',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                addUser(response.data);
                closeModal();
            })
            .catch(error => {
                console.error('Error creating user:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al crear el usuario',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    };

    const superiorOptions = superiors.map(superior => ({
        value: superior.email,
        label: superior.email
    }));

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <MdClose className="h-6 w-6" />
                </button>
                <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">Crear Usuario</h2>
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
                        <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profesión *</label>
                        <input
                            type="text"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Superior</label>
                        <Select
                            options={superiorOptions}
                            onChange={(selectedOption) => setSuperior(selectedOption ? selectedOption.value : "")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="Seleccionar superior"
                            isClearable
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Equipo</label>
                        <select
                            value={team}
                            onChange={(e) => setTeam(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        >
                            <option value="">Seleccionar equipo</option>
                            {teams.map((team) => (
                                <option key={team.name} value={team.name}>
                                    {team.name}
                                </option>
                            ))}
                        </select>
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

export default CreateUserModal;