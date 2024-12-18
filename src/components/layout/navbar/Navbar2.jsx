import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar2 = () => {
  const [isOpen, setIsOpen] = useState(false); // Controla el menú hamburguesa

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="z-450   bg-gray-800 text-white navbar">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">ADVOCATUS HCM</Link>

        {/* Botón Hamburguesa */}
        <button
          className="block lg:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>

        {/* Links de navegación */}
        <ul
          className={`lg:flex lg:items-center lg:space-x-6 absolute lg:relative bg-gray-800 lg:bg-transparent w-full lg:w-auto left-0 top-16 lg:top-0 transition-all duration-300 ease-in-out ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <li>
            <Link
              to="/"
              className="block px-4 py-2 text-lg hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block px-4 py-2 text-lg hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/services"
              className="block px-4 py-2 text-lg hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="block px-4 py-2  text-lg hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="block px-4 py-2 text-lg bg-lime-700 rounded-md text-center  transition"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar2;
