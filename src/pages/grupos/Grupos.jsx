import { useEffect, useState } from 'react'
import Tabla from '../../components/Tabla'
import Boton from '../../components/Boton'
import Modal from '../../components/Modal'
import { Form, Autocomplete, AutocompleteItem, Input } from '@heroui/react'
import { Eye, Pencil } from 'lucide-react'
import AlertaModal from '../../components/AlertaModal'

const Grupos = () => {
  const [grupos, setGrupos] = useState([])
  const [gruposCohorte, setGruposCohorte] = useState([])
  const [profesores, setProfesores] = useState([])
  const [informacion, setInformacion] = useState([])
  const [cargandoGrupos, setCargandoGrupos] = useState(true)
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN
  // Estados para el modal de creación
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenView, setIsOpenView] = useState(false)
  const [materias, setMaterias] = useState([])
  const [materiaId, setMateriaId] = useState('')
  const [cohorteId, setCohorteId] = useState('')
  const [docenteId, setDocenteId] = useState('')
  const [modoEdicion, setModoEdicion] = useState(false)
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)
  const [grupoId, setGrupoId] = useState(null)

  // Nuevos estados para programas y pensums
  const [programas, setProgramas] = useState([])
  const [pensums, setPensums] = useState([])
  const [programaId, setProgramaId] = useState('')
  const [pensumId, setPensumId] = useState('')

  // Estados para el AlertaModal
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState('success')
  const [alertMessage, setAlertMessage] = useState('')

  // Validaciones para campos obligatorios
  const materiaIdErrors = []
  if (materiaId === '') {
    materiaIdErrors.push('Este campo es obligatorio')
  }

  const cohorteIdErrors = []
  if (cohorteId === '') {
    cohorteIdErrors.push('Este campo es obligatorio')
  }

  const docenteIdErrors = []
  if (docenteId === '') {
    docenteIdErrors.push('Este campo es obligatorio')
  }

  // Nuevas validaciones
  const programaIdErrors = []
  if (!modoEdicion && programaId === '') {
    programaIdErrors.push('Este campo es obligatorio')
  }

  const pensumIdErrors = []
  if (!modoEdicion && pensumId === '') {
    pensumIdErrors.push('Este campo es obligatorio')
  }

  useEffect(() => {
    cargarDatos()
    // Cargar la lista de programas
    fetch(`${backendUrl}/programas/listar`)
      .then((response) => response.json())
      .then((data) => {
        setProgramas(data)
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar los programas')
        setIsAlertOpen(true)
      })
  }, [])

  // Efecto para cargar pensums cuando se selecciona un programa
  useEffect(() => {
    if (programaId) {
      fetch(`${backendUrl}/pensums/programa/${programaId}`)
        .then((response) => response.json())
        .then((data) => {
          setPensums(data)
          // Reset pensum and materia selection
          setPensumId('')
          setMateriaId('')
          setMaterias([])
        })
        .catch(() => {
          setAlertType('error')
          setAlertMessage('Error al cargar los pensums')
          setIsAlertOpen(true)
        })
    }
  }, [programaId])

  // Efecto para cargar materias cuando se selecciona un pensum
  useEffect(() => {
    if (pensumId) {
      fetch(`${backendUrl}/materias/pensum/${pensumId}`)
        .then((response) => response.json())
        .then((data) => {
          setMaterias(data)
          setMateriaId('')
        })
        .catch(() => {
          setAlertType('error')
          setAlertMessage('Error al cargar las materias')
          setIsAlertOpen(true)
        })
    }
  }, [pensumId])

  const cargarDatos = () => {
    setCargandoGrupos(true)
    fetch(`${backendUrl}/grupos/vinculados`)
      .then((response) => response.json())
      .then((data) => {
        setGrupos(data)
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar los grupos')
        setIsAlertOpen(true)
      })
      .finally(() => {
        setCargandoGrupos(false)
      })

    fetch(`${backendUrl}/cohortes/listar`)
      .then((response) => response.json())
      .then((data) => {
        // Una vez que tenemos las cohortes, obtenemos los grupos de cada cohorte
        const fetchGruposPromises = data.map((cohorte) => {
          return fetch(`${backendUrl}/cohortes/${cohorte.id}`)
            .then((response) => response.json())
            .then((cohortesData) => {
              // Devolvemos los grupos de esta cohorte
              return cohortesData.cohortesGrupos || []
            })
        })

        // Esperamos a que todas las peticiones terminen
        Promise.all(fetchGruposPromises)
          .then((resultados) => {
            // Aplanamos el array de arrays de grupos
            const todosLosGrupos = resultados.flat()
            setGruposCohorte(todosLosGrupos)
          })
          .catch(() => {
            setAlertType('error')
            setAlertMessage('Error al obtener los grupos de las cohortes')
            setIsAlertOpen(true)
          })
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar las cohortes')
        setIsAlertOpen(true)
      })

    fetch(`${backendUrl}/usuarios/rol/2`)
      .then((response) => response.json())
      .then((data) => {
        setProfesores(data)
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar los profesores')
        setIsAlertOpen(true)
      })

    // Cargar materias para el formulario
    fetch(`${backendUrl}/materias/listar`)
      .then((response) => response.json())
      .then((data) => {
        setMaterias(data)
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar las materias')
        setIsAlertOpen(true)
      })
  }

  useEffect(() => {
    if (grupos.length > 0) {
      const datosCombinados = grupos.map((grupo) => {
        return {
          ...grupo,
          Código: grupo.codigoGrupo,
          Nombre: grupo.grupoNombre,
          Cohorte: grupo.cohorteNombre,
          Profesor: grupo.docenteNombre
        }
      })
      setInformacion(datosCombinados)
    }
  }, [grupos])

  const columnas = ['Código', 'Nombre', 'Cohorte', 'Profesor']
  const filtros = ['Código', 'Nombre', 'Cohorte', 'Profesor']

  // Acciones para la tabla
  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: (grupo) => verGrupo(grupo)
    },
    {
      icono: <Pencil className='text-[25px]' />,
      tooltip: 'Editar',
      accion: (grupo) => prepararEdicion(grupo)
    }
  ]

  // Función para ver detalles del grupo
  const verGrupo = (grupo) => {
    fetch(`${backendUrl}/grupos/vinculado/${grupo.id}`)
      .then((response) => response.json())
      .then((data) => {
        setGrupoSeleccionado({
          ...data,
          Código: data.codigoMateria,
          Nombre: data.grupoNombre,
          Cohorte: data.cohorteGrupoNombre,
          Profesor: data.docenteNombre
        })
        setIsOpenView(true)
      })
      .catch(() => {
        setAlertType('error')
        setAlertMessage('Error al cargar los detalles del grupo')
        setIsAlertOpen(true)
      })
  }

  // Función para preparar la edición
  const prepararEdicion = (grupo) => {
    setGrupoSeleccionado(grupo)

    setMateriaId(grupo.grupoId?.toString() || '')
    setCohorteId(grupo.cohorteGrupoId?.toString() || '')
    setDocenteId(grupo.docenteId?.toString() || '')
    setGrupoId(grupo.id)
    setModoEdicion(true)
    setIsOpen(true)
  }

  // Función para validar campos del formulario
  const validarCampos = () => {
    if (!materiaId || !cohorteId || !docenteId) {
      setAlertType('error')
      setAlertMessage('Por favor complete todos los campos')
      setIsAlertOpen(true)
      return false
    }
    return true
  }

  // Función para crear un grupo
  const crearGrupo = async () => {
    try {
      const response = await fetch(`${backendUrl}/grupos/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ materiaId: parseInt(materiaId) })
      })

      const data = await response.json()

      if (!response.ok) {
        setAlertType('error')
        setAlertMessage(data.message || 'Error al crear el grupo')
        setIsAlertOpen(true)
        return null
      }

      return data.id
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al crear el grupo')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para vincular un grupo
  const vincularGrupo = async (nuevoGrupoId) => {
    try {
      const response = await fetch(`${backendUrl}/grupos/vincular`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          grupoId: nuevoGrupoId,
          cohorteGrupoId: parseInt(cohorteId),
          docenteId: parseInt(docenteId)
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setAlertType('error')
        setAlertMessage(
          data.message || 'El grupo fue creado pero hubo un error al vincularlo'
        )
        setIsAlertOpen(true)
        return null
      }

      return data
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al vincular el grupo')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para obtener información de la materia
  const obtenerInformacionMateria = async (materiaId) => {
    try {
      const response = await fetch(`${backendUrl}/materias/${materiaId}`)
      const data = await response.json()

      if (!response.ok) {
        setAlertType('error')
        setAlertMessage(
          data.message || 'Error al obtener la información de la materia'
        )
        setIsAlertOpen(true)
        return null
      }

      return data
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al obtener la información de la materia')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para crear curso en Moodle
  const crearCursoMoodle = async (nombreGrupo, codigoGrupo, categoriaId) => {
    try {
      const url =
        `${moodleUrl}?wstoken=${moodleToken}` +
        `&wsfunction=core_course_create_courses` +
        `&courses[0][fullname]=${encodeURIComponent(nombreGrupo)}` +
        `&courses[0][shortname]=${encodeURIComponent(codigoGrupo)}` +
        `&courses[0][categoryid]=${categoriaId}` +
        `&courses[0][idnumber]=${encodeURIComponent(codigoGrupo)}` +
        `&moodlewsrestformat=json`

      const response = await fetch(url)
      const data = await response.json()

      if (!data || !Array.isArray(data) || data.length === 0 || !data[0].id) {
        console.error('Respuesta inesperada de Moodle:', data)
        setAlertType('error')
        setAlertMessage('Error: Formato de respuesta de Moodle no válido')
        setIsAlertOpen(true)
        return null
      }

      return data[0].id
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al crear el curso en Moodle')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para asignar ID de Moodle al grupo
  const asignarMoodleIdGrupo = async (grupoId, moodleId) => {
    try {
      const response = await fetch(
        `${backendUrl}/grupos/moodle/${grupoId}?moodleId=${moodleId}`,
        { method: 'POST' }
      )

      if (!response.ok) {
        const data = await response.json()
        setAlertType('error')
        setAlertMessage(
          data.message || 'Error al asignar el ID de Moodle al grupo'
        )
        setIsAlertOpen(true)
        return false
      }

      return true
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al asignar el ID de Moodle al grupo')
      setIsAlertOpen(true)
      return false
    }
  }

  // Función para obtener información del profesor
  const obtenerInformacionProfesor = async (profesorId) => {
    try {
      const response = await fetch(`${backendUrl}/usuarios/${profesorId}`)
      const data = await response.json()

      if (!response.ok) {
        setAlertType('error')
        setAlertMessage(
          data.message || 'Error al obtener la información del profesor'
        )
        setIsAlertOpen(true)
        return null
      }

      return data
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al obtener la información del profesor')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para hacer enroll del profesor en el curso de Moodle
  const enrollProfesorEnCurso = async (profesorMoodleId, cursoMoodleId) => {
    try {
      // El rol 3 suele ser el de profesor/teacher en Moodle, pero podría ser diferente en tu instalación
      const rolId = 3

      const url =
        `${moodleUrl}?wstoken=${moodleToken}` +
        `&wsfunction=enrol_manual_enrol_users` +
        `&enrolments[0][roleid]=${rolId}` +
        `&enrolments[0][userid]=${profesorMoodleId}` +
        `&enrolments[0][courseid]=${cursoMoodleId}` +
        `&moodlewsrestformat=json`

      const response = await fetch(url)
      const data = await response.json()

      // La función enrol_manual_enrol_users no devuelve nada en caso de éxito
      // En caso de error, devuelve un objeto con la propiedad 'exception'
      if (data && data.exception) {
        console.error('Error al hacer enroll del profesor:', data)
        setAlertType('error')
        setAlertMessage(
          `Error al inscribir al profesor en el curso: ${data.message}`
        )
        setIsAlertOpen(true)
        return false
      }

      return true
    } catch (error) {
      console.error('Error en la función enrollProfesorEnCurso:', error)
      setAlertType('error')
      setAlertMessage('Error al inscribir al profesor en el curso')
      setIsAlertOpen(true)
      return false
    }
  }

  // Función para obtener la información del grupo vinculado
  const obtenerGrupoVinculado = async (idGrupo) => {
    try {
      const response = await fetch(`${backendUrl}/grupos/vinculado/${idGrupo}`)
      const data = await response.json()

      if (!response.ok) {
        setAlertType('error')
        setAlertMessage(
          data.message || 'Error al obtener información del grupo'
        )
        setIsAlertOpen(true)
        return null
      }

      return data
    } catch (error) {
      setAlertType('error')
      setAlertMessage('Error al obtener información del grupo')
      setIsAlertOpen(true)
      return null
    }
  }

  // Función para hacer unenroll de un usuario en Moodle
  const unenrollUsuarioDelCurso = async (usuarioMoodleId, cursoMoodleId) => {
    try {
      // La API de Moodle para desenrolar usuarios
      const url =
        `${moodleUrl}?wstoken=${moodleToken}` +
        `&wsfunction=enrol_manual_unenrol_users` +
        `&enrolments[0][userid]=${usuarioMoodleId}` +
        `&enrolments[0][courseid]=${cursoMoodleId}` +
        `&moodlewsrestformat=json`

      const response = await fetch(url)
      const data = await response.json()

      // Similar a enrol_manual_enrol_users, esta función no devuelve nada en caso de éxito
      if (data && data.exception) {
        console.error('Error al hacer unenroll del usuario:', data)
        setAlertType('error')
        setAlertMessage(
          `Error al retirar al profesor del curso: ${data.message}`
        )
        setIsAlertOpen(true)
        return false
      }

      return true
    } catch (error) {
      console.error('Error en la función unenrollUsuarioDelCurso:', error)
      setAlertType('error')
      setAlertMessage('Error al retirar al profesor del curso')
      setIsAlertOpen(true)
      return false
    }
  }

  // Función para actualizar profesor en Moodle al actualizar grupo
  const actualizarProfesorEnMoodle = async (
    grupoId,
    nuevoDocenteId,
    docenteIdAnterior
  ) => {
    try {
      // Si el profesor no ha cambiado, no hacemos nada
      if (nuevoDocenteId === docenteIdAnterior) {
        return true
      }

      // Obtener información del grupo para conseguir el moodleId del curso
      const grupoInfo = await obtenerGrupoVinculado(grupoId)
      if (!grupoInfo || !grupoInfo.moodleId) {
        console.warn('El grupo no tiene un ID de Moodle asociado')
        return false
      }

      // Obtener información del profesor anterior
      const profesorAnteriorInfo =
        await obtenerInformacionProfesor(docenteIdAnterior)
      if (profesorAnteriorInfo && profesorAnteriorInfo.moodleId) {
        // Desenrolar al profesor anterior
        const unenrollExitoso = await unenrollUsuarioDelCurso(
          profesorAnteriorInfo.moodleId,
          grupoInfo.moodleId
        )
        if (!unenrollExitoso) {
          console.warn('No se pudo retirar al profesor anterior del curso')
        }
      }

      // Obtener información del nuevo profesor
      const nuevoProfesorInfo = await obtenerInformacionProfesor(nuevoDocenteId)
      if (nuevoProfesorInfo && nuevoProfesorInfo.moodleId) {
        // Enrolar al nuevo profesor
        const enrollExitoso = await enrollProfesorEnCurso(
          nuevoProfesorInfo.moodleId,
          grupoInfo.moodleId
        )
        if (!enrollExitoso) {
          console.warn('No se pudo inscribir al nuevo profesor en el curso')
          return false
        }
      } else {
        console.warn('El nuevo profesor no tiene ID de Moodle asignado')
        return false
      }

      return true
    } catch (error) {
      console.error('Error al actualizar profesor en Moodle:', error)
      return false
    }
  }

  // Función principal para crear y vincular grupo
  const crearYVincularGrupo = async (e) => {
    e.preventDefault()

    // Paso 0: Validar campos
    if (!validarCampos()) {
      return
    }

    try {
      // Paso 1: Crear el grupo
      const nuevoGrupoId = await crearGrupo()
      if (nuevoGrupoId === null) return

      // Paso 2: Vincular el grupo
      const grupoVinculado = await vincularGrupo(nuevoGrupoId)
      if (grupoVinculado === null) return

      // Paso 3: Obtener información de la materia
      const materiaInfo = await obtenerInformacionMateria(
        grupoVinculado.materiaId
      )
      if (materiaInfo === null) return

      // Paso 4: Obtener información del profesor
      const profesorInfo = await obtenerInformacionProfesor(
        grupoVinculado.docenteId
      )
      if (profesorInfo === null) return

      // Paso 5: Crear curso en Moodle
      const moodleCourseId = await crearCursoMoodle(
        grupoVinculado.grupoNombre + ' - ' + programas[0].semestreActual,
        grupoVinculado.codigoGrupo + '-' + programas[0].semestreActual,
        materiaInfo.moodleId
      )
      if (moodleCourseId === null) return

      // Paso 6: Asignar ID de Moodle al grupo
      const asignacionExitosa = await asignarMoodleIdGrupo(
        grupoVinculado.id,
        moodleCourseId
      )
      if (!asignacionExitosa) return

      // Paso 7: Hacer enroll del profesor en el curso de Moodle
      if (profesorInfo.moodleId) {
        const enrollExitoso = await enrollProfesorEnCurso(
          profesorInfo.moodleId,
          moodleCourseId
        )
        if (!enrollExitoso) {
          console.warn(
            'No se pudo inscribir al profesor, pero el curso fue creado'
          )
        }
      } else {
        console.warn(
          'El profesor no tiene ID de Moodle asignado, no se puede hacer enroll'
        )
      }

      // Todo se ha completado correctamente
      limpiarFormulario()
      setIsOpen(false)
      setAlertType('success')
      setAlertMessage(
        'Grupo creado, vinculado y curso en Moodle creado correctamente'
      )
      setIsAlertOpen(true)
      cargarDatos()
    } catch (error) {
      console.error('Error en el proceso:', error)
      setAlertType('error')
      setAlertMessage('Error al procesar la solicitud')
      setIsAlertOpen(true)
    }
  }

  // Función para actualizar un grupo vinculado
  const actualizarGrupoVinculado = async (e) => {
    e.preventDefault()

    if (!materiaId || !cohorteId || !docenteId || !grupoId) {
      setAlertType('error')
      setAlertMessage('Por favor complete todos los campos')
      setIsAlertOpen(true)
      return
    }

    try {
      // Guardamos el ID del docente anterior antes de actualizar
      const grupoAnterior = await obtenerGrupoVinculado(grupoId)
      if (!grupoAnterior) return

      const docenteIdAnterior = grupoAnterior.docenteId

      // Actualizar el grupo en el backend
      const actualizarResponse = await fetch(
        `${backendUrl}/grupos/vincular/${grupoId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            grupoId: parseInt(materiaId),
            cohorteGrupoId: parseInt(cohorteId),
            docenteId: parseInt(docenteId)
          })
        }
      )

      const actualizarData = await actualizarResponse.json()

      if (!actualizarResponse.ok) {
        setAlertType('error')
        setAlertMessage(
          actualizarData.message || 'Error al actualizar el grupo'
        )
        setIsAlertOpen(true)
        return
      }

      // Si el docente ha cambiado, actualizamos en Moodle
      if (parseInt(docenteId) !== docenteIdAnterior) {
        const actualizacionMoodleExitosa = await actualizarProfesorEnMoodle(
          grupoId,
          parseInt(docenteId),
          docenteIdAnterior
        )

        if (!actualizacionMoodleExitosa) {
          console.warn(
            'No se pudo actualizar correctamente el profesor en Moodle'
          )
        }
      }

      // Limpiar el formulario y cerrar el modal
      limpiarFormulario()
      setIsOpen(false)

      // Mostrar mensaje de éxito
      setAlertType('success')
      setAlertMessage('Grupo actualizado correctamente')
      setIsAlertOpen(true)

      // Recargar datos
      cargarDatos()
    } catch (error) {
      console.error('Error al actualizar grupo:', error)
      setAlertType('error')
      setAlertMessage('Error al procesar la solicitud')
      setIsAlertOpen(true)
    }
  }

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setMateriaId('')
    setCohorteId('')
    setDocenteId('')
    setGrupoId(null)
    setProgramaId('') // Limpiar programa
    setPensumId('') // Limpiar pensum
    setModoEdicion(false)
    setGrupoSeleccionado(null)
  }

  // Función para formatear el nombre completo del profesor
  const getNombreCompleto = (profesor) => {
    const primerNombre = profesor.primerNombre || ''
    const segundoNombre = profesor.segundoNombre || ''
    const primerApellido = profesor.primerApellido || ''
    const segundoApellido = profesor.segundoApellido || ''

    return `${primerNombre} ${segundoNombre} ${primerApellido} ${segundoApellido}`.trim()
  }

  return (
    <div className='p-4 w-full flex flex-col justify-center items-center'>
      <div className='w-full flex items-center justify-between mb-8'>
        <p className='text-center text-titulos flex-1'>Grupos</p>
        <Boton
          onClick={() => {
            limpiarFormulario()
            setIsOpen(true)
          }}
        >
          Crear grupo
        </Boton>
      </div>
      <Tabla
        informacion={informacion}
        filtros={filtros}
        columnas={columnas}
        acciones={acciones}
        elementosPorPagina={10}
        cargandoContenido={cargandoGrupos}
      />

      {/* Modal para crear/editar grupo */}
      <Modal
        size='xl'
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            limpiarFormulario()
          }
        }}
        cabecera={modoEdicion ? 'Editar Grupo' : 'Crear Grupo'}
        cuerpo={
          <Form
            className='flex flex-col gap-4'
            onSubmit={
              modoEdicion ? actualizarGrupoVinculado : crearYVincularGrupo
            }
          >
            {/* Mostrar autocompletes de programa y pensum solo en modo creación */}
            {!modoEdicion && (
              <>
                <div className='w-full py-4'>
                  <Autocomplete
                    variant='bordered'
                    className='w-full'
                    defaultItems={programas}
                    selectedKey={programaId}
                    label='Programa'
                    size='md'
                    placeholder='Selecciona el programa'
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
                        {programa.codigo + ' - ' + programa.nombre}
                      </AutocompleteItem>
                    )}
                  </Autocomplete>
                </div>

                {programaId && (
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
                      onSelectionChange={(id) => {
                        setPensumId(id || '')
                      }}
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
                )}
                {pensumId && (
                  <div className='w-full py-4'>
                    <Autocomplete
                      variant='bordered'
                      className='w-full'
                      defaultItems={materias}
                      selectedKey={materiaId}
                      label='Materia'
                      size='md'
                      placeholder='Selecciona la materia'
                      labelPlacement='outside'
                      isRequired
                      isDisabled={modoEdicion}
                      onSelectionChange={(id) => {
                        if (!modoEdicion) {
                          setMateriaId(id || '')
                        }
                      }}
                      isInvalid={materiaIdErrors.length > 0}
                      errorMessage={() => (
                        <ul className='text-xs text-danger mt-1'>
                          {materiaIdErrors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      )}
                    >
                      {(materia) => (
                        <AutocompleteItem key={materia.id.toString()}>
                          {materia.codigo + ' - ' + materia.nombre}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>
                )}
              </>
            )}

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={gruposCohorte}
                selectedKey={cohorteId}
                label='Cohorte'
                size='md'
                placeholder='Selecciona la cohorte'
                labelPlacement='outside'
                isRequired
                isDisabled={modoEdicion}
                onSelectionChange={(id) => {
                  setCohorteId(id || '')
                }}
                isInvalid={cohorteIdErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {cohorteIdErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              >
                {(grupo) => (
                  <AutocompleteItem key={grupo.id.toString()}>
                    {grupo.nombre}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full py-4'>
              <Autocomplete
                variant='bordered'
                className='w-full'
                defaultItems={profesores}
                selectedKey={docenteId}
                label='Profesor'
                size='md'
                placeholder='Selecciona el profesor'
                labelPlacement='outside'
                isRequired
                onSelectionChange={(id) => {
                  setDocenteId(id || '')
                }}
                isInvalid={docenteIdErrors.length > 0}
                errorMessage={() => (
                  <ul className='text-xs text-danger mt-1'>
                    {docenteIdErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
              >
                {(profesor) => (
                  <AutocompleteItem key={profesor.id.toString()}>
                    {getNombreCompleto(profesor)}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>

            <div className='w-full flex justify-end mb-[-20px]'>
              <Boton type={'submit'}>
                {modoEdicion ? 'Guardar cambios' : 'Crear grupo'}
              </Boton>
            </div>
          </Form>
        }
      />

      {/* Modal para ver detalles del grupo */}
      <Modal
        size='5xl'
        isOpen={isOpenView}
        onOpenChange={(open) => {
          setIsOpenView(open)
          if (!open) {
            setGrupoSeleccionado(null)
          }
        }}
        cabecera='Detalles del Grupo'
        cuerpo={
          grupoSeleccionado && (
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
                  value={grupoSeleccionado.Código || ''}
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
                  value={grupoSeleccionado.Nombre || ''}
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
                  label='Cohorte'
                  labelPlacement='outside-left'
                  name='cohorte'
                  type='text'
                  readOnly
                  value={grupoSeleccionado.Cohorte || ''}
                />
                <Input
                  classNames={{
                    label: `w-1/4 h-[40px] flex items-center group-data-[has-helper=true]:pt-0`,
                    base: 'flex items-start',
                    inputWrapper:
                      'border border-gris-institucional rounded-[15px] w-full max-h-[40px]',
                    mainWrapper: 'w-[70%]'
                  }}
                  label='Profesor'
                  labelPlacement='outside-left'
                  name='profesor'
                  type='text'
                  readOnly
                  value={grupoSeleccionado.Profesor || ''}
                />
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
export default Grupos
