import { api } from './api'

export interface Documento {
  id: number
  tipo: 'CARTA_ALERGIA' | 'CARTA_MEDICA' | 'OTRO'
  nombreArchivo: string
  descripcion?: string
  verificado: boolean
  subidoEn: string
}

export const getMisDocumentos = () => api.get<Documento[]>('/documentos/mis-documentos')

export const subirDocumento = (formData: FormData) =>
  api.post<Documento>('/documentos/subir', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const eliminarDocumento = (id: number) => api.delete(`/documentos/${id}`)
