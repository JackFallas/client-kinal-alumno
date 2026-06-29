import { useState, useEffect, useRef } from 'react'
import { FiFolder, FiUpload, FiCheckCircle, FiClock, FiTrash2, FiX, FiDownload } from 'react-icons/fi'
import {
  getMisDocumentos, subirDocumento, eliminarDocumento, listarPlantillas, getArchivoPlantilla,
  type Documento, type Plantilla,
} from '../../../shared/api/documentos'
import toast from 'react-hot-toast'

const TIPO_LABEL: Record<string, string> = {
  CARTA_ALERGIA: 'Carta de Alergia',
  CARTA_MEDICA:  'Carta Médica',
  OTRO:          'Otro',
}

export const MisDocumentosPage = () => {
  const [docs, setDocs]           = useState<Documento[]>([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting]   = useState<number | null>(null)
  const [form, setForm]           = useState({ tipo: 'OTRO' as Documento['tipo'], descripcion: '' })
  const [plantillas, setPlantillas] = useState<Plantilla[]>([])
  const fileRef                   = useRef<HTMLInputElement>(null)

  const fetchDocs = () =>
    getMisDocumentos()
      .then(({ data }) => setDocs(data))
      .catch(() => toast.error('Error al cargar documentos'))
      .finally(() => setLoading(false))

  useEffect(() => { fetchDocs() }, [])
  useEffect(() => { listarPlantillas().then(({ data }) => setPlantillas(data)).catch(() => {}) }, [])

  const plantillaActual = plantillas.find((p) => p.tipo === form.tipo)

  const descargarPlantilla = async () => {
    if (!plantillaActual) return
    try {
      const { data } = await getArchivoPlantilla(plantillaActual.tipo)
      window.open(URL.createObjectURL(data), '_blank')
    } catch {
      toast.error('No se pudo abrir la plantilla')
    }
  }

  const handleSubir = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { toast.error('Selecciona un archivo'); return }
    setUploading(true)
    const fd = new FormData()
    fd.append('archivo', file)
    fd.append('tipo', form.tipo)
    if (form.descripcion) fd.append('descripcion', form.descripcion)
    try {
      const { data } = await subirDocumento(fd)
      setDocs((prev) => [data, ...prev])
      setShowModal(false)
      setForm({ tipo: 'OTRO', descripcion: '' })
      if (fileRef.current) fileRef.current.value = ''
      toast.success('Documento subido correctamente')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al subir')
    } finally {
      setUploading(false)
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Eliminar este documento?')) return
    setDeleting(id)
    try {
      await eliminarDocumento(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
      toast.success('Documento eliminado')
    } catch {
      toast.error('No se pudo eliminar')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0A2647]">Mis Documentos</h1>
          <p className="text-sm text-slate-400 mt-0.5">{docs.length} documento{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm">
          <FiUpload size={15} /> Subir documento
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando...</div>
      ) : docs.length === 0 ? (
        <div className="text-center py-14">
          <FiFolder size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No tienes documentos subidos</p>
        </div>
      ) : (
        <div className="space-y-2">
          {docs.map((d) => (
            <div key={d.id} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-[#0A2647]">{d.nombreArchivo}</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{TIPO_LABEL[d.tipo]}</span>
                  {d.verificado
                    ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><FiCheckCircle size={10} /> Verificado</span>
                    : <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1"><FiClock size={10} /> Pendiente</span>
                  }
                </div>
                {d.descripcion && <p className="text-xs text-slate-500">{d.descripcion}</p>}
                <p className="text-xs text-slate-400 mt-0.5">{new Date(d.subidoEn).toLocaleDateString('es-GT')}</p>
              </div>
              {!d.verificado && (
                <button onClick={() => handleEliminar(d.id)} disabled={deleting === d.id}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 shrink-0">
                  <FiTrash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal subir */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[#0A2647]">Subir documento</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubir} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Tipo de documento</label>
                <select value={form.tipo} onChange={(e) => setForm((p) => ({ ...p, tipo: e.target.value as Documento['tipo'] }))}
                  className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1]">
                  <option value="CARTA_ALERGIA">Carta de Alergia</option>
                  <option value="CARTA_MEDICA">Carta Médica</option>
                  <option value="OTRO">Otro</option>
                </select>
                {plantillaActual && (
                  <button type="button" onClick={descargarPlantilla}
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#0E6BA8] hover:underline">
                    <FiDownload size={12} /> Descargar plantilla de este documento
                  </button>
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Descripción (opcional)</label>
                <input type="text" value={form.descripcion} onChange={(e) => setForm((p) => ({ ...p, descripcion: e.target.value }))}
                  placeholder="Descripción del documento..."
                  className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#144272] mb-1.5 uppercase tracking-wide">Archivo (PDF, JPG, PNG — máx 5MB)</label>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" required
                  className="w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-blue-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60">
                  {uploading ? 'Subiendo...' : 'Subir'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
