import { ChevronDown, CalendarDays, Save } from "lucide-react"
import Actividades from "../componentes/Actividades"
import { useState, useRef, useEffect } from "react"
import { Alert } from "@heroui/alert"
import Boton from "../../../Boton"
import useProject from "../../../../lib/hooks/useProject"
import { Upload } from "lucide-react"
import { File } from "lucide-react"
import { Download } from "lucide-react"

const actividades = [
   {
      title: "Selección de Grupo de Investigación",
      tasks: [
         { desc: "Seleccionar grupo y línea de investigación" },
         { desc: "Seleccionar director y codirector (OPCIONAL)" },
      ],
   },
   {
      title: "Presentación ante Comité",
      tasks: [
         { desc: "Subir documento de respaldo" },
         { desc: "Subir presentación del proyecto" },
      ],
   },
]

const DocumentoSubido = ({ doc, onDelete }) => (
   <div className="border-gris-claro rounded-md border flex flex-col gap-2 p-4">
      <div className="flex justify-between items-center gap-2">
         <div className="flex items-center gap-2">
            <File size={24} className="text-green-400" />
            <div className="flex flex-col">
               <p className="text-negro-institucional font-bold text-sm">{doc.nombre}</p>
               <p className="text-gris-intermedio text-xs font-thin">{doc.peso}</p>
            </div>
         </div>
         <div className="flex gap-2">
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
               <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                  <Download size={18} />
                  Descargar
               </Boton>
            </a>
            <Boton
               type="button"
               variant="borderwhite"
               customClassName="w-fit"
               onClick={() => onDelete(doc.id)}
            >
               Eliminar
            </Boton>
         </div>
      </div>
      {/* Mostrar retroalimentaciones si existen */}
      {doc.retroalimentacion && doc.retroalimentacion.length > 0 && (
         <div className="bg-gray-50 border rounded p-2 mt-2 flex flex-col gap-1">
            <b className="text-xs mb-1">Retroalimentaciones:</b>
            {doc.retroalimentacion.map(retro => (
               <div key={retro.id} className="text-xs flex gap-2 items-center">
                  <span className="font-semibold">{retro.nombreUsuario}:</span>
                  <span>{retro.descripcion}</span>
               </div>
            ))}
         </div>
      )}
   </div>
)

export default function Fase_2({ project }) {
   const { listaGrupos, listDocentes, editProject, getDocuments, deleteDocumentos, sendDocuments } = useProject()

   const [currentProject, setCurrentProject] = useState(null)
   const [listGrupos, setListGrupos] = useState([])
   const [listDirectores, setListDirectores] = useState([])
   const [listDocumentos, setListDocumentos] = useState(null)
   const [listActas, setListActas] = useState([])

   const [isGrupoOpen, setIsGrupoOpen] = useState(false)
   const [isLineaOpen, setIsLineaOpen] = useState(false)
   const [isDirectorOpen, setIsDirectorOpen] = useState(false)
   const [isCodirectorOpen, setIsCodirectorOpen] = useState(false)

   const [dragTarget, setDragTarget] = useState(null)

   const [formData, setFormData] = useState({
      grupo: null,
      linea: null,
      director: null,
      codirector: null,
      documentoRespaldo: null,
      documentoPresentacion: null,
   })

   const grupoRef = useRef(null)
   const lineaRef = useRef(null)
   const directorRef = useRef(null)
   const codirectorRef = useRef(null)
   const respaldoRef = useRef(null)
   const presentacionRef = useRef(null)

   // NUEVA FUNCIÓN: Determina si hay director y codirector asignados
   const getDirectorCodirectorAsignados = (usuariosAsignados = []) => {
      let director = null
      let codirector = null
      usuariosAsignados.forEach(u => {
         if (u.rol?.nombre === "Director") director = u
         if (u.rol?.nombre === "Codirector") codirector = u
      })
      return { director, codirector }
   }

   const onSubmit = async (e) => {
      e.preventDefault()

      const { grupo, linea, director, codirector, documentoRespaldo, documentoPresentacion } = formData

      const getNombreCompleto = (persona) => {
         if (!persona) return ""
         return [
            persona.primerNombre,
            persona.segundoNombre,
            persona.primerApellido,
            persona.segundoApellido
         ].filter(val => val && val.trim() !== "").join(" ").trim()
      }

      const nombres = [getNombreCompleto(director), getNombreCompleto(codirector)].filter(nombre => nombre && nombre.trim() !== "").join(" y ")

      const data = { lineaInvestigacion: { id: linea.id }, ...(nombres && { recomendacionDirectores: nombres }) }
      await editProject(data, currentProject.id)

      let documentosActualizados = false

      if (documentoRespaldo) {
         await sendDocuments(currentProject.id, "REQUISITOS", "RESPALDO", documentoRespaldo)
         documentosActualizados = true
      }
      if (documentoPresentacion) {
         await sendDocuments(currentProject.id, "REQUISITOS", "PRESENTACION", documentoPresentacion)
         documentosActualizados = true
      }

      // Actualiza la lista de documentos si se subió alguno
      if (documentosActualizados) {
         await setDocumentos(currentProject.id)
         setFormData({ ...formData, documentoRespaldo: null, documentoPresentacion: null })
      }
   }

   useEffect(() => { fetchListas() }, [])
   useEffect(() => { if (!!currentProject) setDocumentos(currentProject.id) }, [currentProject])
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (grupoRef.current && !grupoRef.current.contains(event.target)) setIsGrupoOpen(false)
         if (lineaRef.current && !lineaRef.current.contains(event.target)) setIsLineaOpen(false)
         if (directorRef.current && !directorRef.current.contains(event.target)) setIsDirectorOpen(false)
         if (codirectorRef.current && !codirectorRef.current.contains(event.target)) setIsCodirectorOpen(false)
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => { document.removeEventListener("mousedown", handleClickOutside) }
   }, [])

   const fetchListas = async () => {
      const grupos = await listaGrupos()
      const docentes = await listDocentes()
      setCurrentProject(project)
      setListGrupos(grupos)
      setListDirectores(docentes)

      // --- NUEVA LÓGICA ---
      const { director: asignadoDirector, codirector: asignadoCodirector } = getDirectorCodirectorAsignados(project.usuariosAsignados)

      // Si hay director y codirector asignados, NO mostrar recomendacionDirectores
      if (asignadoDirector && asignadoCodirector) {
         setFormData({
            ...formData,
            grupo: grupos.find(g => g.id === project.lineaInvestigacion.grupoInvestigacion.id),
            linea: grupos.find(g => g.id === project.lineaInvestigacion.grupoInvestigacion.id).lineasInvestigacion.find(l => l.id === project.lineaInvestigacion.id),
            director: null,
            codirector: null,
         })
      } else {
         // Si NO hay ambos asignados, usar recomendacionDirectores para preseleccionar
         setFormData({
            ...formData,
            grupo: grupos.find(g => g.id === project.lineaInvestigacion.grupoInvestigacion.id),
            linea: grupos.find(g => g.id === project.lineaInvestigacion.grupoInvestigacion.id).lineasInvestigacion.find(l => l.id === project.lineaInvestigacion.id),
            director: docentes.find(d =>
               `${d.primerNombre ?? ""}${d.segundoNombre ?? ""}${d.primerApellido ?? ""}${d.segundoApellido ?? ""}`.replace(/\s+/g, "")
               ==
               `${project.recomendacionDirectores?.split(" y ")[0]}`.replace(/\s+/g, "")
            ),
            codirector: docentes.find(d =>
               `${d.primerNombre ?? ""}${d.segundoNombre ?? ""}${d.primerApellido ?? ""}${d.segundoApellido ?? ""}`.replace(/\s+/g, "")
               ==
               `${project.recomendacionDirectores?.split(" y ")[1]}`.replace(/\s+/g, "")
            ),
         })
      }
   }

   const setDocumentos = async (projectId) => {
      const docs = await getDocuments(projectId, "REQUISITOS")
      if (docs.length === 0) {
         setListDocumentos(null)
         return
      }
      setListDocumentos(docs)

      const actas = await getDocuments(projectId, "ACTASOLICITUD")
      if (actas.length === 0) {
         setListActas(null)
         return
      }
      setListActas(actas)
   }

   const handleDragOver = (event, target) => {
      event.preventDefault()
      event.stopPropagation()
      setDragTarget(target)
   }

   const handleDragLeave = (event) => {
      event.preventDefault()
      event.stopPropagation()
      setDragTarget(null)
   }

   const handleDrop = (event, target) => {
      event.preventDefault()
      event.stopPropagation()
      setDragTarget(null)

      // Verificar que hay archivos en el evento
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
         const file = event.dataTransfer.files[0]

         // Solo aceptar archivos PDF
         if (file.type === 'application/pdf') {
            if (target === 'respaldo') {
               setFormData({ ...formData, documentoRespaldo: file })
            } else if (target === 'presentacion') {
               setFormData({ ...formData, documentoPresentacion: file })
            }
         } else {
            alert('Por favor, suba únicamente archivos PDF')
         }
      }
   }

   const handleFileChange = (e, target) => {
      if (e.target.files && e.target.files.length > 0) {
         const file = e.target.files[0]
         if (target === 'respaldo') {
            setFormData({ ...formData, documentoRespaldo: file })
         } else if (target === 'presentacion') {
            setFormData({ ...formData, documentoPresentacion: file })
         }
      }
   }

   const getFileInfo = (file) => {
      return file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : null
   }

   const handleEliminarDocumento = async (docId) => {
      const res = await deleteDocumentos(docId)
      await setDocumentos(currentProject.id)
   }

   const respaldoDoc = listDocumentos?.find(doc => doc.tag === "RESPALDO")
   const presentacionDoc = listDocumentos?.find(doc => doc.tag === "PRESENTACION")

   // NUEVO: Detectar si hay director y codirector asignados
   const { director: asignadoDirector, codirector: asignadoCodirector } = getDirectorCodirectorAsignados(project.usuariosAsignados)

   const handleSubirActaSolicitud = async (e) => {
      e.preventDefault();
      const file = e.target.actaArchivo.files[0];
      if (!file) return;
      await sendDocuments(
         currentProject.id,
         "ACTASOLICITUD",      // tipoDocumento
         "SolicitudEvaluacion",// tag
         file
      );
      await setDocumentos(currentProject.id);
      e.target.reset();
   };

   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)

   const handleDeleteActaClick = (acta) => {
      setActaToDelete(acta)
      setShowDeleteModal(true)
   }

   const handleConfirmDeleteActa = async () => {
      if (actaToDelete) {
         await deleteDocumentos(actaToDelete.id)
         await setDocumentos(currentProject.id)
         setShowDeleteModal(false)
         setActaToDelete(null)
      }
   }

   const handleCancelDeleteActa = () => {
      setShowDeleteModal(false)
      setActaToDelete(null)
   }

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 2: Presentación Inicial del Proyecto</h4>
            <p className="text-gris-institucional text-sm">
               Suba las diapositivas para la presentación inicial de su proyecto
            </p>
         </div>

         <Actividades taskList={actividades} />

         <form onSubmit={onSubmit} className='flex flex-col w-full space-y-5 text-sm'>
            <div className="space-y-1">
               <label className="font-bold select-none">Grupo y Línea de Investigación</label>
               <div className="flex items-center gap-2">
                  <div ref={grupoRef} className="relative w-full">
                     <button onClick={() => currentProject?.estadoActual === 2 && setIsGrupoOpen(!isGrupoOpen)} type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center">
                        <p>{!formData.grupo ? "Seleccione un grupo de investigación" : formData.grupo.nombre}</p>
                        <ChevronDown size={18} className={`${isGrupoOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                     </button>
                     {
                        isGrupoOpen &&
                        <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                           {
                              listGrupos.map((grupo, index) =>
                                 <button key={index} onClick={() => {
                                    setFormData({ ...formData, grupo: grupo, linea: grupo.lineasInvestigacion[0] })
                                    setIsGrupoOpen(false)
                                 }} type="button"
                                    className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                    {grupo.nombre}
                                 </button>
                              )
                           }
                        </div>
                     }
                  </div>
                  <div ref={lineaRef} className="relative w-full">
                     <button disabled={!formData.grupo} onClick={() => currentProject?.estadoActual === 2 && setIsLineaOpen(!isLineaOpen)} type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center">
                        <p>{!formData.linea && !formData.grupo ? "Primero seleccione un grupo de investigación" : formData.linea.nombre}</p>
                        <ChevronDown size={18} className={`${isLineaOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                     </button>
                     {
                        isLineaOpen && formData.grupo &&
                        <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                           {
                              formData.grupo.lineasInvestigacion.map((linea, index) =>
                                 <button key={index} onClick={() => {
                                    setFormData({ ...formData, linea: linea })
                                    setIsLineaOpen(false)
                                 }} type="button"
                                    className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                    {linea.nombre}
                                 </button>
                              )
                           }
                        </div>
                     }
                  </div>
               </div>
            </div>

            {/* Mostrar recomendación como inputs SOLO si NO hay director y codirector asignados.
                Si ya están asignados, mostrar sus nombres como texto. */}
            {(asignadoDirector || asignadoCodirector) ? (
               <div className="space-y-1">
                  <label className="font-bold select-none">Director y Codirector asignados</label>
                  <div className="flex items-center gap-2">
                     <div className="w-full border rounded-md p-2.5 bg-gray-50">
                        <span className="font-semibold">Director: </span>
                        {asignadoDirector
                           ? (asignadoDirector.nombreUsuario || "Sin nombre")
                           : <span className="text-gray-400">No asignado</span>
                        }
                     </div>
                     <div className="w-full border rounded-md p-2.5 bg-gray-50">
                        <span className="font-semibold">Codirector: </span>
                        {asignadoCodirector
                           ? (asignadoCodirector.nombreUsuario || "Sin nombre")
                           : <span className="text-gray-400">No asignado</span>
                        }
                     </div>
                  </div>
               </div>
            ) : (
               <div className="space-y-1">
                  <label className="font-bold select-none">Recomendar Director y Codirector (OPCIONAL)</label>
                  <div className="flex items-center gap-2">
                     <div ref={directorRef} className="relative w-full">
                        <button onClick={() => currentProject?.estadoActual === 2 && setIsDirectorOpen(!isDirectorOpen)} type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center">
                           <p>{!formData.director ? "Seleccione un director" :
                              `${formData.director.primerNombre ?? ""} ${formData.director.segundoNombre ?? ""} 
                           ${formData.director.primerApellido ?? ""} ${formData.director.segundoApellido ?? ""}`}</p>
                           <ChevronDown size={18} className={`${isDirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                        </button>
                        {
                           isDirectorOpen &&
                           <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                              {
                                 listDirectores.filter(u => u.id !== formData.codirector?.id).map((user, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, director: user })
                                       setIsDirectorOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {`${user.primerNombre ?? ""} ${user.segundoNombre ?? ""} ${user.primerApellido ?? ""} ${user.segundoApellido ?? ""}`}
                                    </button>
                                 )
                              }
                           </div>
                        }
                     </div>
                     <div ref={codirectorRef} className="relative w-full">
                        <button onClick={() => currentProject?.estadoActual === 2 && setIsCodirectorOpen(!isCodirectorOpen)} type="button" className="border-gris-claro text-start border rounded-md p-2.5 w-full flex justify-between items-center">
                           <p>{!formData.codirector ? "Seleccione un codirector" :
                              `${formData.codirector.primerNombre ?? ""} ${formData.codirector.segundoNombre ?? ""} 
                           ${formData.codirector.primerApellido ?? ""} ${formData.codirector.segundoApellido ?? ""}`}</p>
                           <ChevronDown size={18} className={`${isCodirectorOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
                        </button>
                        {
                           isCodirectorOpen &&
                           <div className="bg-white border-gris-claro max-h-40 overflow-y-auto border absolute top-[110%] left-0 w-full select-animation rounded-md z-10">
                              {
                                 listDirectores.filter(u => u.id !== formData.director?.id).map((user, index) =>
                                    <button key={index} onClick={() => {
                                       setFormData({ ...formData, codirector: user })
                                       setIsCodirectorOpen(false)
                                    }} type="button"
                                       className="hover:bg-gris-claro/50 w-full text-start duration-150 p-2.5 text-sm">
                                       {`${user.primerNombre ?? ""} ${user.segundoNombre ?? ""} ${user.primerApellido ?? ""} ${user.segundoApellido ?? ""}`}
                                    </button>
                                 )
                              }
                           </div>
                        }
                     </div>
                  </div>
               </div>
            )}

            {/* Inputs y documentos */}
            <>
               {/* Input de Respaldo si no hay documento */}
               {!respaldoDoc && (
                  <div className="space-y-1">
                     <h6 className="font-bold select-none">Documento de Respaldo (PDF)</h6>
                     <label
                        ref={respaldoRef}
                        htmlFor="documentoRespaldo"
                        className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
            ${dragTarget === 'respaldo' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                        onDragOver={(e) => handleDragOver(e, 'respaldo')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'respaldo')}
                     >
                        <Upload />
                        <p className="text-sm">
                           {dragTarget !== 'respaldo'
                              ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                              : "Suelte aquí el documento de respaldo"}
                        </p>
                        <div className="flex items-center gap-2">
                           <p className="text-xs">{getFileInfo(formData.documentoRespaldo) ?? "PDF (MAX: 100MB)"}</p>
                           {formData.documentoRespaldo && (
                              <button
                                 type="button"
                                 className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                                 onClick={e => {
                                    e.stopPropagation()
                                    setFormData({ ...formData, documentoRespaldo: null })
                                 }}
                                 aria-label="Eliminar archivo"
                              >
                                 ×
                              </button>
                           )}
                        </div>
                     </label>
                     <input className='hidden'
                        name="documentoRespaldo"
                        id="documentoRespaldo"
                        onChange={(e) => handleFileChange(e, 'respaldo')}
                        type='file'
                        accept=".pdf"
                     />
                  </div>
               )}

               {!presentacionDoc && (
                  <div className="space-y-1">
                     <h6 className="font-bold select-none">Documento de Presentación (PDF)</h6>
                     <label
                        ref={presentacionRef}
                        htmlFor="documentoPresentacion"
                        className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
            ${dragTarget === 'presentacion' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                        onDragOver={(e) => handleDragOver(e, 'presentacion')}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'presentacion')}
                     >
                        <Upload />
                        <p className="text-sm">
                           {dragTarget !== 'presentacion'
                              ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                              : "Suelte aquí el documento de presentación"}
                        </p>
                        <div className="flex items-center gap-2">
                           <p className="text-xs">{getFileInfo(formData.documentoPresentacion) ?? "PDF (MAX: 100MB)"}</p>
                           {formData.documentoPresentacion && (
                              <button
                                 type="button"
                                 className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                                 onClick={e => {
                                    e.stopPropagation()
                                    setFormData({ ...formData, documentoPresentacion: null })
                                 }}
                                 aria-label="Eliminar archivo"
                              >
                                 ×
                              </button>
                           )}
                        </div>
                     </label>
                     <input className='hidden'
                        name="documentoPresentacion"
                        id="documentoPresentacion"
                        onChange={(e) => handleFileChange(e, 'presentacion')}
                        type='file'
                        accept=".pdf"
                     />
                  </div>
               )}

               {/* Mostrar documento de Respaldo si existe */}
               {respaldoDoc && (
                  <DocumentoSubido doc={respaldoDoc} onDelete={handleEliminarDocumento} />
               )}

               {/* Mostrar documento de Presentación si existe */}
               {presentacionDoc && (
                  <DocumentoSubido doc={presentacionDoc} onDelete={handleEliminarDocumento} />
               )}

               {/* Mostrar documentos IMPORTADO */}
               {listDocumentos?.filter(doc => doc.tag === "IMPORTADO").map(doc => (
                  <DocumentoSubido key={doc.id} doc={doc} onDelete={handleEliminarDocumento} />
               ))}

            </>
            {
               currentProject?.estadoActual === 2 &&
               <div className="flex justify-between items-center">
                  <p className="text-gris-institucional">
                     Suba los documentos de respaldo y presentación. Asegúrese de que el contenido sea claro y legible.
                  </p>
                  <div className="w-fit self-end">
                     <Boton type={"submit"} variant={"borderwhite"} >
                        Guardar
                        <Save size={16} />
                     </Boton>
                  </div>
               </div>
            }
         </form>

         {/* SECCIÓN DE ACTAS */}
         {Array.isArray(listActas) && listActas.length > 0 && (
            <section className="my-10">
               <div className="mb-4">
                  <h5 className="font-bold text-lg">Actas de la Fase</h5>
                  <p className="text-gris-institucional text-sm">Revisar y subir modificaciones si es necesario</p>
               </div>
               <div className="flex flex-col gap-3">
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
               {/* Input para subir nueva acta */}
               <div className="mt-6 space-y-2">
                  <label className="font-bold select-none">Agregar Acta de Solicitud Corregida</label>
                  <form
                     onSubmit={handleSubirActaSolicitud}
                     className="flex flex-col md:flex-row gap-2 items-center"
                  >
                     <input
                        type="file"
                        name="actaArchivo"
                        required
                        className="border rounded p-2 text-sm"
                     />
                     <Boton type="submit" variant="borderwhite" customClassName="w-fit">
                        Subir Acta
                     </Boton>
                  </form>
               </div>
            </section>
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
      </section>
   )
}