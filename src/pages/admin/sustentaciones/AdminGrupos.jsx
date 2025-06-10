import { useEffect, useState } from "react"
import useProject from "../../../lib/hooks/useProject"
import useAdmin from "../../../lib/hooks/useAdmin"
import CustomSelect from "../../../components/CustomSelect"
import Boton from "../../../components/Boton"
import { Plus, Paintbrush, X } from "lucide-react"
import GroupTable from "./GroupTable"
import GrupoModal from "./comp/GrupoModal"
import EliminarGrupoModal from "./comp/EliminarGrupoModal"
import VerLineasModal from "./comp/VerLineasModal"
import LineaModal from "./comp/LineaModal"
import EliminarLineaModal from "./comp/EliminarLineaModal"

export default function AdminGrupos() {
   const { listaGrupos } = useProject()
   const { listProgramas, createGrupo, editGrupo, deleteGrupo, createLinea, editLinea, deleteLinea } = useAdmin()

   const [groups, setGroups] = useState([])
   const [programs, setPrograms] = useState([{ id: 0, nombre: "Todos los programas" }])
   const [lines, setLines] = useState([{ id: 0, nombre: "Todas las líneas" }])
   const [filters, setFilters] = useState({
      group: { id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] },
      program: { id: 0, nombre: "Todos los programas" },
      line: { id: 0, nombre: "Todas las líneas" },
      searchInput: ""
   })
   const [allGroups, setAllGroups] = useState([])
   const [filteredGroups, setFilteredGroups] = useState([])
   const [loading, setLoading] = useState(true)

   // Modales
   const [modalGrupo, setModalGrupo] = useState({ open: false, data: null })
   const [modalEliminarGrupo, setModalEliminarGrupo] = useState({ open: false, data: null })
   const [modalLineas, setModalLineas] = useState({ open: false, grupo: null })
   // Para acciones de líneas
   const [modalLinea, setModalLinea] = useState({ open: false, data: null, grupo: null })
   const [modalEliminarLinea, setModalEliminarLinea] = useState({ open: false, data: null, grupo: null })

   // Cargar grupos y programas
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            const grupos = await listaGrupos()
            setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
            setAllGroups(grupos || [])
            setFilteredGroups(grupos || [])
            const programas = await listProgramas() || []
            setPrograms([{ id: 0, nombre: "Todos los programas" }, ...programas])
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [])

   // Actualizar líneas cuando cambie el grupo seleccionado
   useEffect(() => {
      if (filters.group.id === 0) {
         const allLines = allGroups.flatMap(g => g.lineasInvestigacion || [])
         const uniqueLines = [
            { id: 0, nombre: "Todas las líneas" },
            ...allLines.filter((l, i, arr) => arr.findIndex(x => x.id === l.id) === i)
         ]
         setLines(uniqueLines)
      } else {
         setLines([
            { id: 0, nombre: "Todas las líneas" },
            ...(filters.group.lineasInvestigacion || [])
         ])
      }
      setFilters(f => ({ ...f, line: { id: 0, nombre: "Todas las líneas" } }))
   }, [filters.group, allGroups])

   // Filtrar grupos
   useEffect(() => {
      let filtered = allGroups
      if (filters.group.id !== 0)
         filtered = filtered.filter(g => g.id === filters.group.id)
      if (filters.program.id !== 0)
         filtered = filtered.filter(g => g.programa?.id === filters.program.id)
      if (filters.line.id !== 0)
         filtered = filtered.filter(g => g.lineasInvestigacion?.some(l => l.id === filters.line.id))
      if (filters.searchInput.trim() !== "") {
         const search = filters.searchInput.toLowerCase()
         filtered = filtered.filter(g =>
            g.nombre?.toLowerCase().includes(search) ||
            g.programa?.nombre?.toLowerCase().includes(search) ||
            (g.lineasInvestigacion || []).some(l => l.nombre?.toLowerCase().includes(search))
         )
      }
      setFilteredGroups(filtered)
   }, [filters, allGroups])

   const clearFilters = () => {
      setFilters({
         group: groups[0],
         program: programs[0],
         line: { id: 0, nombre: "Todas las líneas" },
         searchInput: ""
      })
   }
   const removeFilter = (filterType) => {
      if (filterType === 'group') setFilters(f => ({
         ...f,
         group: groups[0],
         line: { id: 0, nombre: "Todas las líneas" }
      }))
      else if (filterType === 'program') setFilters(f => ({ ...f, program: programs[0] }))
      else if (filterType === 'line') setFilters(f => ({ ...f, line: { id: 0, nombre: "Todas las líneas" } }))
      else if (filterType === 'search') setFilters(f => ({ ...f, searchInput: "" }))
   }

   const hasActiveFilters =
      filters.group?.id !== 0 ||
      filters.program?.id !== 0 ||
      filters.line?.id !== 0 ||
      filters.searchInput.trim() !== ""

   const groupOptions = groups.map(g => ({ id: g.id, value: g.nombre, lineasInvestigacion: g.lineasInvestigacion }))
   const programOptions = programs.map(p => ({ id: p.id, value: p.nombre }))
   const lineOptions = lines.map(l => ({ id: l.id, value: l.nombre }))

   // CRUD Grupo
   const handleCrearGrupo = async (data) => {
      await createGrupo(data)
      setModalGrupo({ open: false, data: null })
      // Recargar grupos
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }
   const handleEditarGrupo = async (data) => {
      console.log("Editando grupo:", data)
      await editGrupo(data, modalGrupo.data.id)
      setModalGrupo({ open: false, data: null })
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }
   const handleEliminarGrupo = async (grupo) => {
      await deleteGrupo(grupo.id)
      setModalEliminarGrupo({ open: false, data: null })
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }

   // CRUD Línea
   const handleCrearLinea = async (data) => {
      await createLinea(data)
      setModalLinea({ open: false, data: null, grupo: null })
      // Recargar grupos
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }
   const handleEditarLinea = async (data) => {
      await editLinea(data, data.id)
      setModalLinea({ open: false, data: null, grupo: null })
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }
   const handleEliminarLinea = async (linea) => {
      await deleteLinea(linea.id)
      setModalEliminarLinea({ open: false, data: null, grupo: null })
      const grupos = await listaGrupos()
      setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...(grupos || [])])
      setAllGroups(grupos || [])
   }

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="space-y-2 ">
            <div className="flex justify-between items-center gap-2">
               <h1 className="font-black text-3xl">Administrar Grupos de Investigación</h1>
               <Boton
                  onClick={() => setModalGrupo({ open: true, data: null })}
                  variant="whitered"
                  customClassName="h-fit w-fit self-end py-2"
               >
                  <Plus size={18} strokeWidth={2.5} />
                  Crear Grupo
               </Boton>
            </div>
            <span className="text-gris-institucional">
               Filtra y administra todos los grupos de investigación registrados en el sistema.
            </span>
         </section>

         <section className="flex justify-between items-center gap-4 w-full">
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({
                  ...f,
                  group: groups.find(g => g.id === opt.id)
               }))}
               options={groupOptions}
               defaultValue={{ id: filters.group.id, value: filters.group.nombre }}
               label="Grupo"
            />
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({
                  ...f,
                  program: programs.find(p => p.id === opt.id)
               }))}
               options={programOptions}
               defaultValue={{ id: filters.program.id, value: filters.program.nombre }}
               label="Programa"
            />
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({
                  ...f,
                  line: { id: opt.id, nombre: opt.value }
               }))}
               options={lineOptions}
               defaultValue={{ id: filters.line.id, value: filters.line.nombre }}
               label="Línea"
            />
            <span className="flex flex-col text-sm w-full gap-1 self-end">
               <h6 className="font-bold">Buscar</h6>
               <input
                  className="outline-none rounded-md border w-full p-2"
                  type="search"
                  value={filters.searchInput}
                  onChange={e => setFilters(f => ({ ...f, searchInput: e.target.value }))}
                  placeholder="Buscar por nombre, programa o línea..."
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
               {filters.group?.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Grupo:</b> {filters.group.nombre}</span>
                     <button
                        onClick={() => removeFilter('group')}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de grupo"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
               {filters.program?.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Programa:</b> {filters.program.nombre}</span>
                     <button
                        onClick={() => removeFilter('program')}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de programa"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
               {filters.line?.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Línea:</b> {filters.line.nombre}</span>
                     <button
                        onClick={() => removeFilter('line')}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de línea"
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
            {loading ? <span>Cargando...</span> :
               filteredGroups && filteredGroups.length !== 0 ?
                  <GroupTable
                     groupList={filteredGroups}
                     onEdit={group => setModalGrupo({ open: true, data: group })}
                     onDelete={group => setModalEliminarGrupo({ open: true, data: group })}
                     onVerLineas={grupo => setModalLineas({ open: true, grupo })}
                  /> :
                  hasActiveFilters ?
                     <span>No se han encontrado grupos con esos filtros</span> :
                     <span>No se han encontrado grupos</span>
            }
         </section>

         {/* Modales Grupo */}
         {modalGrupo.open && (
            <GrupoModal
               isOpen={modalGrupo.open}
               onClose={() => setModalGrupo({ open: false, data: null })}
               onSave={modalGrupo.data ? handleEditarGrupo : handleCrearGrupo}
               initialData={modalGrupo.data}
               programas={programs.filter(p => p.id !== 0)}
            />
         )}
         {modalEliminarGrupo.open && (
            <EliminarGrupoModal
               isOpen={modalEliminarGrupo.open}
               onClose={() => setModalEliminarGrupo({ open: false, data: null })}
               onConfirm={() => handleEliminarGrupo(modalEliminarGrupo.data)}
               grupo={modalEliminarGrupo.data}
            />
         )}

         {/* Modal Ver y administrar líneas */}
         {modalLineas.open && (
            <VerLineasModal
               isOpen={modalLineas.open}
               onClose={() => setModalLineas({ open: false, grupo: null })}
               lineas={modalLineas.grupo.lineasInvestigacion || []}
               grupo={modalLineas.grupo}
               loading={loading}
               onCrearLinea={async (data) => {
                  await handleCrearLinea(data)
                  // Refresca el grupo actual para ver la nueva línea
                  const grupos = await listaGrupos()
                  const grupoActualizado = grupos.find(g => g.id === modalLineas.grupo.id)
                  setModalLineas({ open: true, grupo: grupoActualizado })
               }}
               onEditarLinea={async (data) => {
                  await handleEditarLinea(data)
                  const grupos = await listaGrupos()
                  const grupoActualizado = grupos.find(g => g.id === modalLineas.grupo.id)
                  setModalLineas({ open: true, grupo: grupoActualizado })
               }}
               onEliminarLinea={async (linea) => {
                  await handleEliminarLinea(linea)
                  const grupos = await listaGrupos()
                  const grupoActualizado = grupos.find(g => g.id === modalLineas.grupo.id)
                  setModalLineas({ open: true, grupo: grupoActualizado })
               }}
            />
         )}
      </main>
   )
}