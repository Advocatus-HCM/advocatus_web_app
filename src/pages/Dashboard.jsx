import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Card from "../components/ui/Card";

const Dashboard = () => {
    const services = [
        {
            title: "Gestión de Personal",
            description: "Gestiona empleados y roles dentro de la firma.",
            route: "/employee-management",
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
        {
            title: "Configuración",
            description: "Configura los diferentes datos de cuenta y preferencias.",
            route: "/account-settings",
            icon: "⚙️",
        },
    ];

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            {/* Main Content */}
            <div className="lg:ml-64 w-full p-6 bg-gray min-h-screen">
                
                {/* Panel principal */}
                <div className="mb-6 lg:text-left text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Panel principal</h1>
                    <p className="text-gray-600">Funciones disponibles para gestionar</p>
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

