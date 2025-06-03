import { useState, useEffect, useRef } from "react"
import { XIcon, File, Download } from "lucide-react"
import Boton from "../Boton"
import useAdmin from "../../lib/hooks/useAdmin"

export default function AsignarComentariosJuradosModal({ isOpen, sustentacion, onSave, documentosTesis = [] }) {
   const { guardarComentariosJurados } = useAdmin()
   const [comentarios, setComentarios] = useState([])
   const modalRef = useRef(null)

   // Agrupa versiones por documento
   const getVersiones = (baseTag) => {
      return documentosTesis
         .filter(doc =>
            doc.tag === baseTag ||
            doc.tag.startsWith(baseTag + "_v")
         )
         .sort((a, b) => {
            // Ordena por versión descendente (más nuevo primero)
            const getVer = tag => {
               const match = tag.match(/_v(\d+)$/)
               return match ? parseInt(match[1], 10) : 1
            }
            return getVer(b.tag) - getVer(a.tag)
         })
   }

   // Renderiza todas las versiones de un documento
   const renderVersiones = (baseTag, label) => {
      const versiones = getVersiones(baseTag)
      if (versiones.length === 0) return null
      return (
         <div className="space-y-2 mb-4">
            <h6 className="font-bold select-none">{label} (PDF)</h6>
            <div className="space-y-2">
               {versiones.map((doc, idx) => (
                  <div key={doc.id} className="border-gris-claro rounded-md border flex justify-between items-center gap-2 p-3">
                     <div className="flex items-center gap-2">
                        <File size={20} className="text-green-400" />
                        <div className="flex flex-col">
                           <p className="text-negro-institucional font-bold text-xs">{doc.nombre}</p>
                           <p className="text-gris-intermedio text-xs font-thin">
                              {doc.peso}
                              {doc.tag !== baseTag && <span className="ml-2">Versión {doc.tag.split("_v")[1]}</span>}
                           </p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                           <Boton type={"button"} variant={"whitered"} customClassName="w-fit">
                              <Download size={16} />
                              Descargar
                           </Boton>
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )
   }

   useEffect(() => {
      // Buscar la sustentación de tipo TESIS
      if (Array.isArray(sustentacion)) {
         const tesis = sustentacion.find(s => s.tipoSustentacion === "TESIS")
         if (tesis && Array.isArray(tesis.evaluadores)) {
            setComentarios(
               tesis.evaluadores.map(ev => ({
                  idSustentacion: tesis.id,
                  idUsuario: ev.idUsuario,
                  nombreUsuario: ev.nombreUsuario,
                  nota: ev.nota ?? "",
                  observaciones: ev.observaciones ?? ""
               }))
            )
         } else {
            setComentarios([])
         }
      } else if (sustentacion && sustentacion.tipoSustentacion === "TESIS" && Array.isArray(sustentacion.evaluadores)) {
         setComentarios(
            sustentacion.evaluadores.map(ev => ({
               idSustentacion: sustentacion.id,
               idUsuario: ev.idUsuario,
               nombreUsuario: ev.nombreUsuario,
               nota: ev.nota ?? "",
               observaciones: ev.observaciones ?? ""
            }))
         )
      } else {
         setComentarios([])
      }
   }, [sustentacion])

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) isOpen(null)
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => { document.removeEventListener('mousedown', handleClickOutside) }
   }, [])

   const handleComentarioChange = (idx, field, value) => {
      setComentarios(prev =>
         prev.map((c, i) => i === idx ? { ...c, [field]: value } : c)
      )
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      for (const c of comentarios) {
         const body = {
            idSustentacion: c.idSustentacion,
            idUsuario: c.idUsuario,
            observaciones: c.observaciones,
            nota: Number(c.nota)
         }
         await guardarComentariosJurados({ body })
      }
      if (onSave) onSave()
      isOpen(null)
   }

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6 overflow-y-auto max-h-[90vh]">
            <header className="flex justify-between items-center">
               <h6 className="text-lg font-semibold">Asignar comentarios de jurados (solo TESIS)</h6>
               <button onClick={() => isOpen(null)} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>
            <p className="text-sm text-black/50 mb-2">
               Ingrese la nota (0 a 5) y comentarios de cada jurado para la sustentación de tipo <b>TESIS</b>.
            </p>

            {/* Documentos de tipo TESIS con versiones */}
            {renderVersiones("DOCUMENTO_TESIS", "Documento Final")}
            {renderVersiones("ARTICULO_TESIS", "Artículo")}
            {renderVersiones("PRESENTACION_TESIS", "Presentación")}

            {comentarios.length === 0 && (
               <div className="text-center text-gray-400 py-8">No hay jurados para calificar en sustentación de tipo TESIS.</div>
            )}
            {comentarios.length > 0 && (
               <form onSubmit={handleSubmit} className="space-y-4 mt-2 text-sm">
                  {comentarios.map((c, idx) => (
                     <div key={c.idUsuario} className="border rounded-md p-3 flex flex-col gap-2">
                        <div className="font-semibold">{c.nombreUsuario}</div>
                        <div className="flex gap-2">
                           <div className="flex flex-col w-1/3">
                              <label className="font-semibold">Nota</label>
                              <input
                                 className="border-black/5 rounded-md border w-full p-2 outline-none"
                                 type="number"
                                 min={0}
                                 max={5}
                                 step={0.1}
                                 value={c.nota}
                                 onChange={e => handleComentarioChange(idx, "nota", e.target.value)}
                                 required
                              />
                           </div>
                           <div className="flex flex-col w-2/3">
                              <label className="font-semibold">Observaciones</label>
                              <textarea
                                 className="border-black/5 rounded-md border w-full p-2 outline-none"
                                 rows={2}
                                 value={c.observaciones}
                                 onChange={e => handleComentarioChange(idx, "observaciones", e.target.value)}
                                 required
                              />
                           </div>
                        </div>
                     </div>
                  ))}
                  <div className="flex items-stretch gap-2 pt-4">
                     <Boton type="button" variant="whitered" onClick={() => isOpen(null)}>
                        Cancelar
                     </Boton>
                     <Boton type="submit" variant="borderwhite">
                        Guardar comentarios
                     </Boton>
                  </div>
               </form>
            )}
         </section>
      </main>
   )
}