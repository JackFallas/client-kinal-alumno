import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginApi, logoutApi, type AuthUser } from '../../../shared/api/auth'

interface PerfilRecordado {
  email: string
  nombre: string
  fotoPerfil: string | null
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  perfilRecordado: PerfilRecordado | null
  login: (email: string, password: string, recordar?: boolean) => Promise<void>
  logout: () => Promise<void>
  cerrarPorInactividad: () => void
  olvidarPerfil: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      perfilRecordado: null,

      login: async (email, password, recordar) => {
        set({ loading: true, error: null })
        try {
          const { data } = await loginApi(email, password, recordar)
          if (data.usuario.role !== 'ESTUDIANTE') {
            set({ loading: false, error: 'Este portal es exclusivo para estudiantes.' })
            return
          }
          set({
            user: data.usuario,
            token: data.access_token,
            isAuthenticated: true,
            loading: false,
            perfilRecordado: recordar
              ? { email, nombre: `${data.usuario.primerNombre} ${data.usuario.primerApellido}`, fotoPerfil: data.usuario.fotoPerfil ?? null }
              : null,
          })
        } catch (err: any) {
          set({ loading: false, error: err?.response?.data?.message ?? 'Correo o contraseña incorrectos' })
        }
      },

      logout: async () => {
        try { await logoutApi() } catch { /* sesión ya expirada */ }
        set({ user: null, token: null, isAuthenticated: false, error: null, perfilRecordado: null })
      },

      cerrarPorInactividad: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      olvidarPerfil: () => set({ perfilRecordado: null }),
    }),
    {
      name: 'gesap-alumno-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated, perfilRecordado: s.perfilRecordado }),
    }
  )
)
