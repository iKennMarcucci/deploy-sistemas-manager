import React from 'react'
import { ChevronDown, Upload, Plus, X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import Boton from './Boton'

export default function LabelInput({
  id,
  label,
  typeInput,
  fileExtension,
  placeholder,
  isRequired,
  hasSubmitButton = false,
  optionsSelect = []
}) {
  const [inputValue, setInputValue] = useState('')
  const [items, setItems] = useState([])

  const firstRef = useRef(null)
  const [isFirstOpen, setIsFirstOpen] = useState(false)
  const [firstValue, setFirstValue] = useState({
    nombre: 'Seleccione un grupo de investigación'
  })

  const secondRef = useRef(null)
  const [isSecondOpen, setIsSecondOpen] = useState(false)
  const [secondValue, setSecondValue] = useState({
    nombre: 'Primero seleccione un grupo de investigación'
  })

  const directorRef = useRef(null)
  const [isDirectorOpen, setIsDirectorOpen] = useState(false)
  const [directorValue, setDirectorValue] = useState({
    nombre: 'Seleccione un director (Opcional)'
  })

  const codirectorRef = useRef(null)
  const [isCodirectorOpen, setIsCodirectorOpen] = useState(false)
  const [codirectorValue, setCodirectorValue] = useState({
    nombre: 'Seleccione un codirector (Opcional)'
  })

  const [fileInfo, setFileInfo] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        firstRef.current &&
        !firstRef.current.contains(event.target) &&
        secondRef.current &&
        !secondRef.current.contains(event.target)
      ) {
        setIsFirstOpen(false)
        setIsSecondOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        directorRef.current &&
        !directorRef.current.contains(event.target) &&
        codirectorRef.current &&
        !codirectorRef.current.contains(event.target)
      ) {
        setIsDirectorOpen(false)
        setIsCodirectorOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddItem = () => {
    if (inputValue.trim() !== '') {
      setItems([...items, inputValue])
      setInputValue('')
    }
  }

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      updateFileInfo(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files[0]
    if (file) {
      updateFileInfo(file)
    }
  }

  const updateFileInfo = (file) => {
    const fileSize = (file.size / 1024).toFixed(2) // Convertir a KB
    setFileInfo(`${file.name} (${fileSize} KB)`)
  }

  const filteredDirectores = optionsSelect.filter(
    (d) => d.nombre !== codirectorValue?.nombre
  )

  const filteredCodirectores = optionsSelect.filter(
    (d) => d.nombre !== directorValue?.nombre
  )

  return (
    <div className='flex flex-col gap-2 w-full'>
      <label className='font-bold'>{label}</label>
      {typeInput == 'text' ? (
        <input
          className='border-gris-claro border rounded-md p-2.5 w-full'
          placeholder={placeholder}
          required={isRequired}
          type={typeInput}
        />
      ) : typeInput == 'textarea' ? (
        <textarea
          className='border-gris-claro border rounded-md p-2.5 custom-textarea resize-none w-full max-h-28'
          placeholder={placeholder}
          required={isRequired}
          type={typeInput}
        />
      ) : typeInput == 'adder' ? (
        <>
          <div className='flex gap-2'>
            <input
              className='border-gris-claro border rounded-md p-2.5 w-full'
              placeholder={placeholder}
              type='text'
              value={inputValue}
              required={items.length === 0}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              type='button'
              className='border-azul bg-azul-claro border aspect-square rounded-md flex justify-center items-center p-2.5'
              onClick={handleAddItem}
            >
              <Plus size={20} className='stroke-azul' />
            </button>
          </div>

          {items.map((item, index) => (
            <div
              key={index}
              className='border-gris-claro border rounded-md p-2.5 flex gap-2'
            >
              <div className='border-gris-claro bg-gris-claro/25 border rounded-md p-2.5 w-full'>
                {item}
              </div>
              <button
                type='button'
                className='border-gris-claro bg-rojo-institucional border aspect-square rounded-md flex justify-center items-center p-2.5'
                onClick={() => handleRemoveItem(index)}
              >
                <X size={20} stroke='#fff' />
              </button>
            </div>
          ))}
        </>
      ) : typeInput == 'file' ? (
        <>
          <label
            htmlFor={id}
            className={`border-dashed rounded-md w-full p-4 border cursor-pointer flex flex-col justify-center items-center gap-4 py-8 transition-colors 
                        duration-150 ${isDragging ? 'bg-azul-claro border-azul text-azul' : 'bg-gris-claro/15 border-gris-claro text-gris-institucional'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload size={24} />
            <h6 className='text-sm'>
              {
                isDragging
                  ? 'Suelta el archivo aquí'
                  : fileInfo
                    ? fileInfo
                    : 'Haga clic para cargar o arrastre y suelte'
              }
            </h6>

            {
              hasSubmitButton && fileInfo &&
              <span className='flex items-center gap-2'>
                <Boton type={"submit"} variant={'borderwhite'}>
                  Enviar Archivo
                </Boton>
              </span>
            }
          </label>
          <input
            id={id}
            type='file'
            accept={fileExtension}
            className='hidden'
            onChange={handleFileChange}
          />
        </>
      ) : typeInput == 'group-select' ? (
        <div className='flex gap-5 w-full'>
          {/* Primer dropdown */}
          <button
            ref={firstRef}
            type='button'
            className='border-gris-claro text-start border rounded-md p-2.5 w-full cursor-pointer select-none relative flex justify-between items-center'
            onClick={() => setIsFirstOpen(!isFirstOpen)}
          >
            {firstValue.nombre}
            <ChevronDown
              size={18}
              className={`${isFirstOpen && '-rotate-180'} duration-150`}
            />
            {isFirstOpen && (
              <span className='border-gris-claro bg-white left-0 top-12 border rounded-md w-full cursor-pointer absolute flex flex-col max-h-40 overflow-y-auto'>
                {optionsSelect.map((grupo, i) => (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setFirstValue(grupo)
                      setSecondValue(grupo.linea[0])
                      setIsFirstOpen(false)
                    }}
                    className='hover:bg-gris-claro/25 text-start p-2.5'
                  >
                    {grupo.nombre}
                  </button>
                ))}
              </span>
            )}
          </button>

          {/* Segundo dropdown */}
          <button
            ref={secondRef}
            type='button'
            className='border-gris-claro text-start border rounded-md p-2.5 w-full cursor-pointer select-none relative flex justify-between items-center'
            onClick={() => setIsSecondOpen(!isSecondOpen)}
          >
            {secondValue.nombre}
            <ChevronDown
              size={18}
              className={`${isSecondOpen && '-rotate-180'} duration-150 ${!firstValue.linea && 'hidden'}`}
            />
            {isSecondOpen && firstValue.linea && (
              <span className='border-gris-claro bg-white left-0 top-12 border rounded-md w-full cursor-pointer absolute flex flex-col max-h-40 overflow-y-auto'>
                {firstValue.linea.map((linea, i) => (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setSecondValue(linea)
                      setIsSecondOpen(false)
                    }}
                    className='hover:bg-gris-claro/25 text-start p-2.5'
                  >
                    {linea.nombre}
                  </button>
                ))}
              </span>
            )}
          </button>
        </div>
      ) : typeInput == 'director-select' && (
        <div className='flex gap-5 w-full'>
          {/* Primer dropdown (Director) */}
          <button
            ref={directorRef}
            type='button'
            className='border-gris-claro text-start border rounded-md p-2.5 w-full cursor-pointer select-none relative flex justify-between items-center'
            onClick={() => setIsDirectorOpen(!isDirectorOpen)}
          >
            {`${directorValue.nombre !== 'Seleccione un director (Opcional)' ? 'Director: ' : ''}${directorValue.nombre}`}
            <ChevronDown
              size={18}
              className={`${isDirectorOpen ? '-rotate-180' : ''} duration-150`}
            />
            {isDirectorOpen && (
              <span className='border-gris-claro bg-white left-0 top-12 border rounded-md w-full cursor-pointer absolute flex flex-col max-h-40 overflow-y-auto'>
                {filteredDirectores.map((person, i) => (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setDirectorValue(person)
                      setIsDirectorOpen(false)
                    }}
                    className='hover:bg-gris-claro/25 text-start p-2.5'
                  >
                    {person.nombre}
                  </button>
                ))}
              </span>
            )}
          </button>

          {/* Segundo dropdown (Codirector) */}
          <button
            ref={codirectorRef}
            type='button'
            className='border-gris-claro text-start border rounded-md p-2.5 w-full cursor-pointer select-none relative flex justify-between items-center'
            onClick={() => setIsCodirectorOpen(!isCodirectorOpen)}
          >
            {`${codirectorValue.nombre !== 'Seleccione un codirector (Opcional)' ? 'Codirector: ' : ''}${codirectorValue.nombre}`}
            <ChevronDown
              size={18}
              className={`${isCodirectorOpen ? '-rotate-180' : ''} duration-150`}
            />
            {isCodirectorOpen && (
              <span className='border-gris-claro bg-white left-0 top-12 border rounded-md w-full cursor-pointer absolute flex flex-col max-h-40 overflow-y-auto'>
                {filteredCodirectores.map((person, i) => (
                  <button
                    key={i}
                    type='button'
                    onClick={() => {
                      setCodirectorValue(person)
                      setIsCodirectorOpen(false)
                    }}
                    className='hover:bg-gris-claro/25 text-start p-2.5'
                  >
                    {person.nombre}
                  </button>
                ))}
              </span>
            )}
          </button>
        </div>
      )
      }
    </div >
  )
}
