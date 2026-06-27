import { useEffect, useState } from 'react'
import { FiPhone, FiPlus, FiTrash2, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'
import {
  getMisContactos, crearContacto, eliminarContacto,
  type ContactoEmergencia,
} from '../../../shared/api/contactosEmergencia'

const MAX_CONTACTOS = 4
const EMPTY_FORM = { nombre: '', parentesco: '', telefono: '' }

const inputCls = "w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent shadow-sm bg-white"

export const ContactosEmergenciaSection = () => {
  const [contactos, setContactos] = useState<ContactoEmergencia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    getMisContactos().then((r) => setContactos(r.data)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const set = (field: keyof typeof EMPTY_FORM, value: string) => setForm((p) => ({ ...p, [field]: value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await crearContacto(form)
      toast.success('Contacto agregado')
      setForm({ ...EMPTY_FORM })
      setShowForm(false)
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al agregar contacto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este contacto de emergencia?')) return
    try {
      await eliminarContacto(id)
      setContactos((prev) => prev.filter((c) => c.id !== id))
      toast.success('Contacto eliminado')
    } catch {
      toast.error('Error al eliminar contacto')
    }
  }

  return (
    <div className="bg-white rounded-xl border border-blue-50 shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#0A2647] flex items-center gap-2">
          <FiUsers className="text-[#0E6BA8]" size={17} /> Contactos de Emergencia
        </h2>
        {contactos.length < MAX_CONTACTOS && (
          <button onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-1 text-xs font-semibold text-[#0E6BA8] hover:text-[#00ACC1] transition-colors">
            <FiPlus size={14} /> Agregar
          </button>
        )}
      </div>
      <p className="text-xs text-slate-400 mb-4">Hasta {MAX_CONTACTOS} contactos que enfermería puede llamar en caso de emergencia</p>

      {loading ? (
        <p className="text-sm text-slate-400">Cargando...</p>
      ) : (
        <div className="space-y-2 mb-3">
          {contactos.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0A2647] truncate">{c.nombre} <span className="text-xs font-normal text-slate-400">· {c.parentesco}</span></p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><FiPhone size={11} /> {c.telefono}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-600 shrink-0 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
          {contactos.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-3">No tienes contactos de emergencia registrados</p>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="space-y-3 border-t border-blue-50 pt-4">
          <div>
            <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Nombre *</label>
            <input value={form.nombre} onChange={(e) => set('nombre', e.target.value)} required placeholder="María López" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Parentesco *</label>
              <input value={form.parentesco} onChange={(e) => set('parentesco', e.target.value)} required placeholder="Madre" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Teléfono *</label>
              <input value={form.telefono} onChange={(e) => set('telefono', e.target.value)} required placeholder="55512345" className={inputCls} />
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => { setShowForm(false); setForm({ ...EMPTY_FORM }) }}
              className="flex-1 border border-blue-200 text-slate-600 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
