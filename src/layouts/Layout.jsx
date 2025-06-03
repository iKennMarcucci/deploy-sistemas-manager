import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../context/SidebarContext'
import { useLocation } from 'react-router-dom'
import Topbar from '../components/Topbar'
import ProjectSidebar from './temp/ProjectSidebar'

const Layout = () => {
  const location = useLocation()
  const projectRoutes = [
    "/listado-informes",
    "/listado-proyectos",
    "/estado-proyecto",
    "/seguimiento",
    "/informes",
  ]

  const isProjectRoute = location.pathname.startsWith("/listado-proyectos") || location.pathname.startsWith("/listado-informes") ||
    projectRoutes.includes(location.pathname);

  return (
    <SidebarProvider>
      <div className='min-h-screen min-w-fit flex flex-col'>
        {
          isProjectRoute ? <ProjectSidebar /> :
            <>
              <Topbar />
              <div className='w-full flex flex-row flex-grow'>
                <div className='flex-shrink-0'>
                  <Sidebar />
                </div>
                <div
                  className={`flex-1 ${location.pathname !== '/estado-proyecto' && 'p-6'}`}
                >
                  {/* aqui iba el p-6 para darle padding al children pero en /estado-proyecto se necesita sin padding */}
                  <Outlet />
                </div>
              </div>
            </>
        }
      </div>
    </SidebarProvider>
  )
}

export default Layout