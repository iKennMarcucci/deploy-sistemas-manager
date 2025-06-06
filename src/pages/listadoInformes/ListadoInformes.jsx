import { useState, useEffect, useRef } from "react"
import { PlusIcon } from "lucide-react"
import Boton from "../../components/Boton"
import useInformes from "../../lib/hooks/useInformes"
import { useParams } from "react-router-dom"
import CrearInformeForm from "../../components/proyectos/listado-informes/CrearInformeForm"
import EditarInformeForm from "../../components/proyectos/listado-informes/EditarInformeForm"
import ModalDocumentosEstudiante from "../../components/proyectos/listado-informes/ModalDocumentosEstudiante"
import ModalEntregasInforme from "../../components/proyectos/listado-informes/ModalEntregasInforme"

function formatFecha(fechaStr) {
   const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
   const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
   const fecha = new Date(fechaStr)
   return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} del ${fecha.getFullYear()}`
}

function formatHora(horaStr) {
   // horaStr puede venir como "16:37:59"
   const [hh, mm] = horaStr.split(":")
   return `${hh}:${mm}`
}

export default function ListadoInformes() {
   const { listInformesDocente, createColoquio, editColoquio, listEntregasColoquio, listDocumentosEntregasColoquio } = useInformes()
   const { grupoId } = useParams()

   const [informes, setInformes] = useState([])
   const [loading, setLoading] = useState(true)
   const [openActions, setOpenActions] = useState({})

   const [openModal, setOpenModal] = useState(false)
   const [editModal, setEditModal] = useState({ open: false, informe: null })
   const [modalEntregas, setModalEntregas] = useState({ open: false, entregas: [], informe: null })
   const [modalDocs, setModalDocs] = useState({ open: false, documentos: [], estudiante: null })

   const dropdownRefs = useRef({})

   useEffect(() => {
      const fetchInformes = async () => {
         setLoading(true)
         try {
            const res = await listInformesDocente(grupoId)
            setInformes(res)
         } catch (error) {
            setInformes([])
         } finally {
            setLoading(false)
         }
      }
      fetchInformes()
   }, [grupoId])

   // Elipsis handler
   const toggleActions = (informeId) => {
      setOpenActions(prev => ({
         ...prev,
         [informeId]: !prev[informeId]
      }))
   }

   const handleVerEntregas = async (informe) => {
      const entregas = await listEntregasColoquio(informe.id)
      setModalEntregas({ open: true, entregas, informe })
   }

   const handleVerDocumentos = async (estudiante) => {
      const documentos = await listDocumentosEntregasColoquio(modalEntregas.informe.id, estudiante.id)
      setModalDocs({ open: true, documentos, estudiante })
   }

   const handleCrearInforme = async (data) => {
      await createColoquio(data)
      const res = await listInformesDocente(grupoId)
      setInformes(res)
   }

   const handleEditarInforme = async (id, data) => {
      await editColoquio(data, id)
      const res = await listInformesDocente(grupoId)
      setInformes(res)
   }

   useEffect(() => {
      function handleClickOutside(event) {
         Object.keys(openActions).forEach(informeId => {
            if (
               openActions[informeId] &&
               dropdownRefs.current[informeId] &&
               !dropdownRefs.current[informeId].contains(event.target)
            ) {
               setOpenActions(prev => ({ ...prev, [informeId]: false }))
            }
         })
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [openActions])

   return (
      <>
         <main className="flex flex-col gap-4 h-full">
            <section className="flex justify-between items-center gap-4">
               <h1 className="font-black text-3xl">Informes</h1>
               <Boton variant="borderwhite" customClassName="w-fit" onClick={() => setOpenModal(true)}>
                  <PlusIcon size={20} />
                  Nuevo Informe
               </Boton>
            </section>

            <section className="w-full pb-40">
               <table className="flex flex-col rounded-md border w-full">
                  <thead className="bg-black/5 p-4">
                     <tr className="grid grid-cols-6 gap-2">
                        <th className="col-span-2 text-start">Descripción</th>
                        <th className="col-span-1 text-start">Fecha</th>
                        <th className="col-span-1 text-start">Hora</th>
                        <th className="col-span-1 text-start">Lugar</th>
                        <th className="col-span-1 text-center">Acciones</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     {loading ? (
                        <tr>
                           <td colSpan={6} className="text-center py-8">Cargando...</td>
                        </tr>
                     ) : informes.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="text-center py-8 text-gris-institucional">
                              No hay ningún informe programado.
                           </td>
                        </tr>
                     ) : (
                        informes.map(inf => (
                           <tr key={inf.id} className="grid grid-cols-6 items-center gap-2 p-4 border-b">
                              <td className="col-span-2">{inf.descripcion}</td>
                              <td className="col-span-1">{formatFecha(inf.fecha)}</td>
                              <td className="col-span-1">{formatHora(inf.hora)}</td>
                              <td className="col-span-1">
                                 <a href={inf.lugar} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    Ver enlace
                                 </a>
                              </td>
                              <td
                                 className="relative col-span-1 place-self-center w-full"
                                 ref={el => dropdownRefs.current[inf.id] = el}
                              >
                                 <button
                                    id="custom-ellipsis"
                                    onClick={() => toggleActions(inf.id)}
                                    className="flex justify-center items-center gap-1 p-2 w-full"
                                 >
                                    <span id="dot" />
                                    <span id="dot" />
                                    <span id="dot" />
                                 </button>
                                 {openActions[inf.id] && (
                                    <div className="bg-white whitespace-nowrap border rounded-md absolute z-50 top-[115%] right-0 select-animation flex flex-col">
                                       <button
                                          className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                          onClick={() => {
                                             setOpenActions(prev => ({ ...prev, [inf.id]: false }))
                                             setEditModal({ open: true, informe: inf })
                                          }}
                                       >
                                          Editar informe
                                       </button>

                                       <button
                                          className="hover:bg-gris-claro/50 duration-150 p-2 text-left"
                                          onClick={async () => {
                                             setOpenActions(prev => ({ ...prev, [inf.id]: false }))
                                             await handleVerEntregas(inf)
                                          }}
                                       >
                                          Ver Entregas
                                       </button>
                                    </div>
                                 )}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </section>
            <CrearInformeForm
               isOpen={openModal}
               onClose={() => setOpenModal(false)}
               onSubmit={handleCrearInforme}
               grupoCohorteId={parseInt(grupoId)}
            />

            <EditarInformeForm
               inf={editModal.informe}
               isOpen={editModal.open}
               onClose={() => setEditModal({ open: false, informe: null })}
               onSubmit={handleEditarInforme}
            />

            <ModalEntregasInforme
               open={modalEntregas.open}
               onClose={() => setModalEntregas({ open: false, entregas: [], informe: null })}
               entregas={modalEntregas.entregas}
               onVerDocumentos={handleVerDocumentos}
            />

            <ModalDocumentosEstudiante
               open={modalDocs.open}
               onClose={() => setModalDocs({ open: false, documentos: [], estudiante: null })}
               documentos={modalDocs.documentos}
               estudiante={modalDocs.estudiante}
            />
         </main>
      </>
   )
}