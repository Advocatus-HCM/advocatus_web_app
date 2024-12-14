import React from "react";
import { useNavigate } from "react-router-dom";

const Card = ({ title, description, route, icon }) => {
    const navigate = useNavigate();
    
    return (
        <div
            onClick={() => navigate(route)}
            className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg cursor-pointer transition transform hover:-translate-y-2"
            style={{
                background: "linear-gradient(180deg, rgba(255, 255, 255, 0.8), #E0F7FF)" // Gradiente de blanco opaco a azul muy claro
            }}
        >
            <div className="text-4xl">{icon}</div>
            <h2 className="text-lg font-semibold mt-4 text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2">{description}</p>
        </div>
    );
};

export default Card;
