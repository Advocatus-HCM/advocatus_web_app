import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";

const Dashboard = () => {
    const services = [
        {
            title: "Gestión de Personal",
            description: "Gestiona empleados y roles dentro de la firma.",
            route: "/employees",
            icon: "👔",
        },
        {
            title: "Seguimiento de Casos",
            description: "Realiza el seguimiento y asigna casos a empleados.",
            route: "/cases",
            icon: "📂",
        },
        {
            title: "Control de Asistencias",
            description: "Monitorea asistencia, ausencias y tiempo libre.",
            route: "/attendance",
            icon: "⏰",
        },
        {
            title: "Evaluaciones de Desempeño",
            description: "Evalúa el rendimiento de los empleados y sugiere mejoras.",
            route: "/performance",
            icon: "📊",
        },
        {
            title: "Gestión de Documentación",
            description: "Almacena y organiza documentos legales y administrativos.",
            route: "/documents",
            icon: "📄",
        },
    ];

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* Main Content */}
            <div className="lg:ml-64 w-full p-6 bg-gray min-h-screen">
                
                {/* Bienvenido Usuario */}
                <div className="mb-6 text-center lg:text-left">
                    <h1 className="text-2xl font-bold text-gray-800">Bienvenido, Usuario</h1>
                </div>

                {/* Panel Principal Title */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Panel Principal</h1>
                </div>

                {/* Dashboard Content */}
                <main>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service, index) => (
                        <Card
                            key={index}
                            title={service.title}
                            description={service.description}
                            route={service.route}
                            icon={service.icon}
                        />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

