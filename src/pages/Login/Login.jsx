import React, {useState} from 'react';
import Navbar from '../../components/layout/Navbar/Navbar.jsx';
import Footer from '../../components/layout/footer/Footer.jsx';
import './Login.css';

const Login = () => {
  const [showError, setShowError] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    // Lógica de autenticación aquí

    const loginData = {
      email: email,
      password: password
    };

    try {
      console.log('Datos de login:', loginData);
      
      const response = await fetch('URL_DEL_BACKEND', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {//Caso exitoso
        const data = await response.json();
        //console.log('Login exitoso:', data);
        // Acción a realizar al iniciar sesión

      } else {
        // Si la autenticación falla por problemas de correo/constraseña mostrar mensaje de error
        setShowError(true);
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setShowError(true);
    }
    // Si no se puede ejecutar la petición mostrar mensaje de error
    setShowError(true);
  };

  

  return (
    <>
      <div className="navbar-container">
        <Navbar />
      </div>
      <div className="main-content">
        <div class="container" id="container">
          <div class="form-container sign-in-container">
            <form onSubmit={handleLogin}>
              <h1>Iniciar Sesión</h1>
              {showError && <p className='Error'>Correo Electrónico y/o Contraseña Incorrectos</p>}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Correo Electrónico"
              />
              <input
                type="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña" 
              />
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