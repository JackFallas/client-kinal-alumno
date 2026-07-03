import { api } from './api'

export interface Seccion {
  id: number
  codigo: string
  nombre: string
  nivel: string
  grado: number
  carrera: string | null
}

export const getSecciones = () => api.get<Seccion[]>('/secciones')
