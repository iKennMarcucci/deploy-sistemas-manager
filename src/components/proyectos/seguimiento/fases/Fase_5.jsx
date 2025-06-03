import Actividades from "../componentes/Actividades"
import { DatePicker } from "@heroui/date-picker"
import { Save, CircleHelp } from "lucide-react"
import { Alert } from "@heroui/alert"
import Boton from "../../../Boton"
import useProject from "../../../../lib/hooks/useProject"
import { parseDate } from "@internationalized/date"
import { useState } from "react"
import { useEffect } from "react"

const actividades = [
   {
      title: "Planificación de Hitos del Proyecto",
      tasks: [
         { desc: "Definir fechas para cada objetivo específico" },
         { desc: "Revisar la distribución de tareas en 12 meses" },
         { desc: "Confirmación de la planificación con el director" },
      ],
   }
]

export default function Fase_5({ project }) {
   const { editProgress } = useProject()
   const [currentProject, setCurrentProject] = useState(null)

   const fetchProject = async () => {
      setCurrentProject(project)
   }

   useEffect(() => { fetchProject() }, [])

   const handleFechaChange = (id, field, value) => {
      setCurrentProject((prev) => ({
         ...prev,
         objetivosEspecificos: prev.objetivosEspecificos.map((obj) =>
            obj.id === id ? { ...obj, [field]: value?.toString() ?? "" } : obj
         ),
      }))
   }

   const formatDate = (date) => {
      if (!date) return ""
      if (typeof date === "string") return date
      if (typeof date === "object" && date.year && date.month && date.day) {
         const jsDate = new Date(date.year, date.month - 1, date.day)
         return jsDate.toISOString().slice(0, 10)
      }
      if (date instanceof Date) {
         return date.toISOString().slice(0, 10)
      }
      return ""
   }

   const allFieldsFilled = currentProject?.objetivosEspecificos.every(
      obj => obj.fecha_inicio && obj.fecha_fin
   )

   const handleSave = async () => {
      if (!allFieldsFilled) {
         alert("Por favor, completa todas las fechas de inicio y fin.")
         return
      }

      const objetivosFormateados = currentProject.objetivosEspecificos.map(obj => ({
         ...obj,
         fecha_inicio: formatDate(obj.fecha_inicio),
         fecha_fin: formatDate(obj.fecha_fin),
      }))

      await editProgress({ objetivosEspecificos: objetivosFormateados }, currentProject.id)
   }

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 5: Planificación de Hitos del Proyecto</h4>
            <p className="text-gris-institucional text-sm">
               Defina las fechas de inicio y fin para cada objetivo específico del proyecto
            </p>
         </div>

         <Actividades taskList={actividades} />

         <Alert
            title={"Recomendación para la planificación"}
            classNames={{
               title: "font-bold text-base",
               base: "border-azul bg-azul-claro text-azul border py-5",
               iconWrapper: "bg-transparent border-0 shadow-none",
               description: "text-azul"
            }}
            description={"Se recomienda planificar todos los hitos del proyecto dentro de un período estimado de 12 meses. Asegúrese de distribuir las tareas de manera realista a lo largo de este tiempo."}
            icon={<><CircleHelp size={24} /></>}
         />

         <div className="flex justify-between gap-4">
            <div className="flex flex-col w-full">
               <h6 className="font-bold mb-4">Objetivo Específico</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <p>{obj.descripcion}</p>
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-full">
               <h6 className="font-bold mb-4">Fecha de Inicio</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <DatePicker
                           value={obj.fecha_inicio ? parseDate(obj.fecha_inicio) : null}
                           onChange={(date) => handleFechaChange(obj.id, "fecha_inicio", date)}
                           aria-label="Fecha de inicio"
                           classNames={{ inputWrapper: "border-gris-claro border rounded-md hover:bg-transparent bg-transparent shadow-none" }}
                        />
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-full">
               <h6 className="font-bold mb-4">Fecha de Fin</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <DatePicker
                           value={obj.fecha_fin ? parseDate(obj.fecha_fin) : null}
                           onChange={(date) => handleFechaChange(obj.id, "fecha_fin", date)}
                           aria-label="Fecha de fin"
                           classNames={{ inputWrapper: "border-gris-claro border rounded-md hover:bg-transparent bg-transparent shadow-none" }}
                        />
                     </div>
                  )
               }
            </div>
         </div>

         <div className="w-fit place-self-end">
            <Boton
               type={"button"}
               variant={"borderwhite"}
               onClick={handleSave}
               disabled={!allFieldsFilled}
            >
               <Save size={16} />
               Guardar Cambios
            </Boton>
         </div>
      </section>
   )
}