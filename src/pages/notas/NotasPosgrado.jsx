import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Tabla from '../../components/Tabla'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import AlertaModal from '../../components/AlertaModal'

const NotasPosgrado = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN
  const { id } = useParams()
  const [grupo, setGrupo] = useState(null)
  const [estudiantes, setEstudiantes] = useState([])
  const [notas, setNotas] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargando, setCargando] = useState(false)

  // Nuevo estado para controlar si hay notas registradas
  const [notasRegistradas, setNotasRegistradas] = useState(false)

  // Estados para los modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [estudianteActual, setEstudianteActual] = useState(null)
  const [operacionGrupal, setOperacionGrupal] = useState(false)

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTitulo, setAlertTitulo] = useState('')

  // Efecto para verificar si hay notas registradas
  useEffect(() => {
    if (estudiantes.length > 0) {
      // Tomamos el primer estudiante para verificar si ya tiene notas registradas
      verificarNotasRegistradas()
    }
  }, [estudiantes, id])

  // Función para verificar si las notas ya han sido registradas
  const verificarNotasRegistradas = async () => {
    try {
      if (estudiantes.length === 0) return

      const primerEstudiante = estudiantes[0]
      const respMatriculas = await fetch(
        `${backendUrl}/matriculas/estudiante/${primerEstudiante.id}`
      )

      if (!respMatriculas.ok) {
        console.error('Error al verificar matrículas')
        return
      }

      const matriculas = await respMatriculas.json()
      const matriculaGrupo = matriculas.find(
        (m) => m.grupoId.toString() === id.toString()
      )

      if (matriculaGrupo) {
        // Si la nota no es null, significa que ya se registraron notas al menos una vez
        const tieneNotasRegistradas = matriculaGrupo.nota !== null
        setNotasRegistradas(tieneNotasRegistradas)
        console.log('¿Hay notas registradas?', tieneNotasRegistradas)
      }
    } catch (error) {
      console.error('Error al verificar si hay notas registradas:', error)
    }
  }

  useEffect(() => {
    fetch(`${backendUrl}/grupos/vinculado/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setGrupo(data)
      })

    fetch(`${backendUrl}/estudiantes/matriculados/grupo-cohorte/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setEstudiantes(data)
      })
  }, [])

  useEffect(() => {
    fetch(
      `${moodleUrl}?wstoken=${moodleToken}&` +
        `moodlewsrestformat=json&` +
        `wsfunction=gradereport_user_get_grade_items&` +
        `courseid=${grupo?.moodleId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNotas(data.usergrades)
      })
  }, [grupo])

  // Nuevo useEffect para procesar la información de estudiantes y notas
  useEffect(() => {
    // Asegurarse de que los arreglos no estén vacíos
    if (estudiantes.length > 0 && notas && notas.length > 0) {
      const infoEstudiantes = estudiantes.map((estudiante) => {
        // Generar el nombre completo del estudiante
        const nombreCompleto = [
          estudiante.nombre,
          estudiante.nombre2,
          estudiante.apellido,
          estudiante.apellido2
        ]
          .filter(Boolean)
          .join(' ')

        // Buscar las notas correspondientes al estudiante por su moodleId
        const notasEstudiante = notas.find(
          (nota) => nota.userid.toString() === estudiante.moodleId.toString()
        )

        // Obtener la nota definitiva (última posición del arreglo gradeitems)
        let notaDefinitiva = null
        if (notasEstudiante && notasEstudiante.gradeitems.length > 0) {
          // Obtener la última nota (la definitiva)
          const ultimaNota =
            notasEstudiante.gradeitems[notasEstudiante.gradeitems.length - 1]
          notaDefinitiva = ultimaNota.graderaw
        }

        // Devolver la información procesada del estudiante
        return {
          ...estudiante,
          Código: estudiante.codigo,
          Nombre: nombreCompleto,
          DEF: notaDefinitiva ? notaDefinitiva : '-'
        }
      })

      // Actualizar el estado con la información procesada
      setInformacion(infoEstudiantes)
      console.log('Información procesada:', infoEstudiantes)
    }
  }, [notas, estudiantes])

  // Función para mostrar alerta
  const mostrarAlerta = (mensaje, tipo, titulo) => {
    setAlertMessage(mensaje)
    setAlertType(tipo)
    setAlertTitulo(titulo || (tipo === 'success' ? 'Éxito' : 'Error'))
    setIsAlertOpen(true)
  }

  // Función para obtener el nombre del usuario desde localStorage
  const obtenerNombreUsuario = () => {
    const userInfoString = localStorage.getItem('userInfo')
    let nombreUsuario = 'Usuario Sistema'
    if (userInfoString) {
      try {
        const userInfo = JSON.parse(userInfoString)
        nombreUsuario = userInfo.nombre || nombreUsuario
      } catch (error) {
        console.error('Error al parsear userInfo:', error)
      }
    }
    return nombreUsuario
  }

  // Función para registrar las notas de todos los estudiantes
  const registrarNotasEstudiantes = async () => {
    const nombreUsuario = obtenerNombreUsuario()
    const errores = []

    for (const estudiante of informacion) {
      try {
        // Obtener matrículas del estudiante
        const respMatriculas = await fetch(
          `${backendUrl}/matriculas/estudiante/${estudiante.id}`
        )
        if (!respMatriculas.ok) {
          throw new Error(`Error al obtener matrículas de ${estudiante.Nombre}`)
        }

        const matriculas = await respMatriculas.json()
        const matriculaGrupo = matriculas.find(
          (m) => m.grupoId.toString() === id.toString()
        )

        if (!matriculaGrupo) {
          throw new Error(
            `No se encontró la matrícula de ${estudiante.Nombre} para este grupo`
          )
        }

        // Registrar la nota del estudiante
        const respRegistrar = await fetch(`${backendUrl}/notas/registrar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Usuario': nombreUsuario
          },
          body: JSON.stringify({
            matriculaId: matriculaGrupo.id,
            nota: estudiante.DEF,
            realizadoPor: nombreUsuario
          })
        })

        if (!respRegistrar.ok) {
          throw new Error(`Error al registrar la nota de ${estudiante.Nombre}`)
        }

        console.log(`Nota registrada correctamente para ${estudiante.Nombre}`)
      } catch (error) {
        console.error(`Error al registrar nota:`, error)
        errores.push(`${estudiante.Nombre}: ${error.message}`)
      }
    }

    return errores
  }

  // Función para iniciar el proceso de cierre de nota para un estudiante
  const iniciarCierreNotaEstudiante = (estudiante) => {
    setEstudianteActual(estudiante)
    setOperacionGrupal(false)
    setIsConfirmOpen(true)
  }

  // Función modificada para registrar la nota de un estudiante individual
  const cerrarNotas = async (estudiante) => {
    setCargando(true)
    try {
      const nombreUsuario = obtenerNombreUsuario()

      // Obtener matrículas del estudiante
      const respMatriculas = await fetch(
        `${backendUrl}/matriculas/estudiante/${estudiante.id}`
      )
      if (!respMatriculas.ok) {
        throw new Error('Error al obtener las matrículas del estudiante')
      }

      const matriculas = await respMatriculas.json()
      const matriculaGrupo = matriculas.find(
        (m) => m.grupoId.toString() === id.toString()
      )

      if (!matriculaGrupo) {
        throw new Error(
          'No se encontró la matrícula del estudiante para este grupo'
        )
      }

      // Registrar la nota del estudiante
      const respRegistrar = await fetch(`${backendUrl}/notas/registrar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Usuario': nombreUsuario
        },
        body: JSON.stringify({
          matriculaId: matriculaGrupo.id,
          nota: estudiante.DEF,
          realizadoPor: nombreUsuario
        })
      })

      if (!respRegistrar.ok) {
        throw new Error('Error al registrar la nota del estudiante')
      }

      // Después de registrar las notas con éxito, actualizamos el estado
      setNotasRegistradas(true)

      mostrarAlerta(
        `Nota registrada correctamente para ${estudiante.Nombre}`,
        'success',
        'Nota registrada'
      )
    } catch (error) {
      console.error('Error durante el proceso de registro de notas:', error)
      mostrarAlerta(error.message, 'error', 'Error al registrar notas')
    } finally {
      setCargando(false)
    }
  }

  // Función para iniciar el proceso de registro de todas las notas
  const iniciarCierreTodasLasNotas = () => {
    setOperacionGrupal(true)
    setIsConfirmOpen(true)
  }

  // Función para registrar todas las notas del grupo
  const cerrarTodasLasNotas = async () => {
    setCargando(true)
    try {
      // Registrar notas de todos los estudiantes
      const erroresRegistro = await registrarNotasEstudiantes()

      // Si llegamos aquí sin errores, actualizamos el estado
      setNotasRegistradas(true)

      // Mostrar resultado final
      if (erroresRegistro.length > 0) {
        mostrarAlerta(
          `Proceso completado con los siguientes errores:\n${erroresRegistro.join('\n')}`,
          'warning',
          'Proceso completado con errores'
        )
      } else {
        mostrarAlerta(
          'Todas las notas han sido registradas correctamente',
          'success',
          'Proceso completado'
        )
      }
    } catch (error) {
      console.error('Error en el proceso completo:', error)
      mostrarAlerta(error.message, 'error', 'Error en el proceso')
    } finally {
      setCargando(false)
    }
  }

  // Función para verificar si hay estudiantes sin nota
  const hayNotasVacias = () => {
    return informacion.some(
      (estudiante) =>
        estudiante.DEF === null ||
        estudiante.DEF === undefined ||
        estudiante.DEF === '-' ||
        estudiante.DEF === ''
    )
  }

  const acciones = [
    {
      icono: 'DEF',
      tooltip: 'Registrar nota',
      accion: (estudiante) => iniciarCierreNotaEstudiante(estudiante),
      disabled: !notasRegistradas
    }
  ]

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='w-full'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
      </div>
      <p className='text-titulos'>Información del grupo</p>
      <p className='text-subtitulos'>{grupo?.grupoNombre}</p>
      <div className='flex flex-row w-full my-8'>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Nombre del docente:</div>
          <div>{grupo?.docenteNombre}</div>
        </div>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Número de estudiantes:</div>
          <div>{estudiantes?.length}</div>
        </div>
      </div>
      <p className='text-subtitulos mb-8'>Lista de estudiantes</p>
      <div className='w-full'>
        <Tabla
          informacion={informacion}
          columnas={['Código', 'Nombre', 'DEF']}
          filtros={['Código', 'Nombre']}
          acciones={acciones}
        />
      </div>
      <div className='w-full flex mb-8 mt-14 justify-end'>
        <Boton
          onClick={iniciarCierreTodasLasNotas}
          disabled={cargando || hayNotasVacias()}
          success={notasRegistradas} // El botón será verde si ya hay notas registradas
        >
          {cargando ? 'Procesando...' : 'Cerrar todas las notas'}
        </Boton>
      </div>

      {/* Modal de confirmación para cierre de notas */}
      <Modal
        size='md'
        isOpen={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open)
        }}
        cabecera={
          operacionGrupal
            ? 'Confirmar cierre de todas las notas'
            : 'Confirmar cierre de nota'
        }
        cuerpo={
          <div className='flex flex-col'>
            <p>
              {operacionGrupal
                ? '¿Está seguro de cerrar todas las notas del grupo?'
                : `¿Está seguro de cerrar la nota de ${estudianteActual?.Nombre}?`}
            </p>
            <p className='text-warning-500 font-semibold mt-2'>
              {operacionGrupal
                ? 'Esta acción registrará las notas en el sistema académico.'
                : 'Esta acción registrará la respectiva nota en el sistema académico.'}
            </p>
            <div className='flex justify-end space-x-3 mt-6 mb-[-20px]'>
              <Boton
                onClick={() => {
                  setIsConfirmOpen(false)
                  if (operacionGrupal) {
                    cerrarTodasLasNotas()
                  } else if (estudianteActual) {
                    cerrarNotas(estudianteActual)
                  }
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
export default NotasPosgrado
