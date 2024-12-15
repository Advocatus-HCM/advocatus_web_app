import React from 'react'
import './home.css'

import Navbar from '../../components/layout/navbar/Navbar.jsx'
import Footer from '../../components/layout/footer/Footer.jsx'

const Home = () => {
  return (
    <>
    <Navbar />

    

<div className='home-container'>




      <div className='home-container-part1'>
          <h2> Empowering law firms</h2>
              <p className='home-text'>
              Innovative HCM solutions
              Advocatus HCM revolutionizes human resource management for law firms in Bogotá, CO. 
              Our microservices-based Human Capital Management system streamlines key operations, including personnel management, case tracking, and performance evaluations. 
              By automating these crucial processes, we enhance efficiency and support your firm's growth. Our scalable and flexible architecture adapts to your future needs, 
              ensuring
              </p>
      </div>

      <br />

  <div   className='home-container-part1'>


    <img src="../../pages/home/Home-images/home.jpg" alt="" />

  </div>


</div>











  <h3>GET IN TOUCH</h3>



  <div className='contact-home'>


 


    <div>
      <form action="submit">

      <label className='label-home'>Nombre</label>
      <br />
      <input className='input-home' type="text" placeholder='Breiner lopez'/>

      <br />

      <label  className='label-home'>Correo</label>
      <br />
      <input className='input-home'  type="text"  placeholder='Pepitomonda@gmail.com' />
      
      <br />

      <label className='label-home'>Número de telefono</label>
      <br />
      <input className='input-home'  type="text"  placeholder='3196736325'/>

      <br />
      
      <label className='label-home'>Mensaje</label>
      <br />
      <input className='input-home' type="area" />

      <br />

      <input type="checkbox" />
      <p>Entiendo los terminos y condiciones</p>


      </form>

      <button className='Enviar'>Enviar</button>
    
    </div>






    <div className='contact-home-info'>
          <p>
          advocatus@mail.com
          </p>
          <p>
          Ubicación
          Bogotá, DC CO
          </p>
              
          <p>
              <h2 className='schedules'>Horarios</h2>
              <br />

              
              <div>
                 <p>Lunes</p> 
                 <p> 9:00am	-	10:00pm</p>
              </div>
              
              
              <br />
              
              <div>
                  <p>Martes</p> 
                  <p> 9:00am	-	10:00pm</p>
              </div>
              
           
              <br /> 

              <div>
                  <p>Miércoles</p> 
                  <p> 9:00am	-	10:00pm</p>
              </div>
              <br />
              <div>
                  <p>Jueves</p> 
                  <p> 9:00am	-	10:00pm</p>
              </div>
              <br />
             <div>
                  <p>Viernes</p> 
                  <p> 9:00am	-	10:00pm</p>
             </div>
              <br />
              <div>
                  <p>Sábado</p> 
                  <p> 9:00am	-	10:00pm</p>
              </div>
              <br />
              <div>
                  <p>Domingo</p> 
                  <p> 9:00am	-	10:00pm</p>
              </div>

          </p>

    </div>




    </div>

















    <Footer />

    </>



 
  )
}

export default Home