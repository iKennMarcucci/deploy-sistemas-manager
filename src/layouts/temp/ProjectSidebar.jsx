import { Menu as LucideMenu, X, BookPlus } from 'lucide-react'
import ProjectMenu from '../../components/sidebar/temp/ProjectMenu'
import { useSidebar } from '../../context/SidebarContext'
import { PiProjectorScreenChart } from 'react-icons/pi'
import React, { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import { Outlet } from 'react-router-dom'
import { ShieldUser } from 'lucide-react'
import { Users } from 'lucide-react'
import { User } from 'lucide-react'
import { useAuth } from '../../lib/hooks/useAuth'

const ProjectSidebar = () => {
   const { userLogged, userLoggedSetter } = useAuth()
   const { selectedMenu, setSelectedMenu, selectedOption, setSelectedOption } = useSidebar()
   const toggleMenu = (index) => setSelectedMenu(selectedMenu === index ? null : index)
   const handleOptionClick = (label) => setSelectedOption(label)
   const [isOpen, setIsOpen] = useState(true)
   const [user, setUser] = useState({
      picture: '',
      firstName: '',
      lastName: '',
      role: '',
      email: ''
   })

   useEffect(() => {
      // Obtener datos del usuario según el tipo de autenticación
      const getUserInfo = () => {
         // Verificar si existe un usuario de Google
         const googleUser = localStorage.getItem('googleToken')
         // Verificar si existe un usuario administrador
         const adminUser = localStorage.getItem('userInfo')

         if (googleUser) {
            const usuarioObtenido = userLoggedSetter(googleUser)
            setUser(usuarioObtenido)
         } else if (adminUser) {
            const usuarioObtenido = JSON.parse(adminUser)
            setUser({
               picture: '', // Admins no tienen foto
               firstName: usuarioObtenido.nombre || '',
               lastName: usuarioObtenido.apellido || '',
               role: usuarioObtenido.role || 'admin',
               email: usuarioObtenido.email || ''
            })
         } else {
            setUser({
               picture: '',
               firstName: '',
               lastName: '',
               role: '',
               email: ''
            })
         }
      }

      getUserInfo()

      // Configurar un listener para actualizar si cambia el almacenamiento local
      const handleStorageChange = () => {
         getUserInfo()
      }

      window.addEventListener('storage', handleStorageChange)
      return () => {
         window.removeEventListener('storage', handleStorageChange)
      }
   }, [])

   useEffect(() => { localStorage.setItem('sidebarState', JSON.stringify({ selectedMenu, selectedOption })) }, [selectedOption])

   return (
      <>
         <header className='fixed w-full z-50'>
            <Topbar />
            <button className={`bg-rojo-mate text-white absolute top-1 left-4 p-2 rounded-md`} onClick={() => setIsOpen(!isOpen)}>
               {isOpen ? <X size={20} /> : <LucideMenu size={20} />}
            </button>

         </header>
         <header className={`bg-black/5 fixed top-12 z-50 h-full transition-all duration-300 overflow-hidden ${isOpen ? 'w-[240px]' : 'w-0'}`} >
            {
               isOpen && user && (
                  <nav className='space-y-2.5'>
                     <section className='flex items-center justify-center gap-2 my-2.5'>
                        <span className="max-w-12 ml-2.5 aspect-square rounded-full overflow-hidden">
                           <img src={user.picture || `https://placehold.co/250x250/4477ba/blue?text=User`} alt={user.email} />
                        </span>
                        <span className="flex flex-col text-lg/5">
                           <h6 className="font-bold text-sm">{user.firstName + " " + user.lastName}</h6>
                           <p className="text-black/75 italic text-sm">{user.role}</p>
                        </span>
                     </section>
                     {/* {JSON.stringify(user)} */}
                     {
                        user?.role.toLowerCase() === 'estudiante' &&
                        <ProjectMenu
                           nombre='Matrícula'
                           funcion={() => toggleMenu(1)}
                           icono={<BookPlus size={24} strokeWidth={2} />}
                           opciones={[
                              { label: 'Cancelación', href: '#' },
                              { label: 'Aplazamiento de semestre', href: '#' },
                              { label: 'Reintegro', href: '#' },
                              { label: 'Contraprestaciones', href: '#' },
                              { label: 'Inclusión de materias', href: '/matricula/inclusion' }
                           ]}
                           openMenu={selectedMenu === 1}
                           selectedOption={selectedOption}
                           handleOptionClick={handleOptionClick}
                        />
                     }
                     {
                        user?.role.toLowerCase() !== 'estudiante' &&
                        <ProjectMenu
                           nombre='Usuarios'
                           funcion={() => toggleMenu(2)}
                           icono={<User size={24} strokeWidth={2} />}
                           opciones={[
                              { label: 'Profesores', href: '#' },
                              { label: 'Estudiantes', href: '#' }
                           ]}
                           openMenu={selectedMenu === 2}
                           selectedOption={selectedOption}
                           handleOptionClick={handleOptionClick}
                        />
                     }
                     {
                        (user?.role.toLowerCase() === 'estudiante' || user?.role.toLowerCase() === 'docente') &&
                        <ProjectMenu
                           nombre='Grupos'
                           funcion={() => toggleMenu(3)}
                           icono={<Users size={24} strokeWidth={2} />}
                           opciones={[
                              {
                                 label: 'Pregrado',
                                 subopciones: [{ label: 'Ing. Sistemas', href: '/grupos' }]
                              },
                              {
                                 label: 'Posgrado',
                                 subopciones: [{ label: 'Maestría', href: '#' }]
                              }
                           ]}
                           openMenu={selectedMenu === 3}
                           selectedOption={selectedOption}
                           handleOptionClick={handleOptionClick}
                        />
                     }
                     {
                        (user?.role.toLowerCase() === 'estudiante' || user?.role.toLowerCase() === 'docente') &&
                        <ProjectMenu
                           nombre='Proyectos'
                           funcion={() => toggleMenu(4)}
                           icono={<PiProjectorScreenChart size={24} strokeWidth={2} />}
                           opciones={
                              user?.role.toLowerCase() === 'admin' ? [
                                 { label: 'Listado Informes', href: '/listado-informes' },
                                 { label: 'Listado Proyectos', href: '/listado-proyectos' },
                                 { label: 'Estado Proyecto', href: '/estado-proyecto' },
                                 { label: 'Seguimiento', href: '/seguimiento' },
                                 { label: 'Informes', href: '/informes' },
                              ] : user?.role.toLowerCase() === 'docente' ? [
                                 { label: 'Listado Informes', href: '/listado-informes' },
                                 { label: 'Listado Proyectos', href: '/listado-proyectos' },
                                 { label: 'Listado Sustentaciones', href: '/listado-sustentaciones' },
                              ] : user?.role.toLowerCase() === 'estudiante' && [
                                 { label: 'Estado Proyecto', href: '/estado-proyecto' },
                                 { label: 'Seguimiento', href: '/seguimiento' },
                                 { label: 'Informes', href: '/informes' },
                              ]
                           }
                           openMenu={selectedMenu === 4}
                           selectedOption={selectedOption}
                           handleOptionClick={handleOptionClick}
                        />
                     }
                     {
                        user?.role.toLowerCase() === 'admin' &&
                        <ProjectMenu
                           nombre='Admin'
                           funcion={() => toggleMenu(5)}
                           icono={<ShieldUser size={24} strokeWidth={2} />}
                           opciones={[
                              { label: 'Administradores', href: '/admin' },
                              { label: 'Crear administrador', href: '/crear-admin' }
                           ]}
                           openMenu={selectedMenu === 5}
                           selectedOption={selectedOption}
                           handleOptionClick={handleOptionClick}
                        />
                     }
                  </nav>
               )
            }
         </header>
         <main className={`${isOpen ? 'ml-[240px]' : 'ml-0'} duration-300 flex-grow ${location.pathname !== '/estado-proyecto' && 'p-10 mt-8'}`}>
            <Outlet />
         </main>
      </>
   )
}

export default ProjectSidebar