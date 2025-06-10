import React from 'react'
import {
  Form,
  Input,
  Divider,
  DatePicker,
  Autocomplete,
  AutocompleteItem
} from '@heroui/react'
import { useState, useEffect, useRef } from 'react'
import Boton from '../../../components/Boton'
import { ArrowLeft } from 'lucide-react'
import { today, getLocalTimeZone, parseDate } from '@internationalized/date'
import AlertaModal from '../../../components/AlertaModal'

const CrearEstudiante = () => {
  //Información por cargar
  const [programas, setProgramas] = useState([])
  const [pensums, setPensums] = useState([])
  const [cohortes, setCohortes] = useState([])
  const [programa, setPrograma] = useState('')

  // Referencias para los autocomplete y datepicker
  const programaRef = useRef(null)
  const pensumRef = useRef(null)
  const cohorteRef = useRef(null)
  const fechaNacimientoRef = useRef(null)

  const [primerNombre, setPrimerNombre] = useState('')
  const [segundoNombre, setSegundoNombre] = useState('')
  const [primerApellido, setPrimerApellido] = useState('')
  const [segundoApellido, setSegundoApellido] = useState('')
  const [fechaNacimiento, setFechaNacimiento] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [cedula, setCedula] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [pensum, setPensum] = useState('')
  const [cohorte, setCohorte] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')

  const minDate = today(getLocalTimeZone()).subtract({ years: 125 }) // 125 años atrás
  const maxDate = today(getLocalTimeZone()).subtract({ years: 14 }) // 14 años atrás

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

  // Validaciones para fecha de nacimiento
  const fechaNacimientoErrors = []
  if (!fechaNacimiento) {
    fechaNacimientoErrors.push('Este campo es obligatorio')
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

  // Validaciones para programa académico
  const programaErrors = []
  if (!programa) {
    programaErrors.push('Este campo es obligatorio')
  }

  // Validaciones para pensum
  const pensumErrors = []
  if (!pensum) {
    pensumErrors.push('Este campo es obligatorio')
  }

  // Validaciones para cohorte
  const cohorteErrors = []
  if (!cohorte) {
    cohorteErrors.push('Este campo es obligatorio')
  }

  useEffect(() => {
    fetch(`${backendUrl}/programas/listar`)
      .then((response) => response.json())
      .then((data) => {
        setProgramas(data)
      })
  }, [])

  useEffect(() => {
    if (programa !== '') {
      fetch(`${backendUrl}/pensums/programa/${programa}`)
        .then((response) => response.json())
        .then((data) => {
          setPensums(data)
        })

      fetch(`${backendUrl}/cohortes/listar`)
        .then((response) => response.json())
        .then((data) => {
          // Procesar los cohortes y sus grupos
          const gruposCohortes = data.flatMap((cohorte) =>
            cohorte.cohortesGrupos.map((grupo) => ({
              grupo: {
                id: grupo.id,
                nombre: grupo.nombre
              }
            }))
          )
          setCohortes(gruposCohortes) // Actualizar el estado con los grupos
        })
        .catch((error) =>
          console.error('Error al obtener los cohortes:', error)
        )
    }
  }, [programa])

  const buscarEstudiante = async () => {
    if (codigoErrors.length === 0) {
      fetch(
        `${backendUrl}/api/oracle/estudiantes/buscar/codigo?codigo=${codigo}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const estudiante = data[0]

            const toCapitalCase = (str) => {
              if (!str) return ''
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
            }

            setPrimerNombre(toCapitalCase(estudiante.primerNombre) || '')
            setSegundoNombre(toCapitalCase(estudiante.segundoNombre) || '')
            setPrimerApellido(toCapitalCase(estudiante.primerApellido) || '')
            setSegundoApellido(toCapitalCase(estudiante.segundoApellido) || '')
            setCedula(estudiante.documento || '')
            setCorreo(estudiante.email || '')

            // Convertir fecha de nacimiento del formato yyyy-mm-dd a DateValue
            if (estudiante.fechaNacimiento) {
              const fechaParsed = parseDate(estudiante.fechaNacimiento)
              setFechaNacimiento(fechaParsed)
            }
          }
        })
        .catch((error) => {
          console.error('Error al buscar el estudiante:', error)
          setAlertType('error')
          setAlertMessage('Error al buscar el estudiante')
          setIsAlertOpen(true)
        })
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    crearEstudiante()
  }

  // Manejador para cerrar la alerta
  const handleCloseAlert = () => {
    if (alertType === 'success') {
      // Si fue exitoso, recarga la página
      window.location.reload()
    } else {
      // Si fue error, solo cierra el modal
      setIsAlertOpen(false)
    }
  }

  // Función para buscar usuario en Moodle por email
  const buscarUsuarioMoodlePorEmail = async (email) => {
    try {
      const moodleSearchResponse = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=${encodeURIComponent(email)}`
      )

      const moodleSearchData = await moodleSearchResponse.json()

      if (
        moodleSearchData &&
        moodleSearchData.users &&
        moodleSearchData.users.length > 0
      ) {
        return moodleSearchData.users[0].id // Retorna solo el ID del usuario encontrado
      }

      return null // No se encontró usuario
    } catch (error) {
      console.error('Error al buscar usuario en Moodle:', error)
      return null
    }
  }

  const crearEstudiante = async () => {
    const formattedFechaNacimiento = fechaNacimiento
      ? fechaNacimiento
          .toDate(getLocalTimeZone()) // Convertir a Date nativo
          .toISOString() // Convertir a formato ISO
          .split('T')[0] // Extraer solo la parte de la fecha (aaaa-mm-dd)
      : null

    const fechaHoy = new Date()
    const fechaHoyFormated = fechaHoy.toISOString().split('T')[0]

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
      codigo,
      nombre: primerNombre,
      nombre2: segundoNombre,
      apellido: primerApellido,
      apellido2: segundoApellido,
      email: correo,
      telefono,
      fechaNacimiento: formattedFechaNacimiento,
      fechaIngreso: fechaHoyFormated,
      pensumId: pensum,
      cohorteId: cohorte,
      estadoEstudianteId: 1,
      cedula
    }

    try {
      // 1. Crear estudiante en el backend
      const response = await fetch(`${backendUrl}/estudiantes/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        setAlertType('error')
        setAlertMessage(errorData.message || 'Error al crear el estudiante')
        setIsAlertOpen(true)
        return
      }

      const responseData = await response.json()

      try {
        // 2. Verificar si el usuario ya existe en Moodle
        let moodleUserId = await buscarUsuarioMoodlePorEmail(correo)

        if (!moodleUserId) {
          // Usuario no existe, crear en Moodle
          const moodleCreateResponse = await fetch(
            `${moodleUrl}?wstoken=${moodleToken}` +
              `&moodlewsrestformat=json` +
              `&wsfunction=core_user_create_users` +
              `&users[0][username]=${codigo}` +
              `&users[0][email]=${correo}` +
              `&users[0][lastname]=${[primerApellido, segundoApellido].filter(Boolean).join(' ')}` +
              `&users[0][firstname]=${[primerNombre, segundoNombre].filter(Boolean).join(' ')}` +
              `&users[0][password]=${passwordSeguro}`
          )

          const moodleCreateData = await moodleCreateResponse.json()

          if (
            moodleCreateData &&
            moodleCreateData.length > 0 &&
            moodleCreateData[0].id
          ) {
            moodleUserId = moodleCreateData[0].id
          } else if (moodleCreateData && moodleCreateData.exception) {
            setAlertType('warning')
            setAlertMessage(
              `Estudiante creado pero no se pudo crear en Moodle: ${moodleCreateData.message || 'Error desconocido'}`
            )
            setIsAlertOpen(true)
            return
          } else {
            setAlertType('warning')
            setAlertMessage(
              'Estudiante creado pero hubo problemas al crear el usuario en Moodle'
            )
            setIsAlertOpen(true)
            return
          }
        }

        // 3. Vincular el moodleId con el backend
        if (moodleUserId) {
          const body = {
            backendId: responseData.id,
            moodleId: moodleUserId
          }

          const moodleUpdateResponse = await fetch(
            `${backendUrl}/estudiantes/moodle`,
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
              'Estudiante creado y vinculado con Moodle correctamente'
            )
          } else {
            setAlertType('warning')
            setAlertMessage(
              'Estudiante creado pero hubo problemas al vincular con Moodle'
            )
          }
        }
      } catch (moodleError) {
        setAlertType('warning')
        setAlertMessage(
          'Estudiante creado pero no se pudo procesar la integración con Moodle'
        )
      }

      setIsAlertOpen(true)
    } catch (error) {
      if (!isAlertOpen) {
        setAlertType('error')
        setAlertMessage('Error al crear el estudiante')
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
        <p className='text-center text-titulos'>creación de estudiante</p>
        <div className='w-[40px]'></div>
      </div>

      <Form className='w-full my-8 flex flex-col' onSubmit={onSubmit}>
        <p className='text-normal'>Información personal</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row mb-4'>
            <Input
              classNames={{
                label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-1/2 '
              }}
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
          <div className='w-full flex flex-row mb-4'>
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
          <div className='w-full flex flex-row'>
            <div className='w-1/2'>
              <DatePicker
                ref={fechaNacimientoRef}
                classNames={{
                  label: `w-2/6 h-[40px] flex items-center group-data-[has-helper=true]:pt-0 pl-2`,
                  base: 'flex items-start',
                  inputWrapper:
                    'border border-gris-institucional rounded-[15px] w-1/2 max-h-[40px]'
                }}
                className='w-3/4'
                label='Fecha de nacimiento'
                labelPlacement='outside-left'
                type='date'
                isRequired
                firstDayOfWeek='mon'
                showMonthAndYearPickers
                calendarProps={{
                  color: 'danger',
                  classNames: {
                    cellButton:
                      'data-[selected=true]:bg-rojo-institucional data-[selected=true]:data-[hover=true]:-bg-rojo-institucional '
                  }
                }}
                minValue={minDate}
                maxValue={maxDate}
                value={fechaNacimiento || undefined}
                onChange={(value) => setFechaNacimiento(value)}
                isInvalid={fechaNacimientoErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {fechaNacimientoErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              />
            </div>
          </div>
        </div>
        <p className='text-normal mt-8'>Identificación de usuario</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row'>
            <div className='w-1/2 flex flex-row'>
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
            </div>
            <div className='w-1/2 flex flex-row ml-2'>
              <Input
                classNames={{
                  label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                  base: 'flex items-start',
                  inputWrapper:
                    'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                  mainWrapper: 'w-[60%] '
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
              <Boton onClick={buscarEstudiante}>Buscar</Boton>
            </div>
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
        <p className='text-normal mt-8'>Información académica</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row'>
            <div className='w-1/2'>
              <Autocomplete
                ref={programaRef}
                variant='bordered'
                className='w-[90%]'
                defaultItems={programas}
                label='Programa académico'
                size='md'
                placeholder='Selecciona el programa académico'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(programa) => {
                  setPrograma(programa)
                }}
                isInvalid={programaErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {programaErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              >
                {(programa) => (
                  <AutocompleteItem key={programa.id}>
                    {programa.nombre}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </div>
          {pensums.length > 0 && cohortes.length > 0 && (
            <div className='w-full flex flex-row mt-4'>
              <div className='w-1/2'>
                <Autocomplete
                  ref={pensumRef}
                  variant='bordered'
                  className='w-[90%]'
                  defaultItems={pensums}
                  label='Pensum'
                  size='md'
                  placeholder='Selecciona el pensum'
                  labelPlacement='outside'
                  isRequired
                  onSelectionChange={(pensum) => {
                    setPensum(pensum)
                  }}
                  isInvalid={pensumErrors.length > 0}
                  errorMessage={() => (
                    <ul className='text-xs text-danger mt-1'>
                      {pensumErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  )}
                >
                  {(pensum) => (
                    <AutocompleteItem key={pensum.id}>
                      {pensum.nombre}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              <div className='w-1/2'>
                <Autocomplete
                  ref={cohorteRef}
                  variant='bordered'
                  className='w-[90%]'
                  defaultItems={cohortes}
                  label='Cohorte'
                  size='md'
                  placeholder='Selecciona el cohorte'
                  labelPlacement='outside'
                  isRequired
                  onSelectionChange={(cohorte) => {
                    setCohorte(cohorte)
                  }}
                  isInvalid={cohorteErrors.length > 0}
                  errorMessage={() => (
                    <ul className='text-xs text-danger mt-1'>
                      {cohorteErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  )}
                >
                  {(cohorte) => (
                    <AutocompleteItem key={cohorte.grupo.id}>
                      {cohorte.grupo.nombre}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
            </div>
          )}
          {programa !== '' && programa !== null && (
            <>
              {pensums.length === 0 && (
                <p className='text-rojo-oscuro mt-2'>
                  No hay pensum disponibles para este programa
                </p>
              )}
              {cohortes.length === 0 && (
                <p className='text-rojo-oscuro mt-2'>
                  No hay cohortes disponibles para este programa
                </p>
              )}
            </>
          )}
        </div>

        <div className='mt-4 w-full flex justify-end'>
          <Boton type={'submit'}>Crear estudiante</Boton>
        </div>
      </Form>

      {/* AlertaModal para notificaciones */}
      <AlertaModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        message={alertMessage}
        type={alertType}
        titulo={alertType === 'success' ? 'Operación exitosa' : 'Error'}
      />
    </div>
  )
}

export default CrearEstudiante
