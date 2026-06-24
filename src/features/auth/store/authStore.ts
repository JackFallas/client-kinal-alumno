import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loginApi, logoutApi, type AuthUser } from '../../../shared/api/auth'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const { data } = await loginApi(email, password)
          if (data.usuario.role !== 'ESTUDIANTE') {
            set({ loading: false, error: 'Este portal es exclusivo para estudiantes.' })
            return
          }
          set({ user: data.usuario, token: data.access_token, isAuthenticated: true, loading: false })
        } catch {
          set({ loading: false, error: 'Correo o contraseña incorrectos' })
        }
      },

      logout: async () => {
        try { await logoutApi() } catch { /* sesión ya expirada */ }
        set({ user: null, token: null, isAuthenticated: false, error: null })
      },
    }),
    {
      name: 'gesap-alumno-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
