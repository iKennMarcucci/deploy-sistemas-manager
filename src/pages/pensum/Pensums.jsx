import { useState, useEffect } from 'react'
import Tabla from '../../components/Tabla'
import Boton from '../../components/Boton'
import { Pencil } from 'lucide-react'
import Modal from '../../components/Modal'
import AlertaModal from '../../components/AlertaModal'
import { Form, Input, Autocomplete, AutocompleteItem } from '@heroui/react'

const Pensum = () => {
  const [pensums, setPensums] = useState([])
  const [programas, setProgramas] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoPensums, setCargandoPensums] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estados para el modal y formulario
  const [isOpen, setIsOpen] = useState(false)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [pensumId, setPensumId] = useState(null)
  const [nombrePensum, setNombrePensum] = useState('')
  const [programaId, setProgramaId] = useState('')
  const [cantidadSemestres, setCantidadSemestres] = useState('')

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTitulo, setAlertTitulo] = useState('')

  // Estado para el modal de confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Validaciones para nombre del pensum
  const nombrePensumErrors = []
  if (nombrePensum === '') {
    nombrePensumErrors.push('Este campo es obligatorio')
  }

  // Validaciones para programa académico
  const programaIdErrors = []
  if (programaId === '') {
    programaIdErrors.push('Este campo es obligatorio')
  }

  // Validaciones para cantidad de semestres
  const cantidadSemestresErrors = []
  if (cantidadSemestres === '') {
    cantidadSemestresErrors.push('Este campo es obligatorio')
  } else {
    const semestres = parseInt(cantidadSemestres)
    if (isNaN(semestres)) {
      cantidadSemestresErrors.push('Debe ser un número')
    } else if (semestres < 1 || semestres > 10) {
      cantidadSemestresErrors.push('Debe estar entre 1 y 10')
    }
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setCargandoPensums(true)
    try {
      // Cargar pensums
      const pensumResponse = await fetch(`${backendUrl}/pensums/listar`)
      const pensumData = await pensumResponse.json()
      setPensums(pensumData)

      // Cargar programas
      const programaResponse = await fetch(`${backendUrl}/programas/listar`)
      const programaData = await programaResponse.json()
      setProgramas(programaData)
    } catch (error) {
      // Reemplazar console.error por AlertaModal
      mostrarAlerta('Error al cargar los datos', 'error', 'Error de conexión')
    } finally {
      setCargandoPensums(false)
    }
  }

  const mostrarAlerta = (mensaje, tipo, titulo) => {
    setAlertMessage(mensaje)
    setAlertType(tipo)
    setAlertTitulo(
      titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error')
    )
    setIsAlertOpen(true)
  }

  useEffect(() => {
    if (pensums.length > 0 && programas.length > 0) {
      const pensumsConProgramas = pensums.map((pensum) => {
        const programa = programas.find(
          (programa) => programa.id === pensum.programaId
        )
        return {
          ...pensum,
          Id: pensum.id,
          Nombre: pensum.nombre,
          'Nombre del programa académico': programa
            ? programa.nombre
            : 'No disponible',
          'Cantidad de semestres':
            pensum.cantidadSemestres || 'No especificado', // Añadir a la tabla
          programaNombre: programa ? programa.nombre : 'No disponible'
        }
      })
      setInformacion(pensumsConProgramas)
    }
  }, [pensums, programas])

  // Preparar la edición de un pensum
  const prepararEdicion = (pensum) => {
    setNombrePensum(pensum.nombre)
    setProgramaId(pensum.programaId ? pensum.programaId.toString() : '')
    setCantidadSemestres(
      pensum.cantidadSemestres ? pensum.cantidadSemestres.toString() : ''
    ) // Cargar cantidad de semestres
    setPensumId(pensum.id)
    setModoEdicion(true)
    setIsOpen(true)
  }

  // Método para confirmar la creación de un pensum (verificación previa)
  const confirmarCreacionPensum = (e) => {
    e.preventDefault()

    // Validar campos antes de mostrar la confirmación
    if (
      nombrePensumErrors.length > 0 ||
      programaIdErrors.length > 0 ||
      cantidadSemestresErrors.length > 0
    ) {
      mostrarAlerta(
        'Por favor complete correctamente todos los campos',
        'error',
        'Error de validación'
      )
      return
    }

    // Mostrar el modal de confirmación
    setIsConfirmOpen(true)
  }

  // Método para crear pensum en el backend
  const crearPensumEnBackend = async (data) => {
    const response = await fetch(`${backendUrl}/pensums/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const result = await response.json()
      const errorMessage =
        result.mensaje || result.message || 'Error al crear el pensum'
      throw new Error(errorMessage)
    }

    return await response.json()
  }

  // Método para obtener los semestres de un programa
  const obtenerSemestresPrograma = async (programaId) => {
    const response = await fetch(
      `${backendUrl}/programas/${programaId}/semestres`
    )

    if (!response.ok) {
      throw new Error('Error al obtener los semestres del programa')
    }

    return await response.json()
  }

  // Método para crear una categoría de semestre en Moodle
  const crearCategoriaSemestreEnMoodle = async (semestre, programaData) => {
    const moodleUrl = import.meta.env.VITE_MOODLE_URL
    const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

    const response = await fetch(
      `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_categories&categories[0][name]=${semestre.nombre}&categories[0][parent]=${programaData.moodleId}&categories[0][description]=Semestre ${semestre.numero} del programa ${programaData.nombre}`
    )

    if (!response.ok) {
      throw new Error(
        `Error al crear la categoría para el semestre ${semestre.nombre}`
      )
    }

    const data = await response.json()
    if (!data || data.length === 0 || !data[0].id) {
      throw new Error('Respuesta de Moodle inválida')
    }

    return data[0].id
  }

  // Método para actualizar el moodleId de un semestre
  const actualizarMoodleIdSemestre = async (semestreId, moodleId) => {
    const response = await fetch(`${backendUrl}/pensums/semestre/moodle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        backendId: semestreId,
        moodleId: moodleId.toString()
      })
    })

    if (!response.ok) {
      throw new Error(`Error al actualizar moodleId del semestre ${semestreId}`)
    }

    return await response.json()
  }

  // Método para procesar los semestres de un programa
  const procesarSemestresPrograma = async (programaId) => {
    try {
      const programaData = await obtenerSemestresPrograma(programaId)

      if (!programaData.moodleId) {
        console.warn('El programa no tiene un moodleId asociado')
        return false
      }

      // Filtrar semestres sin moodleId y ordenarlos por número de semestre (ascendente)
      const semestresParaProcesar = programaData.semestres
        .filter((semestre) => semestre.moodleId === null)
        .sort((a, b) => a.numero - b.numero) // Ordenar por número de semestre

      // Procesar secuencialmente cada semestre
      let todosProcesadosCorrectamente = true

      // Usar un bucle for...of para manejar las promesas de manera secuencial
      for (const semestre of semestresParaProcesar) {
        try {
          // Paso 1: Crear la categoría en Moodle
          const moodleId = await crearCategoriaSemestreEnMoodle(
            semestre,
            programaData
          )

          // Paso 2: Actualizar el ID en el backend
          await actualizarMoodleIdSemestre(semestre.id, moodleId)
        } catch (error) {
          console.error(
            `Error procesando semestre ${semestre.nombre} (${semestre.numero}):`,
            error
          )
          todosProcesadosCorrectamente = false
          // Continuamos con el siguiente semestre a pesar del error
        }
      }

      return todosProcesadosCorrectamente
    } catch (error) {
      console.error('Error procesando semestres:', error)
      return false
    }
  }

  // Método para crear un pensum nuevo (refactorizado)
  const crearPensum = async () => {
    const data = {
      nombre: nombrePensum,
      programaId: parseInt(programaId),
      cantidadSemestres: parseInt(cantidadSemestres)
    }

    try {
      // 1. Crear el pensum en el backend
      const resultadoPensum = await crearPensumEnBackend(data)

      // 2. Procesar los semestres del programa
      await procesarSemestresPrograma(data.programaId)

      // 3. Finalizar el proceso (independientemente del resultado de procesar los semestres)
      limpiarFormulario()
      setIsOpen(false)
      setIsConfirmOpen(false)

      const successMessage = `Pensum "${resultadoPensum.nombre}" creado correctamente`
      mostrarAlerta(successMessage, 'success', 'Pensum creado')
      cargarDatos()
    } catch (error) {
      console.error('Error en la creación del pensum:', error)
      mostrarAlerta(
        error.message || 'Error al procesar la solicitud',
        'error',
        'Error del servidor'
      )
    }
  }

  // Método para actualizar un pensum existente
  const actualizarPensum = async (e) => {
    e.preventDefault()

    // Validar campos antes de enviar
    if (
      nombrePensumErrors.length > 0 ||
      programaIdErrors.length > 0 ||
      cantidadSemestresErrors.length > 0
    ) {
      mostrarAlerta(
        'Por favor complete correctamente todos los campos',
        'error',
        'Error de validación'
      )
      return
    }

    const data = {
      id: pensumId,
      nombre: nombrePensum,
      programaId: parseInt(programaId),
      cantidadSemestres: parseInt(cantidadSemestres)
    }

    try {
      const response = await fetch(`${backendUrl}/pensums/${pensumId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        // Extraer el mensaje de error del backend
        const errorMessage =
          result.mensaje || result.message || 'Error al actualizar el pensum'
        mostrarAlerta(errorMessage, 'error', 'Error al actualizar')
      } else {
        limpiarFormulario()
        setIsOpen(false)

        const successMessage =
          result.mensaje || result.message || 'Pensum actualizado correctamente'
        mostrarAlerta(successMessage, 'success', 'Pensum actualizado')
        cargarDatos()
      }
    } catch (error) {
      mostrarAlerta(
        'Error al procesar la solicitud',
        'error',
        'Error del servidor'
      )
    }
  }

  const limpiarFormulario = () => {
    setNombrePensum('')
    setProgramaId('')
    setCantidadSemestres('')
    setPensumId(null)
    setModoEdicion(false)
  }

  const columnas = [
    'Id',
    'Nombre',
    'Nombre del programa académico',
    'Cantidad de semestres'
  ]
  const filtros = ['Nombre', 'Nombre del programa académico']

  const acciones = [
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (pensum) => {
        prepararEdicion(pensum)
      }
    }
  ]

  return (
    <div className='w-full p-4 flex flex-col items-center justify-center'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>Lista de pénsums</p>
        <Boton
          onClick={() => {
            limpiarFormulario()
            setIsOpen(true)
          }}
        >
          Crear pensum
        </Boton>
      </div>
      <div className='w-full my-8'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          filtros={filtros}
          acciones={acciones}
          elementosPorPagina={10}
          cargandoContenido={cargandoPensums}
        />
      </div>

      {/* Modal para crear/editar pensum */}
      <Modal
        size='xl'
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            limpiarFormulario()
          }
        }}
        cabecera={modoEdicion ? 'Editar Pensum' : 'Crear Pensum'}
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={modoEdicion ? actualizarPensum : confirmarCreacionPensum}
          >
            <Input
              classNames={{
                label: ` h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-full '
              }}
              className='py-4'
              isRequired
              label='Nombre'
              labelPlacement='outside'
              name='nombre'
              placeholder='Ingresa el nombre del pensum'
              type='text'
              value={nombrePensum}
              onValueChange={(value) => setNombrePensum(value)}
              isInvalid={nombrePensumErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {nombrePensumErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={programas}
                selectedKey={programaId}
                isReadOnly={modoEdicion}
                label='Programa académico'
                size='md'
                placeholder='Selecciona el programa académico'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(id) => {
                  setProgramaId(id || '')
                }}
                isInvalid={programaIdErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {programaIdErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              >
                {(programa) => (
                  <AutocompleteItem key={programa.id.toString()}>
                    {programa.nombre}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <Input
              classNames={{
                label: ` h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                base: 'flex items-start',
                inputWrapper:
                  'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                mainWrapper: 'w-full '
              }}
              className='py-4'
              isRequired
              label='Cantidad de semestres'
              labelPlacement='outside'
              name='cantidadSemestres'
              placeholder='Ingresa la cantidad de semestres (1-10)'
              type='number'
              readOnly={modoEdicion}
              min={1}
              max={10}
              value={cantidadSemestres}
              onValueChange={(value) => {
                // Validar que el valor sea un número entre 1 y 10
                const numValue = parseInt(value)
                if (value === '') {
                  setCantidadSemestres('')
                } else if (!isNaN(numValue)) {
                  if (numValue >= 1 && numValue <= 10) {
                    setCantidadSemestres(numValue.toString())
                  }
                }
              }}
              isInvalid={cantidadSemestresErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {cantidadSemestresErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
              description='El número debe estar entre 1 y 10'
            />

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'}>
                {modoEdicion ? 'Guardar cambios' : 'Crear pensum'}
              </Boton>
            </div>
          </Form>
        }
      />

      {/* Modal de confirmación para la cantidad de semestres */}
      <Modal
        size='md'
        isOpen={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open)
        }}
        cabecera='Confirmar creación de pensum'
        cuerpo={
          <div className='flex flex-col'>
            <p>
              ¿Está seguro de crear el pensum con{' '}
              <strong>{cantidadSemestres} semestres</strong>?
            </p>
            <p className='text-danger font-bold'>
              Advertencia: Una vez creado, la cantidad de semestres NO podrá ser
              modificada.
            </p>
            <div className='flex justify-end space-x-3 mt-4 mb-[-20px]'>
              <Boton
                onClick={() => {
                  crearPensum()
                }}
              >
                Confirmar
              </Boton>
            </div>
          </div>
        }
      />

      {/* AlertaModal para notificaciones */}
      <AlertaModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
        type={alertType}
        titulo={alertTitulo}
      />
    </div>
  )
}

export default Pensum
