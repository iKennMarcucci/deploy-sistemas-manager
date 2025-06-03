import { useEffect, useState, useId, useRef } from "react"
import { ChevronDown } from "lucide-react"

export default function CustomSelect({ label, defaultValue, options, className, action }) {
   const [isOpen, setIsOpen] = useState(false)
   const wrapperRef = useRef(null)
   const id = useId()

   useEffect(() => {
      function handleClickOutside(event) { if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setIsOpen(false) }
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
   }, [wrapperRef])

   return (
      <span ref={wrapperRef} className="flex flex-col relative text-sm w-full gap-1">
         {label && <h6 className="font-bold">{label}</h6>}
         <button type="button" id={id} className={`${className} select-none`}
            onClick={() => setIsOpen(!isOpen)}>
            {defaultValue.value || "Seleccione una opción"}
            <ChevronDown size={18} className={`${isOpen ? "-rotate-180" : "rotate-0"} duration-150`} />
         </button>
         {
            isOpen &&
            <div className={`bg-white absolute top-[110%] left-0 z-10 max-h-28 overflow-hidden overflow-y-auto rounded-md border w-full select-animation flex flex-col select-none`}>
               {
                  options && options.map(option =>
                     <button key={option.id} className={`${option.id === defaultValue.id ? "bg-black/5" : "hover:bg-black/5"} flex gap-2 p-2`}
                        onClick={() => { action(option), setIsOpen(false) }} >
                        <span className={`font-black ${option.id === defaultValue.id ? "opacity-100" : "opacity-0"}`}>✓</span>
                        {option.value}
                     </button>
                  )
               }
            </div>
         }
      </span>
   )
}