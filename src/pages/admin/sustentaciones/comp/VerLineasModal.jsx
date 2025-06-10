import { useState } from "react"
import { X, Pencil, Trash2, Plus } from "lucide-react"
import Boton from "../../../../components/Boton"
import LineaModal from "./LineaModal"
import EliminarLineaModal from "./EliminarLineaModal"

export default function VerLineasModal({
  isOpen,
  onClose,
  lineas = [],
  grupo,
  onCrearLinea,
  onEditarLinea,
  onEliminarLinea,
  loading = false
}) {
  const [modalCrear, setModalCrear] = useState(false)
  const [modalEditar, setModalEditar] = useState(null)
  const [modalEliminar, setModalEliminar] = useState(null)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-lg flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Líneas de {grupo?.nombre}</h2>
          <button type="button" onClick={onClose}><X /></button>
        </div>
        <div className="flex justify-end">
          <Boton variant="borderwhite" onClick={() => setModalCrear(true)}>
            <Plus size={16} /> Nueva Línea
          </Boton>
        </div>
        <ul className="divide-y">
          {lineas.length === 0 && <li className="py-2 text-gray-500">No hay líneas registradas.</li>}
          {lineas.map(linea => (
            <li key={linea.id} className="flex justify-between items-center py-2">
              <span>{linea.nombre}</span>
              <div className="flex gap-2">
                <Boton variant="borderwhite" onClick={() => setModalEditar(linea)} title="Editar">
                  <Pencil size={16} />
                </Boton>
                <Boton variant="borderwhite" onClick={() => setModalEliminar(linea)} title="Eliminar">
                  <Trash2 size={16} />
                </Boton>
              </div>
            </li>
          ))}
        </ul>
        {/* Modales internos */}
        {modalCrear && (
          <LineaModal
            isOpen={modalCrear}
            onClose={() => setModalCrear(false)}
            onSave={async (data) => {
              await onCrearLinea(data)
              setModalCrear(false)
            }}
            grupo={grupo}
            loading={loading}
          />
        )}
        {modalEditar && (
          <LineaModal
            isOpen={!!modalEditar}
            onClose={() => setModalEditar(null)}
            onSave={async (data) => {
              await onEditarLinea({ ...modalEditar, ...data })
              setModalEditar(null)
            }}
            initialData={modalEditar}
            grupo={grupo}
            loading={loading}
          />
        )}
        {modalEliminar && (
          <EliminarLineaModal
            isOpen={!!modalEliminar}
            onClose={() => setModalEliminar(null)}
            onConfirm={async () => {
              await onEliminarLinea(modalEliminar)
              setModalEliminar(null)
            }}
            linea={modalEliminar}
            loading={loading}
          />
        )}
      </div>
    </div>
  )
}