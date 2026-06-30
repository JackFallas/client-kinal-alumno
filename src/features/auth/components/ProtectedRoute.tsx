import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useKickListener } from '../../../shared/hooks/useKickListener'
import { useInactivityLogout } from '../../../shared/hooks/useInactivityLogout'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore()
  useKickListener()
  useInactivityLogout()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}
