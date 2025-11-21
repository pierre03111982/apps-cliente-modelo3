"use client"

import { useSearchParams } from "next/navigation"
import Image from "next/image" // Adicionar Image
import { Camera, User, Share2, Star, ArrowLeftCircle, LogIn, UserPlus, Sparkles, RefreshCw, Home, Instagram, Facebook, Music2, MessageCircle, ShoppingCart, Heart } from "lucide-react" // Adicionar novos ícones
import { FaApple, FaFacebook, FaGoogle, FaWhatsapp } from "react-icons/fa" // Adicionar icones sociais e whatsapp
import { ExperimentarView } from "@/components/views/ExperimentarView"
import { useState } from "react"
import { Produto } from "@/lib/types"

export default function DemoPage() {
  const searchParams = useSearchParams()
  const tela = searchParams.get("tela") || "1"

  const MOCK_USER_PHOTO = "/mock-person.jpg"
  const MOCK_RESULT_PHOTO = "/mock-result.jpg"

  const [demoSelectedProducts, setDemoSelectedProducts] = useState<Produto[]>([])

  const mockCatalog: Produto[] = [
      { id: '1', nome: 'Vestido Gala Noir', preco: 1299.90, imagemUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=500&auto=format&fit=crop', categoria: 'Gala' },
      { id: '2', nome: 'Blazer Alta Costura', preco: 899.90, imagemUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=500&auto=format&fit=crop', categoria: 'Alfaiataria' },
       { id: '3', nome: 'Clutch Diamante', preco: 459.90, imagemUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&auto=format&fit=crop', categoria: 'Acessórios' },
        { id: '4', nome: 'Scarpin Gold', preco: 699.90, imagemUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500&auto=format&fit=crop', categoria: 'Calçados' },
  ]

  // --- TELA 1: LOGIN (Premium) ---
  if (tela === "1") {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white">
        {/* Background Image Fixa */}
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

        {/* Conteúdo do Formulário */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-8 overflow-y-auto">
          
          {/* Caixa com Logo e Nome da Loja */}
          <div className="w-full max-w-sm mb-6">
            <div
              className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md px-3 py-2 shadow-lg flex items-center justify-center gap-2 relative"
            >
              {/* Botão de voltar não faz nada no demo */}
              <button
                onClick={() => {}}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-white opacity-0 cursor-default"
              >
                <ArrowLeftCircle className="h-5 w-5" />
              </button>
              {/* No demo, vamos usar um placeholder de logo */}
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-600 flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                <span className="font-serif font-bold text-white text-lg">S</span>
              </div>
              <h3
                className="text-base font-bold text-white"
                translate="no"
              >
                Sua Loja
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
            <button
              onClick={() => { /* No demo, este botão não faz nada */ }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white py-2.5 font-semibold text-sm transition-all hover:bg-purple-700"
            >
              <UserPlus className="h-4 w-4" />
              Cadastrar conta
            </button>

            {/* Formulário (campos desabilitados) */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                type="text"
                disabled
                placeholder="Nome completo"
                className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              />
              <input
                type="tel"
                disabled
                placeholder="WhatsApp com DDD"
                className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              />
              <input
                type="password"
                disabled
                placeholder="Senha"
                className="w-full rounded-lg border-2 border-zinc-600 bg-zinc-900 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all text-sm"
              />
              <button
                type="submit"
                disabled
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white py-3 font-bold text-sm transition hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" />
                Entrar
              </button>
            </form>

            {/* Divisor e Login Social */}
            <div className="space-y-4">
              <p className="text-sm text-zinc-400">Continuar com...</p>
              <div className="flex justify-center gap-4">
                <button disabled className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white opacity-50 cursor-not-allowed">
                  <FaGoogle />
                </button>
                <button disabled className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white opacity-50 cursor-not-allowed">
                  <FaApple />
                </button>
                <button disabled className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-700 text-white opacity-50 cursor-not-allowed">
                  <FaFacebook />
                </button>
              </div>
            </div>
            
            {/* Link de Rodapé */}
            <p className="text-sm text-zinc-400">
              Não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => { /* No demo, este botão não faz nada */ }}
                className="font-bold underline text-white hover:text-zinc-200 transition opacity-50 cursor-not-allowed"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // --- TELA 2: UPLOAD (USANDO VIEW REAL) ---
  if (tela === "2") {
    // Mock de router para ExperimentarView
    const mockRouter = { push: (path: string) => console.log("Demo navigate to:", path), back: () => console.log("Demo back") };
    
    return (
      <ExperimentarView 
        lojistaData={{ 
            id: 'demo',
            nome: "Sua Loja", // Nome da loja atualizado para "Sua Loja"
            logoUrl: null,
            descricao: "Loja de demonstração",
            salesConfig: {}, 
            redesSociais: { instagram: "@lojademo" },
            descontoRedesSociais: 0,
            descontoRedesSociaisExpiraEm: null
        }}
        isLoadingCatalog={false}
        filteredCatalog={mockCatalog}
        categories={["Coleção", "Gala", "Alfaiataria", "Acessórios"]}
        activeCategory="Coleção"
        setActiveCategory={() => {}}
        userPhotoUrl={MOCK_USER_PHOTO}
        isRefineMode={false}
        refineBaseImageUrl={null}
        handleChangePhoto={() => {}}
        handleRemovePhoto={() => {}}
        handlePhotoUpload={() => {}}
        selectedProducts={demoSelectedProducts}
        toggleProductSelection={(p) => {
            setDemoSelectedProducts(prev => {
                const exists = prev.find(i => i.id === p.id)
                if (exists) return prev.filter(i => i.id !== p.id)
                return [...prev, p]
            })
        }}
        categoryWarning={null}
        handleSocialClick={() => {}}
        handleShareApp={() => {}}
        descontoAplicado={false}
        formatPrice={(v) => `R$ ${v?.toFixed(2).replace('.', ',')}`}
        handleVisualize={() => { /* No demo, este botão não faz nada */ }}
        isGenerating={false}
        generationError={null}
        showFavoritesModal={false}
        setShowFavoritesModal={() => {}}
        isLoadingFavorites={false}
        favorites={[]}
        router={mockRouter}
        lojistaId="demo"
      />
    )
  }

  // --- TELA 3: RESULTADO (Premium) ---
  if (tela === "3") {
    // Mock de router para ResultadoPage
    const mockRouter = { push: (path: string) => console.log("Demo navigate to:", path), back: () => console.log("Demo back") };

    return (
      <div className="relative min-h-screen w-screen overflow-hidden bg-zinc-950 text-white">
        {/* Imagem de Fundo - Fixa */}
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
                onClick={() => mockRouter.push("/demo?tela=2")}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-white hover:text-zinc-200 transition"
              >
                <ArrowLeftCircle className="h-5 w-5" />
              </button>
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-zinc-600 flex-shrink-0 bg-zinc-900 flex items-center justify-center">
                <span className="font-serif font-bold text-white text-lg">S</span>
              </div>
              <h3
                className="text-base font-bold text-white"
                translate="no"
              >
                Sua Loja
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
                    src={MOCK_RESULT_PHOTO}
                    alt="Resultado"
                    className="h-auto w-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Ações e Feedback */}
            <div className="space-y-3">
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">
                  Look Salvo!
                </h2>
                <p className="text-sm text-zinc-400">O que fazer agora?</p>
              </div>

              {/* Card 1: Ações Primárias de Compra */}
              <div className="space-y-2 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-semibold text-white text-sm opacity-50 cursor-not-allowed"
                  style={{ background: "linear-gradient(to right, #1e3a8a, #3b82f6, #1e3a8a)" }}
                >
                  <ShoppingCart className="h-4 w-4" /> Comprar Agora
                </button>
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white text-sm border-2 border-white/10 opacity-50 cursor-not-allowed"
                >
                  <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
                </button>
              </div>

              {/* Card 2: Ações Secundárias */}
              <div className="rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600/80 py-3 font-semibold text-white text-sm border-2 border-blue-500/50 opacity-50 cursor-not-allowed"
                  >
                    <Share2 className="h-4 w-4" /> Compartilhar
                  </button>
                  <button
                    disabled
                    className="flex items-center justify-center gap-2 rounded-xl bg-pink-600/80 py-3 font-semibold text-white text-sm border-2 border-pink-500/50 opacity-50 cursor-not-allowed"
                  >
                    <Heart className="h-4 w-4" /> Favoritos
                  </button>
                </div>
              </div>

              {/* Card 3: Ações de Navegação e Geração */}
              <div className="space-y-2 rounded-2xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg">
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-purple-600/80 py-3 font-semibold text-white text-sm border-2 border-purple-500/50 opacity-50 cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" /> Adicionar Acessório
                </button>
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600/80 py-3 font-semibold text-white text-sm border-2 border-green-500/50 opacity-50 cursor-not-allowed"
                >
                  <RefreshCw className="h-4 w-4" /> Remixar Look
                </button>
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white text-sm border-2 border-white/10 opacity-50 cursor-not-allowed"
                >
                  <Home className="h-4 w-4" /> Criar outro
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <div className="text-white">Selecione uma tela para pré-visualizar.</div>
}
