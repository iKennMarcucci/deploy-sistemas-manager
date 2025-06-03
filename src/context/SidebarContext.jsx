import React, { createContext, useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

const SidebarContext = createContext()

export const SidebarProvider = ({ children }) => {
  // Obtener valores de localStorage o establecer valores por defecto
  const storedSidebarState =
    JSON.parse(localStorage.getItem('sidebarState')) || {}

  const [selectedMenu, setSelectedMenu] = useState(
    storedSidebarState.selectedMenu ?? 1
  )
  const [selectedOption, setSelectedOption] = useState(
    storedSidebarState.selectedOption ?? 'Programas'
  )

  const [selectedCodigo, setSelectedCodigo] = useState(
    storedSidebarState.selectedCodigo ?? ''
  )

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    localStorage.setItem(
      'sidebarState',
      JSON.stringify({ selectedMenu, selectedOption, selectedCodigo }) // Incluye selectedCodigo aquí
    )
  }, [selectedMenu, selectedOption, selectedCodigo]) // Asegúrate de que selectedCodigo sea una dependencia
  return (
    <SidebarContext.Provider
      value={{
        selectedMenu,
        setSelectedMenu,
        selectedOption,
        setSelectedOption,
        selectedCodigo,
        setSelectedCodigo
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

SidebarProvider.propTypes = {
  children: PropTypes.node.isRequired
}

export const useSidebar = () => {
  return useContext(SidebarContext)
}
