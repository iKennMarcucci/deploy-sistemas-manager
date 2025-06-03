import React from 'react'
import { Form, Input, Divider } from '@heroui/react'
import { useState } from 'react'
import Boton from '../../../components/Boton'
import { ArrowLeft } from 'lucide-react'
import AlertaModal from '../../../components/AlertaModal'

const CrearProfesor = () => {
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

  // Validaciones para primer nombre
  const primerNombreErrors = []

  if (primerNombre === '') {
    primerNombreErrors.push('Este campo es obligatorio')
  }

  if (primerNombre && primerNombre.includes(' ')) {
    primerNombreErrors.push('No pueden haber espacios en el valor')
  }

  if (primerNombre && !/^[A-ZÁÉÍÓÚÑÜ]/.test(primerNombre)) {
    primerNombreErrors.push('Tiene que empezar en mayúscula')
  }

  if (primerNombre && (primerNombre.match(/[A-ZÁÉÍÓÚÑÜ]/g) || []).length > 1) {
    primerNombreErrors.push('Sólo puede tener una mayúscula')
  }

  if (primerNombre && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(primerNombre)) {
    primerNombreErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para segundo nombre
  const segundoNombreErrors = []

  if (segundoNombre && segundoNombre.includes(' ')) {
    segundoNombreErrors.push('No pueden haber espacios en el valor')
  }

  if (segundoNombre && !/^[A-ZÁÉÍÓÚÑÜ]/.test(segundoNombre)) {
    segundoNombreErrors.push('Tiene que empezar en mayúscula')
  }

  if (
    segundoNombre &&
    (segundoNombre.match(/[A-ZÁÉÍÓÚÑÜ]/g) || []).length > 1
  ) {
    segundoNombreErrors.push('Sólo puede tener una mayúscula')
  }

  if (segundoNombre && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(segundoNombre)) {
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

  if (primerApellido && !/^[A-ZÁÉÍÓÚÑÜ]/.test(primerApellido)) {
    primerApellidoErrors.push('Tiene que empezar en mayúscula')
  }

  if (
    primerApellido &&
    (primerApellido.match(/[A-ZÁÉÍÓÚÑÜ]/g) || []).length > 1
  ) {
    primerApellidoErrors.push('Sólo puede tener una mayúscula')
  }

  if (primerApellido && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(primerApellido)) {
    primerApellidoErrors.push('No puede tener números o signos, sólo letras')
  }

  // Validaciones para segundo apellido
  const segundoApellidoErrors = []

  if (segundoApellido && segundoApellido.includes(' ')) {
    segundoApellidoErrors.push('No pueden haber espacios en el valor')
  }

  if (segundoApellido && !/^[A-ZÁÉÍÓÚÑÜ]/.test(segundoApellido)) {
    segundoApellidoErrors.push('Tiene que empezar en mayúscula')
  }

  if (
    segundoApellido &&
    (segundoApellido.match(/[A-ZÁÉÍÓÚÑÜ]/g) || []).length > 1
  ) {
    segundoApellidoErrors.push('Sólo puede tener una mayúscula')
  }

  if (segundoApellido && !/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]+$/.test(segundoApellido)) {
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
    crearProfesor()
  }

  const limpiarCampos = () => {
    setPrimerNombre('')
    setSegundoNombre('')
    setPrimerApellido('')
    setSegundoApellido('')
    setCodigo('')
    setCedula('')
    setCorreo('')
    setTelefono('')
  }

  // Función para buscar usuario en Moodle por email
  const buscarUsuarioMoodlePorEmail = async (email) => {
    try {
      const moodleSearchResponse = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}` +
          `&moodlewsrestformat=json` +
          `&wsfunction=core_user_get_users` +
          `&criteria[0][key]=email` +
          `&criteria[0][value]=${email}`
      )

      const moodleSearchData = await moodleSearchResponse.json()

      if (
        moodleSearchData &&
        moodleSearchData.users &&
        moodleSearchData.users.length > 0
      ) {
        return moodleSearchData.users[0] // Retorna el primer usuario encontrado
      }

      return null // No se encontró usuario
    } catch (error) {
      console.error('Error al buscar usuario en Moodle:', error)
      return null
    }
  }

  const crearProfesor = async () => {
    // Generar contraseña segura
    const generarPassword = () => {
      // Primera letra del primer nombre en mayúsculas
      const primerLetraNombre = primerNombre.charAt(0)
      // Segunda letra del primer apellido en mayúsculas (si existe)
      const primeraletraApellido = primerApellido.charAt(0).toLowerCase()

      // Formato: PrimeraLetraNombre + SegundaLetraApellido + . + codigo
      return `${primerLetraNombre}${primeraletraApellido}.${codigo}`
    }

    const passwordSeguro = generarPassword()

    const data = {
      primerNombre,
      segundoNombre,
      primerApellido,
      segundoApellido,
      email: correo,
      telefono,
      cedula,
      codigo
    }
    console.log(data)

    try {
      // 1. Crear profesor en el backend
      const response = await fetch(`${backendUrl}/usuarios/profesores/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAlertType('error')
        setAlertMessage(errorData.message || 'Error al crear el profesor')
        setIsAlertOpen(true)
        throw new Error(errorData.message || 'Error al crear el profesor')
      }

      const responseData = await response.json()
      console.log('Profesor creado en backend:', responseData)

      try {
        // 2. Buscar si existe usuario en Moodle con el email
        const usuarioExistente = await buscarUsuarioMoodlePorEmail(correo)

        if (usuarioExistente) {
          // 2.1. Si existe el usuario, vincular con el backend
          console.log('Usuario encontrado en Moodle:', usuarioExistente)

          const body = {
            backendId: responseData.id,
            moodleId: usuarioExistente.id
          }

          const moodleUpdateResponse = await fetch(
            `${backendUrl}/usuarios/profesores/moodle`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            }
          )

          if (moodleUpdateResponse.ok) {
            setAlertType('success')
            setAlertMessage(
              'Profesor creado y vinculado con Moodle correctamente'
            )
          } else {
            setAlertType('warning')
            setAlertMessage(
              'Profesor creado pero hubo problemas al vincular con Moodle'
            )
          }
        } else {
          // 2.2. Si no existe, crear usuario en Moodle
          const moodleResponse = await fetch(
            `${moodleUrl}?wstoken=${moodleToken}` +
              `&moodlewsrestformat=json` +
              `&wsfunction=core_user_create_users` +
              `&users[0][username]=${codigo}` +
              `&users[0][email]=${correo}` +
              `&users[0][lastname]=${[primerApellido, segundoApellido].filter(Boolean).join(' ')}` +
              `&users[0][firstname]=${[primerNombre, segundoNombre].filter(Boolean).join(' ')}` +
              `&users[0][password]=${passwordSeguro}`
          )

          const moodleData = await moodleResponse.json()
          console.log('Respuesta de Moodle al crear usuario:', moodleData)

          if (moodleData && moodleData.length > 0 && moodleData[0].id) {
            // Usuario creado exitosamente en Moodle, actualizar ID en backend
            const body = {
              backendId: responseData.id,
              moodleId: moodleData[0].id
            }

            const moodleUpdateResponse = await fetch(
              `${backendUrl}/usuarios/profesores/moodle`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
              }
            )

            if (moodleUpdateResponse.ok) {
              setAlertType('success')
              setAlertMessage('Profesor creado correctamente')
            } else {
              setAlertType('warning')
              setAlertMessage(
                'Profesor creado pero hubo problemas al sincronizar con Moodle'
              )
            }
          } else if (moodleData && moodleData.exception) {
            // Error al crear en Moodle
            console.error('Error de Moodle:', moodleData)
            setAlertType('warning')
            setAlertMessage(
              `Profesor creado pero no se pudo crear en Moodle: ${moodleData.message || 'Error desconocido'}`
            )
          } else {
            setAlertType('warning')
            setAlertMessage(
              'Profesor creado pero hubo problemas al crear el usuario en Moodle'
            )
          }
        }
      } catch (moodleError) {
        console.error('Error al integrar con Moodle:', moodleError)
        setAlertType('warning')
        setAlertMessage(
          'Profesor creado pero no se pudo procesar la integración con Moodle'
        )
      }

      setIsAlertOpen(true)
      limpiarCampos()
    } catch (error) {
      console.log(error)
      if (!isAlertOpen) {
        setAlertType('error')
        setAlertMessage('Error al crear el profesor')
        setIsAlertOpen(true)
      }
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
        <p className='text-center text-titulos'>creación de profesor</p>
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
          <Boton type={'submit'}>Crear profesor</Boton>
        </div>
      </Form>

      {/* AlertaModal para notificaciones */}
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

export default CrearProfesor
