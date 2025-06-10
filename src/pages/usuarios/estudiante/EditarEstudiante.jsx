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
import { useParams } from 'react-router-dom'
import AlertaModal from '../../../components/AlertaModal'
import { useNavigate } from 'react-router-dom'

const EditarEstudiante = () => {
  const { id } = useParams()
  const [estudiante, setEstudiante] = useState({})

  // Referencias para los autocomplete y datepicker
  const programaRef = useRef(null)
  const pensumRef = useRef(null)
  const cohorteRef = useRef(null)
  const fechaNacimientoRef = useRef(null)

  const [programas, setProgramas] = useState([])
  const [pensums, setPensums] = useState([])
  const [cohortes, setCohortes] = useState([])
  const [programa, setPrograma] = useState('')

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
  const Navigate = useNavigate()

  const minDate = today(getLocalTimeZone()).subtract({ years: 125 }) // 125 años atrás
  const maxDate = today(getLocalTimeZone()).subtract({ years: 14 }) // 14 años atrás

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
    fetch(`${backendUrl}/estudiantes/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEstudiante(data)
      })

    fetch(`${backendUrl}/programas/listar`)
      .then((response) => response.json())
      .then((data) => {
        setProgramas(data)
      })
  }, [])

  useEffect(() => {
    if (estudiante) {
      setPrimerNombre(estudiante.nombre || '')
      setSegundoNombre(estudiante.nombre2 || '')
      setPrimerApellido(estudiante.apellido || '')
      setSegundoApellido(estudiante.apellido2 || '')

      // Manejo cuidadoso de la fecha
      if (estudiante.fechaNacimiento) {
        try {
          const fecha = parseDate(estudiante.fechaNacimiento.split('T')[0])
          setFechaNacimiento(fecha)
        } catch (e) {
          console.error('Error al parsear fecha:', e)
          setFechaNacimiento(null) // null en lugar de undefined
        }
      } else {
        setFechaNacimiento(null) // null en lugar de undefined
      }

      setCodigo(estudiante.codigo || '')
      setCedula(estudiante.cedula || '')
      setCorreo(estudiante.email || '')
      setTelefono(estudiante.telefono || '')
      setPrograma(estudiante.programaId ? estudiante.programaId.toString() : '')
      setPensum(estudiante.pensumId ? estudiante.pensumId.toString() : '')
      setCohorte(estudiante.cohorteId ? estudiante.cohorteId.toString() : '')
    }
  }, [estudiante])

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

  const onSubmit = async (e) => {
    e.preventDefault()

    // Validar todos los campos antes de enviar
    if (
      primerNombreErrors.length > 0 ||
      primerApellidoErrors.length > 0 ||
      fechaNacimientoErrors.length > 0 ||
      cedulaErrors.length > 0 ||
      codigoErrors.length > 0 ||
      correoErrors.length > 0 ||
      telefonoErrors.length > 0 ||
      programaErrors.length > 0 ||
      pensumErrors.length > 0 ||
      cohorteErrors.length > 0 ||
      (segundoNombre && segundoNombreErrors.length > 0) ||
      (segundoApellido && segundoApellidoErrors.length > 0)
    ) {
      setAlertType('error')
      setAlertMessage('Por favor, corrija los errores del formulario')
      setIsAlertOpen(true)
      return
    }

    editarEstudiante()
  }

  const actualizarEstudianteMoodle = async (
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
      if (!response.ok) {
        console.error('Error al actualizar el estudiante en Moodle')
      }
    })
  }

  const editarEstudiante = async () => {
    const formattedFechaNacimiento = fechaNacimiento
      ? fechaNacimiento
          .toDate(getLocalTimeZone()) // Convertir a Date nativo
          .toISOString() // Convertir a formato ISO
          .split('T')[0] // Extraer solo la parte de la fecha (aaaa-mm-dd)
      : null

    const data = {
      codigo,
      nombre: primerNombre,
      nombre2: segundoNombre,
      apellido: primerApellido,
      apellido2: segundoApellido,
      email: correo,
      telefono,
      fechaNacimiento: formattedFechaNacimiento,
      fechaIngreso: estudiante.fechaIngreso,
      pensumId: pensum,
      cohorteId: cohorte,
      estadoEstudianteId: 1,
      cedula,
      moodleId: estudiante.moodleId
    }

    try {
      const response = await fetch(`${backendUrl}/estudiantes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        actualizarEstudianteMoodle(
          estudiante.moodleId,
          primerNombre,
          correo,
          primerApellido,
          segundoNombre,
          segundoApellido
        )
        setAlertType('success')
        setAlertMessage('Estudiante actualizado correctamente')
        setIsAlertOpen(true)
      } else {
        const errorData = await response.json()
        setAlertType('error')
        setAlertMessage(
          errorData.message || 'Error al actualizar el estudiante'
        )
        setIsAlertOpen(true)
      }
    } catch (error) {
      console.error('Error:', error)
      setAlertType('error')
      setAlertMessage('Error al actualizar el estudiante')
      setIsAlertOpen(true)
    }
  }

  // Función para manejar el cierre del modal con lógica condicional
  const handleModalClose = () => {
    setIsAlertOpen(false)
    // Solo redirigir a la vista de estudiantes si fue exitoso
    if (alertType === 'success') {
      Navigate('/estudiantes')
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
          Editar información del estudiante
        </p>
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
              value={segundoNombre || ''}
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
              value={segundoApellido || ''}
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
                value={fechaNacimiento}
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
        <p className='text-normal mt-8'>Información académica</p>
        <Divider className='mb-4' />
        <div className='w-full flex flex-col'>
          <div className='w-full flex flex-row'>
            <div className='w-1/2'>
              <Autocomplete
                ref={programaRef}
                variant='bordered'
                className='w-[90%]'
                items={programas}
                selectedKey={programa + ''} // Convertir a string
                label='Programa académico'
                size='md'
                placeholder='Selecciona el programa académico'
                labelPlacement='outside'
                isRequired
                isDisabled
                onSelectionChange={(programaId) => {
                  setPrograma(programaId)
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
                  <AutocompleteItem key={programa.id + ''}>
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
                  items={pensums}
                  selectedKey={pensum + ''} // Usar selectedKey en lugar de inputValue
                  label='Pensum'
                  size='md'
                  placeholder='Selecciona el pensum'
                  labelPlacement='outside'
                  isRequired
                  onSelectionChange={(pensumId) => {
                    setPensum(pensumId)
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
                    <AutocompleteItem key={pensum.id + ''}>
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
                  selectedKey={cohorte + ''}
                  label='Cohorte'
                  size='md'
                  placeholder='Selecciona el cohorte'
                  labelPlacement='outside'
                  isRequired
                  onSelectionChange={(cohorteId) => {
                    setCohorte(cohorteId || '')
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
                    <AutocompleteItem key={cohorte.grupo.id + ''}>
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
          <Boton type={'submit'}>Editar información</Boton>
        </div>
      </Form>

      <AlertaModal
        isOpen={isAlertOpen}
        onClose={handleModalClose}
        message={alertMessage}
        type={alertType}
        titulo={alertType === 'success' ? 'Operación exitosa' : 'Error'}
      />
    </div>
  )
}

export default EditarEstudiante
