import { useEffect, useState } from 'react'
import PensumCard from '../../../../components/PensumCard'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'

const PensumEstudiante = () => {
  const { id } = useParams()
  const [pensum, setPensum] = useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetch(`${backendUrl}/matriculas/pensum/estudiante/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPensum(data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }, [])

  return (
    <div className='p-4 flex flex-col w-full items-center gap-4'>
      {pensum.length > 0 && (
        <>
          <div className='w-full flex flex-row justify-between'>
            <button
              className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
              onClick={() => window.history.back()}
            >
              <ArrowLeft />
            </button>
            <p className='text-titulos'>{`Estado del pensum académico`}</p>
            <div className='w-[40px]'></div>
          </div>

          <p className='text-subtitulos'>{`${pensum[0]?.pensumNombre}`}</p>

          <div className='min-w-full flex flex-col'>
            {pensum.map((semestre) => (
              <div
                key={semestre.semestrePensum}
                className='flex flex-row items-center gap-4 my-2'
              >
                <div className='flex flex-row gap-4'>
                  <PensumCard titulo={`Semestre ` + semestre.semestrePensum} />
                  {semestre.materias.map((materia) => (
                    <PensumCard
                      key={materia.codigo}
                      codigo={materia.codigo}
                      nombre={materia.nombre}
                      creditos={materia.creditos}
                      semestre={materia.semestreAprobado}
                      color={materia.colorCard}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-row space-x-2 mt-4'>
            <div
              className='text-normal text-[#1E40B7] p-2 rounded-lg font-semibold'
              style={{ backgroundColor: '#BC001766' }}
            >
              Materia no matriculada
            </div>
            <div
              className='text-normal text-[#1E40B7] p-2 rounded-lg font-semibold'
              style={{ backgroundColor: '#F5A52466' }}
            >
              Materia en curso
            </div>
            <div
              className='text-normal text-[#1E40B7] p-2 rounded-lg font-semibold'
              style={{ backgroundColor: '#17C96466' }}
            >
              Materia aprobada
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PensumEstudiante
