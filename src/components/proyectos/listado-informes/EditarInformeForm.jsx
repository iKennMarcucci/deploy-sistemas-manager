import { useState, useRef, useEffect } from "react"
import { XIcon } from "lucide-react"
import Boton from "../../Boton"

export default function EditarInformeForm({ inf, isOpen, onClose, onSubmit }) {
   const [form, setForm] = useState({
      descripcion: inf?.descripcion || "",
      fecha: inf?.fecha || "",
      hora: inf?.hora || "",
      lugar: inf?.lugar || ""
   })
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const modalRef = useRef(null)

   useEffect(() => {
      setForm({
         descripcion: inf?.descripcion || "",
         fecha: inf?.fecha || "",
         hora: inf?.hora || "",
         lugar: inf?.lugar || ""
      })
   }, [inf])

   const handleChange = (e) => {
      setForm(f => ({ ...f, [e.target.name]: e.target.value }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setError(null)
      try {
         await onSubmit(inf.id, form)
         onClose()
      } catch (err) {
         setError("Error al editar el informe")
      } finally {
         setLoading(false)
      }
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) onClose()
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => { document.removeEventListener('mousedown', handleClickOutside) }
   }, [onClose])

   if (!isOpen) return null

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <header className="flex justify-between items-center">
               <h6 className="text-lg font-semibold">Editar Informe</h6>
               <button onClick={onClose} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>
            <p className="text-sm text-black/50">Modifica los campos del informe</p>
            <form onSubmit={handleSubmit} className="space-y-2 mt-4 text-sm">
               <div className="flex flex-col">
                  <label htmlFor="descripcion" className="font-semibold">Descripción</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={handleChange}
                     value={form.descripcion}
                     id="descripcion"
                     name="descripcion"
                     type="text"
                     placeholder="Descripción del informe"
                     required
                  />
               </div>
               <div className="flex flex-col">
                  <label htmlFor="fecha" className="font-semibold">Fecha</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={handleChange}
                     value={form.fecha}
                     id="fecha"
                     name="fecha"
                     type="date"
                     required
                  />
               </div>
               <div className="flex flex-col">
                  <label htmlFor="hora" className="font-semibold">Hora</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={handleChange}
                     value={form.hora}
                     id="hora"
                     name="hora"
                     type="time"
                     required
                  />
               </div>
               <div className="flex flex-col">
                  <label htmlFor="lugar" className="font-semibold">Lugar (enlace)</label>
                  <input
                     className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={handleChange}
                     value={form.lugar}
                     id="lugar"
                     name="lugar"
                     type="text"
                     placeholder="Enlace de la reunión"
                     required
                  />
               </div>
               {error && <span className="text-red-600">{error}</span>}
               <div className="flex items-stretch gap-2 pt-4">
                  <Boton type="button" variant="whitered" onClick={onClose}>
                     Cancelar
                  </Boton>
                  <Boton type="submit" variant="borderwhite" disabled={loading}>
                     {loading ? "Guardando..." : "Editar informe"}
                  </Boton>
               </div>
            </form>
         </section>
      </main>
   )
}