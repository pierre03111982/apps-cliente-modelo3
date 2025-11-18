"use client"

import React, { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function ClienteAppPage() {
  const params = useParams()
  const router = useRouter()
  const lojistaId = (params?.lojistaId as string) || ""
  
  // Redirecionar para login se não estiver logado
  useEffect(() => {
    if (!lojistaId) {
      // Se não houver lojistaId, não fazer nada (deixar a rota raiz funcionar)
      return
    }
    
    const checkLogin = () => {
      const stored = localStorage.getItem(`cliente_${lojistaId}`)
      if (!stored) {
        router.push(`/${lojistaId}/login`)
        return
      }
      // Se estiver logado, redirecionar para experimentar
      router.push(`/${lojistaId}/experimentar`)
    }
    
    checkLogin()
  }, [lojistaId, router])
  
  // Retornar null enquanto redireciona
  return null
}
