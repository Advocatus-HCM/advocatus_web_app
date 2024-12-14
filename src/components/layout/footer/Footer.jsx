import React from 'react';
import './Footer.css'; // Asegúrate de crear este archivo para los estilos

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-logo">Advocatus HCM</p>
        <p className="footer-text">© {new Date().getFullYear()} MiApp. Todos los derechos reservados.</p>
      </div>
      <div className="footer-links">
        <a href="/privacy" className="footer-link">Política de Privacidad</a>
        <a href="/terms" className="footer-link">Términos y Condiciones</a>
        <a href="/contact" className="footer-link">Contacto</a>
      </div>
    </footer>
  );
};

export default Footer;
