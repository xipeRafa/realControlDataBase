import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';




 import { firestoreDB, storageDocs } from './firebase/firebaseConfig';

 import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  where,
  query,
} from 'firebase/firestore';



 const msecToDateNumbers =(milliseconds)=>{ // '16/8/2024, 12:00:00 a.m.'
      return new Date(milliseconds).toLocaleString()
  }







function App() {


  const [items, setItems] = useState([]);

  const itemCollection = query(
      collection(firestoreDB, 'tasksRealControl'),
      where('asignadoPara', '==', localStorage.getItem('user'))
  )

  const [toggle, setToggle] = useState(true)

  useEffect(() => {

      getDocs(itemCollection).then((resp) => {

          if (resp.size === 0) {
              console.log('No results!');
          }

          const documents = resp.docs.map((doc) => (
              { id: doc.id, ...doc.data() }
          ))

          setItems(documents);

      }).catch((err) => {
          console.log('Error searching items', err)
      })

  }, [toggle])



  const updateById = async (id, obj) => {

    if (confirm("Marcar como Servicio Completado")) {
      obj.completed = true
      obj.completedTime = Date.now()
      delete obj.id

      const aDoc = doc(firestoreDB, 'tasksRealControl', id)

      try {
          await updateDoc(aDoc, obj);
      } catch (error) {
          console.error(error);
      }

      setToggle(!toggle)
    }

  }




  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const [usuarioState, setUsuarioState]=useState()
  const [usuarioClaveState, setClaveState]=useState()

  let admin = 'admin'
  let uno = 'koko'
  let dos = 'lima'
  let tres = 'lona'


  const saveToLocalStorage = () => {

    if(localStorage.user === undefined){

      if(usuarioState === 'admin'){
          if(usuarioClaveState === 'admin'){
              localStorage.setItem('user', usuarioState)
              handleClose()
              setTimeout(()=>{ location.reload() },600)
          }else{
              alert('Clave Incorrecta')
          }
      }

      if(usuarioState === 'usuario1'){
          if(usuarioClaveState === 'koko'){
              localStorage.setItem('user', usuarioState)
              handleClose()
              setTimeout(()=>{ location.reload() },1600)
          }else{
              alert('Clave Incorrecta')
          }
      }

      if(usuarioState === 'usuario2'){
          if(usuarioClaveState === 'lima'){
              localStorage.setItem('user', usuarioState)
              handleClose()
              setTimeout(()=>{ location.reload() },1600)
          }else{
              alert('Clave Incorrecta')
          }
      }
      
      if(usuarioState === 'usuario3'){
          if(usuarioClaveState === 'lona'){
              localStorage.setItem('user', usuarioState)
              handleClose()
              setTimeout(()=>{ location.reload() },1600)
          }else{
              alert('Clave Incorrecta')
          }
      }

    }else{
        localStorage.removeItem('user')
        setTimeout(()=>{ location.reload() },1600)
    }

  }




  const[taskState, setTaskState]=useState({
    asignadoPara:"",
    comentarios:"",
    consumibles:"",
    direccionCliente:"",
    fechaMeta:"",
    nombreCliente:"",
    servicioDescripcion:"",
    tipoDeServicio:""
  })



  const {
    asignadoPara,
    comentarios,
    consumibles,
    direccionCliente,
    fechaMeta,
    nombreCliente,
    servicioDescripcion,
    tipoDeServicio
  } = taskState


  const handlerTaskState=({target})=>{
      const {name, value} = target
      setTaskState({...taskState, [name]:value})
  }



  const postCollection = collection(firestoreDB, 'tasksRealControl');

  const guardar =()=>{

      if (asignadoPara.trim() === '' ||
          comentarios.trim() === '' ||
          consumibles.trim() === '' ||
          direccionCliente.trim() === '' ||
          fechaMeta.trim() === '' ||
          nombreCliente.trim() === '' ||
          servicioDescripcion.trim() === '' ||
          tipoDeServicio.trim() === '' ){
              alert('Algun Campo esta Vacio')
              return
          }

      if (confirm("Crear Servicio")) {
          taskState.createdAt = Date.now()
          taskState.completed = false
          addDoc(postCollection, taskState)
          setTaskState({
              asignadoPara:"",
              comentarios:"",
              consumibles:"",
              direccionCliente:"",
              fechaMeta:"",
              nombreCliente:"",
              servicioDescripcion:"",
              tipoDeServicio:""
          })
      }

    }


  return (
    <>
      <Button variant="primary" onClick={handleShow}>
          {localStorage.user} {localStorage.user ? '➪' : 'Entrar'} 
      </Button>



      <Modal show={show} onHide={handleClose}>

          <Modal.Header closeButton>
              <Modal.Title> {localStorage.user ? localStorage.user : 'Entrar'}</Modal.Title>
          </Modal.Header>

            {!localStorage.user ? 
          <Modal.Body>

              <Form.Label>Usuarios:</Form.Label>
              <Form.Select
                  value={usuarioState}
                  name="usuario"
                  onChange={(e)=>setUsuarioState(e.target.value)}>

                  <option></option>
                  <option value="admin">Admin</option>
                  <option value="usuario1">Usuario 1</option>
                  <option value="usuario2">Usuario 2</option>
                  <option value="usuario3">Usuario 3</option>
              </Form.Select>

              <Form.Label>Clave:</Form.Label>
              <Form.Control type="password" onChange={(e)=>setClaveState(e.target.value)} />
            
          </Modal.Body>

          : ''}

          <Modal.Footer>
              <Button variant="primary" onClick={saveToLocalStorage}>{localStorage.user ? 'Salir ➪' : 'Entrar'}</Button>
          </Modal.Footer>

      </Modal>

    {localStorage.user === 'admin' ? 
      <Container>
        <Row>
          <Col>




        <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Nombre de Cliente</Form.Label>
        <Form.Control type="text" name='nombreCliente' value={nombreCliente} onChange={(e)=>handlerTaskState(e)} />

        <Form.Label>Direccion de Cliente</Form.Label>
        <Form.Control type="text" name='direccionCliente' value={direccionCliente} onChange={(e)=>handlerTaskState(e)}/>

        <Form.Label>Descripción del Servicio</Form.Label>
        <Form.Control type="text" name='servicioDescripcion' value={servicioDescripcion} onChange={(e)=>handlerTaskState(e)}/>

        <Form.Label>Fecha y Hora</Form.Label>
        <Form.Control type="text" name='fechaMeta' value={fechaMeta} onChange={(e)=>handlerTaskState(e)}/>

        <Form.Label>Tipo de Servicio</Form.Label>
        <Form.Select
              value={tipoDeServicio}
              name='tipoDeServicio' 
              onChange={(e)=>handlerTaskState(e)}>

              <option></option>
              <option value="domestica chica">Domestica Chica</option>
              <option value="comercial chica">Comercial Chica</option>
              <option value="industrial chica">Industrial Chica</option>

              <hr />
              <option value="domestica mediana">Domestica Mediana</option>
              <option value="comercial mediana">Comercial Mediana</option>
              <option value="industrial mediana">Industrial Mediana</option>

              <hr />
              <option value="domestica grande">Domestica Grande</option>
              <option value="comercial grande">Comercial Grande</option>
              <option value="industrial grande">Industrial Grande</option>
        </Form.Select>

        <Form.Label>Consumibles a Utilizar</Form.Label>
        <Form.Control as="textarea" name='consumibles' value={consumibles} onChange={(e)=>handlerTaskState(e)} />




        <Form.Label>Asignar a:</Form.Label>
        <Form.Select
              value={asignadoPara}
              name='asignadoPara' 
              onChange={(e)=>handlerTaskState(e)}>

              <option></option>
              <option value="usuario1">Usuario 1</option>
              <option value="usuario2">Usuario 2</option>
              <option value="usuario3">Usuario 3</option>
        </Form.Select>

      








      </Form.Group>



        <Form.Label>Comentarios</Form.Label>
        <Form.Control as="textarea"  name='comentarios' value={comentarios} onChange={(e)=>handlerTaskState(e)} />


    </Form>

      <Button variant="primary" onClick={guardar}>
          GUARDAR
      </Button>



    </Col>
        </Row>
      </Container>

          : 



      <Container>
        <Row>
          <Col>
              {items?.slice(0,12).sort((a, b) => b.createdAt - a.createdAt).map((el, i)=>(
                  <div key={i}>

                    <hr />

                    <p>Cliente: {el.nombreCliente}</p>
                    <p>Direccion: {el.direccionCliente}</p>
                    <p>Servicio: {el.servicioDescripcion}</p>
                    <p>Hora: {el.fechaMeta}</p>
                    <p>Tipo: {el.tipoDeServicio}</p>
                    <p>Consumibles: {el.consumibles}</p>
                    <p>Comentarios: {el.comentarios}</p>
                    <p>Tarea Creada el: {msecToDateNumbers(el.createdAt)}</p>

                    <Button disabled={el.completed} variant="primary" className={el.completed ? '' : 'red'} onClick={()=>updateById(el.id, el)}>
                        {el.completed ? 'Completado' : 'Pendiente'}
                    </Button>

                    <p className={!el?.completedTime ? 'd-none' : 'warning'}>Completado el: {msecToDateNumbers(el?.completedTime)}</p>

                    <hr />
                  </div>
                ))}
          </Col>
        </Row>
      </Container>


        }


    </>
  )
}

export default App
