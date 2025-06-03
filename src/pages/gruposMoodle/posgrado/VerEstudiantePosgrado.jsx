import React from 'react'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Input, Divider } from '@heroui/react'
import Tabla from '../../../components/Tabla'
import { useParams } from 'react-router-dom'

const VerEstudiantePosgrado = () => {
  const { id } = useParams()
  const [usuario, setUsuario] = useState({})
  const [grupos, setGrupos] = useState([])
  const [informacion, setInformacion] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    if (id) {
      fetch(`${backendUrl}/estudiantes/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setUsuario({
            primerNombre: data.nombre,
            segundoNombre: data.nombre2,
            primerApellido: data.apellido,
            segundoApellido: data.apellido2,
            email: data.email,
            codigo: data.codigo
          })
        })

      fetch(`${backendUrl}/matriculas/estudiante/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setGrupos(data)
        })
    }
  }, [])

  useEffect(() => {
    if (grupos.length > 0) {
      console.log(grupos)
      const gruposConMatricula = grupos.map((grupo) => ({
        ...grupo,
        Código: grupo.codigoMateria,
        Grupo: grupo.grupoNombre.charAt(grupo.grupoNombre.length - 1),
        Materia: grupo.nombreMateria,
        Semestre: grupo.semestreMateria
      }))
      setInformacion(gruposConMatricula)
    }
  }, [grupos])

  const columnas = ['Código', 'Materia', 'Grupo', 'Semestre']

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
        <Tabla informacion={informacion} columnas={columnas} />
      </div>
    </div>
  )
}

export default VerEstudiantePosgrado
