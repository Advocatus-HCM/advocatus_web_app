import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import Cookies from "js-cookie";

const myToken = Cookies.get("token");

const ShowReport = ({ closeModal, attendanceData }) => {
  const [abogadoId, setAbogadoId] = useState("");
  const [fecha, setFecha] = useState("");
  const [fecha2, setFecha2] = useState("");
  const [totalInasistencias, setTotalInasistencias] = useState("");
  const [totalTardanzas, setTotalTardanzas] = useState("");

  useEffect(() => {
  
    if (attendanceData && attendanceData.email) {
      setAbogadoId(attendanceData.email);
    }
  }, [attendanceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();





      


    try {

        const token = Cookies.get('token');
        const email = Cookies.get('email');

     
      const response = await axios.post(
        `${import.meta.env.VITE_AG_URL}`,
        {
            query: 
              `mutation GetReport($data: JSON!, $userAuth: UserAuth!) {
            getReport(data: $data, userAuth: $userAuth)
        
                }
            `,
            variables: {
                data: {
                    abogado_id: abogadoId,
                    fecha_inicio: fecha,
                    fecha_fin: fecha2,
                },
                userAuth: {
                    email: email,
                    token: token,
                }
            }
        },
        {
            headers: {
                Authorization: `Bearer ${myToken}`,
                'Content-Type': 'application/json'
            }
        }
    );

      const { total_asistencias, total_inasistencias } = response.data.data.getReport.response;

      setTotalInasistencias(total_inasistencias);
      setTotalTardanzas(total_asistencias);

      Swal.fire({
        title: "Éxito",
        text: "Reporte obtenido correctamente",
        icon: "success",
        confirmButtonText: "OK",
      });

      console.log("Respuesta del servidor:", response.data);
    } catch (error) {
      console.error("Error al obtener el reporte:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al obtener el reporte",
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
          Reporte General
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700">Abogado Email</label>
            <input
              disabled
              value={abogadoId}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rango de fechas</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
            <input
              type="date"
              value={fecha2}
              onChange={(e) => setFecha2(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total inasistencias</label>
            <input
              disabled
              type="text"
              value={totalInasistencias}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Total Tardanzas</label>
            <input
              disabled
              type="text"
              value={totalTardanzas}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Obtener Reporte
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShowReport;
