import { useEffect, useRef } from "react"
import Boton from "../../Boton"

export default function EliminarInformeForm({ inf, isOpen, act }) {
   const modalRef = useRef(null)

   useEffect(() => {
      const handleClickOutside = (event) => { if (modalRef.current && !modalRef.current.contains(event.target)) isOpen("") }
      document.addEventListener("mousedown", handleClickOutside)
      return () => { document.removeEventListener("mousedown", handleClickOutside) }
   }, [isOpen])

   const handleSubmit = () => {
      isOpen("")
   }

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <h6 className="text-lg font-semibold">Borrar Informe: {inf.title}</h6>
            <p className="text-sm mb-5 mt-2">Estas a punto de eliminar el informe <b className="text-red-500">{inf.title}</b>. ¿Estás seguro de realizar esta acción?</p>
            <div className="flex items-stretch gap-2">
               <Boton type={"button"} variant={"whitered"} onClick={() => isOpen("")}>
                  Cancelar
               </Boton>
               <Boton type={"button"} variant={"borderwhite"} onClick={() => {
                  handleSubmit()
                  isOpen("")
               }}>
                  Eliminar informe
               </Boton>
            </div>
         </section>
      </main>
   )
}