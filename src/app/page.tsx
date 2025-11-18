"use client"

import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Garantir que a página seja renderizada no cliente
  }, [])

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
          https://apps-cliente-modelo1.vercel.app/[lojistaId]/login
        </p>
        <div className="mt-6 text-xs text-gray-500">
          <p>Exemplo: https://apps-cliente-modelo1.vercel.app/seu-lojista-id/login</p>
        </div>
      </div>
    </div>
  )
}


