import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../../features/auth/components/ProtectedRoute'
import { LoginForm } from '../../features/auth/components/LoginForm'
import { RegisterPage } from '../../features/auth/components/RegisterPage'
import { VerificarPage } from '../../features/auth/components/VerificarPage'
import { OlvidePasswordPage } from '../../features/auth/components/OlvidePasswordPage'
import { MainLayout } from '../../shared/components/layouts/MainLayout'
import { MisVisitasPage } from '../../features/visitas/components/MisVisitasPage'
import { MisDocumentosPage } from '../../features/documentos/components/MisDocumentosPage'
import { PerfilPage } from '../../features/perfil/components/PerfilPage'
import { AlertasPage } from '../../features/alertas/components/AlertasPage'

export const AppRoutes = () => (
  <Routes>
    <Route path="/login"     element={<LoginForm />} />
    <Route path="/register"  element={<RegisterPage />} />
    <Route path="/verificar" element={<VerificarPage />} />
    <Route path="/olvide-password" element={<OlvidePasswordPage />} />
    <Route path="/portal" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
      <Route index element={<MisVisitasPage />} />
      <Route path="documentos" element={<MisDocumentosPage />} />
      <Route path="alertas" element={<AlertasPage />} />
      <Route path="perfil" element={<PerfilPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)
