import { useState, useEffect } from "react"
import CustomSelect from "../../components/CustomSelect"
import Boton from "../../components/Boton"
import { Paintbrush, X } from "lucide-react"
import useProject from "../../lib/hooks/useProject"
import SustentacionTable from "./SustentacionTable"

const tipoOptions = [
   { id: 0, value: "Todos los tipos" },
   { id: 1, value: "ANTEPROYECTO" },
   { id: 2, value: "TESIS" }
]

export default function ListadoSustentaciones() {
   const { listSustentaciones } = useProject()
   const [allSustentaciones, setAllSustentaciones] = useState([])
   const [sustentaciones, setSustentaciones] = useState([])
   const [loading, setLoading] = useState(true)

   const [filters, setFilters] = useState({
      tipo: tipoOptions[0],
      searchInput: ""
   })

   useEffect(() => {
      setLoading(true)
      const fetchData = async () => {
         try {
            const data = await listSustentaciones()
            setAllSustentaciones(data || [])
            setSustentaciones(data || [])
         } catch (e) {
            setAllSustentaciones([])
            setSustentaciones([])
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [])

   useEffect(() => {
      if (!allSustentaciones) return
      applyFilters()
   }, [filters, allSustentaciones])

   const applyFilters = () => {
      let filtered = allSustentaciones || []

      // Filtrar por tipo si no es "Todos los tipos"
      if (filters.tipo.id !== 0) {
         filtered = filtered.filter(s => s.tipoSustentacion === filters.tipo.value)
      }

      // Filtrar por texto en título de proyecto
      if (filters.searchInput.trim() !== "") {
         const search = filters.searchInput.toLowerCase()
         filtered = filtered.filter(s => s.tituloProyecto && s.tituloProyecto.toLowerCase().includes(search))
      }

      setSustentaciones(filtered)
   }

   const clearFilters = () => {
      setFilters({
         tipo: tipoOptions[0],
         searchInput: ""
      })
   }

   const removeFilter = (filterType) => {
      if (filterType === 'tipo') setFilters({ ...filters, tipo: tipoOptions[0] })
      else if (filterType === 'search') setFilters({ ...filters, searchInput: "" })
   }

   const hasActiveFilters =
      filters.tipo?.id !== 0 ||
      filters.searchInput.trim() !== ""

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="space-y-2">
            <h1 className="font-black text-3xl">Listado de Sustentaciones</h1>
            <span className="text-gris-institucional">
               Visualice y filtre las sustentaciones por tipo y título de proyecto.
            </span>
         </section>

         <section className="flex justify-between items-center gap-4 w-full">
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={(opt) => setFilters({ ...filters, tipo: tipoOptions.find(t => t.id === opt.id) })}
               options={tipoOptions}
               defaultValue={{ id: filters.tipo.id, value: filters.tipo.value }}
               label="Tipo"
            />

            <span className="flex flex-col text-sm w-full gap-1 self-end">
               <h6 className="font-bold">Buscar</h6>
               <input
                  className="flex justify-between items-center outline-none rounded-md border w-full p-2"
                  type="search"
                  value={filters.searchInput}
                  onChange={(e) => setFilters({ ...filters, searchInput: e.target.value })}
                  placeholder="Buscar por título de proyecto..."
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

         {hasActiveFilters && (
            <section className="flex flex-wrap gap-2 mt-2 text-sm">
               {filters.tipo?.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Tipo:</b> {filters.tipo.value}</span>
                     <button
                        onClick={() => removeFilter('tipo')}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de tipo"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
               {filters.searchInput.trim() !== "" && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Búsqueda:</b> "{filters.searchInput}"</span>
                     <button
                        onClick={() => removeFilter('search')}
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
            ) : sustentaciones && sustentaciones.length !== 0 ? (
               <SustentacionTable sustentaciones={sustentaciones} />
            ) : hasActiveFilters ? (
               <span>No se han encontrado sustentaciones con esos filtros</span>
            ) : (
               <span>No se han encontrado sustentaciones</span>
            )}
         </section>
      </main>
   )
}