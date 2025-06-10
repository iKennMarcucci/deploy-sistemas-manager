import React from 'react'
import PropTypes from 'prop-types'
import Boton from './Boton'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Spinner
} from '@heroui/react'
import { useState, useEffect } from 'react'

const TablaEstados = ({
  informacion,
  columnas,
  accionesPorEstado, // Este prop reemplaza a "acciones"
  elementosPorPagina,
  filtros,
  campoEstado, // Nombre del campo que contiene el estado
  cargandoContenido // Nuevo prop para controlar el spinner
}) => {
  //-------filtros--------
  const [filtross, setfiltross] = useState({})
  const [page, setPage] = React.useState(1) // Estado de la página actual

  // Esta función actualiza los filtros y reinicia la paginación a la página 1
  const actualizarFiltro = (col, val) => {
    setfiltross((prev) => ({ ...prev, [col]: val }))
    setPage(1) // Resetear a la página 1
  }

  const informacionFiltrada = React.useMemo(() => {
    if (!Array.isArray(filtros) || filtros.length === 0) {
      // Si filtros no es un array o está vacío, retorna todos los datos
      return informacion
    }

    return informacion.filter((item) => {
      return filtros.every((col) => {
        const valorfiltros = filtross[col]?.toLowerCase() || ''
        const valorItem = item[col]?.toLowerCase?.() || ''
        return valorItem.includes(valorfiltros)
      })
    })
  }, [informacion, filtross, filtros])

  //---Fin de filtros-----

  const [itemsPerPage, setItemsPerPage] = useState(
    elementosPorPagina === undefined ? 10 : elementosPorPagina
  )
  const pages = Math.ceil(informacionFiltrada.length / itemsPerPage)

  // Asegurarse de que la página actual no exceda el número total de páginas
  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(pages)
    }
  }, [informacionFiltrada, page, pages])

  const [selectedKeys, setSelectedKeys] = useState(
    new Set([elementosPorPagina === undefined ? 10 : elementosPorPagina])
  )

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(', ').replace(/_/g, ''),
    [selectedKeys]
  )

  // Asegurarse de que cada item tenga un id único
  const items = React.useMemo(() => {
    const start = (page - 1) * itemsPerPage
    const end = start + itemsPerPage

    return informacionFiltrada.slice(start, end).map((item, index) => ({
      ...item,
      id: item.id || `row-${index}`
    }))
  }, [page, informacionFiltrada, itemsPerPage])

  useEffect(() => {
    const firstValue = [...selectedKeys][0]
    setItemsPerPage(firstValue)
    setPage(1) // Reset a página 1 cuando cambia el número de elementos por página
  }, [selectedKeys])

  const allColumns = React.useMemo(() => {
    const cols = [...columnas]
    if (accionesPorEstado) {
      cols.push('Acciones')
    }
    return cols
  }, [columnas, accionesPorEstado])

  // Función modificada para determinar las acciones según el estado
  const renderCell = React.useCallback(
    (item, columnKey) => {
      if (columnKey === 'Acciones' && accionesPorEstado) {
        // Obtener el estado del ítem actual
        const estadoItem = item[campoEstado]

        // Obtener las acciones correspondientes a este estado
        let accionesEstado = []

        // Verificar si hay acciones definidas para este estado
        if (estadoItem !== undefined && accionesPorEstado[estadoItem]) {
          accionesEstado = accionesPorEstado[estadoItem]
        } else if (accionesPorEstado.default) {
          // Si no hay acciones específicas para este estado, usar las acciones predeterminadas
          accionesEstado = accionesPorEstado.default
        }

        return (
          <div className='flex flex-row justify-center space-x-2 w-full'>
            {accionesEstado.map(({ icono, tooltip, accion }, index) => (
              <Tooltip
                key={`tooltip-${index}`}
                content={tooltip}
                placement='bottom'
                showArrow
              >
                <div>
                  <Boton
                    isIconOnly
                    w='32px'
                    h='32px'
                    onClick={() => accion(item)}
                  >
                    {icono}
                  </Boton>
                </div>
              </Tooltip>
            ))}
          </div>
        )
      }
      return getKeyValue(item, columnKey)
    },
    [accionesPorEstado, campoEstado]
  )

  return (
    <>
      {Array.isArray(filtros) && (
        <div className='flex flex-col w-full'>
          <p className='mb-4 text-subtitulos'>Filtros</p>
          <div className='flex gap-4 mb-4 flex-wrap font-semibold text-normal'>
            {filtros.map((col) => (
              <Input
                classNames={{
                  inputWrapper:
                    'border border-gris-institucional rounded-[15px]'
                }}
                label={col}
                labelPlacement='outside'
                key={col}
                placeholder={`Ingresa el ${col.toLowerCase()}`}
                value={filtross[col] || ''}
                onValueChange={(val) => actualizarFiltro(col, val)} // Usar nueva función
                className='max-w-xs'
                isClearable
              />
            ))}
          </div>
        </div>
      )}

      <Table
        aria-label='Tabla con acciones dinámicas por estado'
        removeWrapper
        classNames={{
          th: 'border-b border-gray-200 text-center text-[15px] bg-rojo-institucional text-white',
          td: 'border border-gray-200 text-center',
          tr: '[&:nth-child(odd)]:bg-gris-intermedio [&:nth-child(even)]:bg-gris-claro'
        }}
      >
        <TableHeader>
          {allColumns.map((columna) => (
            <TableColumn key={`header-${columna}`}>{columna}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={'No hay resultados para mostrar'}
        >
          {(item) => (
            <TableRow key={item.id}>
              {allColumns.map((columnKey) => (
                <TableCell key={`${item.id}-${columnKey}`}>
                  {renderCell(item, columnKey)}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {cargandoContenido && (
        <div className='flex justify-center items-center py-8'>
          <Spinner size='lg' color='danger' />
        </div>
      )}
      <div className='relative flex w-full justify-center my-4'>
        <Pagination
          className='absolute left-1/2 transform -translate-x-1/2'
          classNames={{ cursor: 'bg-rojo-institucional text-white' }}
          showControls
          color='danger'
          showShadow
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
        <div className=' absolute left-3/4 flex flex-row space-x-2 items-center ml-4'>
          <p>Elementos por página</p>
          <Dropdown
            showArrow
            classNames={{
              base: 'w-[100px] text-center',
              content: 'min-w-[50] w-[100px]'
            }}
          >
            <DropdownTrigger>
              <Button
                style={{
                  minWidth: '50px',
                  height: '30px'
                }}
                variant='bordered'
              >
                {selectedValue}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label='Single selection example'
              selectedKeys={selectedKeys}
              selectionMode='single'
              variant='flat'
              onSelectionChange={setSelectedKeys}
            >
              <DropdownItem key='5'>5</DropdownItem>
              <DropdownItem key='10'>10</DropdownItem>
              <DropdownItem key='15'>15</DropdownItem>
              <DropdownItem key='20'>20</DropdownItem>
              <DropdownItem key='50'>50</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  )
}

TablaEstados.propTypes = {
  informacion: PropTypes.array.isRequired,
  columnas: PropTypes.array.isRequired,
  accionesPorEstado: PropTypes.object,
  elementosPorPagina: PropTypes.number,
  filtros: PropTypes.array,
  campoEstado: PropTypes.string.isRequired,
  cargandoContenido: PropTypes.bool
}

export default TablaEstados
