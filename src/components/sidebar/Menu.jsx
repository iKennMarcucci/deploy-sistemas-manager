
import { ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { Tooltip } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/hooks/useAuth';

const Menu = ({
  nombre,
  funcion,
  icono,
  opciones,
  openMenu,
  selectedOption,
  handleOptionClick
}) => {

  const navigate = useNavigate();
  const { userRole } = useAuth();

  const isRouteAllowed = (route) => {
    // Para usuarios de Google, solo permitir acceso a Proyectos y grupos de pregrado
    if (userRole === 'ROLE_GOOGLE') {
      return route.startsWith('/estado-proyecto') ||
        route.startsWith('/seguimiento') ||
        route.startsWith('/informes') ||
        route.startsWith('/pregrado/grupos');
    }

    if (!userRole) {
      return route.startsWith('/estado-proyecto') ||
        route.startsWith('/seguimiento') ||
        route.startsWith('/informes');
    }

    if (userRole === 'ROLE_SUPERADMIN') return true;

    if (userRole === 'ROLE_ADMIN') {
      return !route.startsWith('/admin') && !route.startsWith('/crear-admin');
    }

    return route.startsWith('/estado-proyecto') ||
      route.startsWith('/seguimiento') ||
      route.startsWith('/informes');
  };

  const handleNavigate = (href, label, codigo) => {
    if (isRouteAllowed(href)) {
      handleOptionClick(label, codigo);
      navigate(href);
    } else {
      navigate('/estado-proyecto');
    }
  };

  return (
    <div>
      <button
        className={`flex items-center justify-between h-8 w-full p-3 ${openMenu ? 'text-white bg-rojo-mate' : 'text-black'
          } rounded-md transition-colors duration-300 ease-in-out`}
        onClick={funcion}
      >
        {icono}
        <p>{nombre}</p>
        <motion.span
          animate={{ rotate: openMenu ? 90 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
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
        className='overflow-hidden bg-rojo-claro'
      >
        {opciones.map((opcion, index) =>
          opcion.subopciones ? (
            <div key={index} className='pl-6'>
              <p className='text-negro-institucional'>{opcion.label}</p>
              {opcion.subopciones.map((sub, subIndex) => (
                <Tooltip
                  key={`tooltip-${index}-${subIndex}`}
                  content={sub.label}
                  placement='right'
                  closeDelay={1}
                >
                  <a
                    key={subIndex}
                    href={sub.href}
                    onClick={() => handleNavigate(sub.href, sub.label, sub.codigo)} // Pasa el código aquí
                    className={`block pt-1 pl-4 text-negro-institucional rounded-md transition-colors duration-300 ease-in-out truncate max-w-full ${selectedOption === sub.label
                        ? 'text-rojo-institucional bg-rojo-institucional bg-opacity-20 font-semibold'
                        : 'hover:text-rojo-institucional hover:bg-rojo-institucional hover:bg-opacity-10'
                      }`}
                  >
                    {'· ' + sub.label}
                  </a>
                </Tooltip>
              ))}
            </div>
          ) : (
            <Tooltip
              key={`tooltip-${index}`}
              content={opcion.label}
              placement='right'
              closeDelay={1}
            >
              <a
                key={index}
                href={opcion.href}
                onClick={() => handleNavigate(opcion.href, opcion.label)}
                className={`block pt-1 pl-6 text-negro-institucional rounded-md transition-colors duration-300 ease-in-out truncate ${selectedOption === opcion.label
                    ? 'text-rojo-institucional bg-rojo-institucional font-semibold bg-opacity-20'
                    : 'hover:text-rojo-institucional hover:bg-rojo-institucional hover:bg-opacity-10'
                  }`}
              >
                {opcion.label}
              </a>
            </Tooltip>
          )
        )}
      </motion.div>
    </div>
  )
}

Menu.propTypes = {
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
          href: PropTypes.string,
          codigo: PropTypes.string
        })
      )
    })
  ),
  openMenu: PropTypes.bool,
  selectedOption: PropTypes.string,
  handleOptionClick: PropTypes.func.isRequired
}

export default Menu
