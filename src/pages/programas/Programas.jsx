import { useState, useEffect } from 'react'
import Tabla from '../../components/Tabla'
import { Pencil } from 'lucide-react'
import Modal from '../../components/Modal'
import Boton from '../../components/Boton'
import AlertaModal from '../../components/AlertaModal'
import {
  Form,
  Input,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Button
} from '@heroui/react'

const Programas = () => {
  const [programasPosgrado, setProgramasPosgrado] = useState([])
  const [programasPregrado, setProgramasPregrado] = useState([])
  const [tiposPrograma, setTiposPrograma] = useState([])
  const [cargandoProgramas, setCargandoProgramas] = useState(true)
  const [modoEdicion, setModoEdicion] = useState(false)
  const [programaId, setProgramaId] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [programa, setPrograma] = useState('')
  const [posgrado, setPosgrado] = useState(true)
  const [moodleId, setMoodleId] = useState('')
  const [historicoMoodleId, setHistoricoMoodleId] = useState('')
  const [semestreActual, setSemestreActual] = useState('')
  const [nivelAcademico, setNivelAcademico] = useState('Posgrado')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState(null)

  // Validaciones para código
  const codigoErrors = []
  if (codigo === '') {
    codigoErrors.push('Este campo es obligatorio')
  }

  if (codigo && !/^\d+$/.test(codigo)) {
    codigoErrors.push('Solo puede contener números')
  }
  if (codigo && codigo.length < 3) {
    codigoErrors.push('El código debe tener al menos 3 caracteres')
  }

  // Validaciones para programa (nombre)
  const programaErrors = []
  if (programa === '') {
    programaErrors.push('Este campo es obligatorio')
  }

  useEffect(() => {
    setCargandoProgramas(true)
    fetch(`${backendUrl}/programas/listar`)
      .then((response) => response.json())
      .then((data) => {
        const programasCompletos = data.map((programa) => {
          return {
            ...programa,
            Nombre: programa.nombre,
            Código: programa.codigo,
            Id: programa.id
          }
        })

        const posgrado = programasCompletos.filter(
          (programa) => programa.esPosgrado === true
        )
        setProgramasPosgrado(posgrado)

        const pregrado = programasCompletos.filter(
          (programa) => programa.esPosgrado === false
        )
        setProgramasPregrado(pregrado)
        setCargandoProgramas(false)
      })

    fetch(`${backendUrl}/programas/tipos-programa`)
      .then((response) => response.json())
      .then((data) => {
        setTiposPrograma(data)
      })
  }, [])

  const cargarProgramas = async () => {
    setCargandoProgramas(true)
    fetch(`${backendUrl}/programas/listar`)
      .then((response) => response.json())
      .then((data) => {
        const programasCompletos = data.map((programa) => {
          return {
            ...programa,
            Nombre: programa.nombre,
            Código: programa.codigo,
            Id: programa.id
          }
        })

        const posgrado = programasCompletos.filter(
          (programa) => programa.esPosgrado === true
        )
        setProgramasPosgrado(posgrado)

        const pregrado = programasCompletos.filter(
          (programa) => programa.esPosgrado === false
        )
        setProgramasPregrado(pregrado)
        setCargandoProgramas(false)
      })
  }
  // Añadir este método para cargar los datos al editar
  const prepararEdicion = (programa) => {
    setCodigo(programa.codigo)
    setPrograma(programa.nombre)
    setPosgrado(programa.esPosgrado)
    setNivelAcademico(programa.esPosgrado ? 'Posgrado' : 'Pregrado')
    setModoEdicion(true) // Nuevo estado para controlar si estamos en modo edición
    setProgramaId(programa.id) // Nuevo estado para guardar el ID del programa a editar
    setMoodleId(programa.moodleId)
    setHistoricoMoodleId(programa.historicoMoodleId)
    setSemestreActual(programa.semestreActual)
    setIsOpen(true)
  }

  const crearPrograma = async (e) => {
    e.preventDefault()
    const data = {
      codigo: codigo,
      nombre: programa,
      esPosgrado: posgrado
    }
    try {
      // Verificar que los tipos de programa se hayan cargado correctamente
      if (tiposPrograma.length < 2) {
        setAlertType('error')
        setAlertMessage(
          'No se pudieron cargar los tipos de programa necesarios. Intente nuevamente.'
        )
        setIsAlertOpen(true)
        return
      }

      // Seleccionar el parentId adecuado según el tipo de programa
      // Si es pregrado, usar el primer elemento (índice 0)
      // Si es posgrado, usar el segundo elemento (índice 1)
      const parentMoodleId = posgrado
        ? tiposPrograma[1].moodleId
        : tiposPrograma[0].moodleId

      if (!parentMoodleId) {
        setAlertType('error')
        setAlertMessage(
          'No se pudo determinar la categoría padre en Moodle. Contacte al administrador.'
        )
        setIsAlertOpen(true)
        return
      }

      const response = await fetch(`${backendUrl}/programas/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        const errorData = await response.json()
        setAlertType('error')
        setAlertMessage(errorData.message)
        setIsAlertOpen(true)
      } else {
        const responseData = await response.json()
        const programaResponse = responseData

        // Paso 1: Crear la categoría principal del programa en Moodle
        // Aquí usamos el parentMoodleId en lugar de 0
        fetch(
          `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_categories&categories[0][name]=${programaResponse.nombre}&categories[0][parent]=${parentMoodleId}&categories[0][description]=${programaResponse.nombre}`
        )
          .then((response) => response.json())
          .then((data) => {
            // Obtener el ID de Moodle para el programa
            const programaMoodleId = data[0].id

            // Paso 2: Vincular el ID de Moodle con el programa en el backend
            const body = {
              backendId: programaResponse.id,
              moodleId: programaMoodleId
            }

            return fetch(`${backendUrl}/programas/moodle`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(body)
            })
              .then((response) => response.json())
              .then(() => {
                // Paso 3: Crear la categoría "Histórico" como hijo del programa en Moodle
                return fetch(
                  `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_categories&categories[0][name]=Histórico&categories[0][parent]=${programaMoodleId}&categories[0][description]=Histórico de cursos del programa ${programaResponse.nombre}`
                )
              })
              .then((response) => response.json())
              .then((historicoCategoriaData) => {
                const historicoMoodleId = historicoCategoriaData[0].id

                // Paso 4: Vincular el ID del histórico con el programa en el backend
                const historicoBody = {
                  backendId: programaResponse.id,
                  moodleId: historicoMoodleId
                }

                return fetch(`${backendUrl}/programas/historico/moodle`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(historicoBody)
                })
              })
              .then((response) => response.json())
              .then(() => {
                // Histórico Moodle ID vinculado exitosamente
              })
              .catch((error) => {
                console.error(
                  'Error en la creación o vinculación del histórico:',
                  error
                )
                setAlertType('warning')
                setAlertMessage(
                  'Programa creado pero hubo un problema con la categoría Histórico'
                )
                setIsAlertOpen(true)
              })
          })
          .catch((error) => {
            console.error(
              'Error en la creación o vinculación de la categoría principal:',
              error
            )
            setAlertType('warning')
            setAlertMessage(
              'Programa creado pero hubo un problema con la vinculación a Moodle'
            )
            setIsAlertOpen(true)
          })

        setCodigo('')
        setPrograma('')
        setPosgrado(true)
        setIsOpen(false)
        setAlertType('success')
        setAlertMessage('¡Programa creado exitosamente!')
        setIsAlertOpen(true)
        cargarProgramas()
      }
    } catch (error) {
      console.error('Error:', error)
      setAlertType('error')
      setAlertMessage('Error al procesar la solicitud')
      setIsAlertOpen(true)
    }
  }

  const actualizarEnBackend = async (id, data) => {
    const response = await fetch(`${backendUrl}/programas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Error al actualizar el programa en el backend')
    }

    return await response.json()
  }

  const actualizarEnMoodle = async (moodleId, nombrePrograma) => {
    // La API de Moodle puede retornar [] o null con status 200
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_update_categories&categories[0][id]=${moodleId}&categories[0][name]=${nombrePrograma}&categories[0][description]=${nombrePrograma}`
      )

      if (!response.ok) {
        console.warn('Respuesta no exitosa de Moodle')
        return false
      }

      // Incluso si la respuesta es [], null o cualquier otro valor,
      // consideramos éxito si el status code es 200 OK
      return true
    } catch (error) {
      console.error('Error al comunicarse con Moodle:', error)
      return false
    }
  }

  const limpiarFormulario = () => {
    setCodigo('')
    setPrograma('')
    setPosgrado(true)
    setNivelAcademico('Posgrado')
    setModoEdicion(false)
    setProgramaId(null)
    setIsOpen(false)
  }

  // Refactorización del método actualizarPrograma
  const actualizarPrograma = async (e) => {
    e.preventDefault()
    try {
      // Ya no necesitamos obtener los datos del programa, usamos el moodleId del estado

      // Preparar y actualizar en el backend
      const body = {
        nombre: programa,
        codigo: codigo,
        esPosgrado: posgrado,
        moodleId: moodleId, // Usar el moodleId del estado en lugar de obtenerlo con una petición
        historicoMoodleId: historicoMoodleId,
        semestreActual: semestreActual
      }

      await actualizarEnBackend(programaId, body)

      // Actualizar en Moodle si hay un ID asociado
      let moodleActualizado = true
      if (moodleId) {
        // Verificar si hay un moodleId en el estado
        moodleActualizado = await actualizarEnMoodle(moodleId, programa)
      }

      // Limpiar y mostrar mensaje
      limpiarFormulario()

      setAlertType('success')
      setAlertMessage(
        moodleActualizado
          ? '¡Programa actualizado exitosamente en backend y Moodle!'
          : '¡Programa actualizado en el backend pero hubo un problema con Moodle!'
      )
      setIsAlertOpen(true)
      cargarProgramas()
    } catch (error) {
      console.error('Error:', error)
      setAlertType('error')
      setAlertMessage(`Error al actualizar: ${error.message}`)
      setIsAlertOpen(true)
    }
  }

  const columnas = ['Código', 'Nombre']
  const filtros = ['Nombre']
  const acciones = [
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (programa) => {
        prepararEdicion(programa)
      }
    }
  ]

  return (
    <div className='p-4 w-full flex flex-col items-center justify-center'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>
          Lista de programas de posgrado
        </p>
        <Boton
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Crear programa
        </Boton>
      </div>
      <div className='w-full mb-8'>
        <Tabla
          informacion={programasPosgrado}
          columnas={columnas}
          filtros={filtros}
          acciones={acciones}
          elementosPorPagina={5}
          cargandoContenido={cargandoProgramas}
        />
      </div>
      <p className='text-center text-titulos mt-8'>
        Lista de programas de pregrado
      </p>
      <div className='w-full '>
        <Tabla
          informacion={programasPregrado}
          columnas={columnas}
          filtros={filtros}
          acciones={acciones}
          elementosPorPagina={5}
          cargandoContenido={cargandoProgramas}
        />
      </div>
      <Modal
        size='xl'
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            // Reiniciar estados al cerrar el modal
            setModoEdicion(false)
            setCodigo('')
            setPrograma('')
            setPosgrado(true)
            setNivelAcademico('Posgrado')
            setProgramaId(null)
          }
        }}
        cabecera={modoEdicion ? 'Editar Programa' : 'Crear Programa'}
        cuerpo={
          <Form
            className='flex flex-col gap-2'
            onSubmit={modoEdicion ? actualizarPrograma : crearPrograma}
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
              label='Código'
              labelPlacement='outside'
              name='codigo'
              placeholder='Ingresa el código del programa'
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
              name='programa'
              placeholder='Ingresa el nombre del programa'
              type='text'
              value={programa}
              onValueChange={(value) => setPrograma(value)}
              isInvalid={programaErrors.length > 0}
              errorMessage={() => (
                <ul className='text-xs text-danger mt-1'>
                  {programaErrors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            />
            <div className='flex flex-row items-center'>
              <p className='text-normal mr-4'>Nivel académico</p>
              <Dropdown
                classNames={{
                  content: 'min-w-[50] w-[150px]'
                }}
              >
                <DropdownTrigger>
                  <Button
                    style={{
                      minWidth: '150px',
                      height: '40px'
                    }}
                    variant='bordered'
                  >
                    {nivelAcademico}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label='Static Actions'>
                  <DropdownItem
                    key='new'
                    className='text-center'
                    onPress={() => {
                      setPosgrado(true), setNivelAcademico('Posgrado')
                    }}
                  >
                    Posgrado
                  </DropdownItem>
                  <DropdownItem
                    key='copy'
                    className='text-center'
                    onPress={() => {
                      setPosgrado(false), setNivelAcademico('Pregrado')
                    }}
                  >
                    Pregrado
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'}>
                {modoEdicion ? 'Guardar cambios' : 'Crear programa'}
              </Boton>
            </div>
          </Form>
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
export default Programas
