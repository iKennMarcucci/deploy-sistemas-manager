import { useEffect, useState, useRef } from "react"
import useProject from "../../../../lib/hooks/useProject"
import { File, Download, User, MessageCircle } from "lucide-react"
import Boton from "../../../Boton"
import Actividades from "../componentes/Actividades"
import { Upload } from "lucide-react"

export default function Fase_9({ project }) {
   const actividades = [
      {
         title: "Retroalimentación de Jurados",
         tasks: [
            { desc: "Revisar retroalimentación general de los jurados" },
            { desc: "Realizar cambios sugeridos y subirlos" },
            { desc: "Revisa tu nota definitiva" },
         ],
      }
   ]
   const { getDocuments, sendDocuments, deleteDocumentos, listSustentaciones } = useProject()
   const [currentProject, setCurrentProject] = useState(null)
   const [listDocumentos, setListDocumentos] = useState([])
   const [sustentacion, setSustentacion] = useState(null)
   const [formData, setFormData] = useState({
      documentoTesis: null,
      articuloTesis: null,
      presentacionTesis: null,
   })

   // Actas de original
   const [listActas, setListActas] = useState([])
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)

   const documentoInputRef = useRef(null)
   const articuloInputRef = useRef(null)
   const presentacionInputRef = useRef(null)

   const [dragTarget, setDragTarget] = useState(null)

   useEffect(() => {
      const fetchData = async () => {
         setCurrentProject(project)
         if (project) {
            const docs = await getDocuments(project.id, "TESIS")
            setListDocumentos(docs)
            // Secuencial: primero documentos, luego actas
            const actas = await getDocuments(project.id, "ACTAORIGINAL")
            setListActas(actas || [])
         }
         if (listSustentaciones) {
            const susts = await listSustentaciones()
            const tesis = susts.find(s => s.tipoSustentacion === "TESIS")
            setSustentacion(tesis)
         }
      }
      fetchData()
   }, [])

   // Agrupa versiones por documento
   const getVersiones = (baseTag) => {
      return listDocumentos
         .filter(doc =>
            doc.tag === baseTag ||
            doc.tag.startsWith(baseTag + "_v")
         )
         .sort((a, b) => {
            const getVer = tag => {
               const match = tag.match(/_v(\d+)$/)
               return match ? parseInt(match[1], 10) : 1
            }
            return getVer(b.tag) - getVer(a.tag)
         })
   }

   // Calcula la siguiente versión para el tag
   const getNextVersionTag = (baseTag) => {
      const versiones = getVersiones(baseTag)
      const last = versiones[0]
      if (!last) return baseTag
      const match = last.tag.match(/_v(\d+)$/)
      if (!match) return baseTag + "_v2"
      const next = parseInt(match[1], 10) + 1
      return `${baseTag}_v${next}`
   }

   // Drag & drop y file input
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
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
         const file = event.dataTransfer.files[0]
         if (file.type === 'application/pdf') {
            setFormData({ ...formData, [target]: file })
         } else {
            alert('Por favor, suba únicamente archivos PDF')
         }
      }
   }
   const handleFileChange = (e, target) => {
      if (e.target.files && e.target.files.length > 0) {
         const file = e.target.files[0]
         setFormData({ ...formData, [target]: file })
      }
   }
   const getFileInfo = (file) => {
      return file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : null
   }
   const handleEliminarDocumento = async (docId) => {
      await deleteDocumentos(docId)
      if (currentProject) {
         const docs = await getDocuments(currentProject.id, "TESIS")
         setListDocumentos(docs)
      }
   }

   // Subida de archivos con versión
   const handleSubmit = async (e) => {
      e.preventDefault()
      if (!currentProject) return
      let documentosActualizados = false

      if (formData.documentoTesis) {
         const tag = getNextVersionTag("DOCUMENTO_TESIS")
         await sendDocuments(currentProject.id, "TESIS", tag, formData.documentoTesis)
         documentosActualizados = true
      }
      if (formData.articuloTesis) {
         const tag = getNextVersionTag("ARTICULO_TESIS")
         await sendDocuments(currentProject.id, "TESIS", tag, formData.articuloTesis)
         documentosActualizados = true
      }
      if (formData.presentacionTesis) {
         const tag = getNextVersionTag("PRESENTACION_TESIS")
         await sendDocuments(currentProject.id, "TESIS", tag, formData.presentacionTesis)
         documentosActualizados = true
      }
      if (documentosActualizados) {
         const docs = await getDocuments(currentProject.id, "TESIS")
         setListDocumentos(docs)
         setFormData({
            documentoTesis: null,
            articuloTesis: null,
            presentacionTesis: null,
         })
         if (documentoInputRef.current) documentoInputRef.current.value = ""
         if (articuloInputRef.current) articuloInputRef.current.value = ""
         if (presentacionInputRef.current) presentacionInputRef.current.value = ""
      }
   }

   // --- ACTAS ORIGINALES ---
   // Subir nueva acta original
   const handleSubirActaOriginal = async (e) => {
      e.preventDefault()
      const file = e.target.actaArchivo.files[0]
      if (!file) return
      await sendDocuments(
         currentProject.id,
         "ACTAORIGINAL", // tipoDocumento
         "ActaOriginal", // tag
         file
      )
      const actas = await getDocuments(currentProject.id, "ACTAORIGINAL")
      setListActas(actas || [])
      e.target.reset()
   }

   // Eliminar acta original
   const handleDeleteActaClick = (acta) => {
      setActaToDelete(acta)
      setShowDeleteModal(true)
   }
   const handleConfirmDeleteActa = async () => {
      if (actaToDelete) {
         await deleteDocumentos(actaToDelete.id)
         const actas = await getDocuments(currentProject.id, "ACTAORIGINAL")
         setListActas(actas || [])
         setShowDeleteModal(false)
         setActaToDelete(null)
      }
   }
   const handleCancelDeleteActa = () => {
      setShowDeleteModal(false)
      setActaToDelete(null)
   }

   // Retroalimentación general de jurados
   const renderRetroalimentacion = () => {
      if (!sustentacion || !sustentacion.evaluadores || sustentacion.evaluadores.length === 0) return null
      return (
         <div className="border-gris-claro rounded-md border p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
               <MessageCircle size={20} className="text-amber-500" />
               <span className="font-bold">Retroalimentación de Jurados</span>
            </div>
            {sustentacion.evaluadores.map((ev, idx) => (
               <div key={idx} className="mb-2">
                  <div className="flex items-center gap-2">
                     <User size={16} />
                     <span className="font-bold text-sm">{ev.nombreUsuario}</span>
                     {ev.nota !== null && <span className="bg-azul-claro text-azul border-azul rounded-xl border text-xs px-2">Nota: {ev.nota}</span>}
                  </div>
                  <div className="ml-6 text-sm text-gris-intermedio">
                     {ev.observaciones ? ev.observaciones : <span className="italic text-gris-intermedio">Sin observaciones</span>}
                  </div>
               </div>
            ))}
         </div>
      )
   }

   // Renderiza todas las versiones de un documento
   const renderVersiones = (baseTag, label, inputRef, formKey, dragKey) => {
      const versiones = getVersiones(baseTag)
      return (
         <div className="space-y-2">
            <h6 className="font-bold select-none">{label} (PDF)</h6>
            {versiones.length > 0 && (
               <div className="space-y-2">
                  {versiones.map((doc, idx) => (
                     <div key={doc.id} className="border-gris-claro rounded-md border flex justify-between items-center gap-2 p-3">
                        <div className="flex items-center gap-2">
                           <File size={20} className="text-green-400" />
                           <div className="flex flex-col">
                              <p className="text-negro-institucional font-bold text-xs">{doc.nombre}</p>
                              <p className="text-gris-intermedio text-xs font-thin">{doc.peso} {doc.tag !== baseTag && <span className="ml-2">Versión {doc.tag.split("_v")[1]}</span>}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                                 <Download size={16} />
                                 Descargar
                              </Boton>
                           </a>
                           <Boton
                              type="button"
                              variant="borderwhite"
                              customClassName="w-fit"
                              onClick={() => handleEliminarDocumento(doc.id)}
                           >
                              Eliminar
                           </Boton>
                        </div>
                     </div>
                  ))}
               </div>
            )}
            {/* Input para nueva versión */}
            <label
               htmlFor={formKey}
               className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                  ${dragTarget === dragKey ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
               onDragOver={e => handleDragOver(e, dragKey)}
               onDragLeave={handleDragLeave}
               onDrop={e => handleDrop(e, formKey)}
            >
               <Upload />
               <p className="text-sm">
                  {dragTarget !== dragKey
                     ? "Haga click para cargar una nueva versión o arrastre el archivo aquí"
                     : "Suelte aquí el archivo"}
               </p>
               <div className="flex items-center gap-2 flex-row-reverse">
                  <p className="text-xs">{getFileInfo(formData[formKey]) ?? "PDF (MAX: 100MB)"}</p>
                  {formData[formKey] && (
                     <button
                        type="button"
                        className="text-red-500 hover:text-red-700 font-bold text-lg"
                        onClick={e => {
                           e.stopPropagation()
                           setFormData({ ...formData, [formKey]: null })
                           if (inputRef.current) inputRef.current.value = ""
                        }}
                        aria-label="Eliminar archivo"
                     >
                        ×
                     </button>
                  )}
               </div>
            </label>
            <input
               ref={inputRef}
               className='hidden'
               name={formKey}
               id={formKey}
               onChange={e => handleFileChange(e, formKey)}
               type='file'
               accept=".pdf"
            />
         </div>
      )
   }

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 9: Retroalimentación de Jurados</h4>
            <p className="text-gris-institucional text-sm">
               Revise la retroalimentación general de la sustentación y suba nuevas versiones de sus documentos si es necesario.
            </p>
         </div>

         <Actividades taskList={actividades} />

         {renderRetroalimentacion()}

         <form onSubmit={handleSubmit} className="border-gris-claro border p-4 rounded-md space-y-8">
            {renderVersiones("DOCUMENTO_TESIS", "Documento Final", documentoInputRef, "documentoTesis", "documento")}
            {renderVersiones("ARTICULO_TESIS", "Artículo", articuloInputRef, "articuloTesis", "articulo")}
            {renderVersiones("PRESENTACION_TESIS", "Presentación", presentacionInputRef, "presentacionTesis", "presentacion")}

            <div className="w-fit place-self-end">
               <Boton type={"submit"} variant={"borderwhite"}>
                  Guardar Cambios
               </Boton>
            </div>
         </form>

         {/* SECCIÓN DE ACTAS ORIGINALES */}
         {Array.isArray(listActas) && listActas.length > 0 && (
            <section className="my-10">
               <div className="mb-4">
                  <h5 className="font-bold text-lg">Actas Originales</h5>
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
                  <label className="font-bold select-none">Agregar Acta Original</label>
                  <form
                     onSubmit={handleSubirActaOriginal}
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