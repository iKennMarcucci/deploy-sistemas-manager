import React from 'react'
import Tabla from '../../../components/Tabla'
import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const VerGrupo = () => {
  const [grupo, setGrupo] = useState(null)
  const [listaEstudiantes, setListaEstudiantes] = useState([])
  const [matriculas, setMatriculas] = useState([])
  const [informacion, setInformacion] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    setGrupo(JSON.parse(localStorage.getItem('grupo')))
  }, [])

  //---------Datos quemados---------//
  /*
  useEffect(() => {
    if (grupo) {
      fetch('/divisist/estudiantes.json')
        .then((response) => response.json())
        .then((data) => {
          const estudiantesFiltrados = data.results[0].items.filter(
            (estudiante) => estudiante.nomcarrera === 'INGENIERIA DE SISTEMAS'
          )
          setListaEstudiantes(estudiantesFiltrados)
        })

      fetch('/divisist/materiasMatriculadas.json')
        .then((response) => response.json())
        .then((data) => {
          const matriculasCarreraFiltradas = data.results[0].items.filter(
            (matricula) => matricula.cod_car_mat === grupo.cod_carrera
          )
          const matriculasMateriaFiltradas = matriculasCarreraFiltradas.filter(
            (matricula) => matricula.cod_mat_mat === grupo.cod_materia
          )
          const matriculasGrupoFiltradas = matriculasMateriaFiltradas.filter(
            (matricula) => matricula.grupo === grupo.grupo
          )
          setMatriculas(matriculasGrupoFiltradas)
        })
    }
  }, [grupo])
  */

  //--------Datos divisist---------//
  useEffect(() => {
    if (grupo) {
      fetch(
        `${backendUrl}/api/oracle/estudiantes/buscar-por-codigo?codigo=${grupo.codCarrera}`
      )
        .then((response) => response.json())
        .then((data) => {
          setListaEstudiantes(data)
        })

      fetch(
        `${backendUrl}/api/oracle/materias-matriculadas/filtrar?codCarMat=${grupo.codCarrera}&codMatMat=${grupo.codMateria}&grupo=${grupo.grupo}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMatriculas(data)
        })
    }
  }, [grupo])

  //---------Datos quemados---------//
  /*
  useEffect(() => {
    if (listaEstudiantes.length > 0 && matriculas.length > 0) {
      const estudiantesConMatricula = listaEstudiantes
        .filter((estudiante) =>
          matriculas.some(
            (matricula) =>
              estudiante.codigo === matricula.cod_car_mat + matricula.cod_alumno
          )
        )
        .map((estudiante) => ({
          ...estudiante,
          Código: estudiante.codigo,
          Nombre: estudiante
            ? [
                estudiante.primer_nombre,
                estudiante.segundo_nombre,
                estudiante.primer_apellido,
                estudiante.segundo_apellido
              ]
                .filter(Boolean) // elimina undefined, null, '', etc.
                .join(' ')
            : 'Desconocido',
          'Correo electrónico': estudiante.email || 'No disponible'
        }))
      setInformacion(estudiantesConMatricula)
    }
  }, [listaEstudiantes, matriculas])
  */

  //--------Datos divisist---------//
  useEffect(() => {
    if (listaEstudiantes.length > 0 && matriculas.length > 0) {
      const estudiantesConMatricula = listaEstudiantes
        .filter((estudiante) =>
          matriculas.some(
            (matricula) =>
              estudiante.codigo === matricula.codCarMat + matricula.codAlumno
          )
        )
        .map((estudiante) => ({
          ...estudiante,
          Código: estudiante.codigo,
          Nombre: estudiante
            ? [
                estudiante.primerNombre,
                estudiante.segundoNombre,
                estudiante.primerApellido,
                estudiante.segundoApellido
              ]
                .filter(Boolean) // elimina undefined, null, '', etc.
                .join(' ')
            : 'Desconocido',
          'Correo electrónico': estudiante.email || 'No disponible'
        }))
      setInformacion(estudiantesConMatricula)
    }
  }, [listaEstudiantes, matriculas])

  const Navigate = useNavigate()

  const verEstudiante = (estudiante) => {
    localStorage.setItem('usuario', JSON.stringify(estudiante))
    Navigate('/usuario')
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
        />
      </div>
    </div>
  )
}

export default VerGrupo
