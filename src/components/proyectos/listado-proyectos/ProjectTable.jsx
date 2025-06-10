import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import CambiarFaseModal from "../../admin/CambiarFaseModal"
import useAdmin from "../../../lib/hooks/useAdmin"
import CrearSustentacionForm from "../../admin/CrearSustentacionForm"
import AsignarDirectoresModal from "../../admin/AsignarDirectoresModal"
import AsignarComentariosJuradosModal from "../../admin/AsignarComentariosJuradosModal"
import { useAuth } from "../../../lib/hooks/useAuth"
import useProject from "../../../lib/hooks/useProject"
import EliminarProyectoModal from "../../admin/EliminarProyectoModal"

export default function ProjectTable({ projectList }) {
   const { obtenerDocentes, asignarDirectores, actualizarFase, deleteProject } = useAdmin()
   const { listSustentaciones, getDocuments, asignarDefinitivaAction } = useProject()
   const [modalDirectores, setModalDirectores] = useState(null)
   const [docentes, setDocentes] = useState([])
   const [openActions, setOpenActions] = useState({})
   const dropdownRefs = useRef({})
   const [modalEliminarProyecto, setModalEliminarProyecto] = useState(null)
   const [modalProyecto, setModalProyecto] = useState(null)
   const [modalSustentacion, setModalSustentacion] = useState(null)
   const [modalComentarios, setModalComentarios] = useState(false)
   const [sustentacionSeleccionada, setSustentacionSeleccionada] = useState(null)
   const [listDocumentos, setListDocumentos] = useState([])
   const { userLogged, userRole } = useAuth()

   const toggleActions = (projectId) => {
      setOpenActions(prev => ({
         ...prev,
         [projectId]: !prev[projectId]
      }))
   }

   useEffect(() => { obtenerDocentes().then(setDocentes) }, [])

   useEffect(() => {
      function handleClickOutside(event) {
         Object.keys(openActions).forEach(projectId => {
            if (
               openActions[projectId] &&
               dropdownRefs.current[projectId] &&
               !dropdownRefs.current[projectId].contains(event.target)
            ) {
               setOpenActions(prev => ({ ...prev, [projectId]: false }))
            }
         })
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [openActions])

   const handleConfirmarCambioFase = async (proyecto) => {
      if (proyecto.estadoActual !== 9) {
         const nuevoEstado = proyecto.estadoActual + 1
         const res = await actualizarFase({ idProyecto: proyecto.id, faseNueva: { estadoActual: nuevoEstado } })
         if (res) {
            if (Array.isArray(projectList)) {
               const idx = projectList.findIndex(p => p.id === proyecto.id)
               if (idx !== -1) projectList[idx].estadoActual = nuevoEstado
            }
         }
      } else {
         await asignarDefinitivaAction(proyecto.id)
         const res = await actualizarFase({ idProyecto: proyecto.id, faseNueva: { estadoActual: 0 } })
         if (res) {
            if (Array.isArray(projectList)) {
               const idx = projectList.findIndex(p => p.id === proyecto.id)
               if (idx !== -1) projectList[idx].estadoActual = 0
            }
         }
      }
      setModalProyecto(null)
      setOpenActions({})
   }

   // Función para saber si el usuario es director o codirector en el proyecto
   const esDirectorOCodirector = (project) => {
      if (!userLogged) return false
      return project.usuariosAsignados?.some(
         u => (u.rol?.nombre?.toLowerCase() === "director" || u.rol?.nombre?.toLowerCase() === "codirector") && u.email === userLogged.email
      )
   }

   // Abrir modal de comentarios de jurados
   const handleAbrirComentariosJurados = async (project) => {
      // Busca la sustentación más reciente (ajusta según tu modelo)
      let sustentacion = await listSustentaciones(project.id)
      let documentos = []
      if (project.id) {
         documentos = await getDocuments(project.id, "TESIS")
      }
      setListDocumentos(documentos)
      if (sustentacion) {
         setSustentacionSeleccionada(sustentacion)
         setModalComentarios(true)
      } else {
         alert("No se encontró una sustentación para este proyecto.")
      }
   }

   // Lógica real para eliminar el proyecto
   const handleEliminarProyecto = async (proyecto) => {
      await deleteProject(proyecto.id)
      setModalEliminarProyecto(null)
      if (typeof obtenerDocentes === "function") obtenerDocentes().then(setDocentes)
      if (typeof window !== "undefined") window.location.reload()
   }

   return (
      <>
         <table className="flex flex-col rounded-md border">
            <thead className="bg-black/5 p-4">
               <tr className="grid grid-cols-12 gap-2">
                  <th className="col-span-3 text-start">Estudiante</th>
                  <th className="col-span-2 text-start">Grupo</th>
                  <th className="col-span-2 text-start">Linea</th>
                  <th className="col-span-1 text-start">Fase</th>
                  <th className="col-span-3 text-start">Proyecto</th>
                  <th className="col-span-1 text-center">Acciones</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {
                  projectList.map(project => (
                     <tr key={project.id} className="grid grid-cols-12 items-center gap-2 p-4">
                        <td className="col-span-3 flex gap-2 items-center">
                           {(() => {
                              const estudiante = project.usuariosAsignados?.find(u => u.rol.nombre.toLowerCase() === "estudiante")
                              return (
                                 <>
                                    <span className="w-10 h-10 rounded-full overflow-hidden">
                                       <img
                                          src={estudiante?.fotoUsuario ?? "https://placehold.co/250x250/4477ba/white?text=User"}
                                          alt={estudiante?.nombreUsuario ?? "Estudiante"}
                                       />
                                    </span>
                                    <div className="flex flex-col">
                                       <h6 className="text-base font-bold">{estudiante?.nombreUsuario ?? "Sin estudiante"}</h6>
                                       <p className="text-gris-intermedio">{estudiante?.email ?? ""}</p>
                                    </div>
                                 </>
                              )
                           })()}
                        </td>
                        <td className="col-span-2">
                           {project.lineaInvestigacion?.grupoInvestigacion?.nombre}
                        </td>
                        <td className="col-span-2">
                           {project.lineaInvestigacion?.nombre}
                        </td>
                        <td className="col-span-1">
                           {project.estadoActual === 0 ? "Terminado" : `Fase ${project.estadoActual ?? "-"}`}
                        </td>
                        <td className="col-span-3">
                           {project.titulo}
                        </td>
                        <td
                           className="relative col-span-1 place-self-center w-full"
                           ref={el => dropdownRefs.current[project.id] = el}
                        >
                           <button
                              id="custom-ellipsis"
                              onClick={() => toggleActions(project.id)}
                              className="flex justify-center items-center gap-1 p-2 w-full"
                           >
                              <span id="dot" />
                              <span id="dot" />
                              <span id="dot" />
                           </button>
                           {openActions[project.id] && (
                              <div className="bg-white whitespace-nowrap border rounded-md absolute z-50 top-[115%] right-0 select-animation flex flex-col">
                                 {/* Opciones según el rol */}

                                 {/* Subir nota de jurados: solo si estadoActual es 9 */}
                                 {(project.estadoActual === 9 && project.estadoActual !== 0) && (
                                    <button
                                       className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                       onClick={() => handleAbrirComentariosJurados(project)}
                                    >
                                       Subir nota de jurados
                                    </button>
                                 )}

                                 {esDirectorOCodirector(project) ? (
                                    <>
                                       {/* Cambiar de fase: solo si NO es fase 3 ni 7 */}
                                       {(project.estadoActual !== 3 && project.estadoActual !== 7 && project.estadoActual !== 0) && (
                                          <button
                                             className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                             onClick={() => setModalProyecto(project)}
                                          >
                                             {project.estadoActual !== 9 ? "Cambiar de fase" : "Finalizar proyecto"}
                                          </button>
                                       )}

                                       {/* Ver proyecto: SIEMPRE */}
                                       <Link
                                          to={`/listado-proyectos/${project.id}`}
                                          className="hover:bg-gris-claro/50 duration-150 p-2"
                                       >
                                          Ver proyecto
                                       </Link>
                                    </>
                                 ) : (
                                    <>
                                       {/* Crear sustentación: solo si fase es 3 o 7, y NO mostrar "Cambiar de fase" junto */}
                                       {(project.estadoActual === 3 || project.estadoActual === 7) ? (
                                          <button
                                             className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                             onClick={() => setModalSustentacion(project)}
                                          >
                                             Crear Sustentación
                                          </button>
                                       ) : project.estadoActual !== 0 && (
                                          // Cambiar de fase: solo si NO soy director/codirector y NO es fase 3 ni 7
                                          <button
                                             className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                             onClick={() => setModalProyecto(project)}
                                          >
                                             {project.estadoActual !== 9 ? "Cambiar de fase" : "Finalizar proyecto"}
                                          </button>
                                       )}

                                       {/* Asignar director y codirector: solo si fase es 2 y faltan asignados */}
                                       {project.estadoActual === 2 && (() => {
                                          const tieneDirector = project.usuariosAsignados?.some(u => u.rol?.nombre === "Director");
                                          const tieneCodirector = project.usuariosAsignados?.some(u => u.rol?.nombre === "Codirector");
                                          if (tieneDirector && tieneCodirector) return null;
                                          return (
                                             <button
                                                className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                                onClick={() => setModalDirectores(project)}
                                             >
                                                Asignar Director y Codirector
                                             </button>
                                          );
                                       })()}

                                       {/* Ver proyecto: SIEMPRE */}
                                       <Link
                                          to={`/listado-proyectos/${project.id}`}
                                          className="hover:bg-gris-claro/50 duration-150 p-2"
                                       >
                                          Ver proyecto
                                       </Link>


                                       {/* ELIMINAR PROYECTO SOLO ADMIN */}
                                       {(userRole === "ROLE_ADMIN" || userRole === "ROLE_SUPERADMIN") &&
                                          <button
                                             className="hover:bg-rojo-claro text-red-500 duration-150 p-2 text-left"
                                             onClick={() => setModalEliminarProyecto(project)}
                                          >
                                             Eliminar Proyecto
                                          </button>
                                       }
                                    </>
                                 )}
                              </div>
                           )}
                        </td>
                     </tr>
                  ))
               }
            </tbody>
         </table>
         <CambiarFaseModal
            proyecto={modalProyecto}
            isOpen={setModalProyecto}
            onConfirm={handleConfirmarCambioFase}
         />
         {modalSustentacion && (
            <CrearSustentacionForm
               isOpen={setModalSustentacion}
               proyecto={modalSustentacion}
            />
         )}
         {modalDirectores && (
            <AsignarDirectoresModal
               isOpen={setModalDirectores}
               proyecto={modalDirectores}
               docentes={docentes}
               onAsignar={async ({ director, codirector }) => {
                  // Asignar director (rol id 3), solo si existe
                  if (director) {
                     await asignarDirectores({
                        body: {
                           idUsuario: director.id,
                           idProyecto: modalDirectores.id,
                           rol: { id: 3 }
                        }
                     })
                  }
                  // Asignar codirector (rol id 5), solo si existe
                  if (codirector) {
                     await asignarDirectores({
                        body: {
                           idUsuario: codirector.id,
                           idProyecto: modalDirectores.id,
                           rol: { id: 5 }
                        }
                     })
                  }
               }}
            />
         )}
         {modalComentarios && sustentacionSeleccionada && (
            <AsignarComentariosJuradosModal
               isOpen={setModalComentarios}
               sustentacion={sustentacionSeleccionada}
               documentosTesis={listDocumentos}
               onSave={() => setModalComentarios(false)}
            />
         )}

         {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE PROYECTO */}
         {modalEliminarProyecto && (
            <EliminarProyectoModal
               proyecto={modalEliminarProyecto}
               isOpen={setModalEliminarProyecto}
               onConfirm={handleEliminarProyecto}
            />
         )}
      </>
   )
}