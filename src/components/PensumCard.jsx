const PensumCard = ({ titulo, codigo, nombre, creditos, semestre, color }) => {
  return (
    <>
      {titulo && (
        <div className='w-[200px] min-h-[100px] bg-gris-claro rounded-lg shadow-md flex justify-center items-center'>
          <p className='text-normal'>{titulo}</p>
        </div>
      )}
      {!titulo && (
        <div
          className='flex flex-col text-center justify-center items-center w-[250px] min-h-[100px] rounded-lg shadow-md p-4'
          style={{ backgroundColor: color }}
        >
          <p className='text-[15px] font-bold text-[#1E40B7]'>{codigo}</p>
          <p className='text-[15px] text-center font-bold text-[#1E40B7]'>
            {nombre}
          </p>
          <p className='text-[15px] font-bold text-[#1E40B7]'>
            {'Créditos:' + creditos}
          </p>
          <p className='text-[15px] font-bold text-[#1E40B7]'>{semestre}</p>
        </div>
      )}
    </>
  )
}
export default PensumCard
