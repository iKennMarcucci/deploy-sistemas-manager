export default function ResumenTab() {
   return (
      <div className="flex gap-4">
         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 w-full">
            <h5 className="text-black font-bold text-2xl">Resumen del Proyecto</h5>
            <p>
               Visión general de la investigación realizada
            </p>
            <div className="mt-4 flex flex-col gap-4 text-sm">
               <p>
                  Este proyecto de investigación aborda la problemática del uso eficiente
                  de recursos hídricos en entornos urbanos mediante la implementación de
                  un sistema de monitoreo inteligente basado en Internet de las Cosas (IoT).
               </p>
               <p>
                  La investigación se centró en el diseño, desarrollo e implementación de
                  una red de sensores que permite la recolección de datos en tiempo real
                  sobre las condiciones del suelo, clima y consumo de agua en cultivos urbanos.
                  Estos datos son procesados mediante algoritmos de aprendizaje automático para
                  optimizar el riego y reducir el desperdicio de agua.
               </p>
               <p>
                  Los resultados demuestran una reducción del 37% en el consumo de agua y
                  un aumento del 22% en la productividad de los cultivos monitoreados. El
                  sistema desarrollado representa una solución escalable y de bajo costo que
                  puede ser implementada en diversos contextos urbanos, contribuyendo
                  significativamente a la sostenibilidad ambiental y la seguridad alimentaria
                  en entornos urbanos.
               </p>
            </div>
         </div>

         <div className="border-gris-claro text-gris-institucional border rounded-md p-4 max-w-[33%]">
            <h5 className="text-black font-bold text-2xl">Resultados Clave</h5>
            <p>Logos principales del proyecto</p>
            <ul className="mt-4 flex flex-col gap-4 text-sm">
               <li className="text-black flex gap-2">
                  <span className="bg-rojo-mate text-white rounded-full flex justify-center items-center font-bold text-xs p-2 w-5 h-5">
                     1
                  </span>
                  <p>
                     Reducción del 37% en el consumo de agua
                  </p>
               </li>
               <li className="text-black flex gap-2">
                  <span className="bg-rojo-mate text-white rounded-full flex justify-center items-center font-bold text-xs p-2 w-5 h-5">
                     2
                  </span>
                  <p>
                     Aumento del 22% en la productividad de cultivos
                  </p>
               </li>
               <li className="text-black flex gap-2">
                  <span className="bg-rojo-mate text-white rounded-full flex justify-center items-center font-bold text-xs p-2 w-5 h-5">
                     1
                  </span>
                  <p>
                     Desarrollo de algoritmos predictivos con 89% de precisión
                  </p>
               </li>
               <li className="text-black flex gap-2">
                  <span className="bg-rojo-mate text-white rounded-full flex justify-center items-center font-bold text-xs p-2 w-5 h-5">
                     1
                  </span>
                  <p>
                     Implementación exitosa en 5 huertos urbanos comunitarios
                  </p>
               </li>
            </ul>
         </div>
      </div>
   )
}