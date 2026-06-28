import { api } from './api'

export interface AlertaEnviada {
  id: number
  mensaje: string
  leida: boolean
  creadaEn: string
}

export const enviarAlerta = (mensaje: string) =>
  api.post<AlertaEnviada>('/alertas/estudiante', { mensaje })
