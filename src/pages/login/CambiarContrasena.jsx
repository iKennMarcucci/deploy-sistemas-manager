import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Input } from '@heroui/react'
import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import Boton from '../../components/Boton'
import AlertaModal from '../../components/AlertaModal'

const CambiarContrasena = () => {
    const [nuevaPassword, setNuevaPassword] = useState('')
    const [nuevaPassword2, setNuevaPassword2] = useState('')
    const [token, setToken] = useState('')
    const [loading, setLoading] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [visible2, setVisible2] = useState(false)

    // Estados para el AlertaModal
    const [alertaOpen, setAlertaOpen] = useState(false)
    const [alertaMensaje, setAlertaMensaje] = useState('')
    const [alertaTitulo, setAlertaTitulo] = useState('')
    const [alertaTipo, setAlertaTipo] = useState('error')

    const navigate = useNavigate()
    const location = useLocation()
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        // Obtener el token de la URL
        const params = new URLSearchParams(location.search)
        const tokenFromUrl = params.get('token')

        if (!tokenFromUrl) {
            mostrarAlerta('No se proporcionó un token válido en la URL', 'Error de validación', 'error')
            // Redirigir después de 3 segundos
            setTimeout(() => {
                navigate('/login-admin')
            }, 3000)
        } else {
            setToken(tokenFromUrl)
        }
    }, [location, navigate])

    const mostrarAlerta = (mensaje, titulo = 'Alerta', tipo = 'error') => {
        setAlertaMensaje(mensaje)
        setAlertaTitulo(titulo)
        setAlertaTipo(tipo)
        setAlertaOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!nuevaPassword || !nuevaPassword2) {
            mostrarAlerta('Debe completar todos los campos', 'Error de validación')
            return
        }

        if (nuevaPassword !== nuevaPassword2) {
            mostrarAlerta('Las contraseñas no coinciden', 'Error de validación')
            return
        }

        setLoading(true)

        try {
            const response = await fetch(`${backendUrl}/auth/cambiar-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    nuevaPassword,
                    nuevaPassword2
                })
            })

            const responseData = await response.json()

            if (!response.ok) {
                throw new Error(responseData.message || responseData.mensaje || 'Error al cambiar la contraseña')
            }

            // Mostrar mensaje de éxito
            mostrarAlerta(
                responseData.message || 'Contraseña actualizada exitosamente',
                'Cambio de contraseña',
                'success'
            )

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login-admin')
            }, 3000)

        } catch (error) {
            mostrarAlerta(error.message || 'Error al cambiar la contraseña', 'Error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex items-center justify-center h-screen w-full bg-gris-intermedio'>
            <div className='w-1/2 bg-blanco rounded-[15px] flex flex-col items-center p-8'>
                <p className='text-titulos text-rojo-institucional mb-4'>Cambiar Contraseña</p>

                <form onSubmit={handleSubmit} className='flex flex-col w-full items-center my-4 space-y-8'>
                    <Input
                        classNames={{
                            base: 'w-3/5',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full'
                        }}
                        isRequired
                        label='Nueva contraseña'
                        labelPlacement='outside'
                        value={nuevaPassword}
                        onValueChange={setNuevaPassword}
                        endContent={
                            <button
                                type='button'
                                className='focus:outline-none'
                                onClick={() => setVisible1(!visible1)}
                            >
                                {nuevaPassword ? visible1 ? <EyeOff /> : <Eye /> : <LockKeyhole />}
                            </button>
                        }
                        type={visible1 ? 'text' : 'password'}
                        disabled={loading}
                    />

                    <Input
                        classNames={{
                            base: 'w-3/5',
                            inputWrapper:
                                'border border-gris-institucional rounded-[15px] w-full'
                        }}
                        isRequired
                        label='Confirmar nueva contraseña'
                        labelPlacement='outside'
                        value={nuevaPassword2}
                        onValueChange={setNuevaPassword2}
                        endContent={
                            <button
                                type='button'
                                className='focus:outline-none'
                                onClick={() => setVisible2(!visible2)}
                            >
                                {nuevaPassword2 ? visible2 ? <EyeOff /> : <Eye /> : <LockKeyhole />}
                            </button>
                        }
                        type={visible2 ? 'text' : 'password'}
                        disabled={loading}
                    />

                    <Boton type='submit' w='60%' disabled={loading}>
                        {loading ? 'Procesando...' : 'Cambiar Contraseña'}
                    </Boton>
                </form>
            </div>

            {/* Componente AlertaModal para mostrar mensajes */}
            <AlertaModal
                isOpen={alertaOpen}
                onClose={() => setAlertaOpen(false)}
                message={alertaMensaje}
                type={alertaTipo}
                titulo={alertaTitulo}
            />
        </div>
    )
}

export default CambiarContrasena