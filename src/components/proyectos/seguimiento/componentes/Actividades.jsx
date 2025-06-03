import { Circle } from "lucide-react"

export default function Actividades({ taskList }) {
   return (
      <div className="space-y-4 mt-4">
         <h6 className="font-bold text-lg">Actividades</h6>
         {
            taskList.map((task, index) =>
               <div key={index} className="border-gris-claro border rounded-md p-4 flex items-start">
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-4">
                        <Circle size={16} />
                        <h6 className="font-bold">{task.title}</h6>
                     </div>

                     <div className="border-l py-2 pl-5 ml-2 space-y-2">
                        {
                           task.tasks.map((t, index) =>
                              <div key={index} className="flex items-center gap-4">
                                 <Circle size={16} />
                                 <p className="text-gris-institucional text-sm">{t.desc}</p>
                              </div>
                           )
                        }
                     </div>
                  </div>
               </div>
            )
         }
      </div>
   )
}