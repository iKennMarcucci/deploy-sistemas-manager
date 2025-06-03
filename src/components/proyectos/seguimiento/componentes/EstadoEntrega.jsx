import { Alert } from "@heroui/alert";
import { CheckCircle } from "lucide-react";
import { CircleAlert } from "lucide-react";
import { Clock } from "lucide-react";
import { File } from "lucide-react";
import LabelInput from "../../../LabelInput";

export default function EstadoEntrega({ label, entrega, acciones }) {
   return (
      <div className="border-gris-claro border rounded-md p-4">
         <div className="flex justify-between items-center">
            <h6 className="font-bold">{label}</h6>
            <a target="_blank" href={entrega.url} className="hover:!text-azul text-gris-institucional flex justify-end items-center text-xs gap-2">
               <File size={16} className="text-success" />
               {entrega.nombre}
            </a>
         </div>

         {
            entrega.estado == undefined ? (
               <div className="mt-4 flex flex-col gap-2 space-y-2">
                  <Alert
                     title={"Retroalimentación de los directores"}
                     classNames={{
                        title: "font-bold text-base",
                        base: "bg-gris-claro/25 py-5 border-gris-intermedio border",
                        iconWrapper: "bg-transparent border-0 shadow-none",
                        description: "font-light"
                     }}
                     description={"Pendiente de revisión"}
                     icon={<><Clock size={24} /></>}
                  />
                  <LabelInput
                     id={label}
                     label={"Subir Nueva Versión"}
                     typeInput={"file"}
                     isRequired={true}
                  />
               </div>
            ) : entrega.estado == "ajustes" && (
               <div className="mt-4 flex flex-col gap-2 space-y-2">
                  <Alert
                     title={"Retroalimentación de los directores"}
                     classNames={{
                        title: "font-bold text-base",
                        base: "bg-azul-claro py-5 border-azul border text-azul",
                        iconWrapper: "bg-transparent border-0 shadow-none",
                        description: "text-azul font-light"
                     }}
                     description={<div className="flex flex-col text-xs">
                        {
                           entrega.retroalimentacion.map(ra =>
                              <span key={ra.id}>•<b className="font-bold"> {ra.nombreUsuario}:</b> {ra.descripcion}</span>
                           )
                        }
                     </div>}
                     icon={<><CircleAlert size={24} /></>}
                  />
                  <LabelInput
                     id={label}
                     label={"Subir Nueva Versión"}
                     typeInput={"file"}
                     isRequired={true}
                  />
               </div>
            )
         }

         {/* Acciones extra (descargar, eliminar, etc) */}
         {acciones && <div className="mt-4 place-self-end">{acciones}</div>}
      </div>
   )
}