import { useEffect, useState } from 'react'
import Boton from '../../../components/Boton'
import { useNavigate } from 'react-router-dom'
import Tabla from '../../../components/Tabla'
import { Eye, Pencil } from 'lucide-react'

const Profesores = () => {
  const [profesores, setProfesores] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoProfesores, setCargandoProfesores] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const Navigate = useNavigate()

  useEffect(() => {
    setCargandoProfesores(true)
    fetch(`${backendUrl}/usuarios/rol/2`)
      .then((response) => response.json())
      .then((data) => {
        setProfesores(data)
      })
  }, [])

  useEffect(() => {
    if (profesores.length > 0) {
      const profesoresConDatos = profesores.map((profesor) => {
        const nombreUnido = [
          profesor.primerNombre,
          profesor.segundoNombre,
          profesor.primerApellido,
          profesor.segundoApellido
        ]
          .filter(Boolean)
          .join(' ')

        return {
          ...profesor,
          Código: profesor.codigo,
          Nombre: nombreUnido,
          'Correo electrónico': profesor.email
        }
      })

      setInformacion(profesoresConDatos)
    }
    setCargandoProfesores(false)
  }, [profesores])

  const verProfesor = (profesor) => {
    Navigate('ver-profesor/' + profesor.id)
  }

  const editarProfesor = (profesor) => {
    Navigate('editar-profesor/' + profesor.id)
  }

  const columnas = ['Código', 'Nombre', 'Correo electrónico']
  const filtros = ['Código', 'Nombre']
  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: (profesor) => verProfesor(profesor)
    },
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (profesor) => editarProfesor(profesor)
    }
  ]

  const handleRegistrar = () => {
    Navigate('crear-profesor')
  }

  return (
    <div className='p-4 w-full flex flex-col items-center justify-center'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>Lista de profesores</p>
        <Boton onClick={handleRegistrar}>Crear profesor</Boton>
      </div>
      <div className='w-full my-8'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          filtros={filtros}
          acciones={acciones}
          cargandoContenido={cargandoProfesores}
        />
      </div>
    </div>
  )
}
export default Profesores
