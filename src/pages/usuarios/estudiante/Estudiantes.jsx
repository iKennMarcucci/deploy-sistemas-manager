import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil } from 'lucide-react'
import Tabla from '../../../components/Tabla'
import Boton from '../../../components/Boton'

const Estudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([])
  const [informacion, setInformacion] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const Navigate = useNavigate()

  useEffect(() => {
    fetch(`${backendUrl}/estudiantes`)
      .then((response) => response.json())
      .then((data) => {
        setEstudiantes(data)
      })
  }, [])

  useEffect(() => {
    if (estudiantes.length > 0) {
      const estudiantesConDatos = estudiantes.map((estudiante) => {
        const nombreUnido = [
          estudiante.nombre,
          estudiante.nombre2,
          estudiante.apellido,
          estudiante.apellido2
        ]
          .filter(Boolean)
          .join(' ')

        return {
          ...estudiante,
          Código: estudiante.codigo,
          Nombre: nombreUnido,
          'Programa académico': estudiante.programaNombre,
          Estado: estudiante.estadoEstudianteNombre
        }
      })

      setInformacion(estudiantesConDatos)
    }
  }, [estudiantes])

  const verEstudiante = (estudiante) => {
    Navigate('ver-estudiante/' + estudiante.id)
  }

  const editarEstudiante = (estudiante) => {
    Navigate('editar-estudiante/' + estudiante.id)
  }

  const columnas = ['Código', 'Nombre', 'Programa académico', 'Estado']
  const filtros = ['Código', 'Nombre', 'Programa académico', 'Estado']
  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: (estudiante) => verEstudiante(estudiante)
    },
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (estudiante) => editarEstudiante(estudiante)
    }
  ]

  const handleRegistrar = () => {
    Navigate('crear-estudiante')
  }

  return (
    <div className='p-4 w-full flex flex-col items-center justify-center'>
      <p className='text-center text-titulos'>Lista de estudiantes</p>
      <div className='w-full my-8'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          filtros={filtros}
          acciones={acciones}
        />
      </div>

      <div className='w-full flex justify-end mt-4'>
        <Boton onClick={handleRegistrar}>Crear estudiante</Boton>
      </div>
    </div>
  )
}
export default Estudiantes
