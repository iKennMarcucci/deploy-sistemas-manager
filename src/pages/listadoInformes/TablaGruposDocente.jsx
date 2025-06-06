import { useRef, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Boton from "../../components/Boton"

export default function TablaGruposDocente({ grupos }) {
   const [openActions, setOpenActions] = useState({})
   const dropdownRefs = useRef({})

   const toggleActions = (grupoId) => {
      setOpenActions(prev => ({
         ...prev,
         [grupoId]: !prev[grupoId]
      }))
   }

   useEffect(() => {
      function handleClickOutside(event) {
         Object.keys(openActions).forEach(grupoId => {
            if (
               openActions[grupoId] &&
               dropdownRefs.current[grupoId] &&
               !dropdownRefs.current[grupoId].contains(event.target)
            ) {
               setOpenActions(prev => ({ ...prev, [grupoId]: false }))
            }
         })
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [openActions])

   return (
      <table className="flex flex-col rounded-md border">
         <thead className="bg-black/5 p-4">
            <tr className="grid grid-cols-6 gap-2">
               <th className="col-span-2 text-start">Grupo Cohorte</th>
               <th className="col-span-1 text-start">Cohorte</th>
               <th className="col-span-1 text-start">Materia</th>
               <th className="col-span-1 text-start">Grupo</th>
               <th className="col-span-1 text-center">Acciones</th>
            </tr>
         </thead>
         <tbody className="text-sm">
            {grupos.map(grupo => (
               <tr key={grupo.id} className="grid grid-cols-6 items-center gap-2 p-4">
                  <td className="col-span-2">{grupo.cohorteGrupoNombre}</td>
                  <td className="col-span-1">{grupo.cohorteNombre}</td>
                  <td className="col-span-1">{grupo.materia}</td>
                  <td className="col-span-1">{grupo.grupoNombre}</td>
                  <td
                     className="relative col-span-1 place-self-center w-full"
                     ref={el => dropdownRefs.current[grupo.id] = el}
                  >
                     <button
                        id="custom-ellipsis"
                        onClick={() => toggleActions(grupo.id)}
                        className="flex justify-center items-center gap-1 p-2 w-full"
                     >
                        <span id="dot" />
                        <span id="dot" />
                        <span id="dot" />
                     </button>
                     {openActions[grupo.id] && (
                        <div className="bg-white whitespace-nowrap border rounded-md absolute z-50 top-[115%] right-[20%] select-animation flex flex-col">
                           <Link
                              to={`/listado-informes/${grupo.id}`}
                              className="hover:bg-gris-claro/50 duration-150 p-2"
                              onClick={() => setOpenActions(prev => ({ ...prev, [grupo.id]: false }))}
                           >
                              Ver Informes
                           </Link>
                        </div>
                     )}
                  </td>
               </tr>
            ))}
         </tbody>
      </table>
   )
}