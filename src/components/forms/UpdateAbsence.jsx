import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const myToken = Cookies.get("token");

const UpdateAbsence = ({ closeModal, attendanceData, isEditing = false, absenceToEdit = null }) => {
  const [abogadoId, setAbogadoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [tipo, setTipo] = useState("");
  const [motivo, setMotivo] = useState("");
  const [documentoRespaldo, setDocumentoRespaldo] = useState("");




  useEffect(() => {
    if (isEditing && absenceToEdit) {
      // If editing, populate form with existing data
      setAbogadoId(absenceToEdit.abogado_id);
      setFecha(new Date(absenceToEdit.fecha).toISOString().split('T')[0]);
      setTipo(absenceToEdit.tipo);
      setMotivo(absenceToEdit.motivo);
      setDocumentoRespaldo(absenceToEdit.documento_respaldo || "");
    } else if (attendanceData && attendanceData.email) {
      // If creating new, just set the lawyer's email
      setAbogadoId(attendanceData.email);
    }
  }, [attendanceData, isEditing, absenceToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!abogadoId) {
      Swal.fire({
        title: "Error",
        text: "Por favor seleccione un abogado",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const absenceData = {
      abogado_id: abogadoId,
      fecha,
      tipo,
      motivo,
      documento_respaldo: documentoRespaldo,
    };

    try {
      let response;
      
      if (isEditing) {
     
        response = await axios.put(
          `${import.meta.env.VITE_AT_URL}/update-absence/${abogadoId}`,
          absenceData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        Swal.fire({
          title: "Éxito",
          text: "Ausencia actualizada exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {

        response = await axios.post(
          `${import.meta.env.VITE_AT_URL}/report-absences`,
          absenceData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        Swal.fire({
          title: "Éxito",
          text: "Ausencia registrada exitosamente",
          icon: "success",
          confirmButtonText: "OK",
        });
      }

      if (response.data) {
        closeModal();
      }
    } catch (error) {
      console.error("Error al procesar la ausencia:", error);
      Swal.fire({
        title: "Error",
        text: isEditing 
          ? "Hubo un problema al actualizar la ausencia"
          : "Hubo un problema al registrar la ausencia",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-lg w-full h-auto overflow-hidden relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <MdClose className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4 border-b border-gray-300 pb-2">
          {isEditing ? "Editar Ausencia" : "Registrar Ausencia"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Abogado *
            </label>
            <input
              disabled
              value={abogadoId}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha *
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Ausencia *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Seleccione un tipo</option>
              <option value="justificada">Justificada</option>
              <option value="injustificada">Injustificada</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Documento de Respaldo
            </label>
            <input
              type="text"
              value={documentoRespaldo}
              onChange={(e) => setDocumentoRespaldo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
              {isEditing ? "Actualizar" : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAbsence;