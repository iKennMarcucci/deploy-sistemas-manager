import React from 'react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'

const ProjectMenu = ({
  nombre,
  funcion,
  icono,
  opciones,
  openMenu,
  selectedOption,
  handleOptionClick
}) => {
  return (
    <div>
      <button onClick={funcion} className={`${openMenu ? 'text-white bg-rojo-mate' : 'text-black'}
          flex items-center justify-between h-8 w-full px-3 transition-colors duration-300 ease-in-out`}>
        <div className='flex items-center gap-2.5'>
          {icono}
          {nombre}
        </div>
        <motion.span animate={{ rotate: openMenu ? 90 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
          <ChevronRight size={18} />
        </motion.span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: openMenu ? 'auto' : 0,
          opacity: openMenu ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className='border-black/5 bg-black/5 overflow-hidden border-b'
      >
        {opciones.map((opcion, index) =>
          opcion.subopciones ? (
            <div key={index} className='pl-6 '>
              <p className='text-negro-institucional'>{opcion.label}</p>
              {opcion.subopciones.map((sub, subIndex) => (
                <a
                  key={subIndex}
                  href={sub.href}
                  onClick={() => handleOptionClick(sub.label)}
                  className={`block pt-1 pl-4 transition-colors duration-300 ${selectedOption === sub.label
                    ? 'text-rojo-institucional bg-rojo-institucional/20 font-semibold'
                    : 'hover:text-rojo-institucional hover:bg-rojo-institucional/10'
                    }`}
                >
                  {'· ' + sub.label}
                </a>
              ))}
            </div>
          ) : (
            <a
              key={index}
              href={opcion.href}
              onClick={() => handleOptionClick(opcion.label)}
              className={`block pl-10 py-1.5 text-sm transition-colors duration-300 ${selectedOption === opcion.label
                ? 'text-rojo-institucional bg-rojo-institucional/20 font-semibold'
                : 'hover:text-rojo-institucional hover:bg-rojo-institucional/15'
                }`}
            >
              {opcion.label}
            </a>
          )
        )}
      </motion.div>
    </div>
  )
}

ProjectMenu.propTypes = {
  nombre: PropTypes.string.isRequired,
  icono: PropTypes.node.isRequired,
  funcion: PropTypes.func.isRequired,
  opciones: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      subopciones: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string
        })
      )
    })
  ),
  openMenu: PropTypes.bool,
  selectedOption: PropTypes.string,
  handleOptionClick: PropTypes.func.isRequired
}

export default ProjectMenu
