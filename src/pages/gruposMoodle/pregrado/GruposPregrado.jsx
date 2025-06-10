import React from 'react'
import Tabla from '../../../components/Tabla'
import { Eye, CircleFadingPlus, NotebookPen } from 'lucide-react'
import Boton from '../../../components/Boton'
import { useState, useEffect } from 'react'
import Modal from '../../../components/Modal'
import { addToast, ToastProvider } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

const GruposPregrado = () => {
  const [grupos, setGrupos] = useState([])
  const [materias, setMaterias] = useState([])
  const [profesores, setProfesores] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenGrupo, setIsOpenGrupo] = useState(false)
  const [isCreatingAll, setIsCreatingAll] = useState(false)
  const [isCreatingIndividual, setIsCreatingIndividual] = useState(false)
  const [progresoGrupos, setProgresoGrupos] = useState({ actual: 0, total: 0 })
  const [cargandoGrupos, setCargandoGrupos] = useState(true)
  const Navigate = useNavigate()
  const [grupoNombre, setGrupoNombre] = useState('')
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [informacion, setInformacion] = useState([])
  const [programa, setPrograma] = useState(null)
  const [semestres, setSemestres] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN

  // useEffect para cargar información del programa y semestres
  useEffect(() => {
    const codigoPrograma = localStorage.getItem('codigoPrograma')

    if (codigoPrograma) {
      // Obtener información del programa
      fetch(`${backendUrl}/programas/codigo/${codigoPrograma}`)
        .then((response) => response.json())
        .then((data) => {
          setPrograma(data)
          // Obtener semestres del programa
          return fetch(`${backendUrl}/programas/${data.id}/semestres`)
        })
        .then((response) => response.json())
        .then((data) => {
          setSemestres(data.semestres)
        })
        .catch((error) => {
          console.error('Error al cargar programa y semestres:', error)
        })
    }
  }, [backendUrl])

  useEffect(() => {
    setCargandoGrupos(true)

    Promise.all([
      fetch(`${backendUrl}/api/oracle/grupos/carrera?codCarrera=215`).then(
        (response) => response.json()
      ),
      fetch(`${backendUrl}/api/oracle/materias/tecnologia`).then((response) =>
        response.json()
      ),
      fetch(`${backendUrl}/api/oracle/profesores`).then((response) =>
        response.json()
      )
    ])
      .then(([gruposData, materiasData, profesoresData]) => {
        const gruposFiltrados = gruposData.sort((a, b) => {
          const materiaA = Number(a.codMateria)
          const materiaB = Number(b.codMateria)

          if (materiaA !== materiaB) {
            return materiaA - materiaB
          }

          // Si las materias son iguales, ordena por grupo.grupo (alfabético)
          return a.grupo.localeCompare(b.grupo)
        })
        setGrupos(gruposFiltrados)
        setMaterias(materiasData)
        setProfesores(profesoresData)
      })
      .finally(() => {
        setCargandoGrupos(false)
      })

    localStorage.removeItem('grupo')
    localStorage.removeItem('usuario')
  }, [])

  useEffect(() => {
    if (grupos.length && materias.length && profesores.length) {
      const datosCombinados = grupos.map((grupo) => {
        // Buscar profesor por cod_profesor
        const profesor = profesores.find(
          (prof) => prof.codProfesor === grupo.codProfesor
        )

        // Buscar materia por cod_materia y cod_carrera
        const materia = materias.find(
          (mat) =>
            mat.codMateria === grupo.codMateria &&
            mat.codCarrera === grupo.codCarrera
        )

        return {
          ...grupo,
          codProfesor: profesor?.codProfesor,
          Profesor: profesor
            ? [
                profesor.nombre1,
                profesor.nombre2,
                profesor.apellido1,
                profesor.apellido2
              ]
                .filter(Boolean) // elimina undefined, null, '', etc.
                .join(' ')
            : 'Desconocido',
          Nombre: materia ? materia.nombre : 'Desconocida',
          Código: grupo.codCarrera + grupo.codMateria + '-' + grupo.grupo,
          '# Estudiantes': grupo.numAlumMatriculados,
          semestre: materia ? materia.semestre : 'Desconocido',
          codMateria: materia?.codMateria
        }
      })

      setInformacion(datosCombinados)
    }
  }, [grupos, materias, profesores])

  const verGrupo = (grupo) => {
    localStorage.setItem('grupo', JSON.stringify(grupo))
    Navigate('grupo')
  }

  const crearGrupo = (grupo) => {
    setGrupoNombre(grupo.Nombre)
    setGrupoSeleccionado(grupo)
    setIsOpenGrupo(true)
  }

  const verNotas = (grupo) => {
    localStorage.setItem('grupo', JSON.stringify(grupo))
    Navigate('notas')
  }

  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: verGrupo
    },
    {
      icono: <CircleFadingPlus className='text-[25px]' />,
      tooltip: 'Crear/actualizar grupo',
      accion: (grupo) => crearGrupo(grupo)
    },
    {
      icono: <NotebookPen className='text-[25px]' />,
      tooltip: 'Ver notas',
      accion: (grupo) => verNotas(grupo)
    }
  ]

  const columnas = ['Código', 'Nombre', 'Profesor', '# Estudiantes']

  const filtros = ['Nombre', 'Profesor']

  const mostrarNotificacion = () => {
    if (isOpenGrupo) {
      addToast({
        title: 'Grupo actualizado',
        description: `El grupo ${grupoNombre} ha sido actualizado correctamente`,
        color: 'success',
        timeout: '3000',
        shouldShowTimeoutProgress: true
      })
    } else {
      addToast({
        title: 'Grupos actualizados',
        description: 'Los grupos han sido actualizados correctamente',
        color: 'success',
        timeout: '3000',
        shouldShowTimeoutProgress: true
      })
    }
  }

  // Nueva función para crear/actualizar todos los grupos
  const crearTodosLosGrupos = async () => {
    try {
      setIsCreatingAll(true)
      setProgresoGrupos({ actual: 0, total: informacion.length })

      let gruposCreados = 0
      let gruposConError = 0

      // Procesar cada grupo de la lista
      for (let i = 0; i < informacion.length; i++) {
        const grupo = informacion[i]

        // Actualizar progreso
        setProgresoGrupos({ actual: i + 1, total: informacion.length })

        try {
          // Llamar a la función de creación específica sin mostrar modal
          await crearGrupoIndividual(grupo)

          gruposCreados++
        } catch (error) {
          gruposConError++
        }
      }

      // Mostrar resumen final
      if (gruposConError === 0) {
        addToast({
          title: 'Proceso completado',
          description: `${gruposCreados} grupos creados/actualizados exitosamente`,
          color: 'success',
          timeout: '5000',
          shouldShowTimeoutProgress: true
        })
      } else {
        addToast({
          title: 'Proceso completado con errores',
          description: `${gruposCreados} grupos exitosos, ${gruposConError} con errores`,
          color: 'warning',
          timeout: '5000',
          shouldShowTimeoutProgress: true
        })
      }

      setIsOpen(false)
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Error en el proceso masivo de creación de grupos',
        color: 'danger',
        timeout: '3000',
        shouldShowTimeoutProgress: true
      })
    } finally {
      setIsCreatingAll(false)
      setProgresoGrupos({ actual: 0, total: 0 })
    }
  }

  // Función auxiliar para crear grupo individual sin mostrar modales
  const crearGrupoIndividual = async (grupo) => {
    // 1. Obtener datos de materia desde Oracle
    const materiaData = await obtenerMateriaOracle(
      grupo.codCarrera,
      grupo.codMateria
    )

    // 2. Verificar si la materia existe en divisist
    let materiaExistenteEnDivisist = await verificarMateriaEnDivisist(
      materiaData.codCarrera,
      materiaData.codMateria
    )

    if (!materiaExistenteEnDivisist) {
      // 3. Buscar el semestre correspondiente
      const semestreSeleccionado = buscarSemestreCorrespondiente(
        materiaData.semestre
      )

      // 4. Crear categoría en Moodle
      const idnumber = `${materiaData.codCarrera}${materiaData.codMateria}`
      const moodleData = await crearCategoriaEnMoodle(
        materiaData.nombre,
        semestreSeleccionado.moodleId,
        idnumber
      )

      // 5. Obtener pensum del programa
      const pensumData = await obtenerPensumPrograma()

      // 6. Crear materia en divisist
      materiaExistenteEnDivisist = await crearMateriaEnDivisist(
        materiaData,
        pensumData[0].id,
        moodleData[0].id
      )
    }

    // 7. Traer información del grupo desde Oracle
    const grupoInfo = await traerInformacionGrupoOracle(
      grupo.codCarrera,
      grupo.codMateria,
      grupo.grupo
    )

    // Usar el primer elemento del array
    const grupoOracle = grupoInfo[0]

    // 8. Obtener y procesar información del profesor
    const profesorData = await obtenerProfesorOracle(grupoOracle.codProfesor)

    // 9. Verificar si el profesor existe en divisist
    let profesorExistenteEnDivisist = await verificarProfesorEnDivisist(
      profesorData.codProfesor
    )

    if (!profesorExistenteEnDivisist) {
      // 10. Verificar si el usuario existe en Moodle
      let moodleUserId = await verificarUsuarioMoodlePorEmail(
        profesorData.emaili
      )

      if (!moodleUserId) {
        // Crear usuario en Moodle
        moodleUserId = await crearUsuarioEnMoodle(profesorData)
      }

      // 11. Crear profesor en divisist
      profesorExistenteEnDivisist = await crearProfesorEnDivisist(
        profesorData,
        moodleUserId
      )
    }

    // 12. Verificar si el grupo existe en divisist
    const grupoExistenteEnDivisist = await verificarGrupoEnDivisist(
      grupo.codCarrera,
      grupo.codMateria,
      grupo.grupo
    )

    let moodleCourseId

    if (grupoExistenteEnDivisist) {
      moodleCourseId = grupoExistenteEnDivisist.moodleId
    } else {
      // 13. Crear grupo en Moodle
      const semestreAcademico = calcularSemestreAcademico()
      const idnumberGrupo = `${grupoOracle.codCarrera}${grupoOracle.codMateria}${grupoOracle.grupo}-${semestreAcademico}`
      const nombreGrupo = `${materiaData.nombre} - Grupo ${grupoOracle.grupo}`

      const moodleGrupoData = await crearGrupoEnMoodle(
        nombreGrupo,
        materiaExistenteEnDivisist.moodleId,
        idnumberGrupo
      )

      // 14. Crear grupo en divisist
      await crearGrupoEnDivisist(grupoOracle, moodleGrupoData[0].id)

      moodleCourseId = moodleGrupoData[0].id
    }

    // 15. Obtener usuarios matriculados UNA SOLA VEZ
    const usuariosEnMoodle =
      await obtenerUsuariosMatriculadosEnMoodle(moodleCourseId)

    // 16. Matricular profesor en el curso de Moodle (pasando usuarios existentes)
    await matricularProfesorEnMoodle(
      profesorExistenteEnDivisist.moodleId,
      moodleCourseId,
      usuariosEnMoodle
    )

    // 17. Procesar matrícula de estudiantes (pasando usuarios existentes)
    await procesarMatriculaEstudiantes(
      grupo.codCarrera,
      grupo.codMateria,
      grupo.grupo,
      moodleCourseId,
      usuariosEnMoodle
    )
  }

  // Función para obtener datos de materia desde Oracle
  const obtenerMateriaOracle = async (codCarrera, codMateria) => {
    const response = await fetch(
      `${backendUrl}/api/oracle/materias/buscar?codCarrera=${codCarrera}&codMateria=${codMateria}`
    )
    const data = await response.json()
    return data
  }

  // Función para verificar si la materia existe en divisist
  const verificarMateriaEnDivisist = async (codCarrera, codMateria) => {
    const response = await fetch(
      `${backendUrl}/divisist/materia/${codCarrera}/${codMateria}`
    )
    const data = await response.json()
    return data && Object.keys(data).length > 0 ? data : null
  }

  // Función para verificar si el grupo existe en divisist
  const verificarGrupoEnDivisist = async (codCarrera, codMateria, grupo) => {
    const response = await fetch(
      `${backendUrl}/divisist/grupo/${codCarrera}/${codMateria}/${grupo}`
    )
    const data = await response.json()
    return data && Object.keys(data).length > 0 ? data : null
  }

  // Función para buscar el semestre correspondiente
  const buscarSemestreCorrespondiente = (numeroSemestre) => {
    const semestreSeleccionado = semestres.find(
      (s) => s.numero === parseInt(numeroSemestre)
    )

    if (!semestreSeleccionado) {
      throw new Error(`Semestre ${numeroSemestre} no encontrado`)
    }

    if (!semestreSeleccionado.moodleId) {
      throw new Error(
        `El semestre ${numeroSemestre} no tiene un ID de Moodle asociado`
      )
    }

    return semestreSeleccionado
  }

  // Función para crear categoría en Moodle
  const crearCategoriaEnMoodle = async (nombreMateria, parentId, idnumber) => {
    const response = await fetch(
      `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_categories&categories[0][name]=${encodeURIComponent(nombreMateria)}&categories[0][parent]=${parentId}&categories[0][idnumber]=${idnumber}&categories[0][description]=${encodeURIComponent(`Materia: ${nombreMateria} (${idnumber})`)}`
    )

    if (!response.ok) {
      throw new Error('Error al crear categoría en Moodle')
    }

    const data = await response.json()

    return data
  }

  // Función para obtener el pensum del programa
  const obtenerPensumPrograma = async () => {
    const response = await fetch(
      `${backendUrl}/pensums/programa/${programa.id}`
    )

    if (!response.ok) {
      throw new Error('Error al obtener el pensum del programa')
    }

    const data = await response.json()
    return data
  }

  // Función para crear materia en divisist
  const crearMateriaEnDivisist = async (materiaData, pensumId, moodleId) => {
    try {
      const response = await fetch(`${backendUrl}/divisist/materia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codMateria: materiaData.codMateria,
          codCarrera: materiaData.codCarrera,
          nomMateria: materiaData.nombre,
          creditos: materiaData.creditos,
          semestre: materiaData.semestre,
          pensum: pensumId,
          moodleId: moodleId,
          activo: true
        })
      })

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error al crear materia en Divisist:', error)
      throw error
    }
  }

  const traerInformacionGrupoOracle = async (codCarrera, codMateria, grupo) => {
    const response = await fetch(
      `${backendUrl}/api/oracle/grupos/grupo?codCarrera=${codCarrera}&codMateria=${codMateria}&grupo=${grupo}`
    )
    if (!response.ok) {
      throw new Error('Error al obtener información del grupo')
    }
    const data = await response.json()
    return data
  }

  // Función para calcular el año y período académico
  const calcularSemestreAcademico = () => {
    const fecha = new Date()
    const año = fecha.getFullYear()
    const mes = fecha.getMonth() + 1 // getMonth() retorna 0-11

    let periodo
    if (mes >= 1 && mes <= 6) {
      periodo = 'I'
    } else {
      periodo = 'II'
    }

    return `${año}-${periodo}`
  }

  // Función para crear curso (grupo) en Moodle
  const crearGrupoEnMoodle = async (nombreGrupo, parentId, idnumber) => {
    const response = await fetch(
      `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_course_create_courses&courses[0][fullname]=${encodeURIComponent(
        nombreGrupo
      )}&courses[0][shortname]=${idnumber}&courses[0][categoryid]=${parentId}&courses[0][idnumber]=${idnumber}&courses[0][summary]=${encodeURIComponent(
        `Curso: ${nombreGrupo} (${idnumber})`
      )}&courses[0][visible]=1&courses[0][format]=topics`
    )

    if (!response.ok) {
      throw new Error('Error al crear curso en Moodle')
    }

    const data = await response.json()

    return data
  }

  // Función para crear grupo en divisist
  const crearGrupoEnDivisist = async (grupoData, moodleId) => {
    try {
      const response = await fetch(`${backendUrl}/divisist/grupo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codCarrera: grupoData.codCarrera,
          codMateria: grupoData.codMateria,
          grupo: grupoData.grupo,
          codProfesor: grupoData.codProfesor,
          semestre: calcularSemestreAcademico(),
          ciclo: grupoData.ciclo,
          numAlumMatriculados: grupoData.numAlumMatriculados,
          numMaxAlumnos: grupoData.numMaxAlumnos,
          moodleId: moodleId,
          activo: true
        })
      })

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error al crear grupo en Divisist:', error)
      throw error
    }
  }

  // Función para obtener datos del profesor desde Oracle
  const obtenerProfesorOracle = async (codProfesor) => {
    const response = await fetch(
      `${backendUrl}/api/oracle/profesores/buscar/codigo?codProfesor=${codProfesor}`
    )
    if (!response.ok) {
      throw new Error('Error al obtener información del profesor')
    }
    const data = await response.json()

    return data[0] // Retorna el primer elemento del array
  }

  // Función para verificar si existe un usuario en Moodle por email
  const verificarUsuarioMoodlePorEmail = async (email) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_user_get_users&criteria[0][key]=email&criteria[0][value]=${encodeURIComponent(email)}`
      )

      if (!response.ok) {
        throw new Error('Error al verificar usuario en Moodle')
      }

      const data = await response.json()

      // Si hay resultados, el usuario existe
      if (data && data.users[0].id) {
        return data.users[0].id // Retorna el moodleId del usuario
      }

      return null // Usuario no existe
    } catch (error) {
      console.error('Error verificando usuario en Moodle:', error)
      return null
    }
  }

  // Función para crear usuario en Moodle
  const crearUsuarioEnMoodle = async (profesorData) => {
    const clave =
      profesorData.nombre1[0] +
      profesorData.apellido1[0].toLowerCase() +
      '.' +
      profesorData.codProfesor
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_user_create_users&users[0][username]=${encodeURIComponent(profesorData.codProfesor)}&users[0][password]=${clave}&users[0][firstname]=${encodeURIComponent(profesorData.nombre1 + (profesorData.nombre2 ? ' ' + profesorData.nombre2 : ''))}&users[0][lastname]=${encodeURIComponent(profesorData.apellido1 + (profesorData.apellido2 ? ' ' + profesorData.apellido2 : ''))}&users[0][email]=${encodeURIComponent(profesorData.emaili)}&users[0][auth]=manual`
      )

      if (!response.ok) {
        throw new Error('Error al crear usuario en Moodle')
      }

      const data = await response.json()

      if (data && data.length > 0 && data[0].id) {
        return data[0].id
      }

      throw new Error('Respuesta inválida al crear usuario en Moodle')
    } catch (error) {
      console.error('Error creando usuario en Moodle:', error)
      throw error
    }
  }

  // Función para verificar si el profesor existe en divisist
  const verificarProfesorEnDivisist = async (codProfesor) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/profesor/${codProfesor}`
      )
      const data = await response.json()
      return data && Object.keys(data).length > 0 ? data : null
    } catch (error) {
      console.error('Error verificando profesor en divisist:', error)
      return null
    }
  }

  // Función para crear profesor en divisist
  const crearProfesorEnDivisist = async (profesorData, moodleId) => {
    try {
      const response = await fetch(`${backendUrl}/divisist/profesor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codProfesor: profesorData.codProfesor,
          documento: profesorData.documento,
          tipoDocumento: profesorData.tipoDocumento,
          nombre1: profesorData.nombre1,
          nombre2: profesorData.nombre2 || null,
          apellido1: profesorData.apellido1,
          apellido2: profesorData.apellido2 || null,
          email: profesorData.emaili,
          moodleId: moodleId.toString(),
          activo: true
        })
      })

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error al crear profesor en Divisist:', error)
      throw error
    }
  }

  // Función para matricular profesor en curso de Moodle (modificada)
  const matricularProfesorEnMoodle = async (
    userId,
    courseId,
    usuariosEnMoodle = null
  ) => {
    try {
      // Si no se proporcionan los usuarios, obtenerlos
      if (!usuariosEnMoodle) {
        usuariosEnMoodle = await obtenerUsuariosMatriculadosEnMoodle(courseId)
      }

      // Filtrar solo profesores (roleid 3) de la lista de Moodle
      const profesoresEnMoodle = usuariosEnMoodle.filter((usuario) =>
        usuario.roles.some((rol) => rol.roleid === 3)
      )

      // Verificar si el profesor ya está matriculado
      const yaMatriculado = profesoresEnMoodle.some(
        (usuario) => usuario.id === parseInt(userId)
      )

      if (yaMatriculado) {
        // Si ya está matriculado, no hacer nada
        return { success: true, message: 'Profesor ya matriculado' }
      }

      // Si no está matriculado, proceder con la matriculación
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=enrol_manual_enrol_users&enrolments[0][roleid]=3&enrolments[0][userid]=${userId}&enrolments[0][courseid]=${courseId}`
      )

      if (!response.ok) {
        throw new Error('Error al matricular profesor en Moodle')
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error matriculando profesor en Moodle:', error)
      throw error
    }
  }

  // Función para obtener estudiantes matriculados desde Oracle
  const obtenerEstudiantesMatriculados = async (
    codCarMat,
    codMatMat,
    grupo
  ) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/oracle/materias-matriculadas/filtrar?codCarMat=${codCarMat}&codMatMat=${codMatMat}&grupo=${grupo}`
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

  // Función para verificar si el estudiante existe en divisist
  const verificarEstudianteEnDivisist = async (codigoCompleto) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/estudiante/${codigoCompleto}`
      )
      const data = await response.json()
      return data && Object.keys(data).length > 0 ? data : null
    } catch (error) {
      console.error('Error verificando estudiante en divisist:', error)
      return null
    }
  }

  // Función para obtener datos del estudiante desde Oracle
  const obtenerEstudianteOracle = async (codigoCompleto) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/oracle/estudiantes/buscar/codigo?codigo=${codigoCompleto}`
      )
      if (!response.ok) {
        throw new Error('Error al obtener información del estudiante')
      }
      const data = await response.json()

      return data[0] // Retorna el primer elemento del array
    } catch (error) {
      console.error('Error obteniendo estudiante de Oracle:', error)
      throw error
    }
  }

  // Función para crear estudiante en Moodle
  const crearEstudianteEnMoodle = async (estudianteData) => {
    const clave =
      estudianteData.primerNombre[0] +
      estudianteData.primerApellido[0].toLowerCase() +
      '.' +
      estudianteData.codigo
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_user_create_users&users[0][username]=${encodeURIComponent(estudianteData.codigo)}&users[0][password]=${clave}&users[0][firstname]=${encodeURIComponent(estudianteData.primerNombre + (estudianteData.segundoNombre ? ' ' + estudianteData.segundoNombre : ''))}&users[0][lastname]=${encodeURIComponent(estudianteData.primerApellido + (estudianteData.segundoApellido ? ' ' + estudianteData.segundoApellido : ''))}&users[0][email]=${encodeURIComponent(estudianteData.email)}&users[0][auth]=manual`
      )

      if (!response.ok) {
        throw new Error('Error al crear estudiante en Moodle')
      }

      const data = await response.json()

      if (data && data.length > 0 && data[0].id) {
        return data[0].id
      }

      throw new Error('Respuesta inválida al crear estudiante en Moodle')
    } catch (error) {
      console.error('Error creando estudiante en Moodle:', error)
      throw error
    }
  }

  // Función para crear estudiante en divisist
  const crearEstudianteEnDivisist = async (estudianteData, moodleId) => {
    try {
      const response = await fetch(`${backendUrl}/divisist/estudiante`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          codigo: estudianteData.codigo,
          nomCarrera: estudianteData.nomCarrera,
          primerNombre: estudianteData.primerNombre,
          segundoNombre: estudianteData.segundoNombre || null,
          primerApellido: estudianteData.primerApellido,
          segundoApellido: estudianteData.segundoApellido || null,
          documento: estudianteData.documento,
          tipoDocumento: estudianteData.tipoDocumento,
          fechaNacimiento: estudianteData.fechaNacimiento,
          tMatriculado: estudianteData.tmatriculado,
          descTipoCar: estudianteData.descTipoCar,
          email: estudianteData.email,
          moodleId: moodleId.toString(),
          activo: true
        })
      })

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error al crear estudiante en Divisist:', error)
      throw error
    }
  }

  // Función para matricular estudiante en curso de Moodle
  const matricularEstudianteEnMoodle = async (userId, courseId) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=enrol_manual_enrol_users&enrolments[0][roleid]=5&enrolments[0][userid]=${userId}&enrolments[0][courseid]=${courseId}`
      )

      if (!response.ok) {
        throw new Error('Error al matricular estudiante en Moodle')
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error matriculando estudiante en Moodle:', error)
      throw error
    }
  }

  // Función para crear materia-matriculada en divisist
  const crearMateriaMatriculadaEnDivisist = async (matriculaData) => {
    try {
      const response = await fetch(
        `${backendUrl}/divisist/materia-matriculada`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            codigo: matriculaData.codCarrera + matriculaData.codAlumno,
            codMateria: matriculaData.codMateria,
            codCarrera: matriculaData.codCarrera,
            grupo: matriculaData.grupo,
            ciclo: matriculaData.ciclo,
            activo: true
          })
        }
      )

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Error al crear materia-matriculada en Divisist:', error)
      throw error
    }
  }

  // Función para obtener usuarios matriculados en un curso de Moodle
  const obtenerUsuariosMatriculadosEnMoodle = async (courseId) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=core_enrol_get_enrolled_users&courseid=${courseId}`
      )

      if (!response.ok) {
        throw new Error('Error al obtener usuarios matriculados en Moodle')
      }

      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Error obteniendo usuarios matriculados en Moodle:', error)
      return []
    }
  }

  // Función para desmatricular usuario de curso de Moodle
  const desmatricularUsuarioEnMoodle = async (userId, courseId) => {
    try {
      const response = await fetch(
        `${moodleUrl}?wstoken=${moodleToken}&moodlewsrestformat=json&wsfunction=enrol_manual_unenrol_users&enrolments[0][userid]=${userId}&enrolments[0][courseid]=${courseId}`
      )

      if (!response.ok) {
        throw new Error('Error al desmatricular usuario en Moodle')
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error desmatriculando usuario en Moodle:', error)
      throw error
    }
  }

  // Función para procesar matriculación de estudiantes (modificada)
  const procesarMatriculaEstudiantes = async (
    codCarrera,
    codMateria,
    grupo,
    moodleCourseId,
    usuariosEnMoodle = null
  ) => {
    try {
      // 1. Obtener lista de estudiantes matriculados desde Oracle
      const estudiantesMatriculados = await obtenerEstudiantesMatriculados(
        codCarrera,
        codMateria,
        grupo
      )

      // 2. Si no se proporcionan los usuarios, obtenerlos
      if (!usuariosEnMoodle) {
        usuariosEnMoodle =
          await obtenerUsuariosMatriculadosEnMoodle(moodleCourseId)
      }

      // Filtrar solo estudiantes (roleid 5) de la lista de Moodle
      const estudiantesEnMoodle = usuariosEnMoodle.filter((usuario) =>
        usuario.roles.some((rol) => rol.roleid === 5)
      )

      // 3. Crear array con los moodleIds de estudiantes que deberían estar matriculados
      const moodleIdsEsperados = []

      // Procesar cada estudiante que debería estar matriculado
      for (const matricula of estudiantesMatriculados) {
        const codigoCompleto = matricula.codCarrera + matricula.codAlumno

        // Verificar si el estudiante existe en divisist
        let estudianteExistenteEnDivisist =
          await verificarEstudianteEnDivisist(codigoCompleto)

        if (!estudianteExistenteEnDivisist) {
          // Obtener datos del estudiante desde Oracle
          const estudianteData = await obtenerEstudianteOracle(codigoCompleto)

          // Verificar si el usuario existe en Moodle
          let moodleUserId = await verificarUsuarioMoodlePorEmail(
            estudianteData.email
          )

          if (!moodleUserId) {
            // Crear usuario estudiante en Moodle
            moodleUserId = await crearEstudianteEnMoodle(estudianteData)
          }

          // Crear estudiante en divisist
          estudianteExistenteEnDivisist = await crearEstudianteEnDivisist(
            estudianteData,
            moodleUserId
          )
        }

        const moodleIdEstudiante = parseInt(
          estudianteExistenteEnDivisist.moodleId
        )
        moodleIdsEsperados.push(moodleIdEstudiante)

        // Verificar si el estudiante ya está matriculado en Moodle
        const yaMatriculado = estudiantesEnMoodle.some(
          (usuario) => usuario.id === moodleIdEstudiante
        )

        if (!yaMatriculado) {
          // Matricular estudiante en el curso de Moodle solo si no está matriculado
          await matricularEstudianteEnMoodle(
            estudianteExistenteEnDivisist.moodleId,
            moodleCourseId
          )
        }

        // Crear materia-matriculada en divisist
        await crearMateriaMatriculadaEnDivisist(matricula)
      }

      // 4. Desmatricular estudiantes que están en Moodle pero no deberían estar
      for (const estudianteEnMoodle of estudiantesEnMoodle) {
        if (!moodleIdsEsperados.includes(estudianteEnMoodle.id)) {
          await desmatricularUsuarioEnMoodle(
            estudianteEnMoodle.id,
            moodleCourseId
          )
        }
      }
    } catch (error) {
      console.error('Error procesando matrícula de estudiantes:', error)
      throw error
    }
  }

  // Función principal refactorizada
  const crearGrupoEspecifico = async (grupo) => {
    try {
      setIsCreatingIndividual(true)

      // 1. Obtener datos de materia desde Oracle
      const materiaData = await obtenerMateriaOracle(
        grupo.codCarrera,
        grupo.codMateria
      )

      // 2. Verificar si la materia existe en divisist
      let materiaExistenteEnDivisist = await verificarMateriaEnDivisist(
        materiaData.codCarrera,
        materiaData.codMateria
      )

      if (!materiaExistenteEnDivisist) {
        // 3. Buscar el semestre correspondiente
        const semestreSeleccionado = buscarSemestreCorrespondiente(
          materiaData.semestre
        )

        // 4. Crear categoría en Moodle
        const idnumber = `${materiaData.codCarrera}${materiaData.codMateria}`
        const moodleData = await crearCategoriaEnMoodle(
          materiaData.nombre,
          semestreSeleccionado.moodleId,
          idnumber
        )

        // 5. Obtener pensum del programa
        const pensumData = await obtenerPensumPrograma()

        // 6. Crear materia en divisist
        materiaExistenteEnDivisist = await crearMateriaEnDivisist(
          materiaData,
          pensumData[0].id,
          moodleData[0].id
        )
      }

      // 7. Traer información del grupo desde Oracle
      const grupoInfo = await traerInformacionGrupoOracle(
        grupo.codCarrera,
        grupo.codMateria,
        grupo.grupo
      )

      // Usar el primer elemento del array
      const grupoOracle = grupoInfo[0]

      // 8. Obtener y procesar información del profesor
      const profesorData = await obtenerProfesorOracle(grupoOracle.codProfesor)

      // 9. Verificar si el profesor existe en divisist
      let profesorExistenteEnDivisist = await verificarProfesorEnDivisist(
        profesorData.codProfesor
      )

      if (!profesorExistenteEnDivisist) {
        // 10. Verificar si el usuario existe en Moodle
        let moodleUserId = await verificarUsuarioMoodlePorEmail(
          profesorData.emaili
        )

        if (!moodleUserId) {
          // Crear usuario en Moodle
          moodleUserId = await crearUsuarioEnMoodle(profesorData)
        }

        // 11. Crear profesor en divisist
        profesorExistenteEnDivisist = await crearProfesorEnDivisist(
          profesorData,
          moodleUserId
        )
      }

      // 12. Verificar si el grupo existe en divisist
      const grupoExistenteEnDivisist = await verificarGrupoEnDivisist(
        grupo.codCarrera,
        grupo.codMateria,
        grupo.grupo
      )

      if (grupoExistenteEnDivisist) {
        // Obtener usuarios matriculados UNA SOLA VEZ
        const usuariosEnMoodle = await obtenerUsuariosMatriculadosEnMoodle(
          grupoExistenteEnDivisist.moodleId
        )

        // Matricular profesor en el curso existente (pasando usuarios existentes)
        await matricularProfesorEnMoodle(
          profesorExistenteEnDivisist.moodleId,
          grupoExistenteEnDivisist.moodleId,
          usuariosEnMoodle
        )

        // Procesar matrícula de estudiantes (pasando usuarios existentes)
        await procesarMatriculaEstudiantes(
          grupo.codCarrera,
          grupo.codMateria,
          grupo.grupo,
          grupoExistenteEnDivisist.moodleId,
          usuariosEnMoodle
        )

        addToast({
          title: 'Información',
          description: `Profesor y estudiantes matriculados en el grupo ${grupo.grupo}`,
          color: 'success',
          timeout: '3000',
          shouldShowTimeoutProgress: true
        })
      } else {
        // 13. Crear grupo en Moodle
        const semestreAcademico = calcularSemestreAcademico()
        const idnumberGrupo = `${grupoOracle.codCarrera}${grupoOracle.codMateria}${grupoOracle.grupo}-${semestreAcademico}`
        const nombreGrupo = `${materiaData.nombre} - Grupo ${grupoOracle.grupo}`

        const moodleGrupoData = await crearGrupoEnMoodle(
          nombreGrupo,
          materiaExistenteEnDivisist.moodleId,
          idnumberGrupo
        )

        // 14. Crear grupo en divisist
        await crearGrupoEnDivisist(grupoOracle, moodleGrupoData[0].id)

        // 15. Obtener usuarios matriculados UNA SOLA VEZ (curso recién creado, estará vacío)
        const usuariosEnMoodle = []

        // 16. Matricular profesor en el curso de Moodle (pasando usuarios existentes)
        await matricularProfesorEnMoodle(
          profesorExistenteEnDivisist.moodleId,
          moodleGrupoData[0].id,
          usuariosEnMoodle
        )

        // 17. Procesar matrícula de estudiantes (pasando usuarios existentes)
        await procesarMatriculaEstudiantes(
          grupo.codCarrera,
          grupo.codMateria,
          grupo.grupo,
          moodleGrupoData[0].id,
          usuariosEnMoodle
        )

        mostrarNotificacion()
      }

      setIsOpenGrupo(false)
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Error al crear el grupo',
        color: 'danger',
        timeout: '3000',
        shouldShowTimeoutProgress: true
      })
    } finally {
      setIsCreatingIndividual(false)
    }
  }

  return (
    <div className='flex flex-col items-center w-full p-4'>
      <p className='text-titulos'>Lista de grupos</p>
      <div className='w-full my-8'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          acciones={acciones}
          filtros={filtros}
          cargandoContenido={cargandoGrupos}
        />
      </div>
      <div className='w-full flex justify-end mt-4'>
        <Boton
          onClick={() => {
            setIsOpen(true)
          }}
          disabled={isCreatingAll}
        >
          {isCreatingAll ? 'Creando grupos...' : 'Crear grupos'}
        </Boton>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!isCreatingAll) {
            setIsOpen(open)
          }
        }}
        cabecera='Crear Grupos'
        cuerpo={
          <div>
            <p>¿Estás seguro de crear/actualizar todos los grupos?</p>
            {isCreatingAll && (
              <p className='text-sm text-gray-600 mt-2'>
                Procesando grupos ({progresoGrupos.actual}/
                {progresoGrupos.total}), por favor espere...
              </p>
            )}
          </div>
        }
        footer={
          <Boton onClick={crearTodosLosGrupos} disabled={isCreatingAll}>
            {isCreatingAll ? 'Creando...' : 'Aceptar'}
          </Boton>
        }
      />
      <Modal
        isOpen={isOpenGrupo}
        onOpenChange={(open) => {
          if (!isCreatingIndividual) {
            setIsOpenGrupo(open)
          }
        }}
        cabecera='Crear Grupo'
        cuerpo={
          <div>
            <p>
              {'¿Estás seguro de crear/actualizar el grupo ' +
                grupoNombre +
                '?'}
            </p>
            {isCreatingIndividual && (
              <p className='text-sm text-gray-600 mt-2'>
                Creando grupo, por favor espere...
              </p>
            )}
          </div>
        }
        footer={
          <Boton
            onClick={() => crearGrupoEspecifico(grupoSeleccionado)}
            disabled={isCreatingIndividual}
          >
            {isCreatingIndividual ? 'Creando...' : 'Aceptar'}
          </Boton>
        }
      />
      <ToastProvider
        placement='top-right'
        toastOffset={10}
        maxVisibleToasts={1}
      />
    </div>
  )
}
export default GruposPregrado
