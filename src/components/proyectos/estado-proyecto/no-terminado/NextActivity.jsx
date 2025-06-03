import { Alert } from "@heroui/alert"
import { Calendar } from "@heroui/calendar"
import { parseDate } from "@internationalized/date"
import { CalendarDays } from "lucide-react"

export default function NextActivity({ init }) {
   // Asegura que siempre haya al menos un objeto con valores por defecto
   const actividad = Array.isArray(init) && init.length > 0 ? init[0] : {
      tipo: "",
      descripcion: "",
      fecha: "",
      hora: "",
      horaFin: "",
      lugar: "",
      asistenciaConfirmada: null
   }
   const { tipo, descripcion, fecha, hora, lugar } = actividad

   // Validación de fecha y hora
   let fechaTexto = ""
   if (fecha) {
      const [year, month, day] = fecha.split('-').map(num => parseInt(num, 10))
      const date = new Date(year, month - 1, day)
      fechaTexto = date.toLocaleDateString('es-ES', {
         day: '2-digit',
         month: 'long',
         weekday: 'long',
         year: 'numeric'
      })
   }

   return (
      <div className="border-gris-claro rounded-md border p-5 w-full flex flex-col gap-4">
         <div className="flex flex-col gap-0">
            <h6 className="font-bold text-xl">Próxima Actividad</h6>
            <p className="text-gris-institucional text-sm">Calendario de actividades</p>
         </div>
         {
            init.length === 0 ?
               <a target="_blank" href={lugar || "#"}>
                  <Alert
                     aria-label="Alerta de tarea atrasada"
                     title={`${tipo || "Sin tipo"} - ${descripcion || "Sin descripción"}`}
                     classNames={{
                        title: "font-bold text-base",
                        base: "border-gris-intermedio flex items-center border",
                        iconWrapper: "bg-transparent border-0 shadow-none",
                     }}
                     description={`${fechaTexto}${hora ? ` - ${hora.slice(0, 5)}` : ""}`}
                     icon={<><CalendarDays size={24} /></>}
                  />
               </a>
               : <div className="h-full flex justify-center items-center">
                  <p className="text-gris-institucional ">No hay Actividades pendientes</p>
               </div>
         }

         <div className="flex justify-center">
            {fecha &&
               <Calendar
                  aria-label="Calendario de próximas actividades"
                  classNames={{
                     base: "w-full shadow-none", content: "w-full", gridWrapper: "w-full pb-0", grid: "w-full",
                     gridHeader: "w-full", gridHeaderRow: "w-full justify-between px-5", gridBody: "w-full bg-white",
                     gridBodyRow: "w-full justify-between px-5", title: "text-black font-bold text-lg"
                  }}
                  value={parseDate(fecha)}
               />
            }
         </div>
      </div>
   )
}