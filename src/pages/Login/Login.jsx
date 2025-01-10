import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../../components/layout/navbar/Navbar2';
import Footer from '../../components/layout/footer/Footer';

import './Login.css';

const Login = () => {
  const [showError, setShowError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar la animación de carga
  const navigate = useNavigate(); // Crear una instancia de useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    // Auth Logic
    console.clear();

    setShowError(false);
    setIsLoading(true); // Loading Animation On

    //Add the data to the form
    const loginData = new URLSearchParams();
    loginData.append('username', email);
    loginData.append('password', password);

    console.log('Datos de login:', loginData.toString());

    try {
      //Execute the request
      const response = await fetch('http://localhost:8000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: loginData.toString()
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Login exitoso');

        //Set Cookies
        document.cookie = `token=${data.access_token}; path=/;`;
        //document.cookie = `token_type=${data.token_type}; path=/;`;
        document.cookie = `email=${email}; path=/;`;
        document.cookie = `role=${data.role}; path=/;`;
        //Success Login and redirect to dashboard
        navigate('/dashboard');

      } else {
        // Email and/or password are incorrect
        console.error('Nombre de Usuario y/o Contraseña Incorrectos');
        setShowError(true);
      }
    } catch (error) {
      // Error in the request
      console.error('Error en la petición:', error);
      setShowError(true);
    } finally {
      setIsLoading(false); // Loading Animation Off
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="main-contentLogin">
        <div className="containerLogin" id="container">
          <div className="form-container sign-in-container">
            <form onSubmit={handleLogin} className='FormLogin'>
              <h1 className='TitleLogin'>Iniciar Sesión</h1>
              {showError && <p className='Error'>Correo Electrónico y/o Contraseña Incorrectos</p>}
              <input
                type="email"
                className='inputLogin'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo Electrónico"
              />
              <input
                type="password"
                className='inputLogin'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
              />
              <a href="#" className='aLogin'><u>¿Has Olvidado tu Contraseña?</u></a>
              {isLoading ? (
                //Loading Animation
                <div className="loading"></div>
              ) : (
                <button type="submit" className='ButtonLogin'>Iniciar Sesión</button>
              )}
              {/* <p className="pLogin">¿No tienes una cuenta? <a href='/home' className='refRegister'><u>Regístrate</u></a></p> */}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;