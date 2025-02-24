import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import Cookies from "js-cookie";

const myToken = Cookies.get("token");

const InsertAttendanceModal = ({ closeModal,attendanceData }) => {
  const [abogadoId, setAbogadoId] = useState(null);
  const [fecha, setFecha] = useState("");
  const [entrada, setEntrada] = useState("");
  const [salida, setSalida] = useState("");
  const [tardanza, setTardanza] = useState(false);
  const [tipo, setTipo] = useState("presencial");
  const [motivo, setMotivo] = useState("");
  const [abogados, setAbogados] = useState([]);

  useEffect(() => {
     
      if (attendanceData && attendanceData.email) {
        setAbogadoId(attendanceData.email);
      }
    }, [attendanceData]);
    

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fecha || !entrada || !salida) {
      Swal.fire({
        title: "Error",
        text: "Todos los campos son obligatorios",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }
  
    try {
      // Convertimos la fecha y las horas a objetos Date, asegurando que sean válidos
      const fechaISO = new Date(fecha);
      const entradaISO = new Date(`${fecha}T${entrada}:00.000Z`);
      const salidaISO = new Date(`${fecha}T${salida}:00.000Z`);
  
      if (isNaN(entradaISO.getTime()) || isNaN(salidaISO.getTime())) {
        throw new Error("Formato de hora inválido");
      }
  
      const attendanceData = {
        abogado_id: abogadoId,
        fecha: fechaISO.toISOString(),
        entrada: entradaISO.toISOString(),
        salida: salidaISO.toISOString(),
        tardanza,
        tipo,
        motivo,
      };
  
      const response = await axios.post(`${import.meta.env.VITE_AT_URL}/insertattendance`, attendanceData, {
        headers: {
          Authorization: `Bearer ${myToken}`,
          "Content-Type": "application/json",
        },
      });
  
      Swal.fire({
        title: "Éxito",
        text: "Asistencia registrada exitosamente",
        icon: "success",
        confirmButtonText: "OK",
      });
  
      console.log("Respuesta del servidor:", response.data);
      closeModal();
    } catch (error) {
      console.error("Error al registrar la asistencia:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un problema al registrar la asistencia",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <MdClose className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">
          Registrar Asistencia
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
        <div>
            <label className="block text-sm font-medium text-gray-700">
              Abogado *
            </label>
            <input
              disabled
              value={abogadoId}
              onChange={(e) => setAbogadoId(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Entrada *</label>
            <input
              type="time"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Hora de Salida *</label>
            <input
              type="time"
              value={salida}
              onChange={(e) => setSalida(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">¿Hubo tardanza?</label>
            <input
              type="checkbox"
              checked={tardanza}
              onChange={(e) => setTardanza(e.target.checked)}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Motivo</label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsertAttendanceModal;