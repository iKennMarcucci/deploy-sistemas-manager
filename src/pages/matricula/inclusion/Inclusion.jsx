import { useEffect, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import Tabla from '../../../components/Tabla'
import { useNavigate } from 'react-router-dom'

const Inclusion = () => {
  const [estudiantes, setEstudiantes] = useState([])
  const [transformedEstudiantes, setTransformedEstudiantes] = useState([])
  const Navigate = useNavigate()

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const obtenerEstudiantes = async () => {
    try {
      const response = await fetch(`${backendUrl}/estudiantes/listar/estado/1`)
      const data = await response.json()
      setEstudiantes(data)
      console.log(data)
    } catch (error) {
      console.error('Error fetching estudiantes:', error)
    }
  }

  useEffect(() => {
    obtenerEstudiantes()
    localStorage.removeItem('estudianteMatricula')
    localStorage.removeItem('materiaMatricular')
  }, [])

  useEffect(() => {
    if (estudiantes.length > 0) {
      const transformedEstudiantes = estudiantes.map((estudiante) => {
        const nombreUnido = [
          estudiante.nombre,
          estudiante.nombre2,
          estudiante.apellido,
          estudiante.apellido2
        ]
          .filter(Boolean)
          .join(' ')

        return {
          Id: estudiante.id,
          Código: estudiante.codigo,
          Cohorte: estudiante.cohorteNombre,
          Estudiante: nombreUnido,
          email: estudiante.email,
          telefono: estudiante.telefono,
          fechaNacimiento: estudiante.fechaNacimiento,
          fechaIngreso: estudiante.fechaIngreso,
          esPosgrado: estudiante.esPosgrado,
          pensumId: estudiante.pensumId,
          pensumNombre: estudiante.pensumNombre,
          programaId: estudiante.programaId,
          programaNombre: estudiante.programaNombre,
          estadoEstudianteId: estudiante.estadoEstudianteId,
          estadoEstudianteNombre: estudiante.estadoEstudianteNombre,
          usuarioId: estudiante.usuarioId
        }
      })

      // Aquí podrías almacenar los datos transformados en el estado si es necesario
      setTransformedEstudiantes(transformedEstudiantes)
    }
  }, [estudiantes])

  const columnas = ['Id', 'Estudiante', 'Código', 'Cohorte']
  const acciones = [
    {
      icono: <ClipboardList className='text-[25px]' />,
      tooltip: 'Matricular materias',
      accion: (estudiante) => matricular(estudiante)
    }
  ]
  const filtros = ['Estudiante', 'Código', 'Cohorte']

  const matricular = (estudiante) => {
    // Ya no necesitamos almacenar en localStorage
    Navigate(`matricular/${estudiante.Id}`)
  }

  return (
    <div className='p-4 flex flex-col w-full items-center'>
      <p className='text-titulos'>Inclusión de materias</p>
      <div className='mt-8 w-full'>
        <Tabla
          informacion={transformedEstudiantes}
          columnas={columnas}
          acciones={acciones}
          filtros={filtros}
        />
      </div>
    </div>
  )
}

export default Inclusion
