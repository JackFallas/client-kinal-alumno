import { useState, useEffect } from 'react'
import { FiActivity, FiThermometer } from 'react-icons/fi'
import { getMisVisitas, type Visita } from '../../../shared/api/visitas'
import toast from 'react-hot-toast'

export const MisVisitasPage = () => {
  const [visitas, setVisitas] = useState<Visita[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMisVisitas()
      .then(({ data }) => setVisitas(data))
      .catch(() => toast.error('Error al cargar tus visitas'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-[#0A2647]">Mis Visitas a Enfermería</h1>
        <p className="text-sm text-slate-400 mt-0.5">{visitas.length} visita{visitas.length !== 1 ? 's' : ''} registrada{visitas.length !== 1 ? 's' : ''}</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">Cargando...</div>
      ) : visitas.length === 0 ? (
        <div className="text-center py-14">
          <FiActivity size={36} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No tienes visitas registradas</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visitas.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-blue-50 shadow-sm p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <FiActivity className="text-[#0E6BA8]" size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#0A2647]">{v.motivo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(v.fechaHora).toLocaleString('es-GT')}</p>
                  {v.descripcion && <p className="text-xs text-slate-500 mt-1">{v.descripcion}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {v.temperatura && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <FiThermometer size={10} /> {v.temperatura}°C
                      </span>
                    )}
                    {v.presion && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">💉 {v.presion}</span>}
                    {v.peso && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">⚖ {v.peso} kg</span>}
                  </div>
                  {v.tratamiento && (
                    <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 rounded-lg px-2 py-1">
                      <span className="font-medium">Tratamiento:</span> {v.tratamiento}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
