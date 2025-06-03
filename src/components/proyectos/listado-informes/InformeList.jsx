import { Download } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { Eye } from "lucide-react"
import { FileText } from "lucide-react"
import { useState } from "react"

export default function InformeList({ sent, handleAction }) {
   const [isModalOpen, setIsModalOpen] = useState("")

   return (
      <div className="border-black/5 border-b grid grid-cols-12 items-center p-4">
         <div className="col-span-2 font-bold truncate">{sent.student.name}</div>
         <div className="col-span-4 flex items-center gap-1">
            {
               sent.document &&
               <>
                  <FileText className="text-azul w-6 size-4" />
                  <p className="truncate">{sent.document.name}</p>
               </>
            }
         </div>
         <div className="col-span-2">{sent.sendDate}</div>
         <div className="col-span-2 flex items-center text-xs/4 gap-2">
            <p style={{ backgroundColor: `${sent.status.color}0f`, color: sent.status.color, borderColor: sent.status.color }}
               className="border rounded-full px-2">
               {sent.status.value}
            </p>

            {sent.nota !== "0" && <p>{sent.nota}/5.0</p>}
         </div>
         <div className="col-span-2 flex items-stretch justify-start gap-2">
            <button onClick={() => setIsModalOpen("ver")} title="Ver detalles" className="border-black/15 text-black/50 hover:text-black hover:border-black hover:bg-black/5 
            duration-150 rounded-md border px-2 py-1">
               <Eye size={16} />
            </button>
            <button onClick={() => setIsModalOpen("descargar")} title="Descargar" className="border-black/15 text-black/50 hover:text-black hover:border-black hover:bg-black/5 
            duration-150 rounded-md border px-2 py-1">
               <Download size={16} />
            </button>
            <button onClick={() => setIsModalOpen("calificar")} title="Calificar" className={`${sent.nota === "0" ?
               "border-black/15 text-black/50 hover:text-black hover:border-black hover:bg-black/5"
               : "bg-black/50 text-white border-black/50"} duration-150 rounded-md border px-2 py-1`}>
               <CheckCircle size={16} />
            </button>
         </div>
      </div>
   )
}