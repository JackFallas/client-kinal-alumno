import { api } from './api'

export interface Seccion {
  id: number
  codigo: string
  nombre: string
  nivel: string
  grado: number
}

export const getSecciones = () => api.get<Seccion[]>('/secciones')
