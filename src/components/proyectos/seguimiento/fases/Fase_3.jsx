import EstadoEntrega from "../componentes/EstadoEntrega"
import Actividades from "../componentes/Actividades"
import Boton from "../../../Boton"
import { Save, Download, Upload, File } from "lucide-react"
import useProject from "../../../../lib/hooks/useProject"
import { useEffect, useRef, useState } from "react"

const actividades = [
   {
      title: "Preparación de Presentación Inicial",
      tasks: [
         { desc: "Subir documento del anteproyecto" },
         { desc: "Subir diapositivas del anteproyecto" },
         { desc: "Revisión por director y codirector" },
         { desc: "Realizar ajustes (si es necesario)" },
      ],
   }
]

export default function Fase_3({ project }) {
   const { getDocuments, sendDocuments, deleteDocumentos } = useProject()
   const [currentProject, setCurrentProject] = useState(null)
   const [listDocumentos, setListDocumentos] = useState(null)
   const [listActas, setListActas] = useState([])
   const [formData, setFormData] = useState({
      documentoAnteproyecto: null,
      presentacionAnteproyecto: null,
   })
   const [dragTarget, setDragTarget] = useState(null)
   const [showDeleteModal, setShowDeleteModal] = useState(false)
   const [actaToDelete, setActaToDelete] = useState(null)

   const anteproyectoInputRef = useRef(null)
   const presentacionInputRef = useRef(null)
   const anteproyectoLabelRef = useRef(null)
   const presentacionLabelRef = useRef(null)

   useEffect(() => { fetchProject() }, [])
   useEffect(() => { if (!!currentProject) setDocumentosFase(currentProject.id) }, [currentProject])

   const fetchProject = async () => {
      setCurrentProject(project)
   }

   const setDocumentosFase = async (projectId) => {
      const docs = await getDocuments(projectId, "ANTEPROYECTO")
      setListDocumentos(docs)

      const actas = await getDocuments(projectId, "ACTAAPROBACION")
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
            if (target === 'anteproyecto') {
               setFormData({ ...formData, documentoAnteproyecto: file })
            } else if (target === 'presentacion') {
               setFormData({ ...formData, presentacionAnteproyecto: file })
            }
         } else {
            alert('Por favor, suba únicamente archivos PDF')
         }
      }
   }

   const handleFileChange = (e, target) => {
      if (e.target.files && e.target.files.length > 0) {
         const file = e.target.files[0]
         if (target === 'anteproyecto') {
            setFormData({ ...formData, documentoAnteproyecto: file })
         } else if (target === 'presentacion') {
            setFormData({ ...formData, presentacionAnteproyecto: file })
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

   // Identificar documentos por tag
   const anteproyectoDoc = listDocumentos?.find(doc => doc.tag === "DOCUMENTO_ANTEPROYECTO")
   const presentacionDoc = listDocumentos?.find(doc => doc.tag === "PRESENTACION_ANTEPROYECTO")

   const onSubmit = async (e) => {
      e.preventDefault()
      let documentosActualizados = false

      if (formData.documentoAnteproyecto) {
         await sendDocuments(currentProject.id, "ANTEPROYECTO", "DOCUMENTO_ANTEPROYECTO", formData.documentoAnteproyecto)
         documentosActualizados = true
      }
      if (formData.presentacionAnteproyecto) {
         await sendDocuments(currentProject.id, "ANTEPROYECTO", "PRESENTACION_ANTEPROYECTO", formData.presentacionAnteproyecto)
         documentosActualizados = true
      }
      if (documentosActualizados) {
         await setDocumentosFase(currentProject.id)
         setFormData({ ...formData, documentoAnteproyecto: null, presentacionAnteproyecto: null })
         if (anteproyectoInputRef.current) anteproyectoInputRef.current.value = ""
         if (presentacionInputRef.current) presentacionInputRef.current.value = ""
      }
   }

   // --- NUEVO: Subir acta de aprobación ---
   const handleSubirActaAprobacion = async (e) => {
      e.preventDefault();
      const file = e.target.actaArchivo.files[0];
      if (!file) return;
      await sendDocuments(
         currentProject.id,
         "ACTAAPROBACION",      // tipoDocumento
         "AprobacionAnteproyecto", // tag
         file
      );
      await setDocumentosFase(currentProject.id);
      e.target.reset();
   };

   // --- NUEVO: Modal de eliminación de acta ---
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

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 3: Primera Entrega del Anteproyecto</h4>
            <p className="text-gris-institucional text-sm">
               Suba el documento del anteproyecto y las diapositivas correspondientes.&nbsp;
               El director y codirector revisarán los documentos y proporcionarán retroalimentación
            </p>
         </div>

         <Actividades taskList={actividades} />

         <form onSubmit={onSubmit} className="flex flex-col gap-5">

            {/* Input de Documento de Anteproyecto si no hay documento */}
            {!anteproyectoDoc && (
               <div className="space-y-1">
                  <h6 className="font-bold select-none">Documento del Anteproyecto (PDF)</h6>
                  <label
                     ref={anteproyectoLabelRef}
                     htmlFor="documentoAnteproyecto"
                     className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                        ${dragTarget === 'anteproyecto' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
                     onDragOver={(e) => handleDragOver(e, 'anteproyecto')}
                     onDragLeave={handleDragLeave}
                     onDrop={(e) => handleDrop(e, 'anteproyecto')}
                  >
                     <Upload />
                     <p className="text-sm">
                        {dragTarget !== 'anteproyecto'
                           ? "Haga click para cargar el archivo o arrastre el archivo aquí"
                           : "Suelte aquí el documento del anteproyecto"}
                     </p>
                     <div className="flex items-center gap-2">
                        <p className="text-xs">{getFileInfo(formData.documentoAnteproyecto) ?? "PDF (MAX: 100MB)"}</p>
                        {formData.documentoAnteproyecto && (
                           <button
                              type="button"
                              className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                              onClick={e => {
                                 e.stopPropagation()
                                 setFormData({ ...formData, documentoAnteproyecto: null })
                                 if (anteproyectoInputRef.current) anteproyectoInputRef.current.value = ""
                              }}
                              aria-label="Eliminar archivo"
                           >
                              ×
                           </button>
                        )}
                     </div>
                  </label>
                  <input
                     ref={anteproyectoInputRef}
                     className='hidden'
                     name="documentoAnteproyecto"
                     id="documentoAnteproyecto"
                     onChange={(e) => handleFileChange(e, 'anteproyecto')}
                     type='file'
                     accept=".pdf"
                  />
               </div>
            )}

            {/* Input de Presentación si no hay documento */}
            {!presentacionDoc && (
               <div className="space-y-1">
                  <h6 className="font-bold select-none">Presentación del Anteproyecto (PDF)</h6>
                  <label
                     ref={presentacionLabelRef}
                     htmlFor="presentacionAnteproyecto"
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
                           : "Suelte aquí la presentación del anteproyecto"}
                     </p>
                     <div className="flex items-center gap-2">
                        <p className="text-xs">{getFileInfo(formData.presentacionAnteproyecto) ?? "PDF (MAX: 100MB)"}</p>
                        {formData.presentacionAnteproyecto && (
                           <button
                              type="button"
                              className="ml-2 text-red-500 hover:text-red-700 font-bold text-lg"
                              onClick={e => {
                                 e.stopPropagation()
                                 setFormData({ ...formData, presentacionAnteproyecto: null })
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
                     name="presentacionAnteproyecto"
                     id="presentacionAnteproyecto"
                     onChange={(e) => handleFileChange(e, 'presentacion')}
                     type='file'
                     accept=".pdf"
                  />
               </div>
            )}

            {/* Mostrar documento de Anteproyecto si existe */}
            {anteproyectoDoc && (
               <EstadoEntrega
                  label={anteproyectoDoc.nombre}
                  entrega={{
                     ...anteproyectoDoc,
                     comentarios: anteproyectoDoc.retroalimentacion?.length > 0 ? anteproyectoDoc.retroalimentacion.join("\n") : undefined,
                     estado: anteproyectoDoc.retroalimentacion?.length > 0 ? "ajustes" : undefined,
                  }}
                  acciones={
                     <div className="flex gap-2 mt-2">
                        <a href={anteproyectoDoc.url} target="_blank" rel="noopener noreferrer">
                           <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                              <Download size={18} />
                              Descargar
                           </Boton>
                        </a>
                        <Boton
                           type="button"
                           variant="borderwhite"
                           customClassName="w-fit"
                           onClick={() => handleEliminarDocumento(anteproyectoDoc.id)}
                        >
                           Eliminar
                        </Boton>
                     </div>
                  }
               />
            )}

            {/* Mostrar presentación si existe */}
            {presentacionDoc && (
               <EstadoEntrega
                  label={presentacionDoc.nombre}
                  entrega={{
                     ...presentacionDoc,
                     comentarios: presentacionDoc.retroalimentacion?.length > 0 ? presentacionDoc.retroalimentacion.join("\n") : undefined,
                     estado: presentacionDoc.retroalimentacion?.length > 0 ? "ajustes" : undefined,
                  }}
                  acciones={
                     <div className="flex gap-2 mt-2">
                        <a href={presentacionDoc.url} target="_blank" rel="noopener noreferrer">
                           <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                              <Download size={18} />
                              Descargar
                           </Boton>
                        </a>
                        <Boton
                           type="button"
                           variant="borderwhite"
                           customClassName="w-fit"
                           onClick={() => handleEliminarDocumento(presentacionDoc.id)}
                        >
                           Eliminar
                        </Boton>
                     </div>
                  }
               />
            )}

            {/* Mostrar documentos IMPORTADO */}
            {listDocumentos?.filter(doc => doc.tag === "IMPORTADO").map(doc => (
               <EstadoEntrega
                  key={doc.id}
                  label={doc.nombre}
                  entrega={doc}
                  acciones={
                     <div className="flex gap-2 mt-2">
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
                           onClick={() => handleEliminarDocumento(doc.id)}
                        >
                           Eliminar
                        </Boton>
                     </div>
                  }
               />
            ))}

            <div className="w-fit self-end">
               <Boton type={"submit"} variant={"borderwhite"}>
                  Guardar Cambios
                  <Save size={16} />
               </Boton>
            </div>
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
                  <label className="font-bold select-none">Agregar Acta de Aprobación de Anteproyecto</label>
                  <form
                     onSubmit={handleSubirActaAprobacion}
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