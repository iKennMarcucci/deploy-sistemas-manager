import { useEffect, useRef } from "react"
import Boton from "../Boton"

export default function EliminarProyectoModal({ proyecto, isOpen, onConfirm }) {
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
            <h6 className="text-lg font-semibold text-red-700">Eliminar Proyecto</h6>
            <p className="text-sm mb-5 mt-2">
               ¿Seguro que deseas eliminar el proyecto <b className="text-red-700">{proyecto.titulo}</b>? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-stretch gap-2">
               <Boton type="button" variant="borderwhite" onClick={() => isOpen(null)}>
                  Cancelar
               </Boton>
               <Boton type="button" variant="whitered" onClick={() => onConfirm(proyecto)}>
                  Eliminar
               </Boton>
            </div>
         </section>
      </main>
   )
}