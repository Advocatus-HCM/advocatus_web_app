import React, { useEffect, useState } from 'react';
import './ParallaxComponent.css';
import image from './assets/desk.jpg'; 

const ParallaxComponent = () => {
  const [offset, setOffset] = useState(0);

  const handleScroll = () => {
    setOffset(window.pageYOffset);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="parallax-container">
      <div
        className="parallax-image"
        style={{ transform: `translateY(${offset * 0.3}px)` }} // Ajusta el factor para más o menos movimiento
      >
        <img src={image} alt="Parallax" />
      </div>
      <div className="content">
        <h1 className='title-content'>Potencializa tu firma</h1>
        <p>Transforma tus operaciones con nosotros</p>
        <button className="btn">Servicios</button>
      </div>
    </div>
  );
};

export default ParallaxComponent;
