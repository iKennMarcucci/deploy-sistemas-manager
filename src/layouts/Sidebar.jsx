import React, { useState, useEffect } from 'react'
import {
  Menu as LucideMenu,
  X,
  BookPlus,
  UserRoundCog,
  LibraryBig
} from 'lucide-react'
import { PiStudent } from 'react-icons/pi'
import { MdGroups } from 'react-icons/md'
import { PiProjectorScreenChart } from 'react-icons/pi'
import Menu from '../components/sidebar/Menu'
import { useSidebar } from '../context/SidebarContext'

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const { selectedMenu, setSelectedMenu, selectedOption, setSelectedOption } =
    useSidebar()

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [programas, setProgramas] = useState([])
  const [userRole, setUserRole] = useState(null)
  // Cargar el rol del usuario desde localStorage (ahora con soporte para Google)
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    const googleUser = localStorage.getItem('user')

    if (userInfo) {
      try {
        const { rol } = JSON.parse(userInfo)
        // Normalizar el rol para que coincida con ProtectedRoute
        if (rol.includes('SUPERADMIN') || rol.includes('SUPER_ADMIN')) {
          setUserRole('ROLE_SUPERADMIN')
        } else if (
          (rol.includes('ADMIN') || rol === 'ROLE_ADMIN') &&
          !rol.includes('SUPER')
        ) {
          setUserRole('ROLE_ADMIN')
        } else {
          setUserRole(rol)
        }
      } catch (error) {
        console.error('Error al parsear userInfo:', error)
      }
    } else if (googleUser) {
      // Si es un usuario de Google, asignar un rol específico
      setUserRole('ROLE_GOOGLE')
    }
  }, [])

  const toggleMenu = (index) => {
    setSelectedMenu(selectedMenu === index ? null : index)
  }

  const handleOptionClick = (label, codigo) => {
    setSelectedOption(label) // Actualiza la opción seleccionada
    if (codigo) {
      localStorage.setItem('codigoPrograma', codigo)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`${backendUrl}/api/programas/listar`)
        .then((response) => response.json())
        .then((data) => {
          const programasFiltrados = data.filter(
            (programa) => programa.esPosgrado
          )

          const programasTransformados = programasFiltrados.map((programa) => ({
            label: programa.nombre,
            href: '/posgrado/grupos',
            codigo: String(programa.id)
          }))

          setProgramas(programasTransformados)
        })
    }, 500)

    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'sidebarState',
      JSON.stringify({ selectedMenu, selectedOption })
    )
  }, [selectedOption])
  // Determinar qué menús mostrar según el rol
  const shouldShowMenu = (menuName) => {
    // Para usuarios de Google, mostrar sólo Proyectos y Grupos
    if (userRole === 'ROLE_GOOGLE') {
      return menuName === 'Proyectos' || menuName === 'Grupos'
    }

    if (!userRole) return menuName === 'Proyectos'

    // El superadmin puede ver todos los menús
    if (userRole === 'ROLE_SUPERADMIN') return true

    // El admin puede ver todos los menús excepto Admin
    if (userRole === 'ROLE_ADMIN') return menuName !== 'Admin'

    // Otros roles solo ven Proyectos
    return menuName === 'Proyectos'
  }

  return (
    <div
      className={`bg-rojo-claro min-h-full transition-all duration-300 min-w-0 overflow-hidden ${isOpen ? 'w-[240px] px-4' : 'w-0'}`}
    >
      <button
        className={`absolute top-1 ${isOpen ? 'left-4' : 'left-2'} p-2 bg-rojo-mate text-white rounded-md`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <LucideMenu size={20} />}
      </button>

      {isOpen && (
        <nav className='mt-16 space-y-2'>
          {shouldShowMenu('Académico') && (
            <Menu
              nombre='Académico'
              funcion={() => toggleMenu(1)}
              icono={<LibraryBig className='text-[25px]' />}
              opciones={[
                { label: 'Programas', href: '/academico/programas' },
                { label: 'Pénsums', href: '/academico/pensums' },
                { label: 'Cohortes', href: '/academico/cohortes' },
                { label: 'Materias', href: '/academico/materias' },
                { label: 'Grupos', href: '/academico/grupos' }
              ]}
              openMenu={selectedMenu === 1}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}

          {shouldShowMenu('Matrícula') && (
            <Menu
              nombre='Matrícula'
              funcion={() => toggleMenu(2)}
              icono={<BookPlus className='text-[25px]' />}
              opciones={[
                { label: 'Cancelación', href: '/matricula/cancelaciones' },
                {
                  label: 'Aplazamiento de semestre',
                  href: '/matricula/aplazamiento'
                },
                { label: 'Reintegro', href: '/matricula/reintegros' },
                {
                  label: 'Contraprestaciones',
                  href: '/matricula/contraprestaciones'
                },
                { label: 'Inclusión de materias', href: '/matricula/inclusion' }
              ]}
              openMenu={selectedMenu === 2}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}

          {shouldShowMenu('Usuarios') && (
            <Menu
              nombre='Usuarios'
              funcion={() => toggleMenu(3)}
              icono={<PiStudent className='text-[25px]' />}
              opciones={[
                { label: 'Profesores', href: '/usuarios/profesores' },
                { label: 'Estudiantes', href: '/usuarios/estudiantes' }
              ]}
              openMenu={selectedMenu === 3}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}

          {shouldShowMenu('Grupos') && (
            <Menu
              nombre='Grupos'
              funcion={() => toggleMenu(4)}
              icono={<MdGroups className='text-[25px]' />}
              opciones={[
                {
                  label: 'Pregrado',
                  subopciones: [
                    {
                      label: 'Tecnología en analítica de datos',
                      href: '/pregrado/grupos',
                      codigo: '215'
                    }
                  ]
                },
                {
                  label: 'Posgrado',
                  subopciones: programas
                }
              ]}
              openMenu={selectedMenu === 4}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}

          {shouldShowMenu('Proyectos') && (
            <Menu
              nombre='Proyectos'
              funcion={() => toggleMenu(5)}
              icono={<PiProjectorScreenChart className='text-[25px]' />}
              opciones={[
                { label: 'Proyectos', href: '/proyectos-admin' }, //? Cambiar de Fase, Asignar Director y Codirector, Subir nota de jurados en FASE 9
                { label: 'Grupos Investigación', href: '/grupos-admin' } //? Asignar sustentaciones a cada proyecto (luego de eso cambiar automaticamente de fase)
              ]}
              openMenu={selectedMenu === 5}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}

          {shouldShowMenu('Admin') && (
            <Menu
              nombre='Admin'
              funcion={() => toggleMenu(6)}
              icono={<UserRoundCog className='text-[25px]' />}
              opciones={[
                { label: 'Administradores', href: '/admin/admins' },
                { label: 'Crear administrador', href: '/admin/crear-admin' },
                { label: 'Terminar semestre', href: '/admin/terminar-semestre' }
              ]}
              openMenu={selectedMenu === 6}
              selectedOption={selectedOption}
              handleOptionClick={handleOptionClick}
            />
          )}
        </nav>
      )}
    </div>
  )
}

export default Sidebar
