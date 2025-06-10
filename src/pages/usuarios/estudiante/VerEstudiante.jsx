import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Divider, Input } from '@heroui/react'
const VerEstudiante = () => {
  const { id } = useParams()

  const [estudiante, setEstudiante] = useState({})
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/estudiantes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEstudiante(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  useEffect(() => {}, [estudiante])

  const formatFecha = (fecha) => {
    if (!fecha) return '' // Manejar fechas nulas o indefinidas

    const date = new Date(fecha) // Convertir la fecha ISO a un objeto Date
    const day = date.getUTCDate().toString().padStart(2, '0') // Obtener el día con dos dígitos
    const month = date.getUTCMonth() // Obtener el índice del mes (0-11)
    const year = date.getUTCFullYear() // Obtener el año

    const meses = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]

    return `${day} de ${meses[month]} de ${year}` // Formatear la fecha
  }

  return (
    <div className='flex flex-col w-full items-center p-4'>
      <div className='w-full flex flex-row justify-between'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
        <p className='text-center text-titulos'>Información del estudiante</p>
        <div className='w-[40px]'></div>
      </div>
      <div className='w-full mt-8 flex flex-col'>
        <p className='text-normal'>Información personal</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-row mb-4'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Primer nombre'
            labelPlacement='outside-left'
            name='primerNombre'
            type='text'
            readOnly
            value={estudiante.nombre || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Segundo nombre'
            labelPlacement='outside-left'
            name='segundoNombre'
            type='text'
            readOnly
            value={estudiante.nombre2 || ''}
          />
        </div>
        <div className='w-full flex flex-row mb-4'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Primer apellido'
            labelPlacement='outside-left'
            name='primerApellido'
            type='text'
            readOnly
            value={estudiante.apellido || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Segundo apellido'
            labelPlacement='outside-left'
            name='segundoApellido'
            type='text'
            readOnly
            value={estudiante.apellido2 || ''}
          />
        </div>
        <div className='w-full flex flex-row mb-4'>
          <div className='w-1/2'>
            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              label='Fecha de nacimiento'
              labelPlacement='outside-left'
              name='fechaNacimiento'
              type='text'
              readOnly
              value={formatFecha(estudiante.fechaNacimiento) || ''}
            />
          </div>
        </div>
        <p className='text-normal mt-4'>Identificación de usuario</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-row mb-4'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Documento de identidad'
            labelPlacement='outside-left'
            name='documentoIdentidad'
            type='text'
            readOnly
            value={estudiante.cedula || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Código'
            labelPlacement='outside-left'
            name='codigo'
            type='text'
            readOnly
            value={estudiante.codigo || ''}
          />
        </div>
        <p className='text-normal mt-4'>Información de contacto</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-row mb-4'>
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Correo electrónico'
            labelPlacement='outside-left'
            name='correoElectronico'
            type='text'
            readOnly
            value={estudiante.email || ''}
          />
          <Input
            classNames={{
              label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
              base: 'flex items-start',
              inputWrapper:
                'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
              mainWrapper: 'w-1/2 '
            }}
            label='Número de celular'
            labelPlacement='outside-left'
            name='numeroCelular'
            type='text'
            readOnly
            value={estudiante.telefono || ''}
          />
        </div>
        <p className='text-normal mt-4'>Información académica</p>
        <Divider className='mb-4' />
        <Input
          classNames={{
            label: `w-1/6 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
            base: 'flex items-start',
            inputWrapper:
              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
            mainWrapper: 'w-1/2 '
          }}
          label='Programa académico'
          labelPlacement='outside-left'
          name='programaAcademico'
          type='text'
          readOnly
          value={estudiante.programaNombre || ''}
        />
        <Input
          className='mt-4'
          classNames={{
            label: `w-1/6 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
            base: 'flex items-start',
            inputWrapper:
              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
            mainWrapper: 'w-1/2 '
          }}
          label='Pensum'
          labelPlacement='outside-left'
          name='pensum'
          type='text'
          readOnly
          value={estudiante.pensumNombre || ''}
        />
        <Input
          className='mt-4'
          classNames={{
            label: `w-1/6 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
            base: 'flex items-start',
            inputWrapper:
              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
            mainWrapper: 'w-1/2 '
          }}
          label='Cohorte'
          labelPlacement='outside-left'
          name='cohorte'
          type='text'
          readOnly
          value={estudiante.cohorteNombre || ''}
        />
        <Input
          classNames={{
            label: `w-1/6 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
            base: 'flex items-start',
            inputWrapper:
              'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
            mainWrapper: 'w-1/5 '
          }}
          className='mt-4'
          label='Fecha de ingreso'
          labelPlacement='outside-left'
          name='fechaIngreso'
          type='text'
          readOnly
          value={formatFecha(estudiante.fechaIngreso)}
        />
      </div>
    </div>
  )
}
export default VerEstudiante
