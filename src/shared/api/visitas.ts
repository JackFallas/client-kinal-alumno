import { api } from './api'

export interface Visita {
  id: number
  motivo: string
  descripcion?: string
  temperatura?: number
  tratamiento?: string
  observaciones?: string
  requiereRetirarse?: boolean
  fechaHora: string
}

export const getMisVisitas = () => api.get<Visita[]>('/visitas/mis-visitas')
