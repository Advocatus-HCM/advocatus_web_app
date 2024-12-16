import React from 'react';
import Navbar from '../../components/layout/Navbar/Navbar.jsx';
import Footer from '../../components/layout/footer/Footer.jsx';
import './Login.css';

const Login = () => {
  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="main-content">
        <div class="container" id="container">
          <div class="form-container sign-in-container">
            <form action="#">
              <h1>Iniciar Sesión</h1>
              <input type="email" placeholder="Correo Electrónico" />
              <input type="password" placeholder="Contraseña" />
              <a href="#"><u>¿Has Olvidado tu Contraseña?</u></a>
              <button>Iniciar Sesión</button>
              <p>¿No tienes una cuenta? <a href='/home' className='refRegister'><u>Regístrate</u></a></p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;