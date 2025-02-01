import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../../components/layout/navbar/Navbar2';
import Footer from '../../components/layout/footer/Footer';

import './Login.css';

//GraphQL Petition for Login
const queryLogin= `
mutation Signin($email: String!, $password: String!) {
  signin(email: $email, password: $password)
}
`;

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

    const variablespeticion = {
      email: email,
      password: password,
    };
    
    try {
      const response = await fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //Variables and query for the request must have the same name, otherwise the request will fail because is waiting for "query" and "variables"
        body: JSON.stringify({ query: queryLogin, variables: variablespeticion }),
      });

      //console.log('Response status:', response.status);

      const result = await response.json();
      console.log(result);
      //Case when the response is OK and the login is successful
      
      if (result.data.signin.success) {
        const data = await result.data.signin.response;
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