import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FiCalendar, FiLoader } from 'react-icons/fi'
import { useAuthStore } from '../store/authStore'
import { actualizarMiFechaNacimientoApi } from '../../../shared/api/auth'
import toast from 'react-hot-toast'

export const FechaNacimientoModal = ({ onClose }: { onClose: () => void }) => {
  const [fecha, setFecha] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleGuardar = async () => {
    if (!fecha) {
      toast.error('Selecciona tu fecha de nacimiento')
      return
    }
    setGuardando(true)
    try {
      const { data } = await actualizarMiFechaNacimientoApi(fecha)
      useAuthStore.setState((s) => (s.user ? { user: { ...s.user, fechaNacimiento: data.fechaNacimiento } } : {}))
      toast.success('Fecha de nacimiento guardada')
      onClose()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al guardar la fecha de nacimiento')
    } finally {
      setGuardando(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm max-h-[92vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0E6BA8] to-[#00ACC1] flex items-center justify-center text-white mb-3">
              <FiCalendar size={20} />
            </div>
            <h2 className="text-lg font-bold text-[#0A2647]">Falta tu fecha de nacimiento</h2>
            <p className="text-sm text-slate-500 mt-1">
              Nos ayuda a que enfermería tenga tu edad correcta al momento de atenderte.
            </p>
          </div>

          <label className="block text-xs font-medium text-slate-500 mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-[#0A2647] focus:outline-none focus:ring-2 focus:ring-[#0E6BA8] mb-5"
          />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={guardando}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors disabled:opacity-60"
            >
              Ahora no
            </button>
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0E6BA8] to-[#00ACC1] hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {guardando ? <FiLoader size={16} className="animate-spin" /> : null}
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
