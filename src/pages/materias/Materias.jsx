import { useEffect, useState } from 'react'
import Tabla from '../../components/Tabla'
import Boton from '../../components/Boton'
import { Eye, Pencil } from 'lucide-react'
import Modal from '../../components/Modal'
import { Form, Input, Autocomplete, AutocompleteItem } from '@heroui/react'
import AlertaModal from '../../components/AlertaModal'

const Materias = () => {
  const [materias, setMaterias] = useState([])
  const [pensums, setPensums] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoMaterias, setCargandoMaterias] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

  // Estados para el modal de creación/edición
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [materiaId, setMateriaId] = useState(null)
  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [creditos, setCreditos] = useState('')
  const [semestre, setSemestre] = useState('')
  const [pensumId, setPensumId] = useState('')
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null)
  const [moodleId, setMoodleId] = useState('')

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')

  // Nuevo estado para almacenar la cantidad de semestres del pensum seleccionado
  const [maxSemestres, setMaxSemestres] = useState(0)

  // Validaciones para campos obligatorios
  const codigoErrors = []
  if (codigo === '') {
    codigoErrors.push('Este campo es obligatorio')
  }

  const nombreErrors = []
  if (nombre === '') {
    nombreErrors.push('Este campo es obligatorio')
  }

  // Validación para créditos: solo números entre 1 y 10
  const creditosErrors = []
  if (creditos === '') {
    creditosErrors.push('Este campo es obligatorio')
  } else if (!/^\d+$/.test(creditos)) {
    creditosErrors.push('Solo se permiten números')
  } else {
    const creditosNum = parseInt(creditos)
    if (creditosNum < 1 || creditosNum > 10) {
      creditosErrors.push('El valor debe estar entre 1 y 10')
    }
  }

  // Validación para semestre: número entre 1 y el máximo de semestres del pensum
  const semestreErrors = []
  if (semestre === '') {
    semestreErrors.push('Este campo es obligatorio')
  } else if (!/^\d+$/.test(semestre)) {
    semestreErrors.push('Solo se permiten números')
  } else {
    const semestreNum = parseInt(semestre)
    if (semestreNum < 1 || semestreNum > maxSemestres) {
      semestreErrors.push(`El valor debe estar entre 1 y ${maxSemestres}`)
    }
  }

  // Validación para pensumId
  const pensumIdErrors = []
  if (pensumId === '') {
    pensumIdErrors.push('Este campo es obligatorio')
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargandoMaterias(true)
    try {
      // Cargar materias
      const materiasResponse = await fetch(`${backendUrl}/materias/listar`)
      const materiasData = await materiasResponse.json()
      setMaterias(materiasData)

      // Cargar pensums
      const pensumsResponse = await fetch(`${backendUrl}/pensums/listar`)
      const pensumsData = await pensumsResponse.json()
      setPensums(pensumsData)
    } catch (error) {
      console.error('Error al cargar datos:', error)
    } finally {
      setCargandoMaterias(false)
    }
  }

  useEffect(() => {
    if (materias.length > 0 && pensums.length > 0) {
      const materiasConPensums = materias.map((materia) => {
        const pensum = pensums.find((pensum) => pensum.id === materia.pensumId)
        return {
          id: materia.id,
          Código: materia.codigo,
          Nombre: materia.nombre,
          Pensum: pensum ? pensum.nombre : 'No disponible',
          Créditos: materia.creditos,
          Semestre: materia.semestre,
          pensumId: pensum ? pensum.id : null,
          pensumNombre: pensum ? pensum.nombre : 'No disponible',
          moodleId: materia.moodleId
        }
      })
      setInformacion(materiasConPensums)
    }
  }, [materias, pensums])

  // Preparar la edición de una materia
  const prepararEdicion = (materia) => {
    setCodigo(materia.Código)
    setNombre(materia.Nombre)
    setCreditos(materia.Créditos?.toString() || '')
    setSemestre(materia.Semestre?.toString() || '')
    setPensumId(materia.pensumId?.toString() || '')
    setMateriaId(materia.id)
    setModoEdicion(true)
    setIsOpenForm(true)

    // Obtener el moodleId directamente o a través de una llamada API si no está disponible
    if (materia.moodleId !== undefined) {
      setMoodleId(materia.moodleId.toString())
    } else {
      // Si no está disponible en el objeto, lo obtenemos del API
      obtenerMoodleIdMateria(materia.id)
        .then((moodleId) => {
          if (moodleId) {
            setMoodleId(moodleId.toString())
          } else {
            setMoodleId('')
          }
        })
        .catch((error) => {
          console.error('Error al obtener moodleId:', error)
          setMoodleId('')
        })
    }

    // Buscar y establecer el máximo de semestres del pensum
    if (materia.pensumId) {
      const pensumSeleccionado = pensums.find((p) => p.id === materia.pensumId)
      if (pensumSeleccionado && pensumSeleccionado.cantidadSemestres) {
        setMaxSemestres(pensumSeleccionado.cantidadSemestres)
      }
    }
  }

  // Función para obtener los semestres de un programa
  const obtenerSemestresPrograma = async (programaId) => {
    try {
      const response = await fetch(
        `${backendUrl}/programas/${programaId}/semestres`
      )
      if (!response.ok) {
        throw new Error('Error al obtener los semestres del programa')
      }
      return await response.json()
    } catch (error) {
      console.error('Error al obtener semestres:', error)
      throw error
    }
  }

  // Función para crear la categoría de la materia en Moodle
  const crearCategoriaMateriaEnMoodle = async (nombre, parentId, codigo) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_categories&categories[0][name]=${nombre}&categories[0][parent]=${parentId}&categories[0][idnumber]=${codigo}&categories[0][description]=Materia: ${nombre} (${codigo})`
      )

      if (!response.ok) {
        throw new Error('Error al crear categoría en Moodle')
      }

      const data = await response.json()
      if (!data || data.length === 0 || !data[0].id) {
        throw new Error('Respuesta de Moodle inválida')
      }

      return data[0].id
    } catch (error) {
      console.error('Error creando categoría en Moodle:', error)
      throw error
    }
  }

  // Función para actualizar el moodleId de la materia en el backend
  const actualizarMoodleIdMateria = async (materiaId, moodleId) => {
    try {
      // Verificación de parámetros
      if (!materiaId || !moodleId) {
        console.error('Error: materiaId o moodleId no proporcionados', {
          materiaId,
          moodleId
        })
        throw new Error(
          `Faltan parámetros obligatorios: materiaId=${materiaId}, moodleId=${moodleId}`
        )
      }

      // Crear el objeto para el cuerpo de la solicitud
      const requestBody = {
        backendId: materiaId,
        moodleId: moodleId.toString()
      }

      const response = await fetch(`${backendUrl}/materias/moodle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Respuesta de error del servidor:', errorText)
        throw new Error(
          `Error al actualizar moodleId en la materia: ${response.status} ${response.statusText}`
        )
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error actualizando moodleId:', error)
      throw error
    }
  }

  // Nueva función para obtener el moodleId de una materia
  const obtenerMoodleIdMateria = async (materiaId) => {
    try {
      const response = await fetch(`${backendUrl}/materias/${materiaId}`)
      if (!response.ok) {
        throw new Error('Error al obtener datos de la materia')
      }
      const materiaData = await response.json()
      return materiaData.moodleId
    } catch (error) {
      console.error('Error obteniendo moodleId de materia:', error)
      throw error
    }
  }

  // Nueva función para actualizar una categoría de materia en Moodle
  const actualizarCategoriaMateriaEnMoodle = async (
    moodleId,
    nombre,
    parentId,
    codigo
  ) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_update_categories&categories[0][id]=${moodleId}&categories[0][name]=${nombre}&categories[0][parent]=${parentId}&categories[0][idnumber]=${codigo}&categories[0][description]=Materia: ${nombre} (${codigo})`
      )

      if (!response.ok) {
        throw new Error('Error al actualizar categoría en Moodle')
      }

      // Simulamos una respuesta exitosa
      // return true
    } catch (error) {
      console.error('Error en actualizarCategoriaMateriaEnMoodle:', error)
      throw error
    }
  }

  // Método para crear una materia nueva (modificado para incluir Moodle)
  const crearMateria = async (e) => {
    e.preventDefault()

    const data = {
      codigo: codigo,
      nombre: nombre,
      creditos: parseInt(creditos),
      semestre: semestre,
      pensumId: parseInt(pensumId)
    }

    try {
      // 1. Crear la materia en el backend
      const response = await fetch(`${backendUrl}/materias/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const result = await response.json()
        setAlertType('error')
        setAlertMessage(result.message)
        setIsAlertOpen(true)
        return
      }

      const materiaCreada = await response.json()

      // Verificar que materiaCreada tenga un ID y mostrar su estructura
      const backendId =
        materiaCreada.id || materiaCreada.backendId || materiaCreada._id

      if (!backendId) {
        console.error(
          'No se pudo obtener el ID de la materia creada:',
          materiaCreada
        )
        throw new Error(
          'La respuesta del servidor no incluyó un ID válido para la materia'
        )
      }

      try {
        // 2. Obtener el programa asociado al pensum
        const pensumSeleccionado = pensums.find(
          (p) => p.id.toString() === pensumId
        )

        if (!pensumSeleccionado) {
          throw new Error('Pensum no encontrado')
        }

        // 3. Obtener los semestres del programa
        const programaData = await obtenerSemestresPrograma(
          pensumSeleccionado.programaId
        )

        // 4. Buscar el semestre correspondiente al número de semestre de la materia
        const semestreSeleccionado = programaData.semestres.find(
          (s) => s.numero === parseInt(semestre)
        )

        if (!semestreSeleccionado) {
          throw new Error(`Semestre ${semestre} no encontrado en el programa`)
        }

        if (!semestreSeleccionado.moodleId) {
          throw new Error(
            `El semestre ${semestre} no tiene un ID de Moodle asociado`
          )
        }

        // 5. Crear la categoría de la materia en Moodle
        const moodleId = await crearCategoriaMateriaEnMoodle(
          nombre,
          semestreSeleccionado.moodleId,
          codigo
        )

        // 6. Actualizar el moodleId de la materia en el backend usando el ID correcto
        await actualizarMoodleIdMateria(backendId, moodleId)
      } catch (moodleError) {
        console.error('Error en el proceso de Moodle:', moodleError)
        // No interrumpimos el flujo, solo registramos el error
      }

      // Continuar con el flujo normal
      limpiarFormulario()
      setIsOpenForm(false)
      setAlertType('success')
      setAlertMessage('Materia creada correctamente')
      setIsAlertOpen(true)
      cargarDatos() // Actualizar datos
    } catch (error) {
      console.error('Error:', error)
      setAlertType('error')
      setAlertMessage('Error al procesar la solicitud')
      setIsAlertOpen(true)
    }
  }

  // Método para actualizar una materia existente (modificado para incluir Moodle)
  const actualizarMateria = async (e) => {
    e.preventDefault()

    const data = {
      codigo: codigo,
      nombre: nombre,
      creditos: parseInt(creditos),
      semestre: semestre,
      pensumId: parseInt(pensumId)
    }

    // Añadir moodleId al objeto data solo si existe
    if (moodleId) {
      data.moodleId = moodleId
    }

    try {
      // 1. Actualizar la materia en el backend
      const response = await fetch(`${backendUrl}/materias/${materiaId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const result = await response.json()
        setAlertType('error')
        setAlertMessage(result.message)
        setIsAlertOpen(true)
        return
      }

      try {
        // 2. Obtener el moodleId de la materia
        const materiaMoodleId = await obtenerMoodleIdMateria(materiaId)

        if (!materiaMoodleId) {
          console.warn(
            'La materia no tiene un moodleId, no se puede actualizar en Moodle'
          )
        } else {
          // 3. Obtener el programa asociado al pensum
          const pensumSeleccionado = pensums.find(
            (p) => p.id === parseInt(pensumId)
          )

          if (!pensumSeleccionado) {
            throw new Error('Pensum no encontrado')
          }

          // 4. Obtener los semestres del programa
          const programaData = await obtenerSemestresPrograma(
            pensumSeleccionado.programaId
          )

          // 5. Buscar el semestre correspondiente al número de semestre de la materia
          const semestreSeleccionado = programaData.semestres.find(
            (s) => s.numero === parseInt(semestre)
          )

          if (!semestreSeleccionado) {
            throw new Error(`Semestre ${semestre} no encontrado en el programa`)
          }

          if (!semestreSeleccionado.moodleId) {
            throw new Error(
              `El semestre ${semestre} no tiene un ID de Moodle asociado`
            )
          }

          // 6. Actualizar la categoría de la materia en Moodle, cambiando el parent si es necesario
          await actualizarCategoriaMateriaEnMoodle(
            materiaMoodleId,
            nombre,
            semestreSeleccionado.moodleId,
            codigo
          )
        }
      } catch (moodleError) {
        console.error(
          'Error en el proceso de actualización en Moodle:',
          moodleError
        )
        // No interrumpimos el flujo, solo registramos el error
      }

      // Continuar con el flujo normal
      limpiarFormulario()
      setIsOpenForm(false)
      setAlertType('success')
      setAlertMessage('Materia actualizada correctamente')
      setIsAlertOpen(true)
      cargarDatos() // Actualizar datos
    } catch (error) {
      console.error('Error:', error)
      setAlertType('error')
      setAlertMessage('Error al procesar la solicitud')
      setIsAlertOpen(true)
    }
  }

  // Limpiar el formulario
  const limpiarFormulario = () => {
    setCodigo('')
    setNombre('')
    setCreditos('')
    setSemestre('')
    setPensumId('')
    setMateriaId(null)
    setModoEdicion(false)
    setMaxSemestres(0)
  }

  // Ver detalle de la materia
  const verMateria = (materia) => {
    setMateriaSeleccionada(materia)
    setIsOpenView(true)
  }

  // Modificar la función que maneja el cambio del pensum
  const handlePensumChange = (id) => {
    setPensumId(id || '')

    // Si se seleccionó un pensum, buscar su cantidad de semestres
    if (id) {
      const pensumSeleccionado = pensums.find((p) => p.id.toString() === id)
      if (pensumSeleccionado && pensumSeleccionado.cantidadSemestres) {
        setMaxSemestres(pensumSeleccionado.cantidadSemestres)

        // Si el semestre actual excede el máximo, resetearlo
        if (
          semestre !== '' &&
          parseInt(semestre) > pensumSeleccionado.cantidadSemestres
        ) {
          setSemestre('')
        }
      } else {
        setMaxSemestres(0)
      }
    } else {
      setMaxSemestres(0)
    }
  }

  const columnas = ['Código', 'Nombre', 'Pensum', 'Créditos', 'Semestre']
  const filtros = ['Código', 'Nombre', 'Pensum']
  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: (materia) => verMateria(materia)
    },
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (materia) => prepararEdicion(materia)
    }
  ]

  return (
    <div className='flex flex-col items-center justify-center p-4 w-full'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>Lista de materias</p>
        <Boton
          onClick={() => {
            limpiarFormulario()
            setIsOpenForm(true)
          }}
        >
          Crear materia
        </Boton>
      </div>
      <div className='w-full my-8'>
        <Tabla
          columnas={columnas}
          informacion={informacion}
          acciones={acciones}
          filtros={filtros}
          elementosPorPagina={10}
          cargandoContenido={cargandoMaterias}
        />
      </div>

      {/* Modal para crear/editar materia */}
      <Modal
        size='xl'
        isOpen={isOpenForm}
        onOpenChange={(open) => {
          setIsOpenForm(open)
          if (!open) {
            limpiarFormulario()
          }
        }}
        cabecera={modoEdicion ? 'Editar Materia' : 'Crear Materia'}
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={modoEdicion ? actualizarMateria : crearMateria}
          >
            <Input
              classNames={{
                label: `h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-full'
              }}
              className='py-4'
              isRequired
              label='Código'
              labelPlacement='outside'
              name='codigo'
              placeholder='Ingresa el código de la materia'
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

            <Input
              classNames={{
                label: `h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-full'
              }}
              className='py-4'
              isRequired
              label='Nombre'
              labelPlacement='outside'
              name='nombre'
              placeholder='Ingresa el nombre de la materia'
              type='text'
              value={nombre}
              onValueChange={(value) => setNombre(value)}
              isInvalid={nombreErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {nombreErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={pensums}
                selectedKey={pensumId}
                label='Pensum'
                size='md'
                placeholder='Selecciona el pensum'
                labelPlacement='outside'
                isRequired
                isDisabled={modoEdicion}
                onSelectionChange={(id) => handlePensumChange(id)}
                isInvalid={pensumIdErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {pensumIdErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              >
                {(pensum) => (
                  <AutocompleteItem key={pensum.id.toString()}>
                    {pensum.nombre}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='flex w-full flex-row gap-4'>
              <div className='w-1/2'>
                <Input
                  classNames={{
                    label: `h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-full'
                  }}
                  className='py-4'
                  isRequired
                  label='Créditos'
                  labelPlacement='outside'
                  name='creditos'
                  placeholder='Ingresa los créditos'
                  type='text'
                  value={creditos}
                  onValueChange={(value) => setCreditos(value)}
                  isInvalid={creditosErrors.length > 0}
                  errorMessage={() => (
                    <ul className='text-xs text-danger mt-1'>
                      {creditosErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  )}
                />
              </div>

              <div className='w-1/2'>
                <Input
                  classNames={{
                    label: `h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-full'
                  }}
                  className='py-4'
                  isRequired
                  label='Semestre'
                  labelPlacement='outside'
                  name='semestre'
                  placeholder={
                    maxSemestres
                      ? `Ingresa el semestre (1-${maxSemestres})`
                      : 'Selecciona un pensum primero'
                  }
                  type='number'
                  min={1}
                  max={maxSemestres || undefined}
                  disabled={maxSemestres === 0}
                  value={semestre}
                  onValueChange={(value) => {
                    // Validar que el valor sea un número dentro del rango permitido
                    if (value === '') {
                      setSemestre('')
                    } else {
                      const numValue = parseInt(value)
                      if (!isNaN(numValue)) {
                        if (numValue >= 1 && numValue <= maxSemestres) {
                          setSemestre(numValue.toString())
                        }
                      }
                    }
                  }}
                  isInvalid={semestreErrors.length > 0}
                  errorMessage={() => (
                    <ul className='text-xs text-danger mt-1'>
                      {semestreErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  )}
                  description={
                    maxSemestres
                      ? `Debe ser un número entre 1 y ${maxSemestres}`
                      : 'Selecciona un pensum primero'
                  }
                />
              </div>
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'}>
                {modoEdicion ? 'Guardar cambios' : 'Crear materia'}
              </Boton>
            </div>
          </Form>
        }
      />

      {/* Modal para ver detalles de la materia */}
      <Modal
        size='5xl'
        isOpen={isOpenView}
        onOpenChange={(open) => {
          setIsOpenView(open)
          if (!open) {
            setMateriaSeleccionada(null)
          }
        }}
        cabecera='Detalles de la materia'
        cuerpo={
          materiaSeleccionada && (
            <div className='w-full flex flex-col'>
              <div className='w-full flex flex-row mb-4'>
                <Input
                  classNames={{
                    label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Código'
                  labelPlacement='outside-left'
                  name='codigo'
                  type='text'
                  readOnly
                  value={materiaSeleccionada.Código || ''}
                />
                <Input
                  classNames={{
                    label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Nombre'
                  labelPlacement='outside-left'
                  name='nombre'
                  type='text'
                  readOnly
                  value={materiaSeleccionada.Nombre || ''}
                />
              </div>

              <div className='w-full flex flex-row mb-4'>
                <Input
                  classNames={{
                    label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Créditos'
                  labelPlacement='outside-left'
                  name='creditos'
                  type='text'
                  readOnly
                  value={materiaSeleccionada.Créditos?.toString() || ''}
                />
                <Input
                  classNames={{
                    label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Semestre'
                  labelPlacement='outside-left'
                  name='semestre'
                  type='text'
                  readOnly
                  value={materiaSeleccionada.Semestre?.toString() || ''}
                />
              </div>

              <div className='w-full flex flex-row'>
                <Input
                  classNames={{
                    label: `w-1/5 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Pensum'
                  labelPlacement='outside-left'
                  name='pensum'
                  type='text'
                  readOnly
                  value={materiaSeleccionada.pensumNombre || ''}
                />
                <div className='w-1/2'></div>
              </div>
            </div>
          )
        }
      />

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

export default Materias
