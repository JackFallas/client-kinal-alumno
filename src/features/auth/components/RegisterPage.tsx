import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiMail, FiLock, FiBook } from 'react-icons/fi'
import imgLogo from '../../../assets/img/GESAPLogo.svg'
import { registrarApi, type NivelAcademico } from '../../../shared/api/auth'
import { getSecciones } from '../../../shared/api/secciones'
import toast from 'react-hot-toast'

interface Seccion { id: number; codigo: string; nombre: string; nivel: string; grado: number }

const inputCls = "w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] focus:border-transparent bg-white"

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    carnet:            '',
    primerNombre:      '',
    segundoNombre:     '',
    primerApellido:    '',
    segundoApellido:   '',
    email:             '',
    password:          '',
    confirm:           '',
    fechaNacimiento:   '',
    nivelAcademico:    '' as NivelAcademico | '',
    seccionId:         '',
    seccionAcademicaId: '',
  })

  useEffect(() => {
    getSecciones().then((r) => setSecciones(r.data)).catch(() => {})
  }, [])

  const set = (f: string, v: string) => setForm((p) => ({ ...p, [f]: v }))

  const secBasicos       = secciones.filter((s) => s.nivel === 'BASICOS')
  const secDivTecnicas   = secciones.filter((s) => s.nivel === 'DIVERSIFICADOS')
  const secDivAcademicas = secciones.filter((s) => s.nivel === 'DIVERSIFICADOS')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    if (!form.nivelAcademico) {
      toast.error('Selecciona tu nivel académico')
      return
    }

    setSaving(true)
    try {
      const { data } = await registrarApi({
        carnet:            form.carnet || undefined,
        primerNombre:      form.primerNombre,
        segundoNombre:     form.segundoNombre || undefined,
        primerApellido:    form.primerApellido,
        segundoApellido:   form.segundoApellido || undefined,
        email:             form.email,
        password:          form.password,
        fechaNacimiento:   form.fechaNacimiento || undefined,
        nivelAcademico:    form.nivelAcademico,
        seccionId:         form.seccionId ? Number(form.seccionId) : undefined,
        seccionAcademicaId: form.seccionAcademicaId ? Number(form.seccionAcademicaId) : undefined,
      })
      if (data.verificado) {
        toast.success('¡Cuenta creada y verificada! Ya puedes iniciar sesión.')
        navigate('/login')
      } else {
        toast.success('¡Cuenta creada! Revisa tu correo.')
        navigate(`/verificar?email=${encodeURIComponent(data.email)}`)
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al registrarse')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0E6BA8] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <img src={imgLogo} alt="GESAP" className="h-12 mx-auto mb-3 drop-shadow-lg" />
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Crear cuenta</h1>
          <p className="text-blue-200 text-sm mt-1">Solo para estudiantes · Instituto Kinal</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombres */}
            <div>
              <p className="text-xs font-bold text-[#144272] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiUser size={12} /> Nombres
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Primer nombre *</label>
                  <input type="text" value={form.primerNombre} onChange={(e) => set('primerNombre', e.target.value)} required className={inputCls} placeholder="María" />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Segundo nombre</label>
                  <input type="text" value={form.segundoNombre} onChange={(e) => set('segundoNombre', e.target.value)} className={inputCls} placeholder="Fernanda" />
                </div>
              </div>
            </div>

            {/* Apellidos */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Primer apellido *</label>
                <input type="text" value={form.primerApellido} onChange={(e) => set('primerApellido', e.target.value)} required className={inputCls} placeholder="López" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Segundo apellido</label>
                <input type="text" value={form.segundoApellido} onChange={(e) => set('segundoApellido', e.target.value)} className={inputCls} placeholder="García" />
              </div>
            </div>

            {/* Carnet y fecha de nacimiento */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Carnet (7 dígitos)</label>
                <input type="text" value={form.carnet} onChange={(e) => set('carnet', e.target.value.replace(/\D/g, '').slice(0, 7))} maxLength={7} className={inputCls} placeholder="2024001" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Fecha de nacimiento *</label>
                <input type="date" value={form.fechaNacimiento} onChange={(e) => set('fechaNacimiento', e.target.value)} required
                  max={new Date().toISOString().split('T')[0]} className={inputCls} />
              </div>
            </div>

            {/* Email y password */}
            <div>
              <p className="text-xs font-bold text-[#144272] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiMail size={12} /> Acceso
              </p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Correo institucional *</label>
                  <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required className={inputCls} placeholder="tu@kinal.edu.gt" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Contraseña *</label>
                    <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Confirmar *</label>
                    <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required minLength={6} className={inputCls} />
                  </div>
                </div>
              </div>
            </div>

            {/* Nivel y secciones */}
            <div>
              <p className="text-xs font-bold text-[#144272] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <FiBook size={12} /> Nivel académico
              </p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {(['BASICOS', 'DIVERSIFICADOS'] as NivelAcademico[]).map((n) => (
                  <button key={n} type="button"
                    onClick={() => { set('nivelAcademico', n); set('seccionId', ''); set('seccionAcademicaId', '') }}
                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      form.nivelAcademico === n
                        ? 'bg-[#0E6BA8] border-[#0E6BA8] text-white'
                        : 'border-blue-200 text-slate-600 hover:border-[#0E6BA8] hover:text-[#0E6BA8]'
                    }`}>
                    {n === 'BASICOS' ? 'Básicos' : 'Diversificados'}
                  </button>
                ))}
              </div>

              {form.nivelAcademico === 'BASICOS' && (
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Sección *</label>
                  <select value={form.seccionId} onChange={(e) => set('seccionId', e.target.value)} required className={inputCls}>
                    <option value="">Seleccionar sección</option>
                    {secBasicos.map((s) => <option key={s.id} value={s.id}>{s.codigo} — {s.nombre}</option>)}
                  </select>
                </div>
              )}

              {form.nivelAcademico === 'DIVERSIFICADOS' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Sección técnica *</label>
                    <select value={form.seccionId} onChange={(e) => set('seccionId', e.target.value)} required className={inputCls}>
                      <option value="">Seleccionar sección técnica</option>
                      {secDivTecnicas.map((s) => <option key={s.id} value={s.id}>{s.codigo} — {s.nombre}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Sección académica</label>
                    <select value={form.seccionAcademicaId} onChange={(e) => set('seccionAcademicaId', e.target.value)} className={inputCls}>
                      <option value="">Seleccionar sección académica</option>
                      {secDivAcademicas.map((s) => <option key={s.id} value={s.id}>{s.codigo} — {s.nombre}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button type="submit" disabled={saving}
              className="w-full bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-60 mt-2">
              {saving ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-xs text-slate-400 pt-1">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-[#0E6BA8] font-semibold hover:underline">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
