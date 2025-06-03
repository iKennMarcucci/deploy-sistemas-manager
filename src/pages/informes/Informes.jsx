import { Tabs, Tab } from "@heroui/tabs"
import { useState, useEffect } from "react"
import InformeCard from "../../components/proyectos/informes/InformeCard"
import useInformes from "../../lib/hooks/useInformes"

export default function Informes() {
   const { getInformes, getEntregaInformes } = useInformes()
   const [listInformes, setListInformes] = useState(null)
   const [search, setSearch] = useState("")
   const [entregas, setEntregas] = useState({})
   const [activeTab, setActiveTab] = useState("pending")

   useEffect(() => { setInformes() }, [])

   const setInformes = async () => {
      const inf = await getInformes()
      setListInformes(inf.length === 0 ? [] : inf)
      if (inf && inf.length > 0) {
         const entregados = inf.filter(i => i.tieneEntregas)
         const entregasObj = {}
         for (const i of entregados) {
            try {
               const archivos = await getEntregaInformes(i.id)
               entregasObj[i.id] = archivos
            } catch {
               entregasObj[i.id] = []
            }
         }
         setEntregas(entregasObj)
      }
   }

   // Filtros por tab y búsqueda
   const pendientes = listInformes
      ? listInformes.filter(inf =>
         !inf.tieneEntregas &&
         (inf.materia?.toLowerCase().includes(search.toLowerCase()) ||
            inf.descripcion?.toLowerCase().includes(search.toLowerCase()))
      )
      : []

   const entregados = listInformes
      ? listInformes.filter(inf =>
         inf.tieneEntregas &&
         (inf.materia?.toLowerCase().includes(search.toLowerCase()) ||
            inf.descripcion?.toLowerCase().includes(search.toLowerCase()))
      )
      : []

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="flex justify-between items-center gap-4">
            <h1 className="font-black text-3xl">Informes</h1>
            <input
               type="search"
               placeholder="Buscar por nombre o descripción..."
               className="border rounded-md px-3 py-2 text-sm w-72 outline-none focus:border-azul"
               value={search}
               onChange={e => setSearch(e.target.value)}
            />
         </section>

         {(pendientes.length > 0 || entregados.length > 0) ? (
            <Tabs
               aria-label="Options"
               selectedKey={activeTab}
               onSelectionChange={setActiveTab}
               classNames={{ base: "ml-1", tabList: "bg-gris-claro w-fit rounded-md", tab: "w-28 h-7" }}
            >
               <Tab key="pending" title="Pendientes">
                  {pendientes.length > 0
                     ? pendientes.map(inf =>
                        <InformeCard key={inf.id} informe={inf} />
                     )
                     : <span className="text-gris-institucional">No hay informes pendientes.</span>
                  }
               </Tab>
               <Tab key="sent" title="Entregados">
                  {entregados.length > 0
                     ? entregados.map(inf =>
                        <InformeCard
                           key={inf.id}
                           informe={inf}
                           archivosEntregados={entregas[inf.id] || []}
                        />
                     )
                     : <span className="text-gris-institucional">No hay informes entregados.</span>
                  }
               </Tab>
            </Tabs>
         ) : (
            <span className="text-gris-institucional">No hay ningún informe programado.</span>
         )}
      </main>
   )
}