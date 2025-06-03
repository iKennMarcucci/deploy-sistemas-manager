import useAdmin from "../../../lib/hooks/useAdmin"
import CustomSelect from "../../../components/CustomSelect"
import { useState, useEffect } from "react"
import ProjectTable from "../../../components/proyectos/listado-proyectos/ProjectTable"
import Boton from "../../../components/Boton"
import { Paintbrush, X } from "lucide-react"
import { Plus } from "lucide-react"
import CrearProyectoModal from "../../../components/admin/CrearProyectoModal"

export default function AdminProyectos() {
   const { obtenerProyectos, obtenerGrupos } = useAdmin()

   const [groups, setGroups] = useState([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }])
   const [modalCrear, setModalCrear] = useState(false)
   const [docentes, setDocentes] = useState([])
   const [lines, setLines] = useState([{ id: 0, nombre: "Todas las líneas" }])
   const [filters, setFilters] = useState({
      group: { id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] },
      line: { id: 0, value: "Todas las líneas" },
      searchInput: "",
      phase: 0
   })

   const phaseOptions = [
      { id: 0, value: "Todas las fases" },
      ...Array.from({ length: 9 }, (_, i) => ({ id: i + 1, value: `Fase ${i + 1}` }))
   ]

   const [allProjects, setAllProjects] = useState([])
   const [projects, setProjects] = useState([])
   const [loading, setLoading] = useState(true)

   // Cargar grupos, proyectos y docentes
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            // Proyectos
            const list = await obtenerProyectos({})
            setAllProjects(list || [])
            setProjects(list || [])

            // Grupos
            const grupazos = await obtenerGrupos()
            if (grupazos) { setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...grupazos]) }

         } catch (e) {
            setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }])
            setAllProjects([])
            setProjects([])
            setDocentes([])
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [])

   // Actualizar líneas cuando cambie el grupo seleccionado
   useEffect(() => {
      if (filters.group.id === 0) {
         const allLines = groups.flatMap(g => g.lineasInvestigacion || [])
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
      setFilters(f => ({ ...f, line: { id: 0, value: "Todas las líneas" } }))
   }, [filters.group, groups])

   // Nuevo useEffect para obtener proyectos según grupo y línea
   useEffect(() => {
      const fetchFilteredProjects = async () => {
         setLoading(true)
         try {
            const params = {}
            if (filters.group.id !== 0) params.grupoId = filters.group.id
            if (filters.line.id !== 0) params.lineaId = filters.line.id
            const list = await obtenerProyectos(params)
            setAllProjects(list || [])
            setProjects(list || [])
         } catch (e) {
            setAllProjects([])
            setProjects([])
         } finally {
            setLoading(false)
         }
      }
      // Solo llamar si ya se cargaron los grupos (para evitar llamada inicial doble)
      if (groups.length > 0) {
         fetchFilteredProjects()
      }
   }, [filters.group.id, filters.line.id])

   // Aplicar filtros en frontend
   useEffect(() => {
      if (!allProjects) return
      let filtered = allProjects

      // Grupo
      if (filters.group.id !== 0)
         filtered = filtered.filter(p => p.lineaInvestigacion?.grupoInvestigacion?.id === filters.group.id)
      // Línea
      if (filters.line.id !== 0)
         filtered = filtered.filter(p => p.lineaInvestigacion?.id === filters.line.id)
      // Fase
      if (filters.phase !== 0)
         filtered = filtered.filter(p => p.estadoActual === filters.phase)
      // Búsqueda
      if (filters.searchInput.trim() !== "") {
         const search = filters.searchInput.toLowerCase()
         filtered = filtered.filter(p => {
            const estudiantes = (p.usuariosAsignados || []).filter(
               u => u.rol && u.rol.nombre.toLowerCase() === "estudiante"
            )
            const matchEstudiante = estudiantes.some(
               est => est.nombreUsuario && est.nombreUsuario.toLowerCase().includes(search)
            )
            const matchTitulo = p.titulo && p.titulo.toLowerCase().includes(search)
            return matchEstudiante || matchTitulo
         })
      }
      setProjects(filtered)
   }, [filters, allProjects])

   // Limpiar filtros
   const clearFilters = () => {
      setFilters({
         group: groups[0],
         line: { id: 0, value: "Todas las líneas" },
         searchInput: "",
         phase: 0 // <-- Asegúrate de reiniciar la fase
      })
   }
   const removeFilter = (filterType) => {
      if (filterType === 'group') setFilters(f => ({
         ...f,
         group: groups[0],
         line: { id: 0, value: "Todas las líneas" }
      }))
      else if (filterType === 'line') setFilters(f => ({ ...f, line: { id: 0, value: "Todas las líneas" } }))
      else if (filterType === 'search') setFilters(f => ({ ...f, searchInput: "" }))
      else if (filterType === 'phase') setFilters(f => ({ ...f, phase: 0 }))
   }

   const hasActiveFilters =
      filters.group?.id !== 0 ||
      filters.line?.id !== 0 ||
      filters.searchInput.trim() !== "" ||
      filters.phase !== 0

   const groupOptions = groups.map(g => ({ id: g.id, value: g.nombre, lineasInvestigacion: g.lineasInvestigacion }))
   const lineOptions = lines.map(l => ({ id: l.id, value: l.nombre }))

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="space-y-2 ">
            <div className="flex justify-between items-center gap-2">
               <h1 className="font-black text-3xl">Administrar Proyectos</h1>
               <Boton
                  onClick={() => setModalCrear(true)}
                  variant="whitered"
                  customClassName="h-fit w-fit self-end py-2"
               >
                  <Plus size={18} strokeWidth={2.5} />
                  Crear Proyecto
               </Boton>
            </div>
            <span className="text-gris-institucional">
               Filtra y administra todos los proyectos registrados en el sistema.
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
                  line: { id: opt.id, value: opt.value }
               }))}
               options={lineOptions}
               defaultValue={{ id: filters.line.id, value: filters.line.value }}
               label="Línea"
            />
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={opt => setFilters(f => ({
                  ...f,
                  phase: opt.id
               }))}
               options={phaseOptions}
               defaultValue={{ id: filters.phase, value: phaseOptions.find(p => p.id === filters.phase)?.value }}
               label="Fase"
            />
            <span className="flex flex-col text-sm w-full gap-1 self-end">
               <h6 className="font-bold">Buscar</h6>
               <input
                  className="outline-none rounded-md border w-full p-2"
                  type="search"
                  value={filters.searchInput}
                  onChange={e => setFilters(f => ({ ...f, searchInput: e.target.value }))}
                  placeholder="Buscar por nombre o estudiante..."
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
               {filters.line?.id !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Línea:</b> {filters.line.value}</span>
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
               {filters.phase !== 0 && (
                  <div className="bg-rojo-claro text-rojo-institucional border-rojo-institucional border flex items-center gap-2 px-3 py-1 rounded-md">
                     <span><b>Fase:</b> {filters.phase}</span>
                     <button
                        onClick={() => removeFilter('phase')}
                        className="hover:bg-rojo-institucional hover:text-white duration-150 rounded-full p-1"
                        aria-label="Eliminar filtro de fase"
                     >
                        <X size={16} />
                     </button>
                  </div>
               )}
            </section>
         )}

         <section>
            {loading ? <span>Cargando...</span> :
               projects && projects.length !== 0 ?
                  <ProjectTable projectList={projects} /> :
                  hasActiveFilters ?
                     <span>No se han encontrado proyectos con esos filtros</span> :
                     <span>No se han encontrado proyectos</span>
            }
         </section>

         {modalCrear && (
            <CrearProyectoModal
               isOpen={setModalCrear}
               onCreated={() => setModalCrear(false)}
            />
         )}
      </main>
   )
}