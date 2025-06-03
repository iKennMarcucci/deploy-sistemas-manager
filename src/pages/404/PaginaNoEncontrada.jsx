import Boton from '../../components/Boton'
const PaginaNoEncontrada = () => {
  return (
    <div className='flex flex-col items-center w-full justify-center h-screen bg-gray-100'>
      <img src={'/images/404.png'} alt='404 Not Found' className='h-1/2 mb-4' />
      <h1 className='text-titulos font-bold text-negro-institucional'>
        Página No Encontrada
      </h1>
      <p className='mt-2 mb-4 text-subtitulos text-negro-institucional'>
        Lo sentimos, la página que buscas no existe.
      </p>
      <Boton onClick={() => window.history.back()}>
        <p className='text-subtitulos font-semibold'>Volver</p>
      </Boton>
    </div>
  )
}
export default PaginaNoEncontrada
