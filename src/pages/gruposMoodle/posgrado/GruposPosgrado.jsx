import { useState, useEffect } from 'react'
import Tabla from '../../../components/Tabla'
import { Eye, CircleFadingPlus, NotebookPen } from 'lucide-react'
import Boton from '../../../components/Boton'
import Modal from '../../../components/Modal'
import { addToast, ToastProvider } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

const GruposPosgrado = () => {
  const [programa, setPrograma] = useState('')
  const [grupos, setGrupos] = useState([])
  const [informacion, setInformacion] = useState([])
  const Navigate = useNavigate()
  const [grupoNombre, setGrupoNombre] = useState('')
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const moodleUrl = import.meta.env.VITE_MOODLE_URL
  const moodleToken = import.meta.env.VITE_MOODLE_TOKEN
  const [isOpenGrupo, setIsOpenGrupo] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(null)

  useEffect(() => {
    setPrograma(localStorage.getItem('codigoPrograma')) // Obtener el valor del localStorage
  }, [])

  useEffect(() => {
    if (programa !== '' && programa !== undefined) {
      fetch(`${backendUrl}/grupos/programa/${programa}`)
        .then((response) => response.json())
        .then((data) => {
          setGrupos(data)
        })

      // }
    }
  }, [programa])

  useEffect(() => {
    if (grupos.length > 0) {
      // Crear un array de promesas para cada grupo
      const promesas = grupos.map((grupo) =>
        fetch(`${backendUrl}/estudiantes/grupo-cohorte/${grupo.id}`)
          .then((response) => response.json())
          .then((data) => ({
            ...grupo,
            Código: grupo.codigoMateria,
            Nombre: grupo.grupoNombre,
            '# Estudiantes': data.estudiantes.length,
            Profesor: grupo.docenteNombre,
            Cohorte: grupo.cohorteNombre
          }))
      )

      // Esperar a que todas las promesas se resuelvan
      Promise.all(promesas)
        .then((gruposConEstudiantes) => {
          setInformacion(gruposConEstudiantes)
        })
        .catch((error) =>
          console.error('Error al obtener los estudiantes:', error)
        )
    }
  }, [grupos])

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

  const crearGrupoMoodle = (grupo) => {
    const programaId = grupo.programaId

    fetch(`${backendUrl}/programas/${programaId}`)
      .then((response) => response.json())
      .then((data) => {
        const programa = data

        if (!grupo.moodleId) {
          // Crear el grupo en Moodle
          fetch(
            `${moodleUrl}/?wstoken=${moodleToken}` +
              `&moodlewsrestformat=json` +
              `&wsfunction=core_course_create_courses` +
              `&courses[0][fullname]=${grupo.Nombre}` +
              `&courses[0][categoryid]=${programa.moodleId}` +
              `&courses[0][shortname]=${grupo.codigoGrupo}`
          )
            .then((response) => response.json())
            .then((data) => {
              const moodleId = data[0].id

              // Actualizar el grupo con el moodleId
              fetch(
                `${backendUrl}/grupos/moodle/${grupo.id}?moodleId=${moodleId}`,
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }
              )
                .then((response) => response.json())
                .then(() => {
                  // Matricular estudiantes y profesor
                  matricularUsuarios(grupo.id, moodleId)
                })
            })
        } else {
          // El grupo ya existe, solo matricular estudiantes y profesor
          matricularUsuarios(grupo.id, grupo.moodleId)
        }
      })
  }

  // Función para obtener usuarios matriculados en el curso
  const obtenerUsuariosMatriculados = async (moodleId) => {
    try {
      const response = await fetch(
        `${moodleUrl}/?wstoken=${moodleToken}` +
          `&moodlewsrestformat=json` +
          `&wsfunction=core_enrol_get_enrolled_users` +
          `&courseid=${moodleId}`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error obteniendo usuarios matriculados:', error)
      return []
    }
  }

  // Función para matricular profesor
  const matricularProfesor = async (
    docenteId,
    moodleId,
    usuariosMatriculados
  ) => {
    try {
      // Obtener información del profesor
      const response = await fetch(`${backendUrl}/usuarios/${docenteId}`)
      const profesor = await response.json()

      if (profesor.moodleId) {
        // Verificar si el profesor ya está matriculado
        const profesorYaMatriculado = usuariosMatriculados.some(
          (usuario) => usuario.id === parseInt(profesor.moodleId)
        )

        if (!profesorYaMatriculado) {
          // Matricular profesor con rol de profesor (roleid = 3)
          await fetch(
            `${moodleUrl}/?wstoken=${moodleToken}` +
              `&moodlewsrestformat=json` +
              `&wsfunction=enrol_manual_enrol_users` +
              `&enrolments[0][roleid]=3` + // 3 = rol de profesor
              `&enrolments[0][userid]=${profesor.moodleId}` +
              `&enrolments[0][courseid]=${moodleId}`
          )
        }
      }
    } catch (error) {
      console.error('Error matriculando profesor:', error)
    }
  }

  // Función principal para matricular usuarios (estudiantes y profesor)
  const matricularUsuarios = async (grupoId, moodleId) => {
    try {
      // Obtener usuarios ya matriculados
      const usuariosMatriculados = await obtenerUsuariosMatriculados(moodleId)

      // Obtener estudiantes del grupo
      const responseEstudiantes = await fetch(
        `${backendUrl}/estudiantes/grupo-cohorte/${grupoId}`
      )
      const dataEstudiantes = await responseEstudiantes.json()
      const estudiantes = dataEstudiantes.estudiantes

      // Obtener información del grupo para el docenteId
      const grupo = grupos.find((g) => g.id === grupoId)

      // Matricular profesor
      if (grupo && grupo.docenteId) {
        await matricularProfesor(
          grupo.docenteId,
          moodleId,
          usuariosMatriculados
        )
      }

      // Matricular estudiantes
      const promesasEstudiantes = estudiantes.map(async (estudiante) => {
        if (estudiante.moodleId) {
          // Verificar si el estudiante ya está matriculado
          const estudianteYaMatriculado = usuariosMatriculados.some(
            (usuario) => usuario.id === parseInt(estudiante.moodleId)
          )

          if (!estudianteYaMatriculado) {
            try {
              await fetch(
                `${moodleUrl}/?wstoken=${moodleToken}` +
                  `&moodlewsrestformat=json` +
                  `&wsfunction=enrol_manual_enrol_users` +
                  `&enrolments[0][roleid]=5` + // 5 = rol de estudiante
                  `&enrolments[0][userid]=${estudiante.moodleId}` +
                  `&enrolments[0][courseid]=${moodleId}`
              )
            } catch (error) {
              console.error(
                `Error matriculando estudiante ${estudiante.nombre}:`,
                error
              )
            }
          }
        }
      })

      await Promise.all(promesasEstudiantes)
    } catch (error) {
      console.error('Error en proceso de matriculación:', error)
    }
  }

  const crearTodosLosGrupos = () => {
    grupos.forEach((grupo) => {
      crearGrupoMoodle(grupo)
    })
  }

  const verGrupo = (grupo) => {
    Navigate('/posgrado/grupos/ver-grupo/' + grupo.id)
  }

  const crearGrupo = (grupo) => {
    setGrupoNombre(grupo.Nombre)
    setGrupoSeleccionado(grupo)
    setIsOpenGrupo(true)
  }

  const verNotas = (grupo) => {
    localStorage.setItem('grupo', JSON.stringify(grupo.Nombre))
    Navigate('notas/' + grupo.id)
  }

  const columnas = ['Código', 'Nombre', '# Estudiantes', 'Profesor', 'Cohorte']
  const filtros = ['Código', 'Nombre', 'Cohorte']
  const acciones = [
    {
      icono: <Eye className='text-[25px]' />,
      tooltip: 'Ver',
      accion: (grupo) => verGrupo(grupo)
    },
    {
      icono: <CircleFadingPlus className='text-[25px]' />,
      tooltip: 'Crear/actualizar grupo',
      accion: (grupo) => crearGrupo(grupo)
    },
    {
      icono: <NotebookPen className='text-[25px]' />,
      tooltip: 'Ver notas',
      accion: verNotas
    }
  ]

  return (
    <div className='flex flex-col items-center w-full p-4'>
      <p className='text-titulos my-4'>Lista de grupos</p>
      <div className='w-full my-8'>
        <Tabla
          informacion={informacion}
          columnas={columnas}
          acciones={acciones}
          filtros={filtros}
        />
      </div>
      <div className='w-full flex justify-end mt-4'>
        <Boton
          onClick={() => {
            setIsOpen(true)
          }}
        >
          Crear grupos
        </Boton>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        cabecera='Crear Grupos'
        cuerpo={<p>¿Estás seguro de crear/actualizar todos los grupos?</p>}
        footer={
          <Boton
            onClick={() => {
              crearTodosLosGrupos()
              mostrarNotificacion()
              setIsOpen(false)
            }}
          >
            Aceptar
          </Boton>
        }
      />
      <Modal
        isOpen={isOpenGrupo}
        onOpenChange={setIsOpenGrupo}
        cabecera='Crear Grupo'
        cuerpo={
          <p>
            {'¿Estás seguro de crear/actualizar el grupo ' + grupoNombre + '?'}
          </p>
        }
        footer={
          <Boton
            onClick={() => {
              crearGrupoMoodle(grupoSeleccionado)
              mostrarNotificacion()
              setIsOpenGrupo(false)
            }}
          >
            Aceptar
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
export default GruposPosgrado
