import React from "react";
import "./HomeCards.css"; 
import card1 from "./Assets/card1.jpg";
import card2 from "./Assets/card2.jpg";



const HomeCards = () => {
  const cards = [
    {
      title: "Manejo de Personal",
      description: "Agilice sus procesos de recursos humanos con nuestra solución de vanguardia.",
      image: card1,
    },
    {
      title: "Seguimiento de casos",
      description: "Mantenga sus casos legales organizados y accesibles en todo momento.",
      image: card2, 
    },
    {
      title: "Evaluaciones de desempeño",
      description: "Mejorar el desempeño de los empleados a través de evaluaciones estructuradas.",
      image: card1, 
    },
  ];

  return (


  

    <div className="home-cards-container">
  
  <br />
  <br />
  <br />

  
      <h2 className="text-innovative">Optimice las operaciones con soluciones HCM personalizadas.</h2>
      <br />
      <div className="cards-grid">
        {cards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.image} alt={card.title} className="card-image" />
            <div className="card-content">
              <h3 className="card-title">{card.title} &gt;</h3>
              <p className="card-description">{card.description}</p>
            </div>
          </div>
        ))}
      </div>

      <br />
      <br />
      <br />
      
    </div>
  );
};

export default HomeCards;
