"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { FaApple, FaFacebook, FaGoogle } from "react-icons/fa"
import { LogIn, UserPlus } from "lucide-react"
import { fetchLojistaData } from "@/lib/firebaseQueries"
import type { LojistaData } from "@/lib/types"
// CLOSET_BACKGROUND_IMAGE não será mais usado diretamente aqui

export default function LoginPage() {
  const params = useParams()
  const router = useRouter()
  const lojistaId = params?.lojistaId as string

  const [lojistaData, setLojistaData] = useState<LojistaData | null>(null)
  const [isLoading, setIsLoading] = useState(false) // Manter para futuras implementações, se necessário
  const [mode, setMode] = useState<"login" | "register">("login")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nome, setNome] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Formatação de WhatsApp: (DDD) 99999-9999
  const formatWhatsApp = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 11)

    if (limited.length === 0) return ""
    if (limited.length <= 2) return `(${limited}`
    if (limited.length <= 7) return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`
  }

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value)
    setWhatsapp(formatted)
  }

  // Formatação de nome: primeira letra maiúscula
  const handleNomeChange = (value: string) => {
    // Capitalizar primeira letra de cada palavra
    const formatted = value
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
    setNome(formatted)
  }

  // Validação do formulário
  const isFormValid = () => {
    const whatsappNumbers = whatsapp.replace(/\D/g, "")
    const whatsappValid = whatsappNumbers.length >= 10
    const passwordValid = password.length >= 6

    if (mode === "register") {
      const nomeValid = nome.trim().length >= 3
      const confirmPasswordValid = password === confirmPassword && password.length >= 6
      return nomeValid && whatsappValid && passwordValid && confirmPasswordValid
    }

    return whatsappValid && passwordValid
  }

  // Carregar dados da loja (em background)
  useEffect(() => {
    if (!lojistaId) return

    const loadLojistaData = async () => {
      try {
        const data = await fetchLojistaData(lojistaId)
        setLojistaData(data)
      } catch (err) {
        console.error("[LoginPage] Erro ao carregar dados da loja:", err)
      }
    }
    loadLojistaData()
  }, [lojistaId])

  // Verificar se cliente já está logado
  useEffect(() => {
    if (!lojistaId) return

    const checkExistingClient = async () => {
      try {
        const stored = localStorage.getItem(`cliente_${lojistaId}`)
        if (stored) {
          const clienteData = JSON.parse(stored)
          const loggedAt = new Date(clienteData.loggedAt)
          const now = new Date()
          const daysDiff = (now.getTime() - loggedAt.getTime()) / (1000 * 60 * 60 * 24)

          if (daysDiff < 30) {
            router.push(`/${lojistaId}/experimentar`)
            return
          }
        }
      } catch (err) {
        console.error("[LoginPage] Erro ao verificar cliente existente:", err)
      }
    }
    checkExistingClient()
  }, [lojistaId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (mode === "register") {
        // Validações de cadastro
        if (!nome.trim() || nome.trim().length < 3) {
          throw new Error("Nome deve ter pelo menos 3 caracteres")
        }
        if (!whatsapp.replace(/\D/g, "") || whatsapp.replace(/\D/g, "").length < 10) {
          throw new Error("WhatsApp inválido")
        }
        if (!password || password.length < 6) {
          throw new Error("Senha deve ter no mínimo 6 caracteres")
        }
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem")
        }

        // Registrar cliente
        const cleanWhatsapp = whatsapp.replace(/\D/g, "")
        const response = await fetch("/api/cliente/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lojistaId,
            nome,
            whatsapp: cleanWhatsapp,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao cadastrar")
        }

        // Salvar dados no localStorage
        const clienteData = {
          nome,
          whatsapp: cleanWhatsapp,
          lojistaId,
          clienteId: data.clienteId,
          loggedAt: new Date().toISOString(),
        }
        localStorage.setItem(`cliente_${lojistaId}`, JSON.stringify(clienteData))

        // Redirecionar para workspace
        router.push(`/${lojistaId}/experimentar`)
      } else {
        // Login
        if (!whatsapp.replace(/\D/g, "") || whatsapp.replace(/\D/g, "").length < 10) {
          throw new Error("WhatsApp inválido")
        }
        if (!password || password.length < 6) {
          throw new Error("Senha inválida")
        }

        const cleanWhatsapp = whatsapp.replace(/\D/g, "")
        const response = await fetch("/api/cliente/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lojistaId,
            whatsapp: cleanWhatsapp,
            password,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Erro ao fazer login")
        }

        // Salvar dados no localStorage
        const clienteData = {
          nome: data.cliente.nome,
          whatsapp: cleanWhatsapp,
          lojistaId,
          clienteId: data.cliente.id,
          loggedAt: new Date().toISOString(),
        }
        localStorage.setItem(`cliente_${lojistaId}`, JSON.stringify(clienteData))

        // Redirecionar para workspace
        router.push(`/${lojistaId}/experimentar`)
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar solicitação")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-zinc-950 text-white">
      {/* Background Image Fixa */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <img
          src="/background.jpg"
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover blur-[2px] brightness-50 opacity-40"
        />
      </div>

      {/* Conteúdo do Formulário */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-8 overflow-y-auto">
        
        {/* Caixa com Logo e Nome da Loja */}
        <div className="w-full max-w-sm mb-6">
          <div
            className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md px-3 py-2 shadow-lg flex items-center justify-center gap-2"
          >
            {lojistaData?.logoUrl && (
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-600 flex-shrink-0">
                <Image
                  src={lojistaData.logoUrl}
                  alt={lojistaData.nome || "Logo"}
                  width={40}
                  height={40}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <h3
              className="text-base font-bold text-white"
              translate="no"
            >
              {lojistaData?.nome || "Sua Loja"}
            </h3>
          </div>
        </div>

        {/* Card Principal do Formulário */}
        <div
          className="w-full max-w-sm space-y-6 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-6 shadow-2xl text-center"
        >
          {/* Título Principal e Subtítulo */}
          <div className="text-center">
            <h1 className="text-xl font-bold text-white mb-1">
              Bem-vindo(a) à nova era <br /> da Moda Digital
            </h1>
            <p className="text-sm text-zinc-400">
              (Provador Virtual IA)
            </p>
          </div>

          {/* Botão de Ação Único (Login/Cadastro) */}
          {mode === 'login' ? (
            <button
              onClick={() => setMode("register")}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white py-2.5 font-semibold text-sm transition-all hover:bg-purple-700"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar conta
            </button>
          ) : (
             <button
              onClick={() => setMode("login")}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white py-2.5 font-semibold text-sm transition-all hover:bg-purple-700"
            >
              <LogIn className="h-4 w-4" />
              Já tenho uma conta? Entrar
            </button>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => handleNomeChange(e.target.value)}
                className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                required
              />
            )}

            <input
              type="tel"
              placeholder="WhatsApp com DDD"
              value={whatsapp}
              onChange={(e) => handleWhatsAppChange(e.target.value)}
              className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              required
            />

            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              required
            />

            {mode === "register" && (
              <input
                type="password"
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                required
              />
            )}

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white py-3 font-bold text-sm transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="h-4 w-4" />
              {mode === "login" ? "Entrar" : "Cadastrar"}
            </button>
          </form>

          {/* Divisor e Login Social */}
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">Continuar com...</p>
            <div className="flex justify-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white transition hover:bg-zinc-600">
                <FaGoogle />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white transition hover:bg-zinc-600">
                <FaApple />
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white transition hover:bg-zinc-600">
                <FaFacebook />
              </button>
            </div>
          </div>
          
          {/* Link de Rodapé */}
          <p className="text-sm text-zinc-400">
            {mode === "login" ? (
              <>
                Não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register")
                    setError(null)
                    setPassword("")
                    setConfirmPassword("")
                  }}
                  className="font-bold underline text-white hover:text-zinc-200 transition"
                >
                  Cadastre-se
                </button>
              </>
            ) : (
              <>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login")
                    setError(null)
                    setPassword("")
                    setConfirmPassword("")
                    setNome("")
                  }}
                  className="font-bold underline text-white hover:text-zinc-200 transition"
                >
                  Entrar
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}


