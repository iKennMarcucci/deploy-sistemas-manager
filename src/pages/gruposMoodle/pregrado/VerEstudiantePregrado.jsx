import React from 'react'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Input, Divider } from '@heroui/react'
import Tabla from '../../../components/Tabla'

const VerEstudiantePregrado = () => {
  const [ruta, setRuta] = useState('')
  const [usuario, setUsuario] = useState({})
  const [matriculas, setMatriculas] = useState([])
  const [materias, setMaterias] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoEstudiante, setCargandoEstudiante] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    setRuta(localStorage.getItem('ruta'))
  }, [])

  useEffect(() => {
    setUsuario(JSON.parse(localStorage.getItem('usuario')))
  }, [ruta])

  //--------Datos divisist---------//

  useEffect(() => {
    if (ruta === 'grupos') {
      if (usuario.codigo !== '') {
        setCargandoEstudiante(true)
        fetch(
          `${backendUrl}/api/oracle/materias-matriculadas/alumno-carrera?codCarrera=${usuario.codigo.slice(0, 3)}&codAlumno=${usuario.codigo.slice(3)}`
        )
          .then((response) => response.json())
          .then((data) => {
            setMatriculas(data)
          })
          .catch((error) => {
            console.error('Error fetching materias:', error)
          })
      }

      fetch(`${backendUrl}/api/oracle/materias/tecnologia`)
        .then((response) => response.json())
        .then((data) => {
          setMaterias(data)
        })
        .catch((error) => {
          console.error('Error fetching materias:', error)
        })
    }
  }, [usuario])

  useEffect(() => {
    if (matriculas.length > 0 && materias.length > 0) {
      const materiasConMatricula = materias
        .filter((materia) =>
          matriculas.some(
            (matricula) =>
              materia.codCarrera + materia.codMateria ===
              matricula.codCarMat + matricula.codMatMat
          )
        )
        .map((materia) => {
          // Buscar la matrícula que hizo match
          const matriculaMatch = matriculas.find(
            (matricula) =>
              materia.codCarrera + materia.codMateria ===
              matricula.codCarMat + matricula.codMatMat
          )

          return {
            ...materia,
            Nombre: materia.nombre,
            Código: materia.codCarrera + materia.codMateria,
            Grupo: matriculaMatch?.grupo || 'N/A',
            Semestre: materia.semestre
          }
        })

      setInformacion(materiasConMatricula)
      setCargandoEstudiante(false)
    }
  }, [materias, matriculas])

  const columnas = ['Código', 'Grupo', 'Nombre', 'Semestre']

  const capitalizar = (texto) => {
    if (!texto || typeof texto !== 'string') return ''
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
  }

  return (
    <div className='flex flex-col items-center justify-center w-full p-4'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
        <p className='text-titulos'>{`Información del estudiante`}</p>
        <div className='w-[40px]'></div>
      </div>

      <div className='flex flex-col w-full my-8'>
        <p className='text-normal'>Información personal</p>
        <Divider className='mb-4 mt-2' />
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Primer nombre'
            labelPlacement='outside-left'
            name='primerNombre'
            type='text'
            value={capitalizar(usuario.primerNombre)}
            readOnly
          />
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Segundo nombre'
            labelPlacement='outside-left'
            name='segundoNombre'
            type='text'
            value={capitalizar(usuario.segundoNombre)}
            readOnly
          />
        </div>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Primer apellido'
            labelPlacement='outside-left'
            name='primerNombre'
            type='text'
            value={capitalizar(usuario.primerApellido)}
            readOnly
          />
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Segundo nombre'
            labelPlacement='outside-left'
            name='segundoApellido'
            type='text'
            value={capitalizar(usuario.segundoApellido)}
            readOnly
          />
        </div>
        <p className='text-normal mt-4'>Información de contacto</p>
        <Divider className='mb-4 mt-2' />
        <div className='w-1/2 flex flex-row'>
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Correo electrónico'
            labelPlacement='outside-left'
            name='correoElectronico'
            type='text'
            value={usuario.email}
            readOnly
          />
        </div>
        <p className='text-normal mt-4'>Información académica</p>
        <Divider className='mb-4 mt-2' />
        <div className='w-1/2 flex flex-row'>
          <Input
            classNames={{
              label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            className='mb-4'
            label='Código'
            labelPlacement='outside-left'
            name='correoElectronico'
            type='text'
            value={usuario.codigo}
            readOnly
          />
        </div>
      </div>

      <div className='w-[90%] flex flex-col items-center justify-center mb-8  '>
        <p className='text-subtitulos mb-4'>Materias matriculadas</p>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          cargandoContenido={cargandoEstudiante}
        />
      </div>
    </div>
  )
}

export default VerEstudiantePregrado
