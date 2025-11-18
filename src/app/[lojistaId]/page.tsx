"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

// Forçar renderização dinâmica para evitar erro 404 em rotas dinâmicas
export const dynamic = 'force-dynamic'

export default function ClienteAppPage() {
  const params = useParams()
  const router = useRouter()
  const [lojistaId, setLojistaId] = useState<string>("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  
  useEffect(() => {
    // Garantir que params está disponível
    const id = (params?.lojistaId as string) || ""
    setLojistaId(id)
    
    if (!id) {
      // Se não houver lojistaId, redirecionar para página raiz
      router.push("/")
      return
    }
    
    if (isRedirecting) return
    
    setIsRedirecting(true)
    
    // Verificar login e redirecionar imediatamente
    const checkLogin = () => {
      try {
        const stored = localStorage.getItem(`cliente_${id}`)
        if (!stored) {
          router.replace(`/${id}/login`)
          return
        }
        // Se estiver logado, redirecionar para experimentar
        router.replace(`/${id}/experimentar`)
      } catch (error) {
        console.error("[ClienteAppPage] Erro ao verificar login:", error)
        router.replace(`/${id}/login`)
      }
    }
    
    // Redirecionar imediatamente sem delay
    checkLogin()
  }, [params, router, isRedirecting])
  
  // Redirecionar sem mostrar tela de loading
  return null
}
