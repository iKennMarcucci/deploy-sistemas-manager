import { useEffect, useRef } from "react"
import Boton from "../Boton"

export default function CambiarFaseModal({ proyecto, isOpen, onConfirm }) {
   const modalRef = useRef(null)

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) isOpen(null)
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => { document.removeEventListener("mousedown", handleClickOutside) }
   }, [isOpen])

   if (!proyecto) return null

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <h6 className="text-lg font-semibold">
               {proyecto.estadoActual !== 9 ? "Cambiar de fase" : "Finalizar proyecto"}
            </h6>
            <p className="text-sm mb-5 mt-2">
               {
                  proyecto.estadoActual !== 9 ?
                     <>¿Seguro que deseas cambiar el proyecto <b className="text-red-700">{proyecto.titulo}</b> de la fase <b>{proyecto.estadoActual}</b> a la fase <b>{proyecto.estadoActual + 1}</b>?</>
                     :
                     <>¿Seguro que deseas que el proyecto <b className="text-red-700">{proyecto.titulo}</b> se marque como finalizado?</>
               }

            </p>
            <div className="flex items-stretch gap-2">
               <Boton type="button" variant="whitered" onClick={() => isOpen(null)}>
                  Cancelar
               </Boton>
               <Boton type="button" variant="borderwhite" onClick={() => onConfirm(proyecto)}>
                  Confirmar cambio
               </Boton>
            </div>
         </section>
      </main>
   )
}