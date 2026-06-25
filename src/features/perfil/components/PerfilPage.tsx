import { useAuthStore } from '../../auth/store/authStore'
import { FiUser, FiMail, FiBook } from 'react-icons/fi'

const NIVEL_LABEL: Record<string, string> = {
  BASICOS:       'Básicos',
  DIVERSIFICADOS: 'Diversificados',
}

export const PerfilPage = () => {
  const { user, logout } = useAuthStore()
  if (!user) return null

  const displayName = `${user.primerNombre}${user.segundoNombre ? ' ' + user.segundoNombre : ''} ${user.primerApellido}${user.segundoApellido ? ' ' + user.segundoApellido : ''}`.trim()
  const initials = `${user.primerNombre[0]}${user.primerApellido[0]}`.toUpperCase()

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <h1 className="text-xl font-bold text-[#0A2647]">Mi Perfil</h1>

      <div className="bg-white rounded-xl border border-blue-50 shadow-sm p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-[#0A2647]">{displayName}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Estudiante</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <FiMail size={16} className="text-[#0E6BA8] shrink-0" />
            <div>
              <p className="text-xs text-slate-400">Correo</p>
              <p className="text-sm font-medium text-[#0A2647]">{user.email}</p>
            </div>
          </div>

          {user.carnet && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <FiUser size={16} className="text-[#0E6BA8] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Carnet</p>
                <p className="text-sm font-medium text-[#0A2647] font-mono">{user.carnet}</p>
              </div>
            </div>
          )}

          {user.nivelAcademico && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <FiBook size={16} className="text-[#0E6BA8] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Nivel</p>
                <p className="text-sm font-medium text-[#0A2647]">{NIVEL_LABEL[user.nivelAcademico]}</p>
              </div>
            </div>
          )}

          {user.seccion && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <FiBook size={16} className="text-[#0E6BA8] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Sección</p>
                <p className="text-sm font-medium text-[#0A2647]">{user.seccion.codigo} — {user.seccion.nombre}</p>
              </div>
            </div>
          )}
        </div>

        <button onClick={logout}
          className="w-full mt-5 border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}
