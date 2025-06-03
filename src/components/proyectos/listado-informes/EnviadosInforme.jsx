import { Tabs, Tab } from "@heroui/tabs"
import { XIcon } from "lucide-react"

import { enviados } from "../../../lib/test/sents"
import { useRef, useEffect } from "react"
import InformeList from "./InformeList"

export default function EnviadosInforme({ inf, isOpen }) {
   const modalRef = useRef(null)

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (modalRef.current && !modalRef.current.contains(event.target)) {
            isOpen("")
         }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
         document.removeEventListener("mousedown", handleClickOutside)
      }
   }, [isOpen])
   return (
      <main className="bg-black/50 backdrop-blur-md flex justify-center items-center fixed w-full h-full z-50 left-0 top-0">
         <section ref={modalRef} className="bg-white modal-animation flex flex-col gap-4 max-w-5xl w-full rounded-md p-6">
            <div className="flex justify-between items-center gap-4">
               <h1 className="font-black text-xl">Entregas - {inf.title}</h1>
               <XIcon className="text-black/25 hover:text-black duration-150 cursor-pointer" onClick={() => isOpen("")} />
            </div>
            {
               enviados.length !== 0 ?
                  <section className="w-full">
                     <Tabs aria-label="Options" classNames={{ base: "ml-1", tabList: "bg-gris-claro w-fit rounded-md", tab: "w-28 h-7" }}>
                        <Tab key="all" title="Todos">
                           {
                              enviados.length !== 0 ?
                                 <div className="text-sm">
                                    <div className="bg-black/5 font-bold grid grid-cols-12 p-4 rounded-t-md">
                                       <h5 className="col-span-2">Estudiante</h5>
                                       <h5 className="col-span-4">Documento</h5>
                                       <h5 className="col-span-2">Fecha de entrega</h5>
                                       <h5 className="col-span-2">Estado</h5>
                                       <h5 className="col-span-2">Acciones</h5>
                                    </div>
                                    <div className="border-black/5 border rounded-b-md overflow-hidden">
                                       {enviados.map(sent => <InformeList key={sent.id} sent={sent} handleAction={() => console.log("asd")} />)}
                                    </div>
                                 </div> : <div className="flex justify-center items-center">
                                    No se ha encontrado ninguna entrega
                                 </div>
                           }
                        </Tab>

                        <Tab key="pdng" title="Pendientes">
                           {
                              enviados.filter(s => s.status.id === 3).length !== 0 ?
                                 <div className="text-sm">
                                    <div className="bg-black/5 font-bold grid grid-cols-12 p-4 rounded-t-md">
                                       <h5 className="col-span-2">Estudiante</h5>
                                       <h5 className="col-span-4">Documento</h5>
                                       <h5 className="col-span-2">Fecha de entrega</h5>
                                       <h5 className="col-span-2">Estado</h5>
                                       <h5 className="col-span-2">Acciones</h5>
                                    </div>
                                    <div className="border-black/5 border rounded-b-md overflow-hidden">
                                       {enviados.filter(s => s.status.id === 3).map(sent => <InformeList key={sent.id} sent={sent} handleAction={() => console.log("asd")} />)}
                                    </div>
                                 </div> : <div className="text-black/50 mt-4 flex justify-center items-center">
                                    No se ha encontrado ninguna entrega
                                 </div>
                           }
                        </Tab>

                        <Tab key="qlfd" title="Calificados">
                           {
                              enviados.filter(s => s.status.id === 1).length !== 0 ?
                                 <div className="text-sm">
                                    <div className="bg-black/5 font-bold grid grid-cols-12 p-4 rounded-t-md">
                                       <h5 className="col-span-2">Estudiante</h5>
                                       <h5 className="col-span-4">Documento</h5>
                                       <h5 className="col-span-2">Fecha de entrega</h5>
                                       <h5 className="col-span-2">Estado</h5>
                                       <h5 className="col-span-2">Acciones</h5>
                                    </div>
                                    <div className="border-black/5 border rounded-b-md overflow-hidden">
                                       {enviados.filter(s => s.status.id === 1).map(sent => <InformeList key={sent.id} sent={sent} handleAction={() => console.log("asd")} />)}
                                    </div>
                                 </div> : <div className="text-black/50 mt-4 flex justify-center items-center">
                                    No se ha encontrado ninguna entrega
                                 </div>
                           }
                        </Tab>

                        <Tab key="not" title="No Enviados">
                           {
                              enviados.filter(s => s.status.id === 2).length !== 0 ?
                                 <div className="text-sm">
                                    <div className="bg-black/5 font-bold grid grid-cols-12 p-4 rounded-t-md">
                                       <h5 className="col-span-2">Estudiante</h5>
                                       <h5 className="col-span-4">Documento</h5>
                                       <h5 className="col-span-2">Fecha de entrega</h5>
                                       <h5 className="col-span-2">Estado</h5>
                                       <h5 className="col-span-2">Acciones</h5>
                                    </div>
                                    <div className="border-black/5 border rounded-b-md overflow-hidden">
                                       {enviados.filter(s => s.status.id === 2).map(sent => <InformeList key={sent.id} sent={sent} handleAction={() => console.log("asd")} />)}
                                    </div>
                                 </div> : <div className="text-black/50 mt-4 flex justify-center items-center">
                                    No se ha encontrado ninguna entrega
                                 </div>
                           }
                        </Tab>
                     </Tabs>
                  </section> : <span className="text-gris-institucional">No hay ningún informe programado.</span>
            }
         </section>
      </main >
   )
}