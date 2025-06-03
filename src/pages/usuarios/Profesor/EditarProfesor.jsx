import React from 'react'
import { Form, Input, Divider } from '@heroui/react'
import { useState, useEffect } from 'react'
import Boton from '../../../components/Boton'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AlertaModal from '../../../components/AlertaModal'

const EditarProfesor = () => {
  const { id } = useParams()
  const [profesor, setProfesor] = useState({})
  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [codigo, setCodigo] = useState('')
  const [cedula, setCedula] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN
  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    fetch(`${backendUrl}/usuarios/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProfesor(data)
      })
  }, [])

  useEffect(() => {
    if (profesor) {
      // Usar || '' para garantizar que siempre sea una cadena vacía y nunca null/undefined
      setPrimerNombre(profesor.primerNombre || '')
      setSegundoNombre(profesor.segundoNombre || '')
      setPrimerApellido(profesor.primerApellido || '')
      setSegundoApellido(profesor.segundoApellido || '')
      setCodigo(profesor.codigo || '')
      setCedula(profesor.cedula || '')
      setCorreo(profesor.email || '')
      setTelefono(profesor.telefono || '')
    }
  }, [profesor])

  // Validaciones para primer nombre
  const primerNombreErrors = []

  if (primerNombre === '') {
    primerNombreErrors.push('Este campo es obligatorio')
  }

  if (primerNombre && primerNombre.includes(' ')) {
    primerNombreErrors.push('No pueden haber espacios en el valor')
  }

  if (primerNombre && !/^[A-Z]/.test(primerNombre)) {
    primerNombreErrors.push('Tiene que empezar en mayúscula')
  }

  if (primerNombre && (primerNombre.match(/[A-Z]/g) || []).length > 1) {
    primerNombreErrors.push('Sólo puede tener una mayúscula')
  }

  if (primerNombre && !/^[a-zA-Z]+$/.test(primerNombre)) {
    primerNombreErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para segundo nombre
  const segundoNombreErrors = []

  if (segundoNombre && segundoNombre.includes(' ')) {
    segundoNombreErrors.push('No pueden haber espacios en el valor')
  }

  if (segundoNombre && !/^[A-Z]/.test(segundoNombre)) {
    segundoNombreErrors.push('Tiene que empezar en mayúscula')
  }

  if (segundoNombre && (segundoNombre.match(/[A-Z]/g) || []).length > 1) {
    segundoNombreErrors.push('Sólo puede tener una mayúscula')
  }

  if (segundoNombre && !/^[a-zA-Z]+$/.test(segundoNombre)) {
    segundoNombreErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para el primer apellido
  const primerApellidoErrors = []
  if (primerApellido === '') {
    primerApellidoErrors.push('Este campo es obligatorio')
  }

  if (primerApellido && primerApellido.includes(' ')) {
    primerApellidoErrors.push('No pueden haber espacios en el valor')
  }

  if (primerApellido && !/^[A-Z]/.test(primerApellido)) {
    primerApellidoErrors.push('Tiene que empezar en mayúscula')
  }

  if (primerApellido && (primerApellido.match(/[A-Z]/g) || []).length > 1) {
    primerApellidoErrors.push('Sólo puede tener una mayúscula')
  }

  if (primerApellido && !/^[a-zA-Z]+$/.test(primerApellido)) {
    primerApellidoErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para segundo apellido
  const segundoApellidoErrors = []

  if (segundoApellido && segundoApellido.includes(' ')) {
    segundoApellidoErrors.push('No pueden haber espacios en el valor')
  }

  if (segundoApellido && !/^[A-Z]/.test(segundoApellido)) {
    segundoApellidoErrors.push('Tiene que empezar en mayúscula')
  }

  if (segundoApellido && (segundoApellido.match(/[A-Z]/g) || []).length > 1) {
    segundoApellidoErrors.push('Sólo puede tener una mayúscula')
  }

  if (segundoApellido && !/^[a-zA-Z]+$/.test(segundoApellido)) {
    segundoApellidoErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para cédula de ciudadanía
  const cedulaErrors = []

  if (cedula === '') {
    cedulaErrors.push('Este campo es obligatorio')
  }

  if (cedula && !/^\d+$/.test(cedula)) {
    cedulaErrors.push('Solo puede contener números')
  }

  if (cedula && (cedula.length < 7 || cedula.length > 10)) {
    cedulaErrors.push('Debe tener entre 7 y 10 dígitos')
  }

  // Validaciones para código
  const codigoErrors = []

  if (codigo === '') {
    codigoErrors.push('Este campo es obligatorio')
  }

  if (codigo && !/^\d+$/.test(codigo)) {
    codigoErrors.push('Solo puede contener números')
  }

  if (codigo && (codigo.length < 7 || codigo.length > 10)) {
    codigoErrors.push('Debe tener entre 7 y 10 dígitos')
  }

  // Validaciones para correo electrónico
  const correoErrors = []

  if (correo === '') {
    correoErrors.push('Este campo es obligatorio')
  }

  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    correoErrors.push('Formato de correo inválido')
  }

  // Validaciones para teléfono
  const telefonoErrors = []

  if (telefono === '') {
    telefonoErrors.push('Este campo es obligatorio')
  }

  if (telefono && !/^\d+$/.test(telefono)) {
    telefonoErrors.push('Solo puede contener números')
  }

  if (telefono && !/^3/.test(telefono)) {
    telefonoErrors.push('Debe empezar con el número 3')
  }

  if (telefono && telefono.length !== 10) {
    telefonoErrors.push('Debe tener 10 dígitos')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    editarProfesor()
  }

  const actualizarProfesorMoodle = async (
    id,
    primerNombre,
    correo,
    primerApellido,
    segundoNombre,
    segundoApellido
  ) => {
    fetch(
      `${moodleUrl}?wstoken=${moodleToken}` +
        `&wsfunction=core_user_update_users` +
        `&users[0][id]=${id}` +
        `&users[0][username]=${codigo}` +
        `&users[0][firstname]=${[primerNombre, segundoNombre].filter(Boolean).join(' ')}` +
        `&users[0][lastname]=${[primerApellido, segundoApellido].filter(Boolean).join(' ')}` +
        `&users[0][email]=${correo}`
    ).then((response) => {
      if (response.ok) {
        console.log('Estudiante actualizado en Moodle')
      } else {
        console.error('Error al actualizar el estudiante en Moodle')
      }
    })
  }

  const editarProfesor = async () => {
    const data = {
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      email: correo,
      telefono,
      cedula,
      codigo,
      moodleId: profesor.moodleId
    }
    console.log(data)
    try {
      const response = await fetch(`${backendUrl}/usuarios/profesores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAlertType('error')
        setAlertMessage(errorData.message || 'Error al actualizar el profesor')
        setIsAlertOpen(true)
      } else {
        await response.json()
        actualizarProfesorMoodle(
          profesor.moodleId,
          primerNombre,
          correo,
          primerApellido,
          segundoNombre,
          segundoApellido
        )
        setAlertType('success')
        setAlertMessage('Profesor actualizado correctamente')
        setIsAlertOpen(true)
      }
    } catch (error) {
      console.log(error)
      setAlertType('error')
      setAlertMessage('Error al actualizar el profesor')
      setIsAlertOpen(true)
    }
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
        <p className='text-center text-titulos'>
          Actualización de información del profesor
        </p>
        <div className='w-[40px]'></div>
      </div>

      <Form className='w-full my-8 flex flex-col' onSubmit={onSubmit}>
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
              className='mb-4'
              isRequired
              label='Primer nombre'
              labelPlacement='outside-left'
              name='primerNombre'
              placeholder='Ingresa el primer nombre'
              type='text'
              value={primerNombre}
              onValueChange={(value) => setPrimerNombre(value)}
              isInvalid={primerNombreErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {primerNombreErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />
            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              className='mb-4'
              label='Segundo nombre'
              labelPlacement='outside-left'
              name='segundoNombre'
              placeholder='Ingresa el segundo nombre'
              type='text'
              value={segundoNombre}
              onValueChange={(value) => setSegundoNombre(value)}
              isInvalid={segundoNombreErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {segundoNombreErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
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
              isRequired
              label='Primer apellido'
              labelPlacement='outside-left'
              name='primerApellido'
              placeholder='Ingresa el primer apellido'
              type='text'
              value={primerApellido}
              onValueChange={(value) => setPrimerApellido(value)}
              isInvalid={primerApellidoErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {primerApellidoErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />

            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              label='Segundo apellido'
              labelPlacement='outside-left'
              name='segundoApellido'
              placeholder='Ingresa el segundo apellido'
              type='text'
              value={segundoApellido}
              onValueChange={(value) => setSegundoApellido(value)}
              isInvalid={segundoApellidoErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {segundoApellidoErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
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
              className='mb-4'
              isRequired
              label='Cédula de ciudadanía'
              labelPlacement='outside-left'
              name='cedula'
              placeholder='Ingresa la cédula'
              type='text'
              value={cedula}
              onValueChange={(value) => setCedula(value)}
              isInvalid={cedulaErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {cedulaErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />
            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              isRequired
              className='mb-4'
              label='Código'
              labelPlacement='outside-left'
              name='código'
              placeholder='Ingresa el código'
              type='text'
              value={codigo}
              onValueChange={(value) => setCodigo(value)}
              isInvalid={codigoErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {codigoErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
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
              className='mb-4'
              isRequired
              label='Correo electrónico'
              labelPlacement='outside-left'
              name='correo'
              placeholder='Ingresa el correo electrónico'
              type='email'
              value={correo}
              onValueChange={(value) => setCorreo(value)}
              isInvalid={correoErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {correoErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />
            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
              isRequired
              className='mb-4'
              label='Teléfono'
              labelPlacement='outside-left'
              name='telefono'
              placeholder='Ingresa el número telefónico'
              type='text'
              value={telefono}
              onValueChange={(value) => setTelefono(value)}
              isInvalid={telefonoErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {telefonoErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />
          </div>
        </div>
        <div className='mt-4 w-full flex justify-end'>
          <Boton type={'submit'}>Actualizar información</Boton>
        </div>
      </Form>
      <AlertaModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
        type={alertType}
        titulo={alertType === 'success' ? 'Operación exitosa' : 'Error'}
      />
    </div>
  )
}

export default EditarProfesor
