import { useRef, useState, useEffect } from "react"
import useProject from "../../../../lib/hooks/useProject"
import Actividades from "../componentes/Actividades"
import { Alert } from "@heroui/alert"
import { FileBox, Upload, Download, File, Send } from "lucide-react"
import Boton from "../../../Boton"

const actividades = [
   {
      title: "Entrega de Documentos Finales",
      tasks: [
         { desc: "Suba el documento final de su proyecto" },
         { desc: "Suba el artículo de su proyecto" },
         { desc: "Suba la presentación de su proyecto" },
      ],
   }
]

export default function Fase_7({ project }) {
   const { getDocuments, sendDocuments, deleteDocumentos } = useProject()
   const [currentProject, setCurrentProject] = useState(null)
   const [listDocumentos, setListDocumentos] = useState([])
   const [listActas, setListActas] = useState([])
   const [formData, setFormData] = useState({
      documentoTesis: null,
      articuloTesis: null,
      presentacionTesis: null,
   })
   const [dragTarget, setDragTarget] = useState(null)
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)

   const documentoInputRef = useRef(null)
   const articuloInputRef = useRef(null)
   const presentacionInputRef = useRef(null)

   useEffect(() => { fetchProject() }, [])
   useEffect(() => { if (currentProject) setDocumentosFase(currentProject.id) }, [currentProject])

   const fetchProject = async () => {
      setCurrentProject(project)
   }

   const setDocumentosFase = async (projectId) => {
      const docs = await getDocuments(projectId, "TESIS")
      setListDocumentos(docs)
      const actas = await getDocuments(projectId, "ACTAVB")
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
      if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
         const file = event.dataTransfer.files[0]
         if (file.type === 'application/pdf') {
            if (target === 'documento') {
               setFormData({ ...formData, documentoTesis: file })
            } else if (target === 'articulo') {
               setFormData({ ...formData, articuloTesis: file })
            } else if (target === 'presentacion') {
               setFormData({ ...formData, presentacionTesis: file })
            }
         } else {
            alert('Por favor, suba únicamente archivos PDF')
         }
      }
   }

   const handleFileChange = (e, target) => {
      if (e.target.files && e.target.files.length > 0) {
         const file = e.target.files[0]
         if (target === 'documento') {
            setFormData({ ...formData, documentoTesis: file })
         } else if (target === 'articulo') {
            setFormData({ ...formData, articuloTesis: file })
         } else if (target === 'presentacion') {
            setFormData({ ...formData, presentacionTesis: file })
         }
      }
   }

   const getFileInfo = (file) => {
      return file ? `${file.name} (${(file.size / 1024).toFixed(2)} KB)` : null
   }

   const handleEliminarDocumento = async (docId) => {
      await deleteDocumentos(docId)
      await setDocumentosFase(currentProject.id)
   }

   // Buscar documentos por tag
   const documentoTesisDoc = listDocumentos?.find(doc => doc.tag === "DOCUMENTO_TESIS")
   const articuloTesisDoc = listDocumentos?.find(doc => doc.tag === "ARTICULO_TESIS")
   const presentacionTesisDoc = listDocumentos?.find(doc => doc.tag === "PRESENTACION_TESIS")

   const onSubmit = async (e) => {
      e.preventDefault()
      let documentosActualizados = false

      if (formData.documentoTesis) {
         await sendDocuments(currentProject.id, "TESIS", "DOCUMENTO_TESIS", formData.documentoTesis)
         documentosActualizados = true
      }
      if (formData.articuloTesis) {
         await sendDocuments(currentProject.id, "TESIS", "ARTICULO_TESIS", formData.articuloTesis)
         documentosActualizados = true
      }
      if (formData.presentacionTesis) {
         await sendDocuments(currentProject.id, "TESIS", "PRESENTACION_TESIS", formData.presentacionTesis)
         documentosActualizados = true
      }
      if (documentosActualizados) {
         await setDocumentosFase(currentProject.id)
         setFormData({ ...formData, documentoTesis: null, articuloTesis: null, presentacionTesis: null })
         if (documentoInputRef.current) documentoInputRef.current.value = ""
         if (articuloInputRef.current) articuloInputRef.current.value = ""
         if (presentacionInputRef.current) presentacionInputRef.current.value = ""
      }
   }

   // --- ACTAS VISTO BUENO ---
   const handleSubirActaVB = async (e) => {
      e.preventDefault();
      const file = e.target.actaArchivo.files[0];
      if (!file) return;
      await sendDocuments(
         currentProject.id,
         "ACTAVB",         // tipoDocumento
         "VistoBueno",     // tag
         file
      );
      await setDocumentosFase(currentProject.id);
      e.target.reset();
   }

   const handleDeleteActaClick = (acta) => {
      setActaToDelete(acta)
      setShowDeleteModal(true)
   }

   const handleConfirmDeleteActa = async () => {
      if (actaToDelete) {
         await deleteDocumentos(actaToDelete.id)
         await setDocumentosFase(currentProject.id)
         setShowDeleteModal(false)
         setActaToDelete(null)
      }
   }

   const handleCancelDeleteActa = () => {
      setShowDeleteModal(false)
      setActaToDelete(null)
   }

   // Componente para mostrar documento subido y retroalimentaciones si existen
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

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 7: Entrega de Documentos Finales</h4>
            <p className="text-gris-institucional text-sm">
               Cargue el documento final, el artículo y la presentación para su validación y revisión.
            </p>
         </div>

         <Actividades taskList={actividades} />

         <Alert
            title={"Entrega de Documentos Finales"}
            classNames={{
               title: "font-bold text-base",
               base: "border-azul bg-azul-claro text-azul border py-5",
               iconWrapper: "bg-transparent border-0 shadow-none",
               description: "text-azul"
            }}
            description={"Asegúrese de adjuntar los archivos requeridos en formato PDF. Una vez cargados, serán evaluados por el comité para su aprobación."}
            icon={<><FileBox size={24} /></>}
         />

         <form onSubmit={onSubmit} className="border-gris-claro border p-4 rounded-md space-y-8">

            {/* Documento Final */}
            {!documentoTesisDoc && (
               <div className="space-y-1">
                  <h6 className="font-bold select-none">Documento Final (PDF)</h6>
                  <label
                     htmlFor="documentoTesis"
                     className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                        ${dragTarget === 'documento' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                     onDragOver={e => handleDragOver(e, 'documento')}
                     onDragLeave={handleDragLeave}
                     onDrop={e => handleDrop(e, 'documento')}
                  >
                     <Upload />
                     <p className="text-sm">
                        {dragTarget !== 'documento'
                           ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                           : "Suelte aquí el documento final"}
                     </p>
                     <div className="flex items-center gap-2 flex-row-reverse">
                        <p className="text-xs">{getFileInfo(formData.documentoTesis) ?? "PDF (MAX: 100MB)"}</p>
                        {formData.documentoTesis && (
                           <button
                              type="button"
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                              onClick={e => {
                                 e.stopPropagation()
                                 setFormData({ ...formData, documentoTesis: null })
                                 if (documentoInputRef.current) documentoInputRef.current.value = ""
                              }}
                              aria-label="Eliminar archivo"
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </label>
                  <input
                     ref={documentoInputRef}
                     className='hidden'
                     name="documentoTesis"
                     id="documentoTesis"
                     onChange={e => handleFileChange(e, 'documento')}
                     type='file'
                     accept=".pdf"
                  />
               </div>
            )}

            {/* Artículo */}
            {!articuloTesisDoc && (
               <div className="space-y-1">
                  <h6 className="font-bold select-none">Artículo (PDF)</h6>
                  <label
                     htmlFor="articuloTesis"
                     className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                        ${dragTarget === 'articulo' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                     onDragOver={e => handleDragOver(e, 'articulo')}
                     onDragLeave={handleDragLeave}
                     onDrop={e => handleDrop(e, 'articulo')}
                  >
                     <Upload />
                     <p className="text-sm">
                        {dragTarget !== 'articulo'
                           ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                           : "Suelte aquí el artículo"}
                     </p>
                     <div className="flex items-center gap-2 flex-row-reverse">
                        <p className="text-xs">{getFileInfo(formData.articuloTesis) ?? "PDF (MAX: 100MB)"}</p>
                        {formData.articuloTesis && (
                           <button
                              type="button"
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                              onClick={e => {
                                 e.stopPropagation()
                                 setFormData({ ...formData, articuloTesis: null })
                                 if (articuloInputRef.current) articuloInputRef.current.value = ""
                              }}
                              aria-label="Eliminar archivo"
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </label>
                  <input
                     ref={articuloInputRef}
                     className='hidden'
                     name="articuloTesis"
                     id="articuloTesis"
                     onChange={e => handleFileChange(e, 'articulo')}
                     type='file'
                     accept=".pdf"
                  />
               </div>
            )}

            {/* Presentación */}
            {!presentacionTesisDoc && (
               <div className="space-y-1">
                  <h6 className="font-bold select-none">Presentación (PDF)</h6>
                  <label
                     htmlFor="presentacionTesis"
                     className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                        ${dragTarget === 'presentacion' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                     onDragOver={e => handleDragOver(e, 'presentacion')}
                     onDragLeave={handleDragLeave}
                     onDrop={e => handleDrop(e, 'presentacion')}
                  >
                     <Upload />
                     <p className="text-sm">
                        {dragTarget !== 'presentacion'
                           ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                           : "Suelte aquí la presentación"}
                     </p>
                     <div className="flex items-center gap-2 flex-row-reverse">
                        <p className="text-xs">{getFileInfo(formData.presentacionTesis) ?? "PDF (MAX: 100MB)"}</p>
                        {formData.presentacionTesis && (
                           <button
                              type="button"
                              className="text-red-500 hover:text-red-700 font-bold text-lg"
                              onClick={e => {
                                 e.stopPropagation()
                                 setFormData({ ...formData, presentacionTesis: null })
                                 if (presentacionInputRef.current) presentacionInputRef.current.value = ""
                              }}
                              aria-label="Eliminar archivo"
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </label>
                  <input
                     ref={presentacionInputRef}
                     className='hidden'
                     name="presentacionTesis"
                     id="presentacionTesis"
                     onChange={e => handleFileChange(e, 'presentacion')}
                     type='file'
                     accept=".pdf"
                  />
               </div>
            )}

            {/* Mostrar documento final si existe */}
            {documentoTesisDoc && (
               <DocumentoSubido doc={documentoTesisDoc} onDelete={handleEliminarDocumento} />
            )}

            {/* Mostrar artículo si existe */}
            {articuloTesisDoc && (
               <DocumentoSubido doc={articuloTesisDoc} onDelete={handleEliminarDocumento} />
            )}

            {/* Mostrar presentación si existe */}
            {presentacionTesisDoc && (
               <DocumentoSubido doc={presentacionTesisDoc} onDelete={handleEliminarDocumento} />
            )}

            {/* Mostrar documentos IMPORTADO */}
            {listDocumentos?.filter(doc => doc.tag === "IMPORTADO").map(doc => (
               <DocumentoSubido key={doc.id} doc={doc} onDelete={handleEliminarDocumento} />
            ))}

            <div className="w-full flex justify-end">
               <div>
                  <Boton type={"submit"} variant={"borderwhite"}>
                     <Send size={16} />
                     Enviar a Revisión
                  </Boton>
               </div>
            </div>
         </form>

         {/* SECCIÓN DE ACTAS DE VISTO BUENO */}
         {Array.isArray(listActas) && listActas.length > 0 && (
            <section className="my-10">
               <div className="mb-4">
                  <h5 className="font-bold text-lg">Actas de Visto Bueno</h5>
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
                  <label className="font-bold select-none">Agregar Acta de Visto Bueno</label>
                  <form
                     onSubmit={handleSubirActaVB}
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