import { useParams } from "react-router-dom"
import { Progress } from "@heroui/progress"
import { useState, useEffect, useRef } from "react"
import { User, Calendar, Clock, Users, BookHeart, CircleMinus, FileText, Download, Edit, Trash2, Save, X, CircleAlert, CheckCircle, Circle, XCircle, File, Upload } from "lucide-react"
import useProject from "../../lib/hooks/useProject"
import { useAuth } from "../../lib/hooks/useAuth"
import { Progress as ProgressBar } from "@heroui/progress"
import Boton from "../../components/Boton"

export default function VerProyecto() {
   const params = useParams()
   const [project, setProject] = useState(null)
   const [documentos, setDocumentos] = useState([])
   const [retroInputs, setRetroInputs] = useState({})
   const [sending, setSending] = useState(false)
   const [editRetroId, setEditRetroId] = useState(null)
   const [editRetroValue, setEditRetroValue] = useState("")
   const [listActas, setListActas] = useState([])
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)
   const [actaToResubir, setActaToResubir] = useState(null)
   const [resubirFile, setResubirFile] = useState(null)
   const resubirInputRef = useRef(null)

   const { getSpecificProject, getDocuments, sendRetroalimentacion, editRetroalimentacion, deleteRetroalimentacion, editProgress, sendDocuments, deleteDocumentos } = useProject()
   const { userLogged } = useAuth()

   useEffect(() => {
      const getProyectoEspecifico = async () => {
         const res = await getSpecificProject(params.projectId)
         if (res) setProject(res)
      }
      getProyectoEspecifico()
   }, [])

   useEffect(() => {
      const fetchDocs = async () => {
         if (project?.id) {
            const docs = await getDocuments(project.id, "")
            setDocumentos(docs)
            // Traer todas las actas (por tipoDocumento que empiece con ACTA)
            const actas = docs.filter(doc =>
               typeof doc.tipoDocumento === "string" &&
               doc.tipoDocumento.startsWith("ACTA")
            )
            setListActas(actas)
         }
      }
      fetchDocs()
   }, [project])

   // Agrupar documentos por tipoDocumento
   const docsPorTipo = documentos.reduce((acc, doc) => {
      if (!acc[doc.tipoDocumento]) acc[doc.tipoDocumento] = []
      acc[doc.tipoDocumento].push(doc)
      return acc
   }, {})

   // Manejar input de retroalimentación
   const handleRetroInput = (docId, value) => {
      setRetroInputs(prev => ({ ...prev, [docId]: value }))
   }

   // Enviar retroalimentación
   const handleSendRetro = async (docId) => {
      if (!retroInputs[docId] || !retroInputs[docId].trim()) return
      setSending(true)
      try {
         await sendRetroalimentacion({
            descripcion: retroInputs[docId],
            documentoId: docId
         })
         const docs = await getDocuments(project.id, "")
         setDocumentos(docs)
         setRetroInputs(prev => ({ ...prev, [docId]: "" }))
      } catch (e) {
         alert("Error al enviar retroalimentación")
      }
      setSending(false)
   }

   // Editar retroalimentación
   const handleEditRetro = (retro) => {
      setEditRetroId(retro.id)
      setEditRetroValue(retro.descripcion)
   }

   const handleSaveEditRetro = async (retro) => {
      if (!editRetroValue.trim()) return
      setSending(true)
      try {
         await editRetroalimentacion({
            id: retro.id,
            descripcion: editRetroValue
         })
         const docs = await getDocuments(project.id, "")
         setDocumentos(docs)
         setEditRetroId(null)
         setEditRetroValue("")
      } catch (e) {
         alert("Error al editar retroalimentación")
      }
      setSending(false)
   }

   // Eliminar retroalimentación
   const handleDeleteRetro = async (retro) => {
      if (!window.confirm("¿Seguro que deseas eliminar esta retroalimentación?")) return
      setSending(true)
      try {
         await deleteRetroalimentacion(retro.id)
         const docs = await getDocuments(project.id, "")
         setDocumentos(docs)
      } catch (e) {
         alert("Error al eliminar retroalimentación")
      }
      setSending(false)
   }

   // Validar objetivos
   const handleValidarObjetivo = async (objetivoId, esDirector, valor) => {
      const nuevosObjetivos = project.objetivosEspecificos.map(obj => {
         if (obj.id !== objetivoId) {
            return {
               id: obj.id,
               avanceReportado: obj.avanceReportado,
               avanceReal: obj.avanceReal,
               evaluacion: obj.evaluacion,
               fecha_inicio: obj.fecha_inicio,
               fecha_fin: obj.fecha_fin
            }
         } else {
            let nuevaEvaluacion = { ...obj.evaluacion }
            if (!nuevaEvaluacion) nuevaEvaluacion = {}
            if (esDirector) {
               nuevaEvaluacion.director = valor
            } else {
               nuevaEvaluacion.codirector = valor
            }
            return {
               id: obj.id,
               avanceReportado: obj.avanceReportado,
               avanceReal: obj.avanceReal,
               evaluacion: nuevaEvaluacion,
               fecha_inicio: obj.fecha_inicio,
               fecha_fin: obj.fecha_fin
            }
         }
      })

      await editProgress(
         { objetivosEspecificos: nuevosObjetivos },
         project.id
      )

      const res = await getSpecificProject(params.projectId)
      if (res) setProject(res)
   }

   function formatearFechaManual(fechaStr) {
      if (!fechaStr) return ""
      const meses = [
         "enero", "febrero", "marzo", "abril", "mayo", "junio",
         "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
      ]
      const dias = [
         "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"
      ]
      const fecha = new Date(fechaStr)
      const diaSemana = dias[fecha.getDay()]
      const dia = String(fecha.getDate()).padStart(2, "0")
      const mes = meses[fecha.getMonth()]
      const anio = fecha.getFullYear()
      return `${diaSemana}, ${dia} de ${mes} del ${anio}`
   }

   // Obtener el id del usuario actual
   const usuarioId = userLogged?.id
   // Obtener el rol del usuario actual
   const usuarioRol = userLogged?.role

   const tiposDocenteEdita = ["ANTEPROYECTO", "REQUISITOS", "TESIS"]

   // --- ACTAS: Eliminar ---
   const handleDeleteActaClick = (acta) => {
      setActaToDelete(acta)
      setShowDeleteModal(true)
   }
   const handleConfirmDeleteActa = async () => {
      if (actaToDelete) {
         await deleteDocumentos(actaToDelete.id)
         // Refrescar lista de documentos y actas
         const docs = await getDocuments(project.id, "")
         setDocumentos(docs)
         setListActas(docs.filter(doc =>
            typeof doc.tipoDocumento === "string" &&
            doc.tipoDocumento.startsWith("ACTA")
         ))
         setShowDeleteModal(false)
         setActaToDelete(null)
      }
   }
   const handleCancelDeleteActa = () => {
      setShowDeleteModal(false)
      setActaToDelete(null)
   }

   // --- ACTAS: Resubir ---
   const handleResubirActaClick = (acta) => {
      setActaToResubir(acta)
      setResubirFile(null)
      if (resubirInputRef.current) resubirInputRef.current.value = ""
   }
   const handleResubirFileChange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
         setResubirFile(e.target.files[0])
      }
   }
   const handleResubirActaSubmit = async (e) => {
      e.preventDefault()
      if (!actaToResubir || !resubirFile) return
      await sendDocuments(
         project.id,
         actaToResubir.tipoDocumento,
         actaToResubir.tag,
         resubirFile
      )
      // Refrescar lista de documentos y actas
      const docs = await getDocuments(project.id, "")
      setDocumentos(docs)
      setListActas(docs.filter(doc =>
         typeof doc.tipoDocumento === "string" &&
         doc.tipoDocumento.startsWith("ACTA")
      ))
      setActaToResubir(null)
      setResubirFile(null)
      if (resubirInputRef.current) resubirInputRef.current.value = ""
   }
   const handleCancelResubirActa = () => {
      setActaToResubir(null)
      setResubirFile(null)
      if (resubirInputRef.current) resubirInputRef.current.value = ""
   }

   return project && (
      <main className="flex flex-col gap-4 h-full">
         <section className="flex justify-between items-center gap-2">
            <h1 className="font-black text-3xl">{project.titulo}</h1>
            <span className="flex items-center gap-2.5">
               <p className="text-gris-institucional">Fase Actual:</p>
               <b className="bg-black text-white rounded-full text-xs px-2">Fase {project.estadoActual}</b>
            </span>
         </section>

         <section className="flex flex-col gap-2">
            <b>Objetivo General</b>
            <p className="text-gris-institucional text-sm">{project.objetivoGeneral}</p>
         </section>

         <section className="flex flex-col gap-2">
            <b>Información del Proyecto</b>
            <article className="flex items-center gap-16 p-4">
               <aside className="flex flex-col gap-4">
                  <div className="flex gap-2">
                     <User size={20} />
                     <div className="flex flex-col text-sm/5">
                        <b>Estudiante</b>
                        <p className="text-gris-institucional text-xs">{project.usuariosAsignados?.find(u => u.rol?.nombre?.toLowerCase() === "estudiante")?.nombreUsuario}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Calendar size={20} />
                     <div className="flex flex-col text-sm/5">
                        <b>Fecha de inicio</b>
                        <p className="text-gris-institucional text-xs">{project.createdAt}</p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <Clock size={20} />
                     <div className="flex flex-col text-sm/5">
                        <b>Última actualización</b>
                        <p className="text-gris-institucional text-xs">{project.updatedAt}</p>
                     </div>
                  </div>
               </aside>
               <span className="bg-gris-claro w-[1px] h-full" />
               <aside className="flex flex-col gap-4">
                  <div className="flex gap-2">
                     <Users size={20} />
                     <div className="flex flex-col text-sm/3 gap-2.5">
                        <span className="flex items-center gap-1">
                           <b>Director:</b>
                           <p className="text-gris-institucional">
                              {project.usuariosAsignados?.find(u => u.rol?.nombre?.toLowerCase() === "director")?.nombreUsuario ?? "No existe un director en este proyecto"}
                           </p>
                        </span>
                        <span className="flex items-center gap-1">
                           <b>Codirector:</b>
                           <p className="text-gris-institucional">
                              {project.usuariosAsignados?.find(u => u.rol?.nombre?.toLowerCase() === "codirector")?.nombreUsuario ?? "No existe un codirector en este proyecto"}
                           </p>
                        </span>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <BookHeart size={20} />
                     <div className="flex flex-col text-sm/3 gap-2.5">
                        <span className="flex items-center gap-1">
                           <b>Grupo de investigación:</b>
                           <p className="text-gris-institucional">{project.lineaInvestigacion?.grupoInvestigacion?.nombre ?? "No pertenece a ningún grupo de investigación"}</p>
                        </span>
                        <span className="flex items-center gap-1">
                           <b>Línea de investigación:</b>
                           <p className="text-gris-institucional">{project.lineaInvestigacion?.nombre ?? "No pertenece a ninguna línea de investigación"}</p>
                        </span>
                     </div>
                  </div>
               </aside>
            </article>
         </section>

         <section className="flex flex-col gap-4">
            <span className="flex justify-between items-center gap-2">
               <b>Progreso General</b>
               <p>{(project.estadoActual / 10).toFixed(2) * 100}%</p>
            </span>
            <Progress classNames={{ indicator: "bg-rojo-institucional", track: "bg-rojo-claro" }}
               aria-label="statusbar"
               value={(project.estadoActual / 10).toFixed(2) * 100}
               size="sm"
            />
         </section>

         <section className="flex flex-col gap-2">
            <b>Objetivos Específicos</b>
            {project.objetivosEspecificos.map(obj => {
               const hoy = new Date()
               const fechaInicio = obj.fecha_inicio ? new Date(obj.fecha_inicio) : null
               const fechaFin = obj.fecha_fin ? new Date(obj.fecha_fin) : null
               const avance = typeof obj.avanceReportado === "number" ? obj.avanceReportado : 0
               const validadoDirector = obj.evaluacion?.director === true
               const validadoCodirector = obj.evaluacion?.codirector === true

               let estadoIcon = <CircleMinus className="text-gris-institucional" size={18} />
               let estadoTexto = "No iniciado"

               if (fechaInicio && fechaFin) {
                  if (hoy < fechaInicio) {
                     estadoIcon = <CircleMinus className="text-gris-institucional" size={18} />
                     estadoTexto = "No iniciado"
                  } else if (hoy >= fechaInicio && hoy <= fechaFin) {
                     estadoIcon = <CircleAlert className="text-amber-400" size={18} />
                     estadoTexto = "En progreso"
                  } else if (hoy > fechaFin) {
                     if (avance === 100 && validadoDirector && validadoCodirector) {
                        estadoIcon = <CheckCircle className="text-green-500" size={18} />
                        estadoTexto = "Completado"
                     } else if (avance < 100) {
                        estadoIcon = <XCircle className="text-rojo-mate" size={18} />
                        estadoTexto = "Atrasado"
                     } else if (avance === 100 && (!validadoDirector || !validadoCodirector)) {
                        estadoIcon = <CircleAlert className="text-amber-400" size={18} />
                        estadoTexto = "Pendiente a validación"
                     }
                  }
               }

               const esDirector = project.usuariosAsignados?.some(u =>
                  u.rol?.nombre?.toLowerCase() === "director" && u.email === usuarioId
               )
               const esCodirector = project.usuariosAsignados?.some(u =>
                  u.rol?.nombre?.toLowerCase() === "codirector" && u.email === usuarioId
               )

               return (
                  <article key={obj.id} className="flex justify-between items-center rounded-md border gap-2 p-5">
                     <aside className="flex justify-center items-center text-sm gap-4">
                        {estadoIcon}
                        <span className="flex flex-col justify-center">
                           <b>{obj.descripcion}</b>
                           <p className="text-gris-institucional/75 text-xs">
                              Rango: {formatearFechaManual(obj.fecha_inicio)} - {formatearFechaManual(obj.fecha_fin)}
                           </p>
                           <p className="text-xs mt-1">
                              Estado actual: <span className="font-semibold">{estadoTexto}</span>
                           </p>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">Avance reportado:</span>
                              <span className="font-semibold text-xs">{avance}%</span>
                           </div>
                           <ProgressBar
                              value={avance}
                              size="sm"
                              classNames={{ indicator: "bg-rojo-institucional", track: "bg-rojo-claro" }}
                              aria-label="avance-objetivo"
                           />
                        </span>
                     </aside>
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center">
                           <span className="text-xs font-semibold">Director</span>
                           {
                              obj.evaluacion == null
                                 ? <Circle className="text-gris-intermedio" />
                                 : obj.evaluacion.director === true
                                    ? <CheckCircle className="text-green-400" />
                                    : obj.evaluacion.director === false
                                       ? <CircleAlert className="text-amber-400" />
                                       : <Circle className="text-gris-intermedio" />
                           }
                           {esDirector && (
                              <div className="flex gap-1 mt-1">
                                 <button
                                    className="text-green-600 hover:text-green-800"
                                    title="Validar"
                                    onClick={() => handleValidarObjetivo(obj.id, true, true)}
                                 >
                                    <CheckCircle size={18} />
                                 </button>
                                 <button
                                    className="text-amber-500 hover:text-amber-700"
                                    title="No validar"
                                    onClick={() => handleValidarObjetivo(obj.id, true, false)}
                                 >
                                    <CircleAlert size={18} />
                                 </button>
                              </div>
                           )}
                        </div>
                        <div className="flex flex-col items-center">
                           <span className="text-xs font-semibold">Codirector</span>
                           {
                              obj.evaluacion == null
                                 ? <Circle className="text-gris-intermedio" />
                                 : obj.evaluacion.codirector === true
                                    ? <CheckCircle className="text-green-400" />
                                    : obj.evaluacion.codirector === false
                                       ? <CircleAlert className="text-amber-400" />
                                       : <Circle className="text-gris-intermedio" />
                           }
                           {esCodirector && (
                              <div className="flex gap-1 mt-1">
                                 <button
                                    className="text-green-600 hover:text-green-800"
                                    title="Validar"
                                    onClick={() => handleValidarObjetivo(obj.id, false, true)}
                                 >
                                    <CheckCircle size={18} />
                                 </button>
                                 <button
                                    className="text-amber-500 hover:text-amber-700"
                                    title="No validar"
                                    onClick={() => handleValidarObjetivo(obj.id, false, false)}
                                 >
                                    <CircleAlert size={18} />
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  </article>
               )
            })}
         </section>

         <section className="flex flex-col gap-2">
            <b>Documentos del Proyecto</b>
            {Object.keys(docsPorTipo).length > 0 ? (
               Object.entries(docsPorTipo).map(([tipo, docs]) => (
                  <div key={tipo} className="bg-gris-claro/50 rounded-md mb-4 p-4 border">
                     <div className="font-bold text-base mb-1">{tipo}</div>
                     <div className="flex flex-col gap-2">
                        {docs.map(doc => {
                           const misRetros = doc.retroalimentacion?.filter(r => r.email === usuarioId) || []
                           const yaRetro = misRetros.length > 0
                           const puedeEditarRetro =
                              usuarioRol !== "Docente" ||
                              (usuarioRol === "Docente" && tiposDocenteEdita.includes(doc.tipoDocumento))
                           return (
                              <div key={doc.id} className="bg-white flex flex-col border rounded-md p-3 gap-2">
                                 <div className="flex items-center gap-3">
                                    <FileText className="text-green-600" size={20} />
                                    <div className="flex-1">
                                       <div className="font-semibold">{doc.nombre}</div>
                                       <div className="text-xs text-gray-500">{doc.peso}</div>
                                    </div>
                                    <a
                                       href={doc.url}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="flex items-center gap-1 text-blue-600 hover:underline"
                                    >
                                       <Download size={16} />
                                       Descargar
                                    </a>
                                 </div>
                                 {doc.retroalimentacion && doc.retroalimentacion.length > 0 && (
                                    <div className="bg-gray-50 border rounded p-2 mt-2 flex flex-col gap-1">
                                       <b className="text-xs mb-1">Retroalimentaciones:</b>
                                       {doc.retroalimentacion.map(retro => (
                                          <div key={retro.id} className="text-xs flex gap-2 items-center">
                                             <span className="font-semibold">{retro.nombreUsuario}:</span>
                                             {editRetroId === retro.id ? (
                                                <>
                                                   <textarea
                                                      className="border rounded p-1 text-xs flex-1"
                                                      value={editRetroValue}
                                                      onChange={e => setEditRetroValue(e.target.value)}
                                                      rows={2}
                                                      disabled={sending}
                                                   />
                                                   <button
                                                      className="text-green-600 hover:text-green-800"
                                                      onClick={() => handleSaveEditRetro(retro)}
                                                      type="button"
                                                      disabled={sending || !editRetroValue.trim()}
                                                   >
                                                      <Save size={16} />
                                                   </button>
                                                   <button
                                                      className="text-gray-500 hover:text-gray-800"
                                                      onClick={() => { setEditRetroId(null); setEditRetroValue(""); }}
                                                      type="button"
                                                      disabled={sending}
                                                   >
                                                      <X size={16} />
                                                   </button>
                                                </>
                                             ) : (
                                                <>
                                                   <span>{retro.descripcion}</span>
                                                   {retro.emailUsuario === usuarioId && puedeEditarRetro && (
                                                      <>
                                                         <button
                                                            className="text-blue-600 hover:text-blue-800"
                                                            onClick={() => handleEditRetro(retro)}
                                                            type="button"
                                                            disabled={sending}
                                                         >
                                                            <Edit size={15} />
                                                         </button>
                                                         <button
                                                            className="text-red-600 hover:text-red-800"
                                                            onClick={() => handleDeleteRetro(retro)}
                                                            type="button"
                                                            disabled={sending}
                                                         >
                                                            <Trash2 size={15} />
                                                         </button>
                                                      </>
                                                   )}
                                                </>
                                             )}
                                          </div>
                                       ))}
                                    </div>
                                 )}
                                 {!yaRetro && puedeEditarRetro && (
                                    <form
                                       className="flex flex-col gap-2 mt-2"
                                       onSubmit={e => {
                                          e.preventDefault()
                                          handleSendRetro(doc.id)
                                       }}
                                    >
                                       <textarea
                                          className="border rounded p-2 text-sm"
                                          rows={2}
                                          placeholder="Escribe tu retroalimentación aquí..."
                                          value={retroInputs[doc.id] || ""}
                                          onChange={e => handleRetroInput(doc.id, e.target.value)}
                                          disabled={sending}
                                       />
                                       <button
                                          type="submit"
                                          className="self-end bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
                                          disabled={sending || !retroInputs[doc.id] || !retroInputs[doc.id].trim()}
                                       >
                                          {sending ? "Enviando..." : "Enviar retroalimentación"}
                                       </button>
                                    </form>
                                 )}
                              </div>
                           )
                        })}
                     </div>
                  </div>
               ))
            ) : (
               <p className="text-gris-institucional text-sm">No hay documentos para este proyecto.</p>
            )}
         </section>

         {/* SECCIÓN DE TODAS LAS ACTAS */}
         <section className="flex flex-col gap-2 my-10">
            <b className="text-lg">Todas las Actas del Proyecto</b>
            <p className="text-gris-institucional text-sm">Aquí puedes descargar, resubir o eliminar cualquier acta generada en el proyecto.</p>
            <div className="flex flex-col gap-3">
               {listActas.length === 0 && (
                  <span className="text-gris-institucional text-sm">No hay actas para este proyecto.</span>
               )}
               {listActas.map(acta => (
                  <div
                     key={acta.id}
                     className="border-gris-claro rounded-md border flex flex-col md:flex-row md:items-center justify-between gap-2 p-4"
                  >
                     <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File size={22} className="text-blue-400 shrink-0" />
                        <div className="flex flex-col min-w-0">
                           <span className="truncate font-semibold text-sm">{acta.nombre}</span>
                           <span className="text-xs text-gray-500">{acta.peso}</span>
                           <span className="text-xs text-gray-400">{acta.tipoDocumento} {acta.tag && `| ${acta.tag}`}</span>
                        </div>
                     </div>
                     <div className="flex gap-2 flex-shrink-0">
                        <a
                           href={acta.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           download
                        >
                           <Boton type="button" variant="borderwhite" customClassName="w-fit">
                              Descargar
                           </Boton>
                        </a>
                        <Boton
                           type="button"
                           variant="borderwhite"
                           customClassName="w-fit"
                           onClick={() => handleResubirActaClick(acta)}
                        >
                           Resubir
                        </Boton>
                        <Boton
                           type="button"
                           variant="whitered"
                           customClassName="w-fit"
                           onClick={() => handleDeleteActaClick(acta)}
                        >
                           Eliminar
                        </Boton>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* MODAL DE RESUBIR ACTA */}
         {actaToResubir && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4">
                  <h6 className="font-bold text-lg">Resubir acta</h6>
                  <p className="text-sm">
                     Selecciona el archivo PDF para reemplazar el acta <b>{actaToResubir?.nombre}</b>.
                  </p>
                  <form onSubmit={handleResubirActaSubmit} className="flex flex-col gap-2">
                     <input
                        ref={resubirInputRef}
                        type="file"
                        accept=".pdf"
                        required
                        onChange={handleResubirFileChange}
                        className="border rounded p-2 text-sm"
                     />
                     <div className="flex gap-2 justify-end">
                        <Boton variant="borderwhite" type="button" onClick={handleCancelResubirActa}>
                           Cancelar
                        </Boton>
                        <Boton variant="borderwhite" type="submit" disabled={!resubirFile}>
                           Subir nueva versión
                        </Boton>
                     </div>
                  </form>
               </div>
            </div>
         )}

         {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
         {showDeleteModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
               <div className="bg-white rounded-md p-6 max-w-sm w-full flex flex-col gap-4">
                  <h6 className="font-bold text-lg">¿Eliminar acta?</h6>
                  <p className="text-sm">
                     ¿Estás seguro de que deseas eliminar el acta <b>{actaToDelete?.nombre}</b>? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2 justify-end">
                     <Boton variant="borderwhite" onClick={handleCancelDeleteActa}>
                        Cancelar
                     </Boton>
                     <Boton variant="whitered" onClick={handleConfirmDeleteActa}>
                        Eliminar
                     </Boton>
                  </div>
               </div>
            </div>
         )}
      </main>
   )
}