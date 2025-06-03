import { useRef, useState, useEffect } from "react"
import { Upload, X, File, Download } from "lucide-react"
import Boton from "../../Boton"
import useInformes from "../../../lib/hooks/useInformes"
import { Link } from "react-router-dom"

export default function InformeCard({ informe, archivosEntregados }) {
   const { id, fecha, descripcion, materia } = informe
   const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

   const { sendInforme, getEntregaInformes, deleteInformeArchivo } = useInformes()
   const [dragTarget, setDragTarget] = useState(null)
   const [formData, setFormData] = useState({ documentoPresentacion: [] })
   const [submitting, setSubmitting] = useState(false)
   const [success, setSuccess] = useState(false)
   const [error, setError] = useState(null)
   const [entrega, setEntrega] = useState(archivosEntregados || [])
   const presentacionRef = useRef(null)

   // Si archivosEntregados cambia, actualiza entrega
   useEffect(() => {
      if (archivosEntregados) setEntrega(archivosEntregados)
   }, [archivosEntregados])

   // Si no se pasa archivosEntregados, busca la entrega (para pendientes que luego se entregan)
   useEffect(() => {
      if (!archivosEntregados && informe.tieneEntregas) {
         const fetchEntrega = async () => {
            try {
               const data = await getEntregaInformes(id)
               setEntrega(data || [])
            } catch (e) {
               setEntrega([])
            }
         }
         fetchEntrega()
      }
   }, [id, success, archivosEntregados, informe.tieneEntregas])

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
         const files = Array.from(event.dataTransfer.files)
         const validFiles = []
         for (const file of files) {
            if (file.type !== 'application/pdf') {
               setError("Por favor, suba únicamente archivos PDF")
               return
            }
            if (file.size > MAX_FILE_SIZE) {
               setError("Cada archivo no debe superar los 10MB")
               return
            }
            validFiles.push(file)
         }
         setFormData(prev => ({
            ...prev,
            documentoPresentacion: [...prev.documentoPresentacion, ...validFiles]
         }))
         setError(null)
      }
   }

   const handleFileChange = (e, target) => {
      if (e.target.files && e.target.files.length > 0) {
         const files = Array.from(e.target.files)
         const validFiles = []
         for (const file of files) {
            if (file.type !== 'application/pdf') {
               setError("Por favor, suba únicamente archivos PDF")
               return
            }
            if (file.size > MAX_FILE_SIZE) {
               setError("Cada archivo no debe superar los 10MB")
               return
            }
            validFiles.push(file)
         }
         setFormData(prev => ({
            ...prev,
            documentoPresentacion: [...prev.documentoPresentacion, ...validFiles]
         }))
         setError(null)
      }
   }

   const handleRemoveFile = (index) => {
      setFormData(prev => ({
         ...prev,
         documentoPresentacion: prev.documentoPresentacion.filter((_, i) => i !== index)
      }))
      setError(null)
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      setSubmitting(true)
      setError(null)
      setSuccess(false)
      try {
         await sendInforme({
            idColoquio: id,
            archivos: formData.documentoPresentacion,
            tag: "INFORME"
         })
         const data = await getEntregaInformes(id)
         setEntrega(data || [])
         setSuccess(true)
         setFormData({ documentoPresentacion: [] })
      } catch (err) {
         setError("Error al enviar el archivo. Intente de nuevo.")
      } finally {
         setSubmitting(false)
      }
   }

   const handleEliminarArchivo = async (docId) => {
      try {
         await deleteInformeArchivo(docId)
         const data = await getEntregaInformes(id)
         setEntrega(data || [])
      } catch (e) {
         setError("No se pudo eliminar el archivo.")
      }
   }

   return (
      <main className="overflow-hidden rounded-md border mb-4">
         <section className="bg-gris-claro/50 flex justify-between items-center gap-4 p-4">
            <div className="flex items-center gap-4">
               <h5 className="font-bold">{materia}</h5>
               <span className="text-white rounded-full text-xs px-2"
                  style={{
                     backgroundColor: `${informe.tieneEntregas ? "#4caf50" : "#bc0017"}`,
                  }}
               >
                  Informe {informe.tieneEntregas ? "Entregado" : "Pendiente"}
               </span>
            </div>
            <p className="text-gris-institucional text-sm">
               <b>Fecha: </b>{fecha}
            </p>
         </section>
         <section className="text-sm p-4">
            <h6 className="font-bold">Descripción</h6>
            <p className="text-gris-institucional">{descripcion}</p>
         </section>
         <form onSubmit={handleSubmit} className="space-y-2 p-4 pt-0">
            <h6 className="font-bold select-none">Archivos Adjuntos</h6>
            {/* Listar archivos entregados */}
            {entrega && entrega.length > 0 && (
               <div className="flex flex-col gap-2 w-full">
                  {entrega.map((archivo, idx) =>
                     <div key={archivo.id || idx} className="border-gris-claro border rounded-md flex justify-between items-center w-full gap-2 p-4">
                        <div className="flex items-center gap-2 font-bold">
                           <File size={20} className="text-azul/75" />
                           {archivo.nombre || `Archivo ${idx + 1}`}
                           {archivo.peso && (
                              <span className="text-xs text-gris-intermedio font-normal ml-2">{archivo.peso}</span>
                           )}
                        </div>
                        <div className="flex gap-2">
                           <a href={archivo.url || "#"} target="_blank" rel="noopener noreferrer">
                              <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                                 <Download size={18} />
                                 Descargar
                              </Boton>
                           </a>
                           <Boton
                              type="button"
                              variant="borderwhite"
                              customClassName="w-fit"
                              onClick={() => handleEliminarArchivo(archivo.id)}
                           >
                              Eliminar
                           </Boton>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {/* Input para subir nuevos archivos, siempre visible */}
            <label
               ref={presentacionRef}
               htmlFor={`documentoPresentacion-${id}`}
               className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col items-center justify-center gap-2 py-8
                  ${dragTarget === 'presentacion' ? "bg-azul-claro border-azul text-azul" : "border-gris-institucional text-gris-institucional bg-gris-claro/25"}`}
               onDragOver={(e) => handleDragOver(e, 'presentacion')}
               onDragLeave={handleDragLeave}
               onDrop={(e) => handleDrop(e, 'presentacion')}
            >
               <Upload />
               <p className="text-sm">
                  {dragTarget !== 'presentacion'
                     ? "Haga click para cargar los archivos o arrastre aquí"
                     : "Suelte aquí los documentos"}
               </p>
               <div className="flex flex-col gap-1 w-full">
                  {formData.documentoPresentacion.length > 0 ? (
                     formData.documentoPresentacion.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 mx-auto">
                           <p className="text-xs">{file.name} ({(file.size / 1024).toFixed(2)} KB)</p>
                           <button
                              type="button"
                              aria-label="Eliminar archivo"
                              className="text-red-500 hover:bg-red-100 rounded-full p-1"
                              onClick={e => { e.stopPropagation(); e.preventDefault(); handleRemoveFile(idx) }}
                              tabIndex={0}
                           >
                              <X size={16} />
                           </button>
                        </div>
                     ))
                  ) : (
                     <p className="text-xs mx-auto">PDF (MAX: 10MB)</p>
                  )}
               </div>
            </label>
            <input
               className='hidden'
               name="documentoPresentacion"
               id={`documentoPresentacion-${id}`}
               onChange={(e) => handleFileChange(e, 'presentacion')}
               type='file'
               accept=".pdf"
               multiple
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}
            {success && <p className="text-green-600 text-xs">Archivo enviado correctamente.</p>}

            <div className="flex justify-end">
               <Boton customClassName="w-fit"
                  type="submit"
                  variant="borderwhite"
                  disabled={submitting || formData.documentoPresentacion.length === 0}
               >
                  {submitting ? "Guardando..." : "Guardar Informe"}
               </Boton>
            </div>
         </form>
      </main>
   )
}