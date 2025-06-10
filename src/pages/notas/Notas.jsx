import Tabla from '../../components/Tabla'
import { useEffect, useState } from 'react'
import Boton from '../../components/Boton'
import { ArrowLeft } from 'lucide-react'

const Notas = () => {
  const [listaNotas, setListaNotas] = useState([])
  const [cargandoNotas, setCargandoNotas] = useState(true)
  const [grupo, setGrupo] = useState(null)
  const [grupoCompleto, setGrupoCompleto] = useState(null)
  const [primerPrevio, setPrimerPrevio] = useState(false)
  const [segundoPrevio, setSegundoPrevio] = useState([false, false])
  const [terceroPrevio, setTerceroPrevio] = useState([false, false])
  const [examenFinal, setExamenFinal] = useState([false, false])
  const [puedeHabilitarP1, setPuedeHabilitarP1] = useState(false)
  const [puedeHabilitarP2, setPuedeHabilitarP2] = useState(false)
  const [puedeHabilitarP3, setPuedeHabilitarP3] = useState(false)
  const [puedeHabilitarEX, setPuedeHabilitarEX] = useState(false)
  const [notasEstadoDivisist, setNotasEstadoDivisist] = useState(null)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

  const columnas = ['Código', 'Nombre', 'P1', 'P2', 'P3', 'EX', 'DEF']

  // Función para obtener información del grupo desde Divisist
  const obtenerGrupoDivisist = async (codCarrera, codMateria, grupo) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/grupo/${codCarrera}/${codMateria}/${grupo}`
      )
      if (!response.ok) {
        throw new Error('Error al obtener información del grupo de Divisist')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo grupo de Divisist:', error)
      throw error
    }
  }

  // Función para obtener notas desde Moodle
  const obtenerNotasMoodle = async (moodleId) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=gradereport_user_get_grade_items&courseid=${moodleId}`
      )
      if (!response.ok) {
        throw new Error('Error al obtener notas de Moodle')
      }
      const data = await response.json()
      return data.usergrades || []
    } catch (error) {
      console.error('Error obteniendo notas de Moodle:', error)
      return []
    }
  }

  // Función para procesar notas de un estudiante
  const procesarNotasEstudiante = (estudianteData, notasUsuario) => {
    let notasProceadas = {
      P1: '-',
      P2: '-',
      P3: '-',
      EX: '-',
      DEF: '-'
    }

    if (notasUsuario && notasUsuario.gradeitems) {
      // Buscar notas específicas por itemname
      notasUsuario.gradeitems.forEach((item) => {
        if (item.itemname === 'P1' && item.graderaw !== null) {
          notasProceadas['P1'] = parseFloat(item.graderaw).toFixed(2)
        } else if (item.itemname === 'P2' && item.graderaw !== null) {
          notasProceadas['P2'] = parseFloat(item.graderaw).toFixed(2)
        } else if (item.itemname === 'P3' && item.graderaw !== null) {
          notasProceadas['P3'] = parseFloat(item.graderaw).toFixed(2)
        } else if (item.itemname === 'EX' && item.graderaw !== null) {
          notasProceadas['EX'] = parseFloat(item.graderaw).toFixed(2)
        }
      })

      // Solo calcular DEF si todas las notas están presentes (P1, P2, P3 y EX)
      if (
        notasProceadas['P1'] !== '-' &&
        notasProceadas['P2'] !== '-' &&
        notasProceadas['P3'] !== '-' &&
        notasProceadas['EX'] !== '-'
      ) {
        const p1 = parseFloat(notasProceadas['P1'])
        const p2 = parseFloat(notasProceadas['P2'])
        const p3 = parseFloat(notasProceadas['P3'])
        const ex = parseFloat(notasProceadas['EX'])

        const promedioParciales = (p1 + p2 + p3) / 3
        const def = promedioParciales * 0.7 + ex * 0.3
        notasProceadas['DEF'] = def.toFixed(2)
      }
    }

    return {
      Código: estudianteData.codigo,
      Nombre:
        `${estudianteData.primerNombre} ${estudianteData.segundoNombre || ''} ${estudianteData.primerApellido} ${estudianteData.segundoApellido || ''}`.trim(),
      ...notasProceadas
    }
  }

  // Función para obtener estudiantes matriculados desde Oracle
  const obtenerEstudiantesMatriculados = async (
    codCarMat,
    codMatMat,
    grupoParam
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/oracle/materias-matriculadas/filtrar?codCarMat=${codCarMat}&codMatMat=${codMatMat}&grupo=${grupoParam}`
      )
      if (!response.ok) {
        throw new Error('Error al obtener estudiantes matriculados')
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo estudiantes matriculados:', error)
      throw error
    }
  }

  // Función para obtener estudiante desde Divisist
  const obtenerEstudianteDivisist = async (codigoCompleto) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/estudiante/${codigoCompleto}`
      )
      if (!response.ok) {
        throw new Error(
          'Error al obtener información del estudiante de Divisist'
        )
      }
      const data = await response.json()
      return data && Object.keys(data).length > 0 ? data : null
    } catch (error) {
      console.error('Error obteniendo estudiante de Divisist:', error)
      return null
    }
  }

  // Función para verificar si todas las notas de una columna están completas
  const verificarNotasCompletas = (columna) => {
    if (listaNotas.length === 0) return false

    return listaNotas.every(
      (estudiante) =>
        estudiante[columna] !== '-' &&
        estudiante[columna] !== null &&
        estudiante[columna] !== undefined &&
        estudiante[columna] !== ''
    )
  }

  // Función para cerrar notas en Divisist
  const cerrarNotasEnDivisist = async (estudiante, camposActualizar) => {
    try {
      // Construir el código completo del alumno (sin el prefijo de carrera)
      const codAlumno = estudiante.Código

      const response = await fetch(`${backendUrl}/divisist/nota`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codAlumno: codAlumno,
          codMateria: grupoCompleto.codMateria,
          codCarrera: grupoCompleto.codCarrera,
          grupo: grupoCompleto.grupo,
          semestre: grupoCompleto.semestre,
          ciclo: grupoCompleto.ciclo,
          camposActualizar: camposActualizar
        })
      })

      if (!response.ok) {
        throw new Error(`Error al cerrar notas: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error cerrando notas en Divisist:', error)
      throw error
    }
  }

  // Función para recargar las notas después de cerrar
  const recargarNotas = async () => {
    if (grupoCompleto && grupoCompleto.moodleId) {
      const notasMoodleActualizadas = await obtenerNotasMoodle(
        grupoCompleto.moodleId
      )

      // Reprocesar las notas manteniendo los datos originales del estudiante
      const estudiantesActualizados = listaNotas.map((estudianteOriginal) => {
        // Buscar notas actualizadas del estudiante en Moodle por moodleId
        const notasUsuario = notasMoodleActualizadas.find(
          (nota) =>
            nota.userid.toString() === estudianteOriginal.moodleId?.toString()
        )

        // Mantener los datos originales del estudiante y solo actualizar las notas
        let notasProceadas = {
          P1: '-',
          P2: '-',
          P3: '-',
          EX: '-',
          DEF: '-'
        }

        if (notasUsuario && notasUsuario.gradeitems) {
          // Buscar notas específicas por itemname
          notasUsuario.gradeitems.forEach((item) => {
            if (item.itemname === 'P1' && item.graderaw !== null) {
              notasProceadas['P1'] = parseFloat(item.graderaw).toFixed(2)
            } else if (item.itemname === 'P2' && item.graderaw !== null) {
              notasProceadas['P2'] = parseFloat(item.graderaw).toFixed(2)
            } else if (item.itemname === 'P3' && item.graderaw !== null) {
              notasProceadas['P3'] = parseFloat(item.graderaw).toFixed(2)
            } else if (item.itemname === 'EX' && item.graderaw !== null) {
              notasProceadas['EX'] = parseFloat(item.graderaw).toFixed(2)
            }
          })

          // Solo calcular DEF si todas las notas están presentes (P1, P2, P3 y EX)
          if (
            notasProceadas['P1'] !== '-' &&
            notasProceadas['P2'] !== '-' &&
            notasProceadas['P3'] !== '-' &&
            notasProceadas['EX'] !== '-'
          ) {
            const p1 = parseFloat(notasProceadas['P1'])
            const p2 = parseFloat(notasProceadas['P2'])
            const p3 = parseFloat(notasProceadas['P3'])
            const ex = parseFloat(notasProceadas['EX'])

            const promedioParciales = (p1 + p2 + p3) / 3
            const def = promedioParciales * 0.7 + ex * 0.3
            notasProceadas['DEF'] = def.toFixed(2)
          }
        }

        // Retornar el estudiante con las notas actualizadas pero manteniendo los datos originales
        return {
          Código: estudianteOriginal.Código,
          Nombre: estudianteOriginal.Nombre,
          moodleId: estudianteOriginal.moodleId,
          ...notasProceadas
        }
      })

      setListaNotas(estudiantesActualizados)
    }
  }

  // Función para obtener estado de notas desde Divisist
  const obtenerEstadoNotasDivisist = async (
    codAlumno,
    codCarrera,
    codMateria,
    grupo
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/nota/${codAlumno}/${codCarrera}/${codMateria}/${grupo}`
      )
      if (!response.ok) {
        // Si no existe la nota, retornar un objeto vacío
        return null
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo estado de notas de Divisist:', error)
      return null
    }
  }

  // Función para actualizar estados de botones basado en notas existentes
  const actualizarEstadosBotones = (estadoNotas) => {
    if (!estadoNotas) {
      // No hay notas registradas, solo habilitar P1
      setPrimerPrevio(false)
      setSegundoPrevio([false, false])
      setTerceroPrevio([false, false])
      setExamenFinal([false, false])
      return
    }

    // Verificar qué notas ya están cerradas
    const nota1Cerrada =
      estadoNotas.nota1 !== null && estadoNotas.nota1 !== undefined
    const nota2Cerrada =
      estadoNotas.nota2 !== null && estadoNotas.nota2 !== undefined
    const nota3Cerrada =
      estadoNotas.nota3 !== null && estadoNotas.nota3 !== undefined
    const exCerrado = estadoNotas.ex !== null && estadoNotas.ex !== undefined

    // Actualizar estados según las notas cerradas
    setPrimerPrevio(nota1Cerrada)

    if (nota1Cerrada) {
      setSegundoPrevio([nota2Cerrada, true]) // Habilitado para cerrar
    } else {
      setSegundoPrevio([false, false])
    }

    if (nota2Cerrada) {
      setTerceroPrevio([nota3Cerrada, true]) // Habilitado para cerrar
    } else {
      setTerceroPrevio([false, false])
    }

    if (nota3Cerrada) {
      setExamenFinal([exCerrado, true]) // Habilitado para cerrar
    } else {
      setExamenFinal([false, false])
    }
  }

  useEffect(() => {
    const grupoData = JSON.parse(localStorage.getItem('grupo'))
    setGrupo(grupoData)

    if (grupoData) {
      // Cargar información completa del grupo y estudiantes
      const cargarDatosCompletos = async () => {
        setCargandoNotas(true)
        try {
          // 1. Obtener información del grupo desde Divisist
          const grupoDivisist = await obtenerGrupoDivisist(
            grupoData.codCarrera,
            grupoData.codMateria,
            grupoData.grupo
          )
          setGrupoCompleto(grupoDivisist)

          // 2. Obtener lista de estudiantes matriculados desde Oracle
          const estudiantesMatriculados = await obtenerEstudiantesMatriculados(
            grupoData.codCarrera,
            grupoData.codMateria,
            grupoData.grupo
          )

          // 3. Para cada matrícula, buscar el estudiante en Divisist
          const estudiantesConDatos = await Promise.all(
            estudiantesMatriculados.map(async (matricula) => {
              const codigoCompleto = matricula.codCarrera + matricula.codAlumno
              const estudianteDivisist =
                await obtenerEstudianteDivisist(codigoCompleto)
              return estudianteDivisist
            })
          )

          // Filtrar estudiantes que existen en Divisist
          const estudiantesValidos = estudiantesConDatos.filter(
            (estudiante) => estudiante !== null
          )

          // 4. Verificar estado de notas con el primer estudiante
          if (estudiantesValidos.length > 0) {
            const primerEstudiante = estudiantesValidos[0]
            const estadoNotas = await obtenerEstadoNotasDivisist(
              primerEstudiante.codigo,
              grupoData.codCarrera,
              grupoData.codMateria,
              grupoData.grupo
            )
            setNotasEstadoDivisist(estadoNotas)
            actualizarEstadosBotones(estadoNotas)
          }

          // 5. Obtener notas desde Moodle si el grupo tiene moodleId
          let notasMoodle = []
          if (grupoDivisist && grupoDivisist.moodleId) {
            notasMoodle = await obtenerNotasMoodle(grupoDivisist.moodleId)
          }

          // 6. Procesar notas para cada estudiante
          const estudiantesCompletos = estudiantesValidos.map(
            (estudianteData) => {
              // Buscar notas del estudiante en Moodle por moodleId
              const notasUsuario = notasMoodle.find(
                (nota) =>
                  nota.userid.toString() === estudianteData.moodleId?.toString()
              )

              const estudianteProcesado = procesarNotasEstudiante(
                estudianteData,
                notasUsuario
              )
              // Mantener el moodleId para futuras referencias
              estudianteProcesado.moodleId = estudianteData.moodleId
              return estudianteProcesado
            }
          )

          setListaNotas(estudiantesCompletos)
          setCargandoNotas(false)
        } catch (error) {
          console.error('Error cargando datos completos:', error)
          // En caso de error, usar datos de ejemplo como fallback
          fetch('/estudiantes.json')
            .then((response) => response.json())
            .then((data) => {
              const estudiantes = data.map((estudiante) => ({
                ...estudiante,
                Nombre: `${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`,
                DEF: `${(((estudiante['1P'] + estudiante['2P'] + estudiante['3P']) / 3) * 0.7 + estudiante.EX * 0.3).toFixed(2)}`
              }))
              setListaNotas(estudiantes)
              setCargandoNotas(false)
            })
        }
      }

      cargarDatosCompletos()
    }
  }, [backendUrl, moodleUrl, moodleToken])

  // useEffect para verificar qué botones pueden habilitarse (ahora solo verifica notas completas)
  useEffect(() => {
    if (listaNotas.length > 0) {
      setPuedeHabilitarP1(verificarNotasCompletas('P1'))
      setPuedeHabilitarP2(verificarNotasCompletas('P2'))
      setPuedeHabilitarP3(verificarNotasCompletas('P3'))
      setPuedeHabilitarEX(verificarNotasCompletas('EX'))
    }
  }, [listaNotas])

  const cerrarP1 = async () => {
    try {
      // Cerrar P1 para todos los estudiantes que tengan nota en P1
      const estudiantesConP1 = listaNotas.filter(
        (estudiante) => estudiante.P1 !== '-'
      )

      for (const estudiante of estudiantesConP1) {
        const camposActualizar = {
          nota1: parseFloat(estudiante.P1)
        }

        await cerrarNotasEnDivisist(estudiante, camposActualizar)
      }

      setPrimerPrevio(true)
      if (!segundoPrevio[1]) {
        setSegundoPrevio([false, true])
      }

      // Actualizar estado de notas en Divisist
      if (notasEstadoDivisist) {
        const nuevoEstado = {
          ...notasEstadoDivisist,
          nota1: estudiantesConP1[0]?.P1
        }
        setNotasEstadoDivisist(nuevoEstado)
      }

      // Recargar notas para mostrar cambios
      await recargarNotas()
    } catch (error) {
      console.error('Error cerrando P1:', error)
      alert('Error al cerrar P1. Por favor, intente nuevamente.')
    }
  }

  const cerrarP2 = async () => {
    try {
      // Cerrar P2 para todos los estudiantes que tengan nota en P2
      const estudiantesConP2 = listaNotas.filter(
        (estudiante) => estudiante.P2 !== '-'
      )

      for (const estudiante of estudiantesConP2) {
        const camposActualizar = {
          nota2: parseFloat(estudiante.P2)
        }

        await cerrarNotasEnDivisist(estudiante, camposActualizar)
      }

      setSegundoPrevio([true, true])
      if (!terceroPrevio[1]) {
        setTerceroPrevio([false, true])
      }

      // Actualizar estado de notas en Divisist
      if (notasEstadoDivisist) {
        const nuevoEstado = {
          ...notasEstadoDivisist,
          nota2: estudiantesConP2[0]?.P2
        }
        setNotasEstadoDivisist(nuevoEstado)
      }

      // Recargar notas para mostrar cambios
      await recargarNotas()
    } catch (error) {
      console.error('Error cerrando P2:', error)
      alert('Error al cerrar P2. Por favor, intente nuevamente.')
    }
  }

  const cerrarP3 = async () => {
    try {
      // Cerrar P3 para todos los estudiantes que tengan nota en P3
      const estudiantesConP3 = listaNotas.filter(
        (estudiante) => estudiante.P3 !== '-'
      )

      for (const estudiante of estudiantesConP3) {
        const camposActualizar = {
          nota3: parseFloat(estudiante.P3)
        }

        await cerrarNotasEnDivisist(estudiante, camposActualizar)
      }

      setTerceroPrevio([true, true])
      if (!examenFinal[1]) {
        setExamenFinal([false, true])
      }

      // Actualizar estado de notas en Divisist
      if (notasEstadoDivisist) {
        const nuevoEstado = {
          ...notasEstadoDivisist,
          nota3: estudiantesConP3[0]?.P3
        }
        setNotasEstadoDivisist(nuevoEstado)
      }

      // Recargar notas para mostrar cambios
      await recargarNotas()
    } catch (error) {
      console.error('Error cerrando P3:', error)
      alert('Error al cerrar P3. Por favor, intente nuevamente.')
    }
  }

  const cerrarEX = async () => {
    try {
      // Cerrar EX para todos los estudiantes que tengan todas las notas completas
      const estudiantesConNotasCompletas = listaNotas.filter(
        (estudiante) => estudiante.EX !== '-' && estudiante.DEF !== '-'
      )

      for (const estudiante of estudiantesConNotasCompletas) {
        const notaDefinitiva = parseFloat(estudiante.DEF)
        const estadoNota = notaDefinitiva >= 3.0 ? 'APROBADO' : 'REPROBADO'

        const camposActualizar = {
          ex: parseFloat(estudiante.EX),
          notaDefinitiva: notaDefinitiva,
          estadoNota: estadoNota
        }

        await cerrarNotasEnDivisist(estudiante, camposActualizar)
      }

      setExamenFinal([true, true])

      // Actualizar estado de notas en Divisist
      if (notasEstadoDivisist) {
        const nuevoEstado = {
          ...notasEstadoDivisist,
          ex: estudiantesConNotasCompletas[0]?.EX,
          notaDefinitiva: estudiantesConNotasCompletas[0]?.DEF
        }
        setNotasEstadoDivisist(nuevoEstado)
      }

      // Recargar notas para mostrar cambios
      await recargarNotas()
    } catch (error) {
      console.error('Error cerrando EX:', error)
      alert('Error al cerrar EX. Por favor, intente nuevamente.')
    }
  }

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
      <p className='text-subtitulos'>{grupo?.Nombre}</p>
      <div className='flex flex-row w-full my-8'>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Nombre del profesor:</div>
          <div>{grupo?.Profesor}</div>
        </div>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Número de estudiantes:</div>
          <div>{grupo?.['# Estudiantes']}</div>
        </div>
      </div>
      <p className='text-subtitulos mb-8'>Lista de estudiantes</p>
      <Tabla
        informacion={listaNotas}
        columnas={columnas}
        itemsPorPagina={10}
        cargandoContenido={cargandoNotas}
      />
      <div className='w-full flex flex-row mt-8 mb-4 justify-end space-x-4'>
        <Boton
          h={'30px'}
          onClick={cerrarP1}
          success={primerPrevio}
          disabled={!puedeHabilitarP1}
        >
          Cerrar P1
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarP2}
          disabled={!segundoPrevio[1] || !puedeHabilitarP2}
          success={segundoPrevio[0]}
        >
          Cerrar P2
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarP3}
          disabled={!terceroPrevio[1] || !puedeHabilitarP3}
          success={terceroPrevio[0]}
        >
          Cerrar P3
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarEX}
          disabled={!examenFinal[1] || !puedeHabilitarEX}
          success={examenFinal[0]}
        >
          Cerrar EX
        </Boton>
      </div>
    </div>
  )
}

export default Notas
