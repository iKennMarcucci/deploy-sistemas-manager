import { useState, useEffect } from 'react'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import AlertaModal from '../../components/AlertaModal'

const TerminarSemestre = () => {
  // Estado para el modal de confirmación
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Estado para almacenar los datos de programas
  const [programas, setProgramas] = useState([])
  const [semestreActual, setSemestreActual] = useState('Cargando...')
  const [cargando, setCargando] = useState(true)
  // Nuevo estado para controlar si está en proceso de terminación
  const [terminando, setTerminando] = useState(false)

  // Estados para la alerta
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')
  const [alertTitulo, setAlertTitulo] = useState('')

  // Estado para el nombre del usuario
  const [nombreUsuario, setNombreUsuario] = useState('Usuario Sistema')

  // Efecto para cargar el nombre de usuario desde localStorage
  useEffect(() => {
    try {
      const userInfoString = localStorage.getItem('userInfo')
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString)
        if (userInfo && userInfo.nombre) {
          setNombreUsuario(userInfo.nombre)
        }
      }
    } catch (error) {
      console.error('Error al obtener la información de usuario:', error)
    }
  }, [])

  // Efecto para cargar los programas al montar el componente
  useEffect(() => {
    const cargarProgramas = async () => {
      try {
        const response = await fetch(`${backendUrl}/programas/listar`)
        if (!response.ok) {
          throw new Error('Error al obtener los programas')
        }

        const data = await response.json()
        setProgramas(data)

        // Obtener el semestre actual del primer programa
        if (data && data.length > 0 && data[0].semestreActual) {
          setSemestreActual(data[0].semestreActual)
        } else {
          setSemestreActual('No disponible')
        }
      } catch (error) {
        console.error('Error al cargar los programas:', error)
        mostrarAlerta(
          'Error al cargar la información del semestre',
          'error',
          'Error de conexión'
        )
        setSemestreActual('Error al cargar')
      } finally {
        setCargando(false)
      }
    }

    cargarProgramas()
  }, [backendUrl])

  // Función para mostrar alertas
  const mostrarAlerta = (mensaje, tipo, titulo) => {
    setAlertMessage(mensaje)
    setAlertType(tipo)
    setAlertTitulo(
      titulo || (tipo === 'success' ? 'Operación exitosa' : 'Error')
    )
    setIsAlertOpen(true)
  }

  // Función para iniciar el proceso de confirmación
  const iniciarConfirmacion = () => {
    setIsConfirmOpen(true)
  }

  // Función para ejecutar la terminación del semestre
  const terminarSemestre = async () => {
    try {
      // Indicar que está en proceso de terminación
      setTerminando(true)

      // Crear un array para almacenar los resultados de cada programa
      const resultados = []
      let exito = true

      // Procesar cada programa secuencialmente - Usando bucle for...of con await
      for (const programa of programas) {
        try {
          // Verificaciones previas
          if (!programa.id || !programa.semestreActual) {
            resultados.push({
              programa: programa.nombre || 'Programa sin nombre',
              estado: 'Error',
              mensaje: 'Falta información necesaria (ID o semestre actual)'
            })
            continue
          }

          // Realizar la petición al backend para terminar el semestre de este programa
          const response = await fetch(
            `${backendUrl}/semestres/terminar/${programa.id}/${programa.semestreActual}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Usuario': nombreUsuario
              }
            }
          )

          // Procesamiento de la respuesta
          if (!response.ok) {
            const errorData = await response.json()
            console.error('Error en la respuesta:', errorData)
            resultados.push({
              programa: programa.nombre,
              estado: 'Error',
              mensaje: errorData.mensaje || 'Error al terminar el semestre'
            })
            exito = false
          } else {
            const nuevoSemestre = calcularSiguienteSemestrePara(
              programa.semestreActual
            )
            resultados.push({
              programa: programa.nombre,
              estado: 'Éxito',
              mensaje: `Semestre terminado. Nuevo semestre: ${nuevoSemestre}`
            })
          }
        } catch (error) {
          resultados.push({
            programa: programa.nombre || 'Programa desconocido',
            estado: 'Error',
            mensaje: error.message || 'Error en la petición'
          })
          exito = false
        }
      }

      // Determinar el mensaje para mostrar basado en los resultados
      if (exito) {
        mostrarAlerta(
          `El semestre ha sido terminado correctamente. El nuevo semestre es ${siguienteSemestre}`,
          'success',
          'Semestre terminado'
        )
      } else {
        // Si hubo errores, mostrar un mensaje con los detalles
        const mensajeError = resultados
          .filter((r) => r.estado === 'Error')
          .map((r) => `${r.programa}: ${r.mensaje}`)
          .join('\n')

        mostrarAlerta(
          `Ocurrieron errores al terminar el semestre:\n${mensajeError}`,
          'error',
          'Errores al terminar semestre'
        )
      }
    } catch (error) {
      mostrarAlerta(
        'Ocurrió un error al intentar terminar el semestre',
        'error',
        'Error'
      )
    } finally {
      // Finalizar el proceso de terminación y cerrar el modal
      setTerminando(false)
      setIsConfirmOpen(false)
    }
  }

  // Función para calcular el siguiente semestre para un programa específico
  const calcularSiguienteSemestrePara = (semestreActualPrograma) => {
    if (
      !semestreActualPrograma ||
      semestreActualPrograma === 'No disponible' ||
      semestreActualPrograma === 'Error al cargar'
    ) {
      return 'próximo semestre'
    }

    const partes = semestreActualPrograma.split('-')
    if (partes.length !== 2) return 'próximo semestre'

    const año = parseInt(partes[0])
    const periodo = partes[1].trim()

    if (periodo === 'I') {
      return `${año}-II`
    } else {
      return `${año + 1}-I`
    }
  }

  // Calcular cuál sería el siguiente semestre
  const calcularSiguienteSemestre = () => {
    if (
      !semestreActual ||
      semestreActual === 'No disponible' ||
      semestreActual === 'Error al cargar'
    ) {
      return 'próximo semestre'
    }

    const partes = semestreActual.split('-')
    if (partes.length !== 2) return 'próximo semestre'

    const año = parseInt(partes[0])
    const periodo = partes[1].trim()

    if (periodo === 'I') {
      return `${año}-II`
    } else {
      return `${año + 1}-I`
    }
  }

  const siguienteSemestre = calcularSiguienteSemestre()

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <p className='text-titulos font-semibold my-4'>Terminar semestre</p>
      <p className='text-subtitulos my-4'>
        Semestre actual: {cargando ? 'Cargando...' : semestreActual}
      </p>
      <p className='text-normal my-4'>
        Ten en cuenta que al momento de terminar el semestre, no hay vuelta
        atrás.
      </p>
      {/* Corregido: Separar el párrafo de la lista */}
      <div className='text-normal my-4'>
        <p>
          Como recomendación, finaliza el semestre a partir de las siguientes
          fechas:
        </p>
        <ul className='list-disc ml-5 mt-2'>
          <li>Primera semana de julio</li>
          <li>Primer semana de enero</li>
        </ul>
      </div>
      <Boton onClick={iniciarConfirmacion} disabled={cargando || terminando}>
        {terminando ? 'Terminando semestre...' : 'Terminar semestre'}
      </Boton>

      {/* Modal de confirmación */}
      <Modal
        size='lg'
        isOpen={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open)
        }}
        cabecera='Confirmar terminación de semestre'
        cuerpo={
          <div className='flex flex-col'>
            <p>
              ¿Está seguro de que desea terminar el semestre actual (
              {semestreActual})?
            </p>
            <p className='text-danger-500 font-bold mt-4'>
              ADVERTENCIA: Esta acción es irreversible y afectará a todos los
              estudiantes, profesores y materias del sistema. Una vez terminado
              el semestre:
            </p>
            <ul className='list-disc ml-5 mt-2 text-danger-500'>
              <li>Todas las notas se cerrarán</li>
              <li>Los cursos de moodle se moverán al histórico</li>
              <li>Los cursos en moodle se reiniciarán</li>
              <li>Se habilitará un nuevo semestre ({siguienteSemestre})</li>
              <li>
                Los estudiantes deberán matricular nuevamente sus materias
              </li>
            </ul>
            <div className='flex justify-end space-x-3 mt-6 mb-[-20px]'>
              <Boton onClick={terminarSemestre} disabled={terminando}>
                {terminando ? 'Procesando...' : 'Confirmar'}
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
export default TerminarSemestre
