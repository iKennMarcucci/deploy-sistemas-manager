import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Boton from "../../../../components/Boton"

export default function GrupoModal({
  isOpen,
  onClose,
  onSave,
  initialData = {},
  programas = [],
  loading = false
}) {
  const [nombre, setNombre] = useState("")
  const [programaId, setProgramaId] = useState("")

  useEffect(() => {
    setNombre(initialData?.nombre || "")
    setProgramaId(initialData?.programa?.id || "")
  }, [initialData, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nombre || !programaId) return
    const data = {
      nombre,
      programa: { id: Number(programaId) }
    }
    // Si es edición, agrega el id
    if (initialData?.id) data.id = initialData.id
    onSave(data)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-md p-6 w-full max-w-md flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">{initialData?.id ? "Editar Grupo" : "Crear Grupo"}</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <div>
          <label className="font-bold">Nombre del Grupo</label>
          <input
            className="border rounded-md p-2 w-full"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            placeholder="Nombre del grupo"
            autoFocus
          />
        </div>
        <div>
          <label className="font-bold">Programa</label>
          <select
            className="border rounded-md p-2 w-full"
            value={programaId}
            onChange={e => setProgramaId(e.target.value)}
            required
            disabled={!!initialData?.id} // Bloquea el select si es edición
          >
            <option value="">Seleccione un programa</option>
            {programas.map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 justify-end">
          <Boton type="button" variant="borderwhite" onClick={onClose}>Cancelar</Boton>
          <Boton type="submit" variant="whitered" disabled={loading}>
            {initialData?.id ? "Guardar Cambios" : "Crear Grupo"}
          </Boton>
        </div>
      </form>
    </div>
  )
}