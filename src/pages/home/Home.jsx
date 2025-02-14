
import './home.css'
import image1 from '../../pages/home/Home-images/home.jpg'
import HomeCards from './Cards/HomeCards.jsx'
import Footer from '../../components/layout/footer/Footer.jsx'
import ParallaxComponent from './Start/ParallaxComponent.jsx'
import Navbar2 from '../../components/layout/navbar/Navbar2.jsx'
const Home = () => {
  return (
    <>
    <Navbar2/>
    <ParallaxComponent />
<div className='home-container   flex min-h-screen'>
      <div className='home-container-part1'>

        <div className='home-container-part1-text'>
          <h2 className='text-empowering'>Empoderar a los despachos de abogados.</h2>

          <h1 className='text-innovative'>HCM Soluciones innovadoras</h1>
              <p className='home-text'>
              Advocatus HCM revoluciona la gestión de recursos humanos para firmas de abogados en Bogotá, CO. 
              Nuestro sistema de Gestión del Capital Humano basado en microservicios agiliza las operaciones clave, incluida la gestión de personal, 
              el seguimiento de casos y las evaluaciones de desempeño. Al automatizar estos procesos cruciales, mejoramos la eficiencia y apoyamos el crecimiento de su empresa.
               Nuestra arquitectura escalable y flexible se adapta a sus necesidades futuras, garantizando que se mantenga a la vanguardia en un panorama legal competitivo.
              </p>
         </div>
      </div>
      <br />
  <div   className='home-container-part1'>
    <img className='image1' src={image1} alt="" />
  </div>


</div>

<br />

<HomeCards />


<br />
<br />

  <div className='contact-home'>
 


    <div>
         
<h2 className='text-empowering'>Ponte en contacto</h2>

<h2 className='text-innovative' >
Busque soluciones personalizadas.</h2>
<br />

      <form action="submit">

      <label className='label-home'>Nombre</label>
      <br />
      <input className='input-home' type="text" placeholder='Advo Catus'/>

      <br />

      <label  className='label-home'>Correo</label>
      <br />
      <input className='input-home'  type="text"  placeholder='correo@dominio.com' />
      
      <br />

      <label className='label-home'>Número de teléfono</label>
      <br />
      <input className='input-home'  type="text"  placeholder='3124567890'/>

      <br />
      
      <label className='label-home'>Mensaje</label>
      <br />
      <input className='input-home' type="area" />

      <br />


      <div className='container-check-home'>
        <div>
            <input type="checkbox" />
        </div>

        <div>
            <p className='text-terms'>
            Permito que este sitio web almacene mi <br />envío para que puedan responder a mi consulta</p>
       </div>
      </div>


      </form>



      <button className='Enviar'>Enviar</button>
    
    </div>


    <div className='contact-home-info'>
    <p className='Subtittle-c'>Contacto</p>

    <div className='container-contact'>
        <div>
          <span>📧</span>
        </div>
    <div>
        <p className='underlined'>advocatus@gmail.com</p>
    </div>
    </div>

  
  
  <p className='Subtittle'>Ubicación</p>
     
       
<div className='container-location'>
        <div>
            <p >📍 </p>
        </div>
            
        <div className='underlined'>
           Bogotá, DC CO
        </div>

</div>
  
<br />
<h2 className="Subtittle">Horarios</h2>


<div className="container-schedules">
  <div>
    <p className="day">Lunes</p>
  </div>
  <div>
    <p className="hour">9:00am - 10:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Martes</p>
  </div>
  <div>
    <p className="hour">9:00am - 10:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Miércoles</p>
  </div>
  <div>
    <p className="hour">9:00am - 10:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Jueves</p>
  </div>
  <div>
    <p className="hour">9:00am - 10:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Viernes</p>
  </div>
  <div>
    <p className="hour">9:00am - 10:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Sábado</p>
  </div>
  <div>
    <p className="hour">12:00pm - 5:00pm</p>
  </div>
</div>

<div className="container-schedules">
  <div>
    <p className="day">Domingo</p>
  </div>
  <div>
    <p className="hour">12:00pm - 5:00pm</p>
  </div>
</div>


         

    </div>
    </div>


<br />
<br />
<br />
<br />
<br />
<br />















    <Footer />

    </>



 
  )
}

export default Home
