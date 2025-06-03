import Actividades from "../componentes/Actividades"
import { FileCode } from "lucide-react"
import { Alert } from "@heroui/alert"
import Boton from "../../../Boton"
import { Progress } from "@heroui/progress"
import { Save } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { CircleAlert } from "lucide-react"
import { Circle } from "lucide-react"
import { useState } from "react"
import useProject from "../../../../lib/hooks/useProject"
import { useEffect } from "react"

const actividades = [
   {
      title: "Seguimiento de Hitos",
      tasks: [
         { desc: "Actualizar porcentaje de avance de cada hito" },
         { desc: "Complete todos los hitos al 100%" },
         { desc: "Solicitar sustentación final" },
      ],
   }
]

export default function Fase_6({ project }) {
   const { editProgress } = useProject()
   const [currentProject, setCurrentProject] = useState(null)

   useEffect(() => { fetchProject() }, [])


   const fetchProject = async () => {
      setCurrentProject(project)
   }

   const handleAvanceChange = async () => {
      await editProgress(currentProject, currentProject.id)
   }

   return (
      <section className="space-y-5">
         <div>
            <h4 className="font-bold text-2xl">Fase 6: Seguimiento de Hitos</h4>
            <p className="text-gris-institucional text-sm">
               Evalúe el avance reportado por el estudiante para cada hito del proyecto
            </p>
         </div>

         <Actividades taskList={actividades} />

         <Alert
            title={"Seguimiento de Avance"}
            classNames={{
               title: "font-bold text-base",
               base: "border-azul bg-azul-claro text-azul border py-5",
               iconWrapper: "bg-transparent border-0 shadow-none",
               description: "text-azul"
            }}
            description={"Registre el porcentaje de avance para cada hito del proyecto. Cuando todos los hitos estén al 100% y validados por el director y el codirector, podrá solicitar la sustentación final."}
            icon={<><FileCode size={24} /></>}
         />

         <div className="flex justify-between gap-10 border rounded-md p-6">
            <div className="flex flex-col w-full whitespace-nowrap">
               <h6 className="font-bold mb-4">Objetivo Específico</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <p>{obj.descripcion}</p>
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-fit whitespace-nowrap">
               <h6 className="font-bold mb-4">Período</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <p>
                           {
                              (() => {
                                 const dateStr = obj.fecha_inicio
                                 if (!dateStr) return ''

                                 let date
                                 if (dateStr.includes('T')) {
                                    date = new Date(dateStr)
                                 } else {
                                    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10))
                                    date = new Date(year, month - 1, day)
                                 }

                                 return date.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                 })
                              })()
                           }

                           &nbsp;&nbsp;-&nbsp;&nbsp;

                           {
                              (() => {
                                 const dateStr = obj.fecha_fin
                                 if (!dateStr) return ''

                                 let date
                                 if (dateStr.includes('T')) {
                                    date = new Date(dateStr)
                                 } else {
                                    const [year, month, day] = dateStr.split('-').map(num => parseInt(num, 10))
                                    date = new Date(year, month - 1, day)
                                 }

                                 return date.toLocaleDateString('es-ES', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                 })
                              })()
                           }
                        </p>
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-full max-w-64">
               <h6 className="font-bold mb-4">Progreso</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-full">
                        <Progress aria-label="none" value={obj.avanceReportado} classNames={{ indicator: "bg-rojo-institucional", track: "bg-rojo-claro" }} />
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-fit">
               <h6 className="font-bold mb-4">% Avance</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center w-24 gap-2 -translate-y-1">
                        <input className="border-gris-claro border rounded-md p-2 w-full"
                           type="number"
                           min={0}
                           max={100}
                           value={obj.avanceReportado ?? 0}
                           onChange={(e) => {
                              const value = Math.max(0, Math.min(100, Number(e.target.value)))
                              setCurrentProject({
                                 ...currentProject,
                                 objetivosEspecificos: currentProject.objetivosEspecificos.map(o =>
                                    o.id === obj.id ? { ...o, avanceReportado: value } : o
                                 )
                              })
                           }}
                        />
                        %
                     </div>
                  )
               }
            </div>
            <div className="flex flex-col w-fit">
               <h6 className="font-bold mb-4">Validación</h6>
               {
                  currentProject?.objetivosEspecificos.map(obj =>
                     <div key={obj.id} className="text-sm h-12 flex items-center justify-center w-full gap-2">
                        {/* Director */}
                        {
                           obj.evaluacion == null
                              ? <Circle className="text-gris-intermedio" />
                              : obj.evaluacion.director === true
                                 ? <CheckCircle className="text-green-400" />
                                 : obj.evaluacion.director === false
                                    ? <CircleAlert className="text-amber-400" />
                                    : <Circle className="text-gris-intermedio" />
                        }
                        {/* Codirector */}
                        {
                           obj.evaluacion == null
                              ? <Circle className="text-gris-intermedio" />
                              : obj.evaluacion.codirector === true
                                 ? <CheckCircle className="text-green-400" />
                                 : obj.evaluacion.codirector === false
                                    ? <CircleAlert className="text-amber-400" />
                                    : <Circle className="text-gris-intermedio" />
                        }
                     </div>
                  )
               }
            </div>
         </div>

         <div className="w-fit place-self-end flex gap-4">
            <Boton type={"button"} variant={"borderwhite"} onClick={() => handleAvanceChange()}>
               <Save size={16} />
               Guardar
            </Boton>
            {
               false && // Cuando el usuario sea un director o codirector
               <Boton type="button" variant="whitered" customClassName="px-20"
                  disabled={
                     !currentProject?.objetivosEspecificos?.length || !currentProject.objetivosEspecificos.every(
                        obj => obj.avanceReportado === 100 && obj.evaluacion?.director === true && obj.evaluacion?.codirector === true
                     )
                  }
                  onClick={() => alert("Solicitud de sustentación enviada.")}>
                  Promover a Entrega de Documentos Finales
               </Boton>
            }
         </div>
      </section >
   )
}