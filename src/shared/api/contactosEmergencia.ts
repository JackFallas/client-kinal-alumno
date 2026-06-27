import { api } from './api'

export interface ContactoEmergencia {
  id: number
  nombre: string
  parentesco: string
  telefono: string
}

export interface ContactoEmergenciaInput {
  nombre: string
  parentesco: string
  telefono: string
}

export const getMisContactos = () => api.get<ContactoEmergencia[]>('/contactos-emergencia/mis-contactos')

export const crearContacto = (data: ContactoEmergenciaInput) =>
  api.post<ContactoEmergencia>('/contactos-emergencia', data)

export const actualizarContacto = (id: number, data: Partial<ContactoEmergenciaInput>) =>
  api.patch<ContactoEmergencia>(`/contactos-emergencia/${id}`, data)

export const eliminarContacto = (id: number) => api.delete(`/contactos-emergencia/${id}`)
