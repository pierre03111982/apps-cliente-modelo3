"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ShoppingCart,
  Heart,
  RefreshCw,
  Home,
  Instagram,
  Facebook,
  Music2,
  MessageCircle,
  X,
  Sparkles,
  ArrowLeftCircle,
} from "lucide-react"
// CLOSET_BACKGROUND_IMAGE não será mais usado diretamente aqui
import { fetchLojistaData } from "@/lib/firebaseQueries"
import type { LojistaData, GeneratedLook } from "@/lib/types"

// Resolver backend URL
const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search)
    return params.get("backend") || process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_PAINELADM_URL || "http://localhost:3000"
  }
  return process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_PAINELADM_URL || "http://localhost:3000"
}

export default function ResultadoPage() {
  const params = useParams()
  const router = useRouter()
  const lojistaId = params?.lojistaId as string

  const [lojistaData, setLojistaData] = useState<LojistaData | null>(null)
  const [looks, setLooks] = useState<GeneratedLook[]>([])
  const [currentLookIndex, setCurrentLookIndex] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [votedType, setVotedType] = useState<"like" | "dislike" | null>(null)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)
  const [showFavoritesModal, setShowFavoritesModal] = useState(false)
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [fromFavoritos, setFromFavoritos] = useState(false)

  // Carregar dados da loja
  useEffect(() => {
    if (!lojistaId) return

    const loadData = async () => {
      try {
        // Tentar buscar do backend primeiro
        let lojistaDb: LojistaData | null = null

        try {
          const perfilResponse = await fetch(`/api/lojista/perfil?lojistaId=${encodeURIComponent(lojistaId)}`)
          if (perfilResponse.ok) {
            const perfilData = await perfilResponse.json()
            if (perfilData?.nome) {
              lojistaDb = {
                id: lojistaId,
                nome: perfilData.nome,
                logoUrl: perfilData.logoUrl || null,
                descricao: perfilData.descricao || null,
                redesSociais: {
                  instagram: perfilData.instagram || perfilData.redesSociais?.instagram || null,
                  facebook: perfilData.facebook || perfilData.redesSociais?.facebook || null,
                  tiktok: perfilData.tiktok || perfilData.redesSociais?.tiktok || null,
                  whatsapp: perfilData.whatsapp || perfilData.redesSociais?.whatsapp || null,
                },
                salesConfig: perfilData.salesConfig || {
                  whatsappLink: perfilData.salesWhatsapp || null,
                  ecommerceUrl: perfilData.checkoutLink || null,
                },
                descontoRedesSociais: perfilData.descontoRedesSociais || null,
                descontoRedesSociaisExpiraEm: perfilData.descontoRedesSociaisExpiraEm || null,
              }
            }
          }
        } catch (apiError) {
          console.warn("[ResultadoPage] Erro ao buscar via API, tentando Firebase:", apiError)
        }

        // Se não encontrou via API, tentar Firebase
        if (!lojistaDb) {
          lojistaDb = await fetchLojistaData(lojistaId).catch(() => null)
        }

        if (lojistaDb) setLojistaData(lojistaDb)
      } catch (error) {
        console.error("[ResultadoPage] Erro ao carregar dados:", error)
      }
    }

    loadData()
  }, [lojistaId])

  // Verificar se já foi votado
  const checkVoteStatus = async (compositionId: string | null) => {
    if (!compositionId || !lojistaId) return null

    try {
      const stored = localStorage.getItem(`cliente_${lojistaId}`)
      if (!stored) return null

      const clienteData = JSON.parse(stored)
      const clienteId = clienteData.clienteId

      if (!clienteId) return null

      const response = await fetch(
        `/api/actions/check-vote?compositionId=${encodeURIComponent(compositionId)}&customerId=${encodeURIComponent(clienteId)}&lojistaId=${encodeURIComponent(lojistaId)}`
      )

      if (response.ok) {
        const data = await response.json()
        return data.votedType || data.action || null // "like" ou "dislike"
      }
    } catch (error) {
      console.error("[ResultadoPage] Erro ao verificar voto:", error)
    }

    return null
  }

  // Carregar looks do sessionStorage ou favorito
  useEffect(() => {
    if (!lojistaId) return

    const loadLooksAndCheckVote = async () => {
      // Verificar se veio de favoritos
      const fromFavoritosFlag = sessionStorage.getItem(`from_favoritos_${lojistaId}`)
      if (fromFavoritosFlag === "true") {
        setFromFavoritos(true)
        // Carregar favorito do sessionStorage
        const favoritoData = sessionStorage.getItem(`favorito_${lojistaId}`)
        if (favoritoData) {
          try {
            const favoritoLook = JSON.parse(favoritoData)
            setLooks([favoritoLook])
            setCurrentLookIndex(0)
            // Marcar como já votado (like) - veio de favoritos
            setHasVoted(true)
            setVotedType("like")
            // Limpar flag
            sessionStorage.removeItem(`from_favoritos_${lojistaId}`)
          } catch (error) {
            console.error("[ResultadoPage] Erro ao carregar favorito:", error)
            router.push(`/${lojistaId}/experimentar`)
          }
        } else {
          router.push(`/${lojistaId}/experimentar`)
        }
        return
      }

      // Carregar looks normalmente
      const storedLooks = sessionStorage.getItem(`looks_${lojistaId}`)
      if (storedLooks) {
        try {
          const parsedLooks = JSON.parse(storedLooks)
          setLooks(parsedLooks)
          
          // Verificar se já foi votado no primeiro look
          if (parsedLooks.length > 0 && parsedLooks[0].compositionId) {
            const voteStatus = await checkVoteStatus(parsedLooks[0].compositionId)
            if (voteStatus) {
              setHasVoted(true)
              setVotedType(voteStatus === "like" ? "like" : "dislike")
            }
          }
        } catch (error) {
          console.error("[ResultadoPage] Erro ao carregar looks:", error)
        }
      } else {
        // Se não houver looks, redirecionar para experimentar
        router.push(`/${lojistaId}/experimentar`)
      }

      // Carregar produtos selecionados do sessionStorage
      const storedProducts = sessionStorage.getItem(`products_${lojistaId}`)
      if (storedProducts) {
        try {
          const parsedProducts = JSON.parse(storedProducts)
          if (parsedProducts && Array.isArray(parsedProducts) && parsedProducts.length > 0) {
            setSelectedProducts(parsedProducts) // Carregar todos os produtos
          }
        } catch (error) {
          console.error("[ResultadoPage] Erro ao carregar produtos:", error)
        }
      }
    }

    loadLooksAndCheckVote()
  }, [lojistaId, router])

  // Verificar se cliente está logado
  useEffect(() => {
    if (!lojistaId) return

    const stored = localStorage.getItem(`cliente_${lojistaId}`)
    if (!stored) {
      router.push(`/${lojistaId}/login`)
    }
  }, [lojistaId, router])

  // Verificar voto quando mudar de look (mas não se vier de favoritos)
  useEffect(() => {
    if (!fromFavoritos && looks.length > 0 && looks[currentLookIndex]) {
      const checkVote = async () => {
        const compositionId = looks[currentLookIndex].compositionId
        if (compositionId) {
          const voteStatus = await checkVoteStatus(compositionId)
          if (voteStatus) {
            setHasVoted(true)
            setVotedType(voteStatus === "like" ? "like" : "dislike")
          } else {
            setHasVoted(false)
            setVotedType(null)
          }
        } else {
          setHasVoted(false)
          setVotedType(null)
        }
      }
      checkVote()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLookIndex, fromFavoritos, looks])

  // Recarregar favoritos quando o modal for aberto
  useEffect(() => {
    if (showFavoritesModal && lojistaId) {
      loadFavorites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFavoritesModal, lojistaId])

  // Carregar favoritos
  const loadFavorites = useCallback(async () => {
    if (!lojistaId) return

    try {
      setIsLoadingFavorites(true)
      const stored = localStorage.getItem(`cliente_${lojistaId}`)
      if (!stored) return

      const clienteData = JSON.parse(stored)
      const clienteId = clienteData.clienteId

      if (!clienteId) return

      // Adicionar timestamp para evitar cache
      const response = await fetch(
        `/api/cliente/favoritos?lojistaId=${encodeURIComponent(lojistaId)}&customerId=${encodeURIComponent(clienteId)}&_t=${Date.now()}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        const favoritesList = data.favorites || data.favoritos || []
        
        // Filtrar apenas os likes (action === "like" ou tipo === "like" ou votedType === "like")
        const likesOnly = favoritesList.filter((f: any) => {
          const hasImage = f.imagemUrl && f.imagemUrl.trim() !== ""
          const isLike = f.action === "like" || f.tipo === "like" || f.votedType === "like"
          // Se não tiver campo de ação, assumir que é like (compatibilidade com dados antigos)
          return hasImage && (isLike || (!f.action && !f.tipo && !f.votedType))
        })
        
        // Ordenar por data de criação (mais recente primeiro)
        const sortedFavorites = likesOnly.sort((a: any, b: any) => {
          // Tentar diferentes formatos de data
          let dateA: Date
          let dateB: Date
          
          if (a.createdAt?.toDate) {
            dateA = a.createdAt.toDate()
          } else if (a.createdAt?.seconds) {
            dateA = new Date(a.createdAt.seconds * 1000)
          } else if (typeof a.createdAt === 'string') {
            dateA = new Date(a.createdAt)
          } else if (a.createdAt) {
            dateA = new Date(a.createdAt)
          } else {
            dateA = new Date(0) // Data muito antiga se não houver
          }
          
          if (b.createdAt?.toDate) {
            dateB = b.createdAt.toDate()
          } else if (b.createdAt?.seconds) {
            dateB = new Date(b.createdAt.seconds * 1000)
          } else if (typeof b.createdAt === 'string') {
            dateB = new Date(b.createdAt)
          } else if (b.createdAt) {
            dateB = new Date(b.createdAt)
          } else {
            dateB = new Date(0) // Data muito antiga se não houver
          }
          
          // Ordenar do mais recente para o mais antigo
          return dateB.getTime() - dateA.getTime()
        })
        
        // Limitar a 10 favoritos mais recentes
        const limitedFavorites = sortedFavorites.slice(0, 10)
        
        console.log("[ResultadoPage] Favoritos carregados:", limitedFavorites.length, "de", likesOnly.length, "likes totais")
        
        setFavorites(limitedFavorites)
      }
    } catch (error) {
      console.error("[ResultadoPage] Erro ao carregar favoritos:", error)
    } finally {
      setIsLoadingFavorites(false)
    }
  }, [lojistaId])

  // Registrar ação (like/dislike)
  const registerAction = async (action: "like" | "dislike" | "share" | "checkout") => {
    const currentLook = looks[currentLookIndex]
    if (!currentLook || !lojistaId) return

    const stored = localStorage.getItem(`cliente_${lojistaId}`)
    const clienteData = stored ? JSON.parse(stored) : null
    const clienteId = clienteData?.clienteId || null
    const clienteNome = clienteData?.nome || null

    setLoadingAction(action)

    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lojistaId,
          action,
          compositionId: currentLook.compositionId || null,
          jobId: currentLook.jobId || null,
          customerId: clienteId,
          customerName: clienteNome,
          productName: currentLook.produtoNome,
          productPrice: currentLook.produtoPreco || null,
          imagemUrl: currentLook.imagemUrl,
        }),
      })

      return response.ok
    } catch (error) {
      console.error("[ResultadoPage] Erro ao registrar ação:", error)
      return false
    } finally {
      setLoadingAction(null)
    }
  }

  // Handle like
  const handleLike = useCallback(async () => {
    if (hasVoted) return

    const currentLook = looks[currentLookIndex]
    if (!currentLook || !lojistaId) return

    const stored = localStorage.getItem(`cliente_${lojistaId}`)
    const clienteData = stored ? JSON.parse(stored) : null
    const clienteId = clienteData?.clienteId || null
    const clienteNome = clienteData?.nome || null

    setLoadingAction("like")

    try {
      const response = await fetch("/api/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lojistaId,
          action: "like",
          compositionId: currentLook.compositionId || null,
          jobId: currentLook.jobId || null,
          customerId: clienteId,
          customerName: clienteNome,
          productName: currentLook.produtoNome,
          productPrice: currentLook.produtoPreco || null,
          imagemUrl: currentLook.imagemUrl,
        }),
      })

      if (response.ok) {
        setHasVoted(true)
        setVotedType("like")
        // Aguardar um pouco antes de atualizar favoritos para garantir que o backend processou
        setTimeout(async () => {
          await loadFavorites()
        }, 500)
      }
    } catch (error) {
      console.error("[ResultadoPage] Erro ao registrar like:", error)
    } finally {
      setLoadingAction(null)
    }
  }, [hasVoted, currentLookIndex, looks, lojistaId, loadFavorites])

  // Handle dislike
  const handleDislike = useCallback(async () => {
    if (hasVoted) return

    const success = await registerAction("dislike")
    if (success) {
      setHasVoted(true)
      setVotedType("dislike")
    }
  }, [hasVoted, currentLookIndex, looks, lojistaId])

  // Handle share
  const handleShare = useCallback(async () => {
    const currentLook = looks[currentLookIndex]
    if (!currentLook) return

    await registerAction("share")

    const shareUrl = `${window.location.origin}/${lojistaId}`
    const shareText = `Confira este look incrível da ${lojistaData?.nome || "loja"}! ${shareUrl}`

    if (navigator.share) {
      try {
        const shareData: any = {
          title: "Experimente AI - Look Gerado",
          text: shareText,
          url: shareUrl,
        }

        // Tentar incluir a imagem gerada se possível
        if (currentLook.imagemUrl) {
          try {
            const response = await fetch(currentLook.imagemUrl)
            const blob = await response.blob()
            const file = new File([blob], "look.jpg", { type: blob.type })
            shareData.files = [file]
          } catch (error) {
            console.warn("Não foi possível incluir imagem no compartilhamento:", error)
          }
        }

        await navigator.share(shareData)
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Erro ao compartilhar:", error)
          // Fallback: copiar link
          navigator.clipboard.writeText(shareUrl)
          alert("Link copiado para a área de transferência!")
        }
      }
    } else {
      // Fallback: copiar link
      navigator.clipboard.writeText(shareUrl)
      alert("Link copiado para a área de transferência!")
    }
  }, [currentLookIndex, looks, lojistaId, lojistaData, registerAction])

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    await registerAction("checkout")
    const checkoutLink = lojistaData?.salesConfig?.checkoutLink || lojistaData?.salesConfig?.whatsappLink
    if (checkoutLink) {
      window.open(checkoutLink, "_blank", "noopener,noreferrer")
    }
  }, [lojistaData])

  // Gerar novo look (remixar) com as mesmas foto e produtos
  const handleRegenerate = async () => {
    try {
      setLoadingAction("remix")

      // Buscar dados anteriores do sessionStorage
      const storedPhoto = sessionStorage.getItem(`photo_${lojistaId}`)
      const storedProducts = sessionStorage.getItem(`products_${lojistaId}`)

      if (!storedPhoto || !storedProducts) {
        // Se não houver dados salvos, redirecionar para experimentar
        router.push(`/${lojistaId}/experimentar`)
        return
      }

      const products = JSON.parse(storedProducts)
      const productIds = products.map((p: any) => p.id).filter(Boolean)

      if (productIds.length === 0) {
        throw new Error("Nenhum produto encontrado")
      }

      // Buscar clienteId do localStorage
      const stored = localStorage.getItem(`cliente_${lojistaId}`)
      const clienteData = stored ? JSON.parse(stored) : null
      const clienteId = clienteData?.clienteId || null

      // Usar a URL da foto já salva (não precisa fazer upload novamente)
      const personImageUrl = storedPhoto

      if (!personImageUrl) {
        throw new Error("Foto não encontrada")
      }

      const payload = {
        personImageUrl,
        productIds,
        lojistaId,
        customerId: clienteId,
        scenePrompts: [],
        options: { quality: "high", skipWatermark: true },
      }

      // Gerar novo look criativo
      const response = await fetch("/api/generate-looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Usar apenas a mensagem amigável do backend (já trata erro 429)
        const errorMessage = responseData.error || "Erro ao gerar novo look"
        throw new Error(errorMessage)
      }

      // Salvar novos resultados
      if (responseData.looks && Array.isArray(responseData.looks) && responseData.looks.length > 0) {
        sessionStorage.setItem(`looks_${lojistaId}`, JSON.stringify(responseData.looks))
        // Manter foto e produtos salvos
        sessionStorage.setItem(`photo_${lojistaId}`, storedPhoto)
        sessionStorage.setItem(`products_${lojistaId}`, storedProducts)
        
        // Resetar votação para o novo look
        setHasVoted(false)
        setVotedType(null)
        setCurrentLookIndex(0)
        
        // Atualizar favoritos antes de recarregar (caso tenha dado like anteriormente)
        await loadFavorites()
        
        // Recarregar a página para mostrar o novo look
        window.location.reload()
      } else {
        throw new Error("Nenhum look foi gerado")
      }
    } catch (error: any) {
      console.error("[handleRegenerate] Erro:", error)
      alert(error.message || "Erro ao remixar look. Tente novamente.")
    } finally {
      setLoadingAction(null)
    }
  }

  // Voltar para início
  const handleGoHome = () => {
    // Limpar produtos selecionados do sessionStorage
    sessionStorage.removeItem(`products_${lojistaId}`)
    router.push(`/${lojistaId}/experimentar`)
  }

  // Adicionar Acessório (Refinamento)
  const handleAddAccessory = () => {
    const currentLook = looks[currentLookIndex]
    if (!currentLook || !currentLook.imagemUrl) {
      alert("Erro: Imagem do look não encontrada")
      return
    }

    // Salvar a URL da imagem base para refinamento
    sessionStorage.setItem(`refine_baseImage_${lojistaId}`, currentLook.imagemUrl)
    
    // Salvar compositionId se disponível
    if (currentLook.compositionId) {
      sessionStorage.setItem(`refine_compositionId_${lojistaId}`, currentLook.compositionId)
    }

    // Marcar que estamos em modo de refinamento
    sessionStorage.setItem(`refine_mode_${lojistaId}`, "true")

    // Redirecionar para a galeria de produtos (experimentar) em modo refinamento
    router.push(`/${lojistaId}/experimentar?mode=refine`)
  }

  const currentLook = looks[currentLookIndex]
  const formatPrice = (value?: number | null) =>
    typeof value === "number"
      ? value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
      : "Consultar preço"

  if (!currentLook) {
    return (
      <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden bg-zinc-950 text-white">
      {/* Vídeo de Fundo - Fixa */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          src="/background.mp4"
          loop
          muted
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/background.webm" type="video/webm" />
          <source src="/background.mp4" type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex flex-col p-4 items-center justify-center space-y-3">
        {/* Caixa com Logo e Nome da Loja (adaptada) */}
        <div className="w-full max-w-sm">
          <div
            className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md px-3 py-2 shadow-lg flex items-center justify-center gap-2 relative"
          >
            <button
              onClick={() => router.push(`/${lojistaId}/experimentar`)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-white hover:text-zinc-200 transition"
            >
              <ArrowLeftCircle className="h-5 w-5" />
            </button>
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
              {lojistaData?.nome || "Loja"}
            </h3>
          </div>
        </div>

        {/* Card Principal do Look */}
        <div
          className="relative w-full max-w-sm space-y-3 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-4 shadow-lg"
        >
          {/* Tag Look Criativo IA */}
          <div className="absolute top-2 right-2 z-10">
            <span
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border-2 border-white/50 text-white"
              style={{
                background:
                  "linear-gradient(45deg, rgba(37,99,235,1), rgba(147,51,234,1), rgba(249,115,22,1), rgba(34,197,94,1))",
              }}
            >
              <Sparkles className="h-4 w-4 text-white" style={{ filter: "drop-shadow(0 0 2px white)" }} />
              Look Criativo IA
            </span>
          </div>

          {/* Imagem Gerada */}
          <div className="w-full rounded-xl overflow-hidden">
            <div className="relative rounded-2xl border-2 border-white/50 p-2 shadow-lg bg-white/10 inline-block w-full">
              <div className="relative border-2 border-dashed border-white/30 rounded-xl p-1 inline-block w-full">
                <img
                  src={currentLook.imagemUrl}
                  alt={currentLook.titulo}
                  className="h-auto w-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Ações e Feedback */}
          <div className="space-y-3">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">
                {votedType === "dislike" ? "Que pena! Vamos tentar de novo?" : "Look Salvo!"}
              </h2>
              <p className="text-sm text-zinc-400">O que fazer agora?</p>
            </div>

            {/* Card 1: Ações Primárias de Compra */}
            <div className="space-y-2 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white text-sm"
                style={{ background: "linear-gradient(to right, #1e3a8a, #3b82f6, #1e3a8a)" }}
              >
                <ShoppingCart className="h-4 w-4" /> Comprar Agora
              </button>
              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white text-sm border-2 border-white/10"
              >
                <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
              </button>
            </div>

            {/* Card 2: Ações Secundárias */}
            <div className="rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600/80 py-3 font-semibold text-white text-sm border-2 border-blue-500/50"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowFavoritesModal(true)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-pink-600/80 py-3 font-semibold text-white text-sm border-2 border-pink-500/50"
                >
                  <Heart className="h-4 w-4" /> Favoritos
                </button>
              </div>
            </div>

            {/* Card 3: Ações de Navegação e Geração */}
            <div className="space-y-2 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
              <button
                onClick={handleAddAccessory}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600/80 py-3 font-semibold text-white text-sm border-2 border-purple-500/50"
              >
                <Sparkles className="h-4 w-4" /> Adicionar Acessório
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loadingAction === "remix"}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600/80 py-3 font-semibold text-white text-sm border-2 border-green-500/50"
              >
                <RefreshCw className={`h-4 w-4 ${loadingAction === "remix" ? "animate-spin" : ""}`} /> Remixar Look
              </button>
              <button
                onClick={handleGoHome}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white text-sm border-2 border-white/10"
              >
                <Home className="h-4 w-4" /> Criar outro
              </button>
            </div>

            {/* Feedback Like/Dislike */}
            {!hasVoted && (
              <div className="text-center space-y-3 mt-4">
                <h3 className="text-base font-semibold text-white">Curtiu o Look?</h3>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={handleDislike}
                    disabled={loadingAction === "dislike"}
                    className="flex items-center gap-2 rounded-full bg-red-600/80 py-2.5 px-4 font-semibold text-white text-sm border-2 border-red-500/50"
                  >
                    <ThumbsDown className="h-4 w-4" /> Não
                  </button>
                  <button
                    onClick={handleLike}
                    disabled={loadingAction === "like"}
                    className="flex items-center gap-2 rounded-full bg-green-600/80 py-2.5 px-4 font-semibold text-white text-sm border-2 border-green-500/50"
                  >
                    <ThumbsUp className="h-4 w-4" /> Sim
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Favoritos */}
      {showFavoritesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-lg p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Meus Favoritos</h2>
              <button
                onClick={() => setShowFavoritesModal(false)}
                className="text-white/70 hover:text-white transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {isLoadingFavorites ? (
              <div className="py-12 text-center text-white">Carregando favoritos...</div>
            ) : favorites.length === 0 ? (
              <div className="py-12 text-center text-white/70">
                <Heart className="mx-auto mb-4 h-16 w-16 text-white/30" />
                <p>Você ainda não tem favoritos.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((favorito) => (
                  <div
                    key={favorito.id}
                    onClick={() => {
                      // Salvar dados do favorito no sessionStorage
                      const favoritoLook: GeneratedLook = {
                        id: favorito.id || `favorito-${Date.now()}`,
                        imagemUrl: favorito.imagemUrl,
                        titulo: favorito.productName || "Look favorito",
                        produtoNome: favorito.productName || "",
                        produtoPreco: favorito.productPrice || null,
                        compositionId: favorito.compositionId || null,
                        jobId: favorito.jobId || null,
                      }
                      sessionStorage.setItem(`favorito_${lojistaId}`, JSON.stringify(favoritoLook))
                      sessionStorage.setItem(`from_favoritos_${lojistaId}`, "true")
                      // Fechar modal e recarregar página
                      setShowFavoritesModal(false)
                      // Recarregar a página para aplicar as mudanças
                      window.location.href = `/${lojistaId}/resultado?from=favoritos`
                    }}
                    className="group relative overflow-hidden rounded-lg border-2 border-zinc-700 bg-zinc-900/50 transition hover:border-zinc-600 cursor-pointer"
                  >
                    {favorito.imagemUrl && (
                      <div className="relative aspect-square w-full">
                        <Image
                          src={favorito.imagemUrl}
                          alt={favorito.productName || "Look favorito"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {favorito.productName && (
                      <div className="p-3 bg-zinc-900">
                        <p className="text-sm font-semibold text-white line-clamp-2">
                          {favorito.productName}
                        </p>
                        {favorito.productPrice && (
                          <p className="mt-1 text-xs font-bold text-green-500">
                            {formatPrice(favorito.productPrice)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

