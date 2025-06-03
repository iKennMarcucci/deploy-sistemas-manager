import { subjects } from "../../../lib/test/materias"
import { useState, useRef, useEffect } from "react"
import { groups } from "../../../lib/test/cursor"
import CustomSelect from "../../CustomSelect"
import { XIcon } from "lucide-react"
import Boton from "../../Boton"

export default function EditarInformeForm({ inf, isOpen }) {
   const [formData, setFormData] = useState({
      title: inf.title,
      subject: subjects[2],
      group: groups[2],
      startDate: toISO(inf.startDate),
      endDate: toISO(inf.endDate),
      description: "Placeholder de la descripción del informe"
   })

   const modalRef = useRef(null)

   function toISO(dateStr) {
      const [dd, mm, yyyy] = dateStr.split('-');
      return `${yyyy}-${mm}-${dd}`;
   }

   const handleSubmit = (e) => {
      e.preventDefault()
      isOpen("")
   }

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) isOpen("")
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => { document.removeEventListener('mousedown', handleClickOutside) }
   }, [])

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <header className="flex justify-between items-center">
               <h6 className="text-lg font-semibold">Editar Informe</h6>
               <button onClick={() => isOpen("")} className="text-black/50 hover:text-black duration-150">
                  <XIcon size={20} />
               </button>
            </header>

            <p className="text-sm text-black/50">Complete el formulario para editar el informe</p>

            <form onSubmit={(e) => handleSubmit(e)} className="space-y-2 mt-4 text-sm">
               <div className="flex flex-col">
                  <label htmlFor="title" className="font-semibold">Título</label>
                  <input className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     value={formData.title}
                     id="title"
                     name="title"
                     type="text"
                     placeholder="Escribe el título del nuevo informe"
                     required
                  />
               </div>

               <CustomSelect className="flex justify-between items-center rounded-md border w-full p-2"
                  action={(opt) => setFormData({ ...formData, subject: opt })}
                  options={subjects}
                  defaultValue={formData.subject}
                  label="Materia"
               />

               <CustomSelect className="flex justify-between items-center rounded-md border w-full p-2"
                  action={(opt) => setFormData({ ...formData, group: opt })}
                  options={groups}
                  defaultValue={formData.group}
                  label="Grupo"
               />

               <div className="flex flex-col">
                  <label htmlFor="startDate" className="font-semibold">Fecha de apertura</label>
                  <input className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                     value={formData.startDate}
                     id="startDate"
                     name="startDate"
                     type="date"
                     required
                  />
               </div>

               <div className="flex flex-col">
                  <label htmlFor="endDate" className="font-semibold">Fecha de cierre</label>
                  <input className="border-black/5 rounded-md border w-full p-2 outline-none"
                     onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                     value={formData.endDate}
                     id="endDate"
                     name="endDate"
                     type="date"
                     required
                  />
               </div>

               <div className="flex flex-col">
                  <label htmlFor="description" className="font-semibold">Descripción</label>
                  <textarea className="border-black/5 rounded-md border w-full p-2 outline-none resize-none"
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     value={formData.description}
                     id="description"
                     name="description"
                     type="date"
                     rows={3}
                     required
                  />
               </div>

               <div className="flex items-stretch gap-2 pt-4">
                  <Boton type={"button"} variant={"whitered"} onClick={() => isOpen("")}>
                     Cancelar
                  </Boton>
                  <Boton type={"submit"} variant={"borderwhite"}>
                     Editar informe
                  </Boton>
               </div>
            </form>
         </section>
      </main>
   )
}