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

export interface Plantilla {
  id: number
  tipo: 'CARTA_ALERGIA' | 'CARTA_MEDICA' | 'OTRO'
  nombreArchivo: string
  subidoEn: string
}

export const listarPlantillas = () => api.get<Plantilla[]>('/documentos/plantillas')

export const getArchivoPlantilla = (tipo: string) =>
  api.get(`/documentos/plantillas/${tipo}/archivo`, { responseType: 'blob' })
