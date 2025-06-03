import { CircleAlert } from "lucide-react"
import { Alert } from "@heroui/alert"

export default function OverdueTasks({ init }) {
   const tareas = Array.isArray(init) ? init : []

   return (
      <div className="border-gris-claro rounded-md border p-5 w-full flex flex-col gap-4">
         <div className="flex flex-col gap-0">
            <h6 className="font-bold text-xl">Tareas Atrasadas</h6>
            <p className="text-gris-institucional text-sm">Tareas pendientes con atrasos</p>
         </div>
         <div className="flex flex-col justify-start items-center gap-4 h-full">
            {
               tareas.length > 0 ? tareas.map((tarea, i) => {
                  // Validación de campos
                  const tipo = tarea?.tipo ?? "Sin tipo"
                  const descripcion = tarea?.descripcion ?? "Sin descripción"
                  const fecha = tarea?.fecha ?? ""
                  const hora = tarea?.hora ?? ""
                  const lugar = tarea?.lugar ?? "#"

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
                     <a key={i} target="_blank" href={lugar} className="w-full">
                        <Alert
                           title={<span className="line-clamp-2">{tipo} - {descripcion}</span>}
                           aria-label="Alerta de tarea atrasada"
                           classNames={{
                              title: "text-danger font-bold text-base",
                              description: "text-rojo-oscuro",
                              base: "border-danger bg-rojo-claro flex items-center border",
                              iconWrapper: "bg-transparent text-danger border-0 shadow-none"
                           }}
                           description={`${fechaTexto}${hora ? ` - ${hora.slice(0, 5)}` : ""}`}
                           icon={<><CircleAlert size={24} /></>}
                        />
                     </a>
                  )
               }) : (
                  <div className="h-full flex justify-center items-center">
                     <p className="text-gris-institucional ">No hay tareas atrasadas</p>
                  </div>
               )
            }
         </div>
      </div>
   )
}