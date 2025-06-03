import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Input, Divider } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
const VerProfesor = () => {
  const { id } = useParams()
  const [profesor, setProfesor] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/usuarios/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfesor(data)
      })
  }, [])

  return (
    <div className='flex flex-col w-full items-center p-4'>
      <div className='w-full flex flex-row justify-between mb-6'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
        <p className='text-center text-titulos'>Información del profesor</p>
        <div className='w-[40px]'></div>
      </div>

      <p className='text-normal'>Información personal</p>
      <Divider className='mb-4' />
      <div className='w-full flex flex-col'>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Primer nombre'
            labelPlacement='outside-left'
            name='primerNombre'
            type='text'
            value={profesor.primerNombre || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Segundo nombre'
            labelPlacement='outside-left'
            name='segundoNombre'
            type='text'
            value={profesor.segundoNombre || ''}
          />
        </div>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            label='Primer apellido'
            labelPlacement='outside-left'
            name='primerApellido'
            type='text'
            value={profesor.primerApellido || ''}
          />

          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            label='Segundo apellido'
            labelPlacement='outside-left'
            name='segundoApellido'
            type='text'
            value={profesor.segundoApellido || ''}
          />
        </div>
      </div>
      <p className='text-normal mt-8'>Identificación de usuario</p>
      <Divider className='mb-4' />
      <div className='w-full flex flex-col'>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Cédula de ciudadanía'
            labelPlacement='outside-left'
            name='cedula'
            type='text'
            value={profesor.cedula || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Código'
            labelPlacement='outside-left'
            name='código'
            type='text'
            value={profesor.codigo || ''}
            required
          />
        </div>
      </div>
      <p className='text-normal mt-8'>Información de contacto</p>
      <Divider className='mb-4' />
      <div className='w-full flex flex-col'>
        <div className='w-full flex flex-row'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Correo electrónico'
            labelPlacement='outside-left'
            name='correo'
            type='email'
            value={profesor.email || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            readOnly
            className='mb-4'
            label='Teléfono'
            labelPlacement='outside-left'
            name='telefono'
            type='text'
            value={profesor.telefono || ''}
            required
          />
        </div>
      </div>
    </div>
  )
}
export default VerProfesor
