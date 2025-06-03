import ProjectTable from "../../components/proyectos/listado-proyectos/ProjectTable"
import CustomSelect from "../../components/CustomSelect"
import useProject from "../../lib/hooks/useProject"
import { useState, useEffect } from "react"
import Boton from "../../components/Boton"
import { Paintbrush } from "lucide-react"
import { X } from "lucide-react"

export default function ListadoProyectos() {
   const { listProjects, listaGrupos } = useProject()

   const [allProjects, setAllProjects] = useState(null)
   const [projects, setProjects] = useState(null)
   const [groups, setGroups] = useState([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }])
   const [lines, setLines] = useState([{ id: 0, nombre: "Todas las líneas" }])
   const [loading, setLoading] = useState(true)

   // Obtener proyectos, grupos y líneas desde el endpoint
   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            // Primero obtener grupos
            const data = await listaGrupos()
            const sortedGroups = [...data].sort((a, b) => a.nombre.localeCompare(b.nombre))
            sortedGroups.forEach(g => {
               g.lineasInvestigacion = (g.lineasInvestigacion || []).sort((a, b) => a.nombre.localeCompare(b.nombre))
            })
            setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }, ...sortedGroups])

            // Luego obtener proyectos
            const list = await listProjects()
            setAllProjects(list)
            setProjects(list)
         } catch (e) {
            setGroups([{ id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] }])
            setAllProjects([])
            setProjects([])
         } finally {
            setLoading(false)
         }
      }
      fetchData()
   }, [])

   // Estado de filtros
   const [filters, setFilters] = useState({
      group: { id: 0, nombre: "Todos los grupos", lineasInvestigacion: [] },
      line: { id: 0, nombre: "Todas las líneas" },
      searchInput: ""
   })

   // Actualizar líneas cuando cambie el grupo seleccionado
   useEffect(() => {
      if (filters.group.id === 0) {
         // Todas las líneas de todos los grupos
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
      // Resetear línea al cambiar grupo
      setFilters(f => ({ ...f, line: { id: 0, nombre: "Todas las líneas" } }))
   }, [filters.group, groups])

   // Aplicar filtros automáticamente cuando cambien
   useEffect(() => {
      if (!allProjects) return
      applyFilters()
   }, [filters, allProjects])

   const applyFilters = () => {
      let filtered = allProjects || []

      // Filtrar por grupo si no es "Todos los grupos"
      if (filters.group.id !== 0) filtered = filtered.filter(p => p.lineaInvestigacion.grupoInvestigacion.id === filters.group.id)

      // Filtrar por línea si no es "Todas las líneas"
      if (filters.line.id !== 0) filtered = filtered.filter(p => p.lineaInvestigacion.id === filters.line.id)

      // Filtrar por texto en nombre de estudiante o título de proyecto
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
   }

   const clearFilters = () => {
      setFilters({
         group: groups[0],
         line: { id: 0, nombre: "Todas las líneas" },
         searchInput: ""
      })
   }

   const removeFilter = (filterType) => {
      if (filterType === 'group') setFilters({ ...filters, group: groups[0], line: { id: 0, nombre: "Todas las líneas" } })
      else if (filterType === 'line') setFilters({ ...filters, line: { id: 0, nombre: "Todas las líneas" } })
      else if (filterType === 'search') setFilters({ ...filters, searchInput: "" })
   }

   // Determinar si hay filtros activos
   const hasActiveFilters =
      filters.group?.id !== 0 ||
      filters.line?.id !== 0 ||
      filters.searchInput.trim() !== ""

   // Opciones para CustomSelect
   const groupOptions = groups.map(g => ({ id: g.id, value: g.nombre, lineasInvestigacion: g.lineasInvestigacion }))
   const lineOptions = lines.map(l => ({ id: l.id, value: l.nombre }))

   return (
      <main className="flex flex-col gap-4 h-full">
         <section className="space-y-2">
            <h1 className="font-black text-3xl">Listado de Proyectos</h1>
            <span className="text-gris-institucional">
               Visualice y filtre los proyectos de los estudiantes por grupo y línea de investigación.
            </span>
         </section>

         <section className="flex justify-between items-center gap-4 w-full">
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={(opt) => setFilters({ ...filters, group: groups.find(g => g.id === opt.id) })}
               options={groupOptions}
               defaultValue={{ id: filters.group.id, value: filters.group.nombre }}
               label="Grupo"
            />
            <CustomSelect
               className="flex justify-between items-center rounded-md border w-full p-2"
               action={(opt) => setFilters({ ...filters, line: { id: opt.id, nombre: opt.value } })}
               options={lineOptions}
               defaultValue={{ id: filters.line.id, value: filters.line.nombre }}
               label="Línea"
            />

            <span className="flex flex-col text-sm w-full gap-1 self-end">
               <h6 className="font-bold">Buscar</h6>
               <input
                  className="flex justify-between items-center outline-none rounded-md border w-full p-2"
                  type="search"
                  value={filters.searchInput}
                  onChange={(e) => setFilters({ ...filters, searchInput: e.target.value })}
                  placeholder="Buscar por nombre o proyecto..."
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

         {/* Sección de filtros activos */}
         {
            hasActiveFilters && (
               <section className="flex flex-wrap gap-2 mt-2 text-sm">
                  {
                     filters.group?.id !== 0 && (
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
                     )
                  }

                  {
                     filters.line?.id !== 0 && (
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
                     )
                  }

                  {
                     filters.searchInput.trim() !== "" && (
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
                     )
                  }
               </section>
            )
         }
         <section>
            {
               loading ? <span>Cargando...</span> :
                  projects && projects.length !== 0 ?
                     <ProjectTable projectList={projects} /> :
                     hasActiveFilters ?
                        <span>No se han encontrado proyectos con esos filtros</span> :
                        <span>No se han encontrado proyectos</span>
            }
         </section>
      </main>
   )
}