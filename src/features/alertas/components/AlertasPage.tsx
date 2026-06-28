import { useState } from 'react'
import { FiBell, FiSend } from 'react-icons/fi'
import { enviarAlerta } from '../../../shared/api/alertas'
import toast from 'react-hot-toast'

export const AlertasPage = () => {
  const [mensaje, setMensaje] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviada, setEnviada] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!mensaje.trim()) return
    setEnviando(true)
    try {
      await enviarAlerta(mensaje.trim())
      toast.success('Alerta enviada a enfermería')
      setMensaje('')
      setEnviada(true)
      setTimeout(() => setEnviada(false), 4000)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al enviar la alerta')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#0A2647]">Enviar Alerta a Enfermería</h1>
        <p className="text-sm text-slate-400 mt-0.5">Si no te sientes bien o necesitas ayuda, avisa directamente a enfermería</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-blue-50 shadow-sm p-6 space-y-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto">
          <FiBell className="text-red-500" size={24} />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">¿Qué te pasa?</label>
          <textarea
            value={mensaje} onChange={(e) => setMensaje(e.target.value)}
            rows={4} required placeholder="Describe brevemente tu situación..."
            className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent resize-none shadow-sm"
          />
        </div>

        <button type="submit" disabled={enviando || !mensaje.trim()}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60">
          <FiSend size={15} /> {enviando ? 'Enviando...' : 'Enviar alerta'}
        </button>

        {enviada && (
          <p className="text-xs text-emerald-600 text-center font-medium">Enfermería recibió tu alerta</p>
        )}
      </form>
    </div>
  )
}
