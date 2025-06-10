import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PaginaNoEncontrada from './pages/404/PaginaNoEncontrada'
import Index from './pages/Index'
import Botones from './pages/pruebaComponente/Botones'
import Modales from './pages/pruebaComponente/Modales'
import LoginAdmin from './pages/login/LoginAdmin'
import GruposPregrado from './pages/gruposMoodle/pregrado/GruposPregrado'
import Layout from './layouts/Layout'
import VerGrupoPregrado from './pages/gruposMoodle/pregrado/VerGrupoPregrado'
import CrearUsuario from './pages/usuarios/CrearUsuario'
import Login from './pages/login/Login'
import Notas from './pages/notas/Notas'
import EstadoProyecto from './pages/estado-proyecto/EstadoProyecto'
import Seguimiento from './pages/seguimiento/Seguimiento'
import Admins from './pages/administrador/Admins'
import CrearAdmin from './pages/administrador/CrearAdmin'
import Inclusion from './pages/matricula/inclusion/Inclusion'
import Matricular from './pages/matricula/inclusion/matricular/Matricular'
import PensumEstudiante from './pages/matricula/inclusion/pensum/PensumEstudiante'
import MatricularMateria from './pages/matricula/inclusion/matricular/grupos/MatricularMateria'
import GruposPosgrado from './pages/gruposMoodle/posgrado/GruposPosgrado'
import VerGrupoPosgrado from './pages/gruposMoodle/posgrado/VerGrupoPosgrado'
import VerEstudiantePosgrado from './pages/gruposMoodle/posgrado/VerEstudiantePosgrado'
import Informes from './pages/informes/Informes'
import ListadoProyectos from './pages/listadoProyectos/ListadoProyectos'
import VerProyecto from './pages/listadoProyectos/VerProyecto'
import Profesores from './pages/usuarios/Profesor/Profesores'
import CrearProfesor from './pages/usuarios/Profesor/CrearProfesor'
import VerProfesor from './pages/usuarios/Profesor/VerProfesor'
import EditarProfesor from './pages/usuarios/Profesor/EditarProfesor'
import Estudiantes from './pages/usuarios/estudiante/Estudiantes'
import CrearEstudiante from './pages/usuarios/estudiante/CrearEstudiante'
import VerEstudiante from './pages/usuarios/estudiante/VerEstudiante'
import EditarEstudiante from './pages/usuarios/estudiante/EditarEstudiante'
import Programas from './pages/programas/Programas'
import Pensum from './pages/pensum/Pensums'
import Materias from './pages/materias/Materias'
import Cohortes from './pages/cohorte/cohortes'
import Grupos from './pages/grupos/Grupos'
import Contraprestaciones from './pages/contraprestaciones/Contraprestaciones'
import VerContraprestacion from './pages/contraprestaciones/VerContraprestacion'
import CrearContraprestacion from './pages/contraprestaciones/CrearContraprestacion'
import EditarContraprestacion from './pages/contraprestaciones/EditarContraprestación'
import Aplazamiento from './pages/aplazamientos/Aplazamientos'
import VerAplazamiento from './pages/aplazamientos/VerAplazamiento'
import Reintegros from './pages/reintegros/Reintegros'
import VerReintegro from './pages/reintegros/VerReintegro'
import Cancelaciones from './pages/cancelaciones/Cancelaciones'
import VerCancelacion from './pages/cancelaciones/VerCancelacion'
import ProtectedRoute from './components/auth/ProtectedRoute'
import TerminarSemestre from './pages/terminarSemestre/TerminarSemestre'
import NotasPosgrado from './pages/notas/NotasPosgrado'
import CambiarContrasena from './pages/login/CambiarContrasena'
import Success from './pages/login/Success'
import ListadoInformes from './pages/listadoInformes/ListadoInformes'
import ListadoGruposDocente from './pages/listadoInformes/ListadosGruposDocente'
import ListadoSustentaciones from './pages/listadoSustentaciones/ListadoSustentaciones'
import AdminProyectos from './pages/admin/proyectos/AdminProyectos'
import AdminGrupos from './pages/admin/sustentaciones/AdminGrupos'
import VerEstudiantePregrado from './pages/gruposMoodle/pregrado/VerEstudiantePregrado'

function App() {
  return (
    <div className='App'>
      <Routes>
        {/* Rutas públicas Login*/}
        <Route path='' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login/success' element={<Success />} />
        <Route path='/login-admin' element={<LoginAdmin />} />
        <Route path='/cambiar-contrasena' element={<CambiarContrasena />} />

        {/* Rutas de prueba */}
        <Route path='/botones' element={<Botones />} />
        <Route path='/modales' element={<Modales />} />
        <Route path='/pruebas' element={<Index />} />

        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Profesores */}
            <Route
              path='/usuarios/profesores/crear-profesor'
              element={<CrearProfesor />}
            />
            <Route path='/usuarios/profesores' element={<Profesores />} />
            <Route
              path='/usuarios/profesores/ver-profesor/:id'
              element={<VerProfesor />}
            />
            <Route
              path='/usuarios/profesores/editar-profesor/:id'
              element={<EditarProfesor />}
            />

            {/* Estudiantes */}
            <Route path='/usuarios/estudiantes' element={<Estudiantes />} />
            <Route
              path='/usuarios/estudiantes/crear-estudiante'
              element={<CrearEstudiante />}
            />
            <Route
              path='/usuarios/estudiantes/ver-estudiante/:id'
              element={<VerEstudiante />}
            />
            <Route
              path='/usuarios/estudiantes/editar-estudiante/:id'
              element={<EditarEstudiante />}
            />

            {/* Programas */}
            <Route path='/academico/programas' element={<Programas />} />

            {/* Pensum */}
            <Route path='/academico/pensums' element={<Pensum />} />

            {/* Cohortes */}
            <Route path='/academico/cohortes' element={<Cohortes />} />
            <Route path='/cohortes' element={<Cohortes />} />

            {/* Contraprestacion */}
            <Route
              path='/matricula/contraprestaciones'
              element={<Contraprestaciones />}
            />
            <Route
              path='/matricula/contraprestaciones/:id'
              element={<VerContraprestacion />}
            />
            <Route
              path='/matricula/contraprestaciones/crear'
              element={<CrearContraprestacion />}
            />
            <Route
              path='/matricula/contraprestaciones/editar/:id'
              element={<EditarContraprestacion />}
            />

            {/* Solicitudes*/}
            <Route path='/matricula/aplazamiento' element={<Aplazamiento />} />
            <Route
              path='/matricula/aplazamiento/:id'
              element={<VerAplazamiento />}
            />
            <Route path='/matricula/reintegros' element={<Reintegros />} />
            <Route
              path='/matricula/reintegros/:id'
              element={<VerReintegro />}
            />
            <Route
              path='/matricula/cancelaciones/:id'
              element={<VerCancelacion />}
            />
            <Route
              path='/matricula/cancelaciones'
              element={<Cancelaciones />}
            />

            {/* Materias */}
            <Route path='/academico/materias' element={<Materias />} />

            {/* Grupos */}
            <Route path='/academico/grupos' element={<Grupos />} />

            {/* Resto de rutas protegidas */}
            <Route path='/pregrado/grupos/notas' element={<Notas />} />
            <Route path='/crear-usuario' element={<CrearUsuario />} />
            <Route path='/estado-proyecto' element={<EstadoProyecto />} />
            <Route path='/seguimiento' element={<Seguimiento />} />
            <Route path='/informes' element={<Informes />} />
            <Route path='/listado-proyectos' element={<ListadoProyectos />} />
            <Route path='/listado-informes' element={<ListadoGruposDocente />} />
            <Route path='/listado-informes/:grupoId' element={<ListadoInformes />} />
            <Route path='/listado-sustentaciones' element={<ListadoSustentaciones />} />
            <Route
              path='/listado-proyectos/:projectId'
              element={<VerProyecto />}
            />
            <Route path='/proyectos-admin' element={<AdminProyectos />} />
            <Route
              path='/grupos-admin'
              element={<AdminGrupos />}
            />

            <Route path='/admin/admins' element={<Admins />} />
            <Route path='/admin/crear-admin' element={<CrearAdmin />} />
            <Route path='/matricula/inclusion' element={<Inclusion />} />
            <Route
              path='/matricula/inclusion/matricular/:id'
              element={<Matricular />}
            />
            <Route
              path='/matricula/inclusion/matricular/matricularMateria/:codigo/:id'
              element={<MatricularMateria />}
            />
            <Route
              path='/matricula/inclusion/matricular/pensum/:id'
              element={<PensumEstudiante />}
            />

            {/* Grupos pregrado */}
            <Route path='/pregrado/grupos' element={<GruposPregrado />} />
            <Route
              path='/pregrado/grupos/grupo'
              element={<VerGrupoPregrado />}
            />
            <Route
              path='/pregrado/grupos/grupo/usuario'
              element={<VerEstudiantePregrado />}
            />

            {/* Grupos posgrado */}

            <Route path='/posgrado/grupos' element={<GruposPosgrado />} />
            <Route
              path='/posgrado/grupos/ver-grupo/:id'
              element={<VerGrupoPosgrado />}
            />
            <Route
              path='/posgrado/grupos/ver-grupo/ver-estudiante/:id'
              element={<VerEstudiantePosgrado />}
            />
            <Route
              path='/posgrado/grupos/notas/:id'
              element={<NotasPosgrado />}
            />

            <Route
              path='/admin/terminar-semestre'
              element={<TerminarSemestre />}
            />
          </Route>
        </Route>

        <Route path='*' element={<PaginaNoEncontrada />} />
      </Routes>
    </div>
  )
}

export default App
