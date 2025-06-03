import { useState, useEffect } from 'react';

export default function useProyectoFlag(key = 'proyecto_is_finished') {
   // Lectura lazy: solo al inicializar el estado
   const [flag, setFlag] = useState(() => {
      const stored = localStorage.getItem(key)
      return stored === 'true'        // default false si no existe
   });

   // Cada vez que flag cambie, lo guardamos
   useEffect(() => {
      localStorage.setItem(key, flag)
   }, [key, flag])                  // sync automático con localStorage :contentReference[oaicite:2]{index=2}

   // Función para alternar
   const toggle = () => setFlag(prev => !prev)

   return [flag, toggle]
}
