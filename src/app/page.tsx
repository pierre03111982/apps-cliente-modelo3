"use client"

import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4 text-lg">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white px-4">
      <div className="text-center max-w-2xl">
        <h1 className="mb-4 text-2xl md:text-3xl font-bold">
          Experimente AI - Modelo 1
        </h1>
        <p className="mb-2 text-gray-400 text-lg">
          Acesse o aplicativo usando o link completo com o ID da loja:
        </p>
        <p className="text-sm text-gray-500 break-all mb-6">
          {typeof window !== 'undefined' 
            ? `${window.location.origin}/[lojistaId]/login`
            : 'https://modelo1.experimenteai.com.br/[lojistaId]/login'}
        </p>
        <div className="mt-6 text-xs text-gray-500">
          <p>Exemplo: {typeof window !== 'undefined' 
            ? `${window.location.origin}/seu-lojista-id/login`
            : 'https://modelo1.experimenteai.com.br/seu-lojista-id/login'}</p>
        </div>
      </div>
    </div>
  )
}


