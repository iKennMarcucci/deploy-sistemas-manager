import { useEffect, useState } from "react"
import useInformes from "../../lib/hooks/useInformes"
import Boton from "../../components/Boton"
import { X, Paintbrush } from "lucide-react"
import TablaGruposDocente from "./TablaGruposDocente"
import CustomSelect from "../../components/CustomSelect"

export default function ListadosGruposDocente() {
   const { listGruposDocente } = useInformes()
   const [allGroups, setAllGroups] = useState([])
   const [groups, setGroups] = useState([])
   const [loading, setLoading] = useState(true)
   const [cohorteOptions, setCohorteOptions] = useState([{ id: 0, value: "Todos los cohortes" }])
   const [materiaOptions, setMateriaOptions] = useState([{ id: 0, value: "Todas las materias" }])

   // Estado de filtros
   const [filters, setFilters] = useState({
      cohorte: { id: 0, value: "Todos los cohortes" },
      materia: { id: 0, value: "Todas las materias" },
      searchInput: ""
   })

   // Obtener grupos del docente
   useEffect(() => {
      const fetchListGrupos = async () => {
         setLoading(true)
         try {
            const res = await listGruposDocente()
            setAllGroups(res)
            setGroups(res)
            // Opciones únicas para selects
            const cohortes = [
               { id: 0, value: "Todos los cohortes" },
               ...Array.from(new Set(res.map(g => g.cohorteNombre)))
                  .map((nombre, idx) => ({ id: idx + 1, value: nombre }))
            ]
            setCohorteOptions(cohortes)
            const materias = [
               { id: 0, value: "Todas las materias" },
               ...Array.from(new Set(res.map(g => g.materia)))
                  .map((nombre, idx) => ({ id: idx + 1, value: nombre }))
            ]
            setMateriaOptions(materias)
         } catch (error) {
            setAllGroups([])
            setGroups([])
            setCohorteOptions([{ id: 0, value: "Todos los cohortes" }])
            setMateriaOptions([{ id: 0, value: "Todas las materias" }])
         } finally {
            setLoading(false)
         }
      }
      fetchListGrupos()
   }, [])

   // Aplicar filtros
   useEffect(() => {
      let filtered = allGroups
      if (filters.cohorte.id !== 0) {
         filtered = filtered.filter(g => g.cohorteNombre === filters.cohorte.value)
      }
      if (filters.materia.id !== 0) {
         filtered = filtered.filter(g => g.materia === filters.materia.value)
      }
      if (filters.searchInput.trim() !== "") {
         const search = filters.searchInput.toLowerCase()
         filtered = filtered.filter(g =>
            g.cohorteGrupoNombre.toLowerCase().includes(search) ||
            g.cohorteNombre.toLowerCase().includes(search) ||
            g.materia.toLowerCase().includes(search) ||
            g.grupoNombre.toLowerCase().includes(search)
         )
      }
      setGroups(filtered)
   }, [filters, allGroups])

   const clearFilters = () => {
      setFilters({
         cohorte: cohorteOptions[0],
         materia: materiaOptions[0],
         searchInput: ""
      })
   }

   const removeFilter = (type) => {
      if (type === "cohorte") setFilters(f => ({ ...f, cohorte: cohorteOptions[0] }))
      if (type === "materia") setFilters(f => ({ ...f, materia: materiaOptions[0] }))
      if (type === "search") setFilters(f => ({ ...f, searchInput: "" }))
   }

   const hasActiveFilters =
      filters.cohorte.id !== 0 ||
      filters.materia.id !== 0 ||
      filters.searchInput.trim() !== ""

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="space-y-2">
            <h1 className="font-black text-3xl">Listado de Grupos del Docente</h1>
            <span className="text-gris-institucional">
               Visualice y filtre los grupos de cohorte asignados.
            </span>
         </section>

         <section className="flex justify-between items-center gap-4 w-full">
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({ ...f, cohorte: cohorteOptions.find(c => c.id === opt.id) }))}
               options={cohorteOptions}
               defaultValue={{ id: filters.cohorte.id, value: filters.cohorte.value }}
               label="Cohorte"
            />
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({ ...f, materia: materiaOptions.find(m => m.id === opt.id) }))}
               options={materiaOptions}
               defaultValue={{ id: filters.materia.id, value: filters.materia.value }}
               label="Materia"
            />
            <span className="flex flex-col text-sm w-full gap-1 self-end">
               <h6 className="font-bold">Buscar</h6>
               <input
                  className="flex justify-between items-center outline-none rounded-md border w-full p-2"
                  type="search"
                  value={filters.searchInput}
                  onChange={e => setFilters(f => ({ ...f, searchInput: e.target.value }))}
                  placeholder="Buscar por grupo, cohorte, materia..."
               />
            </span>
            <Boton
               onClick={clearFilters}
               variant="borderwhite"
               customClassName="h-fit w-full self-end py-2"
            >
               <Paintbrush size={18} strokeWidth={2.5} />
               Limpiar Filtros
            </Boton>
         </section>

         {/* Filtros activos */}
         {hasActiveFilters && (
            <section className="flex flex-wrap gap-2 mt-2 text-sm">
               {filters.cohorte.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Cohorte:</b> {filters.cohorte.value}</span>
                     <button
                        onClick={() => removeFilter("cohorte")}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de cohorte"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
               {filters.materia.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Materia:</b> {filters.materia.value}</span>
                     <button
                        onClick={() => removeFilter("materia")}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de materia"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
               {filters.searchInput.trim() !== "" && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Búsqueda:</b> "{filters.searchInput}"</span>
                     <button
                        onClick={() => removeFilter("search")}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de búsqueda"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
            </section>
         )}

         <section>
            {loading ? (
               <span>Cargando...</span>
            ) : groups && groups.length !== 0 ? (
               <TablaGruposDocente grupos={groups} />
            ) : hasActiveFilters ? (
               <span>No se han encontrado grupos con esos filtros</span>
            ) : (
               <span>No se han encontrado grupos</span>
            )}
         </section>
      </main>
   )
}