import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiCheckCircle, FiRefreshCw } from 'react-icons/fi'
import imgLogo from '../../../assets/img/GESAPLogo.svg'
import { verificarApi, reenviarCodigoApi } from '../../../shared/api/auth'
import toast from 'react-hot-toast'

export const VerificarPage = () => {
  const navigate   = useNavigate()
  const [params]   = useSearchParams()
  const tokenParam = params.get('token') ?? undefined
  const emailParam = params.get('email') ?? ''

  const [step, setStep]           = useState<'email' | 'code'>(emailParam ? 'code' : 'email')
  const [digits, setDigits]       = useState(['', '', '', '', '', ''])
  const [loading, setLoading]     = useState(false)
  const [resending, setResending] = useState(false)
  const [success, setSuccess]     = useState(false)
  const [email, setEmail]         = useState(emailParam)
  const inputRefs                 = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => { if (step === 'code') inputRefs.current[0]?.focus() }, [step])

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Ingresa tu correo'); return }
    setResending(true)
    try {
      await reenviarCodigoApi(email)
      toast.success('Código enviado. Revisa tu correo.')
      setStep('code')
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al enviar el código')
    } finally {
      setResending(false)
    }
  }

  const handleChange = (i: number, val: string) => {
    const char = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1)
    const next  = [...digits]
    next[i] = char
    setDigits(next)
    if (char && i < 5) inputRefs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
    const next  = [...digits]
    text.split('').forEach((c, i) => { if (i < 6) next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(text.length, 5)]?.focus()
  }

  const codigo = digits.join('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (codigo.length < 6) { toast.error('Ingresa los 6 caracteres del código'); return }

    setLoading(true)
    try {
      await verificarApi({ codigo, token: tokenParam, email: email || undefined })
      setSuccess(true)
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Código incorrecto o expirado')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) { toast.error('Ingresa tu correo para reenviar el código'); return }
    setResending(true)
    try {
      await reenviarCodigoApi(email)
      toast.success('Nuevo código enviado. Revisa tu correo.')
      setDigits(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Error al reenviar')
    } finally {
      setResending(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0E6BA8] flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-[#0A2647] mb-2">¡Cuenta verificada!</h2>
          <p className="text-slate-500 text-sm mb-6">Tu cuenta está activa. Ya puedes iniciar sesión.</p>
          <Link to="/login"
            className="block w-full bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm hover:from-[#144272] hover:to-[#00ACC1]">
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0E6BA8] flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <img src={imgLogo} alt="GESAP" className="h-12 mx-auto mb-3 drop-shadow-lg" />
            <h1 className="text-white text-2xl font-extrabold tracking-tight">Verificar cuenta</h1>
            <p className="text-blue-200 text-sm mt-1">Ingresa tu correo para enviarte el código</p>
          </div>

          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Tu correo</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@kinal.edu.gt" autoFocus
                  className="w-full border border-blue-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#00ACC1] bg-white" />
              </div>

              <button type="submit" disabled={resending}
                className="w-full bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-60">
                {resending ? 'Enviando...' : 'Enviar código'}
              </button>

              <p className="text-center text-xs text-slate-400">
                ¿Ya tienes cuenta verificada?{' '}
                <Link to="/login" className="text-[#0E6BA8] font-semibold hover:underline">Inicia sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A2647] via-[#144272] to-[#0E6BA8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={imgLogo} alt="GESAP" className="h-12 mx-auto mb-3 drop-shadow-lg" />
          <h1 className="text-white text-2xl font-extrabold tracking-tight">Verificar cuenta</h1>
          <p className="text-blue-200 text-sm mt-1">Ingresa el código de 6 caracteres enviado a {email}</p>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleVerify} className="space-y-6">

            {/* Cajas estilo GitHub */}
            <div>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el }}
                    type="text"
                    inputMode="text"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-11 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition-all uppercase font-mono
                      ${d ? 'border-[#0E6BA8] text-[#0A2647] bg-blue-50' : 'border-blue-200 text-slate-400'}
                      focus:border-[#0E6BA8] focus:bg-blue-50`}
                  />
                ))}
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">Las letras se convierten en mayúsculas automáticamente</p>
            </div>

            <button type="submit" disabled={loading || codigo.length < 6}
              className="w-full bg-gradient-to-r from-[#0A2647] to-[#0E6BA8] hover:from-[#144272] hover:to-[#00ACC1] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm disabled:opacity-60">
              {loading ? 'Verificando...' : 'Verificar cuenta'}
            </button>

            <div className="text-center">
              <button type="button" onClick={handleResend} disabled={resending}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#0E6BA8] transition-colors disabled:opacity-50">
                <FiRefreshCw size={12} className={resending ? 'animate-spin' : ''} />
                {resending ? 'Enviando...' : 'Reenviar código'}
              </button>
            </div>

            <p className="text-center text-xs text-slate-400">
              ¿Ya tienes cuenta verificada?{' '}
              <Link to="/login" className="text-[#0E6BA8] font-semibold hover:underline">Inicia sesión</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
