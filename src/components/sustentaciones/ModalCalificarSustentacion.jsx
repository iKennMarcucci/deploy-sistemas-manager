import { useState, useEffect } from "react"
import { XIcon, File, Download } from "lucide-react"

// Relación de tags por tipo de sustentación
const TAGS_POR_TIPO = {
   ANTEPROYECTO: [
      { tag: "DOCUMENTO_ANTEPROYECTO", label: "Documento Anteproyecto" },
      { tag: "PRESENTACION_ANTEPROYECTO", label: "Presentación" }
   ],
   TESIS: [
      { tag: "DOCUMENTO_TESIS", label: "Documento Final" },
      { tag: "ARTICULO_TESIS", label: "Artículo" },
      { tag: "PRESENTACION_TESIS", label: "Presentación" }
   ]
   // Agrega más tipos si los tienes
}

export default function ModalCalificarSustentacion({
   open,
   onClose,
   sustentacion,
   documentosTesis = [],
   retroalimentaciones = [],
   miRetro,
   miNota,
   onSave
}) {
   const [retro, setRetro] = useState(miRetro ?? "")
   const [nota, setNota] = useState(miNota ?? "")

   // Agrupa versiones por documento
   const getVersiones = (baseTag) => {
      return documentosTesis
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

   // Renderiza todas las versiones de un documento
   const renderVersiones = (baseTag, label) => {
      const versiones = getVersiones(baseTag)
      if (versiones.length === 0) return null
      return (
         <div className="space-y-2 mb-4">
            <h6 className="font-bold select-none">{label} (PDF)</h6>
            <div className="space-y-2">
               {versiones.map(doc => (
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
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 flex items-center gap-1">
                           <Download size={16} />
                           Descargar
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      if (onSave) onSave({ retro, nota })
      onClose()
   }

   useEffect(() => {
      setRetro(miRetro ?? "")
      setNota(miNota ?? "")
   }, [miRetro, miNota, open])

   if (!open || !sustentacion) return null

   // Detecta el tipo de sustentación y usa los tags correctos
   const tipo = sustentacion?.tipoSustentacion?.toUpperCase?.() || "TESIS"
   const tags = TAGS_POR_TIPO[tipo] || TAGS_POR_TIPO["TESIS"]

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
         <div className="bg-white rounded-md p-6 max-w-xl w-full relative">
            <button className="absolute top-2 right-2 text-black/50 hover:text-black" onClick={onClose}><XIcon size={20} /></button>
            <h2 className="font-bold text-lg mb-2">Calificar sustentación</h2>
            <div className="mb-4 text-sm text-gray-600">{sustentacion.tituloProyecto}</div>

            {/* Documentos */}
            {tags.map(({ tag, label }) => renderVersiones(tag, label))}

            {/* Mi retroalimentación y nota */}
            <form onSubmit={handleSubmit}>
               <div className="mb-2 flex gap-4">
                  <div className="flex-1">
                     <label className="font-semibold">Mi retroalimentación</label>
                     <textarea
                        className="border rounded-md w-full p-2 mt-1"
                        rows={4}
                        value={retro}
                        onChange={e => setRetro(e.target.value)}
                        required
                     />
                  </div>
                  <div className="w-32">
                     <label className="font-semibold">Nota</label>
                     <input
                        className="border rounded-md w-full p-2 mt-1"
                        type="number"
                        min={0}
                        max={5}
                        step={0.1}
                        value={nota}
                        onChange={e => setNota(e.target.value)}
                        required
                     />
                  </div>
               </div>
               <div className="flex gap-2 mt-4">
                  <button type="button" className="border px-4 py-2 rounded-md" onClick={onClose}>Cancelar</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Guardar</button>
               </div>
            </form>
         </div>
      </div>
   )
}