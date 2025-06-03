import { Tabs, Tab } from "@heroui/tabs"
import { informes } from "../../lib/test/informes"
import VerInforme from "./VerInforme"
import Boton from "../../components/Boton"
import { useState } from "react"
import { PlusIcon } from "lucide-react"
import CrearInformeForm from "../../components/proyectos/listado-informes/CrearInformeForm"
import VerDetallesInforme from "../../components/proyectos/listado-informes/VerDetallesInforme"
import EnviadosInforme from "../../components/proyectos/listado-informes/EnviadosInforme"
import EditarInformeForm from "../../components/proyectos/listado-informes/EditarInformeForm"
import EliminarInformeForm from "../../components/proyectos/listado-informes/EliminarInformeForm"

export default function ListadoInformes() {
   const [informeSelected, setInformeSelected] = useState(null)
   const [gestionarModales, setGestionarModales] = useState("")

   const handleAction = (action) => {
      setInformeSelected(action.inf)

      switch (action.action) {
         case "ver":
            setGestionarModales(action.action)
            break;
         case "enviados":
            setGestionarModales(action.action)
            break;
         case "editar":
            setGestionarModales(action.action)
            break;
         case "borrar":
            setGestionarModales(action.action)
            break;
      }
   }

   return (
      <>
         <main className="flex flex-col gap-4 h-full">
            <section className="flex justify-between items-center gap-4">
               <h1 className="font-black text-3xl">Informes</h1>
               <Boton variant={"borderwhite"} customClassName="w-fit" onClick={() => setGestionarModales("crear")}>
                  <PlusIcon size={20} />
                  Nuevo Informe
               </Boton>
            </section>
            {
               informes.length !== 0 ?
                  <section className="w-full pb-40">
                     <Tabs aria-label="Options" classNames={{ base: "ml-1", tabList: "bg-gris-claro w-fit rounded-md", tab: "w-28 h-7" }}>
                        <Tab key="all" title="Todas">
                           {informes.map(inf => <VerInforme key={inf.id} inf={inf} handleAction={handleAction} />)}
                        </Tab>

                        <Tab key="opened" title="Activas">
                           {informes.filter(inf => inf.status.id === 1).map(inf => <VerInforme key={inf.id} inf={inf} handleAction={handleAction} />)}
                        </Tab>

                        <Tab key="incoming" title="Próximos">
                           {informes.filter(inf => inf.status.id === 2).map(inf => <VerInforme key={inf.id} inf={inf} handleAction={handleAction} />)}
                        </Tab>

                        <Tab key="closed" title="Cerrados">
                           {informes.filter(inf => inf.status.id === 3).map(inf => <VerInforme key={inf.id} inf={inf} handleAction={handleAction} />)}
                        </Tab>
                     </Tabs>
                  </section> : <span className="text-gris-institucional">No hay ningún informe programado.</span>
            }
         </main>

         {gestionarModales === "crear" && <CrearInformeForm isOpen={setGestionarModales} />}
         {gestionarModales === "ver" && <VerDetallesInforme inf={informeSelected} isOpen={setGestionarModales} />}
         {gestionarModales === "enviados" && <EnviadosInforme inf={informeSelected} isOpen={setGestionarModales} />}
         {gestionarModales === "editar" && <EditarInformeForm inf={informeSelected} isOpen={setGestionarModales} />}
         {gestionarModales === "borrar" && <EliminarInformeForm inf={informeSelected} isOpen={setGestionarModales} />}
      </>
   )
}