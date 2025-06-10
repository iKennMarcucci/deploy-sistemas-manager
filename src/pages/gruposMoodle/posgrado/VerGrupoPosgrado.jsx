import React from 'react'
import Tabla from '../../../components/Tabla'
import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const VerGrupoPosgrado = () => {
  const { id } = useParams()
  const [grupo, setGrupo] = useState(null)
  const [listaEstudiantes, setListaEstudiantes] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoGrupo, setCargandoGrupo] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (id) {
      setCargandoGrupo(true)
      fetch(`${backendUrl}/estudiantes/grupo-cohorte/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setGrupo({
            Nombre: data.grupoNombre,
            Profesor: data.docenteNombre,
            '# Estudiantes': data.estudiantes.length
          })
        })

      fetch(`${backendUrl}/estudiantes/grupo-cohorte/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setListaEstudiantes(data.estudiantes)
        })
    }
  }, [id])

  useEffect(() => {
    if (listaEstudiantes.length > 0) {
      const estudiantesConMatricula = listaEstudiantes.map((estudiante) => ({
        ...estudiante,
        Código: estudiante.codigo,
        Nombre: [
          estudiante.nombre,
          estudiante.nombre2,
          estudiante.apellido,
          estudiante.apellido2
        ]
          .filter(Boolean)
          .join(' '),
        'Correo electrónico': estudiante.email
      }))
      setInformacion(estudiantesConMatricula)
      setCargandoGrupo(false)
    }
  }, [listaEstudiantes])

  const Navigate = useNavigate()

  const verEstudiante = (estudiante) => {
    localStorage.setItem('usuario', JSON.stringify(estudiante))
    Navigate('/posgrado/grupos/ver-grupo/ver-estudiante/' + estudiante.id)
    localStorage.setItem('ruta', 'grupos')
  }

  const columnas = ['Código', 'Nombre', 'Correo electrónico']

  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: verEstudiante
    }
  ]

  const filtros = ['Código', 'Nombre']

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='w-full'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
      </div>
      <p className='text-titulos'>Información del grupo</p>
      <p className='text-subtitulos'>{grupo?.Nombre}</p>
      <div className='flex flex-row w-full my-8'>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Nombre del profesor:</div>
          <div>{grupo?.Profesor}</div>
        </div>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Número de estudiantes:</div>
          <div>{grupo?.['# Estudiantes']}</div>
        </div>
      </div>
      <p className='text-subtitulos mb-8'>Lista de estudiantes</p>
      <div className='my-12 w-full'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          acciones={acciones}
          itemsPorPagina={10}
          filtros={filtros}
          cargandoContenido={cargandoGrupo}
        />
      </div>
    </div>
  )
}

export default VerGrupoPosgrado
