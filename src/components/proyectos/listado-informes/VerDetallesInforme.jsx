import { useEffect, useRef } from "react"
import { CalendarDays, Clock, XIcon } from "lucide-react"

export default function VerDetallesInforme({ inf, isOpen }) {
   const modalRef = useRef(null)

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) {
            isOpen("")
         }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }
   }, [isOpen])

   const formatDate = (dateStr) => {
      if (!dateStr) return "Fecha no definida"
      const [day, month, year] = dateStr.split("-").map(Number)
      const date = new Date(year, month - 1, day)
      return date.toLocaleDateString("es-ES", {
         day: "2-digit",
         month: "short",
         year: "numeric",
      })
   }

   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation max-w-xl w-full rounded-md p-6">
            <header className="flex flex-col w-full">
               <div className="flex justify-between items-center">
                  <h6 className="text-lg font-semibold">{inf.title}</h6>
                  <div className="flex items-center gap-2">
                     <span
                        style={{ backgroundColor: `${inf.status.color}0f`, color: inf.status.color, borderColor: inf.status.color }}
                        className="text-xs/3 border rounded-full px-2 py-[1px]"
                     >
                        {inf.status.value}
                     </span>
                     <button onClick={() => isOpen("")} className="text-black/50 hover:text-black duration-150">
                        <XIcon size={20} />
                     </button>
                  </div>
               </div>
               <div className="text-black/40 text-sm flex items-center gap-1 mt-2">
                  <CalendarDays size={16} />
                  <p>
                     <b>Apertura:&nbsp;</b>
                     {formatDate(inf.startDate)}
                  </p>
                  <Clock size={16} className="ml-4" />
                  <p>
                     <b>Cierre:&nbsp;</b>
                     {formatDate(inf.endDate)}
                  </p>
               </div>
            </header>

            <div className="mt-4">
               <b className="text-sm">Descripción</b>
               <div className="overflow-y-auto text-sm max-h-40 space-y-2 rounded-md border p-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit inventore temporibus exercitationem assumenda nemo fuga voluptates accusamus qui necessitatibus impedit fugit velit, officiis sed quod, accusantium tempora delectus. Dolorum, consequatur? Corrupti ut aut exercitationem accusantium at consequatur sed eveniet atque delectus doloremque autem alias, quod distinctio nemo deleniti officiis, hic labore molestiae? Nihil eveniet error alias aliquid ad id ab asperiores ipsa, amet officia magni fugit tempore.
               </div>
            </div>
         </section>
      </main>
   )
}
