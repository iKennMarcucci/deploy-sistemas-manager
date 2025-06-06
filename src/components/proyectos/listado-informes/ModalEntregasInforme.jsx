import { useState, useRef, useEffect } from "react"
import { X, MoreVertical } from "lucide-react"

export default function ModalEntregasInforme({ open, onClose, entregas, onVerDocumentos }) {
   const modalRef = useRef(null)
   const [openActions, setOpenActions] = useState({})

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) onClose()
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
   }, [onClose])

   if (!open) return null

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-lg w-full rounded-md p-6">
            <header className="flex justify-between items-center mb-4">
               <h6 className="text-lg font-semibold">Entregas de Estudiantes</h6>
               <button onClick={onClose} className="text-black/50 hover:text-black duration-150">
                  <X size={20} />
               </button>
            </header>
            <div className="flex flex-col gap-2">
               {entregas.length === 0 ? (
                  <span className="text-gray-500">Ningún estudiante ha entregado este informe.</span>
               ) : (
                  entregas.map(est => (
                     <div key={est.id} className="flex items-center justify-between border-b py-2 gap-2">
                        <div className="flex items-center gap-3">
                           <img src={est.foto} alt={est.nombreCompleto} className="w-10 h-10 rounded-full object-cover" />
                           <span className="font-medium">{est.nombreCompleto}</span>
                        </div>
                        <div className="relative">
                           <button
                              id="custom-ellipsis"
                              onClick={() => setOpenActions(prev => ({ ...prev, [est.id]: !prev[est.id] }))}
                              className="flex justify-center items-center gap-1 p-2 w-full"
                           >
                              <span id="dot" />
                              <span id="dot" />
                              <span id="dot" />
                           </button>
                           {openActions[est.id] && (
                              <div className="absolute whitespace-nowrap right-0 top-8 bg-white border rounded shadow z-50 flex flex-col">
                                 <button
                                    className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                    onClick={() => {
                                       setOpenActions({})
                                       onVerDocumentos(est)
                                    }}
                                 >
                                    Ver Documentos
                                 </button>
                              </div>
                           )}
                        </div>
                     </div>
                  ))
               )}
            </div>
         </section>
      </main>
   )
}