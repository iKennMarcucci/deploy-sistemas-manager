import { X } from "lucide-react"

export default function ModalDocumentosEstudiante({ open, onClose, documentos, estudiante }) {
   if (!open) return null

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-[999] left-0 top-0">
         <section className="bg-white modal-animation max-w-lg w-full rounded-md p-6">
            <header className="flex justify-between items-center mb-4">
               <div className="flex items-center gap-2">
                  <img src={estudiante?.foto} alt={estudiante?.nombreCompleto} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-semibold">{estudiante?.nombreCompleto}</span>
               </div>
               <button onClick={onClose} className="text-black/50 hover:text-black duration-150">
                  <X size={20} />
               </button>
            </header>
            <div className="flex flex-col gap-2">
               {documentos.length === 0 ? (
                  <span className="text-gray-500">No hay documentos entregados.</span>
               ) : (
                  documentos.map(doc => (
                     <div key={doc.id} className="flex items-center gap-2 border-b py-2">
                        <span className="font-medium flex-1">{doc.nombre}</span>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                           Ver
                        </a>
                        <a href={doc.url} download className="text-blue-600 underline">
                           Descargar
                        </a>
                     </div>
                  ))
               )}
            </div>
         </section>
      </main>
   )
}