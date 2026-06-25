import { api } from './api'

export interface Visita {
  id: number
  motivo: string
  descripcion?: string
  temperatura?: number
  presion?: string
  peso?: number
  tratamiento?: string
  observaciones?: string
  fechaHora: string
}

export const getMisVisitas = () => api.get<Visita[]>('/visitas/mis-visitas')
