"use client"

import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg text-white">
        <div className="text-center">
          <div className="mb-4 text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-bg text-white px-4">
      <div className="text-center max-w-2xl neo-card p-6 rounded-3xl">
        <h1 className="mb-4 text-2xl md:text-3xl font-bold bg-gradient-to-r from-gradient-blue to-gradient-pink bg-clip-text text-transparent">
          Experimente AI - Modelo 3
        </h1>
        <p className="mb-4 text-white/80 text-lg">
          Acesse o aplicativo usando o link completo com o ID da loja:
        </p>
        <div className="neo-input p-3 text-sm break-all mb-6">
          {typeof window !== 'undefined' 
            ? `${window.location.origin}/[lojistaId]/login`
            : 'https://modelo3.experimenteai.com.br/[lojistaId]/login'}
        </div>
        <div className="mt-6 text-xs text-white/70">
          <p>Exemplo: {typeof window !== 'undefined' 
            ? `${window.location.origin}/seu-lojista-id/login`
            : 'https://modelo3.experimenteai.com.br/seu-lojista-id/login'}</p>
          <p className="mt-4 text-sm text-gradient-blue">Porta: 3010</p>
        </div>
      </div>
    </div>
  )
}
