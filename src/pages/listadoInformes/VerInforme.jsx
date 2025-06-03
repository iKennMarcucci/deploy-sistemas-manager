import { CalendarDays, Clock, Eye, Users, FileText, Edit, Trash2 } from "lucide-react"

export default function VerInforme({ inf, handleAction }) {
   return (
      <div className="space-y-2.5 rounded-md border mb-4 p-4">
         <section className="flex flex-col">
            <div className="flex justify-between items-center gap-2">
               <h5 className="font-semibold text-xl">{inf.title}</h5>
               <span className="rounded-full text-xs border w-fit px-2"
                  style={{
                     backgroundColor: `${inf.status.color}1f`,
                     color: inf.status.color,
                     borderColor: inf.status.color
                  }}>
                  {inf.status.value}
               </span>
            </div>
            <p className="text-black/50 text-sm">{inf.group.value} - {inf.group.lines.value}</p>
         </section>

         <section className="flex justify-between items-center gap-2">
            <aside className="text-black/50 flex items-center text-sm gap-8">
               <span className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  <p><b>Apertura:</b>&nbsp;{inf.endDate}</p>
               </span>
               <span className="flex items-center gap-2">
                  <Clock size={16} />
                  <p><b>Cierre:</b>&nbsp;{inf.endDate}</p>
               </span>
            </aside>

            <aside className="text-black/50 flex justify-end items-center text-sm gap-2">
               <button onClick={() => handleAction({inf: inf, action: "ver"})} className="hover:text-black hover:border-black duration-150 w-12 h-8 rounded-md border p-2">
                  <Eye size={16} className="mx-auto" />
               </button>
               <button onClick={() => handleAction({inf: inf, action: "enviados"})} className={`${inf.sents !== 0 ? "text-azul-claro bg-azul" : "hover:text-azul-claro hover:bg-azul"} duration-150 w-12 h-8 rounded-md border p-2 flex items-center justify-evenly`}>
                  <FileText size={16} />
                  {inf.sents !== 0 && <p className="text-xs">&nbsp;{inf.sents}</p>}
               </button>
               <button onClick={() => handleAction({inf: inf, action: "editar"})} className="hover:text-black hover:border-black duration-150 w-12 h-8 rounded-md border p-2">
                  <Edit size={16} className="mx-auto" />
               </button>
               <button onClick={() => handleAction({inf: inf, action: "borrar"})} className="hover:text-rojo-claro hover:bg-rojo-institucional duration-150 w-12 h-8 rounded-md border p-2">
                  <Trash2 size={16} className="mx-auto" />
               </button>
            </aside>
         </section>

         <section className="flex items-center text-sm gap-2">
            <Users size={16} className="text-azul" />
            <span className="flex items-center">{inf.sents} entregas &nbsp;<p className="text-warning">({inf.pending} pendientes)</p></span>
         </section>
      </div>
   )
}