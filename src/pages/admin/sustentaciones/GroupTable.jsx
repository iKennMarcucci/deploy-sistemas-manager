import { useState } from "react"
import { Pencil, Trash2, List } from "lucide-react"
import Boton from "../../../components/Boton"
import VerLineasModal from "./comp/VerLineasModal"

export default function GroupTable({
   groupList,
   onEdit,
   onDelete,
   onVerLineas,
   lineasAcciones // { onCrearLinea, onEditarLinea, onEliminarLinea }
}) {
   return (
      <>
         <table className="flex flex-col rounded-md border">
            <thead className="bg-black/5 p-4">
               <tr className="grid grid-cols-12 gap-2">
                  <th className="col-span-3 text-start">Nombre</th>
                  <th className="col-span-3 text-start">Programa</th>
                  <th className="col-span-5 text-start">Líneas</th>
                  <th className="col-span-1 text-center">Acciones</th>
               </tr>
            </thead>
            <tbody className="text-sm">
               {groupList.map(group => (
                  <tr key={group.id} className="grid grid-cols-12 items-center gap-2 p-4">
                     <td className="col-span-3">{group.nombre}</td>
                     <td className="col-span-3">{group.programa?.nombre ?? "-"}</td>
                     <td className="col-span-5">
                        {(group.lineasInvestigacion || []).map(l => l.nombre).join(", ")}
                     </td>
                     <td className="col-span-1 flex justify-center">
                        <div className="flex gap-2">
                           <Boton
                              variant="borderwhite"
                              onClick={() => onVerLineas(group)}
                              title="Ver líneas"
                           >
                              <List size={16} />
                           </Boton>
                           <Boton
                              variant="borderwhite"
                              onClick={() => onEdit(group)}
                              title="Editar grupo"
                           >
                              <Pencil size={16} />
                           </Boton>
                           <Boton
                              variant="borderwhite"
                              onClick={() => onDelete(group)}
                              title="Eliminar grupo"
                           >
                              <Trash2 size={16} />
                           </Boton>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </>
   )
}