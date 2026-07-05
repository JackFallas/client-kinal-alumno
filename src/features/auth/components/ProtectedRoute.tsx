import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useKickListener } from '../../../shared/hooks/useKickListener'
import { useInactivityLogout } from '../../../shared/hooks/useInactivityLogout'
import { FechaNacimientoModal } from './FechaNacimientoModal'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuthStore()
  const [posponerFechaNacimiento, setPosponerFechaNacimiento] = useState(false)
  useKickListener()
  useInactivityLogout()
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const faltaFechaNacimiento = !!user && !user.fechaNacimiento && !posponerFechaNacimiento

  return (
    <>
      {children}
      {faltaFechaNacimiento && <FechaNacimientoModal onClose={() => setPosponerFechaNacimiento(true)} />}
    </>
  )
}
