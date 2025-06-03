import React from 'react'
import Tabla from '../../components/Tabla'
import { useEffect, useState } from 'react'
import Boton from '../../components/Boton'
import { ArrowLeft } from 'lucide-react'

const Notas = () => {
  const [listaNotas, setListaNotas] = useState([])
  const [grupo, setGrupo] = useState(null)
  const [primerPrevio, setPrimerPrevio] = useState(false) //Primer estado para succes y segundo para disabled
  const [segundoPrevio, setSegundoPrevio] = useState([false, false])
  const [terceroPrevio, setTerceroPrevio] = useState([false, false])
  const [examenFinal, setExamenFinal] = useState([false, false])

  const columnas = ['Código', 'Nombre', '1P', '2P', '3P', 'EX', 'DEF']

  useEffect(() => {
    setGrupo(JSON.parse(localStorage.getItem('grupo')))
    fetch('/estudiantes.json')
      .then((response) => response.json())
      .then((data) => {
        const estudiantes = data.map((estudiante) => ({
          ...estudiante,
          Nombre: `${estudiante.primer_nombre} ${estudiante.segundo_nombre} ${estudiante.primer_apellido} ${estudiante.segundo_apellido}`,
          DEF: `${(((estudiante['1P'] + estudiante['2P'] + estudiante['3P']) / 3) * 0.7 + estudiante.EX * 0.3).toFixed(2)}`
        }))
        setListaNotas(estudiantes)
      })
  }, [])

  const cerrarP1 = () => {
    setPrimerPrevio(true)
    if (!segundoPrevio[1]) {
      setSegundoPrevio([false, true])
    }
  }

  const cerrarP2 = () => {
    setSegundoPrevio([true, true])
    if (!terceroPrevio[1]) {
      setTerceroPrevio([false, true])
    }
  }

  const cerrarP3 = () => {
    setTerceroPrevio([true, true])
    if (!examenFinal[1]) {
      setExamenFinal([false, true])
    }
  }

  const cerrarEX = () => {
    setExamenFinal([true, true])
  }

  return (
    <div className='flex flex-col items-center p-4'>
      <div className='w-full'>
        <button
          className='w-[40px] h-[30px] text-[30px] bg-rojo-mate flex items-center  justify-center rounded-md border border-rojo-mate text-white hover:bg-rojo-oscuro ease-in-out transition-all duration-300'
          onClick={() => window.history.back()}
        >
          <ArrowLeft />
        </button>
      </div>
      <p className='text-titulos'>Información del grupo</p>
      <p className='text-subtitulos'>{grupo?.Nombre}</p>
      <div className='flex flex-row w-full my-8'>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Nombre del docente:</div>
          <div>{grupo?.Docente}</div>
        </div>
        <div className='w-[50%] flex flex-row justify-center space-x-2'>
          <div className='font-semibold'>Número de estudiantes:</div>
          <div>{grupo?.['# Estudiantes']}</div>
        </div>
      </div>
      <p className='text-subtitulos mb-8'>Lista de estudiantes</p>
      <Tabla informacion={listaNotas} columnas={columnas} itemsPorPagina={10} />
      <div className='w-full flex flex-row my-4 justify-end space-x-4'>
        <Boton
          h={'30px'}
          onClick={cerrarP1}
          success={primerPrevio ? true : false}
        >
          Cerrar P1
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarP2}
          disabled={!segundoPrevio[1]}
          success={segundoPrevio[0]}
        >
          Cerrar P2
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarP3}
          disabled={!terceroPrevio[1]}
          success={terceroPrevio[0]}
        >
          Cerrar P3
        </Boton>
        <Boton
          h={'30px'}
          onClick={cerrarEX}
          disabled={!examenFinal[1]}
          success={examenFinal[0]}
        >
          Cerrar EX
        </Boton>
      </div>
    </div>
  )
}

export default Notas
