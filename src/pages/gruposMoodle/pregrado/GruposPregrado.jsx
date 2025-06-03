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
  const Navigate = useNavigate()
  const [grupoNombre, setGrupoNombre] = useState('')
  const [informacion, setInformacion] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/api/oracle/grupos/carrera?codCarrera=115`)
      .then((response) => response.json())
      .then((data) => {
        const gruposFiltrados = data.sort((a, b) => {
          const materiaA = Number(a.codMateria)
          const materiaB = Number(b.codMateria)

          if (materiaA !== materiaB) {
            return materiaA - materiaB
          }

          // Si las materias son iguales, ordena por grupo.grupo (alfabético)
          return a.grupo.localeCompare(b.grupo)
        })
        setGrupos(gruposFiltrados)
      })

    fetch(`${backendUrl}/api/oracle/materias/sistemas`)
      .then((response) => response.json())
      .then((data) => {
        setMaterias(data)
      })

    fetch(`${backendUrl}/api/oracle/profesores`)
      .then((response) => response.json())
      .then((data) => {
        setProfesores(data)
      })

    localStorage.removeItem('grupo')
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
          '# Estudiantes': grupo.numAlumMatriculados
        }
      })

      setInformacion(datosCombinados)
    }
  }, [grupos, materias, profesores])

  const verGrupo = (grupo) => {
    localStorage.setItem('grupo', JSON.stringify(grupo))
    Navigate('/grupo')
  }

  const crearGrupo = (grupo) => {
    setGrupoNombre(grupo.Nombre)
    setIsOpenGrupo(true)
  }

  const verNotas = (grupo) => {
    localStorage.setItem('grupo', JSON.stringify(grupo.Nombre))
    Navigate('/notas')
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
      accion: verNotas
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
export default GruposPregrado
