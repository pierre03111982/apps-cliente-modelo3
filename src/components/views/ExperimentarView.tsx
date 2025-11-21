"use client"

import Image from "next/image"
import {
  Upload,
  Camera,
  Wand2,
  Heart,
  X,
  Check,
  Filter,
  ThumbsUp,
  Instagram,
  Facebook,
  Music2,
  Share2,
  ArrowLeftCircle
} from "lucide-react"
import { CLOSET_BACKGROUND_IMAGE } from "@/lib/constants"
import type { LojistaData, Produto, GeneratedLook } from "@/lib/types"
import { useRouter } from "next/navigation"; // Importar useRouter

export interface ExperimentarViewProps {
  lojistaData: LojistaData | null
  isLoadingCatalog: boolean
  filteredCatalog: Produto[]
  categories: string[]
  activeCategory: string
  setActiveCategory: (category: string) => void
  userPhotoUrl: string | null
  isRefineMode: boolean
  refineBaseImageUrl: string | null
  handleChangePhoto: () => void
  handleRemovePhoto: () => void
  handlePhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  selectedProducts: Produto[]
  toggleProductSelection: (produto: Produto) => void
  categoryWarning: string | null
  handleSocialClick: (url: string) => void
  handleShareApp: () => void
  descontoAplicado: boolean
  formatPrice: (value?: number | null) => string
  handleVisualize: () => void
  isGenerating: boolean
  generationError: string | null
  showFavoritesModal: boolean
  setShowFavoritesModal: (show: boolean) => void
  isLoadingFavorites: boolean
  favorites: any[]
  router: any
  lojistaId: string
}

export function ExperimentarView({
  lojistaData,
  isLoadingCatalog,
  filteredCatalog,
  categories,
  activeCategory,
  setActiveCategory,
  userPhotoUrl,
  isRefineMode,
  refineBaseImageUrl,
  handleChangePhoto,
  handleRemovePhoto,
  handlePhotoUpload,
  selectedProducts,
  toggleProductSelection,
  categoryWarning,
  handleSocialClick,
  handleShareApp,
  descontoAplicado,
  formatPrice,
  handleVisualize,
  isGenerating,
  generationError,
  showFavoritesModal,
  setShowFavoritesModal,
  isLoadingFavorites,
  favorites,
  router,
  lojistaId
}: ExperimentarViewProps) {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-auto bg-zinc-950 text-white">
      {/* 1. Imagem de Fundo com Desfoque e Overlay - Fixa */}
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

      {/* 2. Conteúdo Principal */}
      <div className="relative z-10 min-h-screen p-4 pb-24">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Caixa com Logo e Nome da Loja (adaptada) */}
          <div>
            <div
              className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md px-3 sm:px-4 py-2 shadow-lg flex items-center justify-center gap-2 relative"
            >
              <button
                onClick={() => router.push(`/${lojistaId}/login`)}
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

          {/* Upload de Foto e Área Personalize o seu Look */}
          <div
            className={`flex flex-col sm:flex-row items-stretch gap-4 ${
              userPhotoUrl ? "justify-center" : "justify-center"
            }`}
          >
            {/* Upload de Foto */}
            <div className={`${userPhotoUrl ? 'w-full sm:max-w-[48%] md:max-w-[42%]' : 'w-full'}`}>
              {userPhotoUrl && !isRefineMode ? (
                <div className="relative inline-block">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-lg inline-block">
                    <img
                      src={userPhotoUrl}
                      alt="Sua foto"
                      className="h-auto w-auto max-w-full object-cover block rounded-lg cursor-pointer"
                      onClick={handleChangePhoto}
                      title="Clique para trocar a foto"
                    />
                  </div>
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute right-2 top-2 rounded-full bg-red-500/80 p-1.5 text-white transition hover:bg-red-600 z-10"
                    title="Remover foto"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleChangePhoto}
                    className="absolute bottom-2 right-2 rounded-full bg-zinc-700/80 p-1.5 text-white transition hover:bg-zinc-600 z-10"
                    title="Trocar foto"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              ) : isRefineMode ? (
                <div className="relative inline-block">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-lg inline-block">
                    {refineBaseImageUrl && (
                      <img
                        src={refineBaseImageUrl}
                        alt="Look base para refinamento"
                        className="h-auto w-auto max-w-full object-cover block rounded-lg"
                      />
                    )}
                  </div>
                  <div className="absolute top-2 left-2 bg-purple-600/90 text-white px-2 py-0.5 rounded-md text-xs font-semibold">
                    Modo Refinamento
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="photo-upload"
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-zinc-600 bg-zinc-800/70 hover:bg-zinc-800/90 transition-colors p-6 sm:p-8 md:p-10"
                >
                  <Camera className="h-10 w-10 text-zinc-400" />
                  <span className="text-sm font-medium text-white text-center px-2">
                    Adicionar sua foto
                  </span>
                  <span className="text-xs text-zinc-400 mt-1 text-center px-2">Para provador virtual</span>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Área: Personalize o seu Look */}
            {userPhotoUrl && (
              <div
                className="w-full sm:flex-1 self-stretch rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-4 shadow-lg flex flex-col min-h-0 sm:max-w-[48%] md:max-w-[42%]"
              >
                <div className="mb-4 shrink-0">
                  <div className="rounded-lg border-2 border-zinc-600 bg-zinc-900 p-2 shadow-sm">
                    <h2 className="text-center text-xs font-semibold text-white uppercase tracking-wide">
                      Provador Virtual com IA
                    </h2>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 flex-1 justify-between min-h-0">
                  <div className="flex flex-col gap-3 shrink-0">
                    {/* Passos */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white shadow-sm">1</div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-white">Adicione sua foto</span>
                        {userPhotoUrl && (<div className="mt-1 h-1 w-full rounded-full bg-green-500"></div>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${selectedProducts.length > 0 ? 'bg-purple-600 text-white' : 'bg-zinc-600 text-zinc-400'}`}>2</div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-white">Escolha o Produto</span>
                        {selectedProducts.length > 0 && (<div className="mt-1 h-1 w-full rounded-full bg-green-500"></div>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm ${userPhotoUrl && selectedProducts.length > 0 ? 'bg-purple-600 text-white' : 'bg-zinc-600 text-zinc-400'}`}>3</div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-semibold text-white">Crie seu Look</span>
                        {userPhotoUrl && selectedProducts.length > 0 && (<div className="mt-1 h-1 w-full rounded-full bg-green-500"></div>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Caixa com Produtos Selecionados */}
          {userPhotoUrl && selectedProducts.length > 0 && (
            <div
              className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-3 shadow-lg w-full sm:w-[90%] md:w-[80%] lg:w-[70%] mx-auto"
            >
              <h3 className="mb-2 text-center text-sm font-bold text-white">
                Produtos Selecionados
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedProducts.map((produto, index) => (
                  <div key={produto.id || index} className="rounded-lg border-2 border-zinc-600 bg-zinc-900 overflow-hidden shadow-sm relative">
                    {/* Botão para remover produto */}
                    <button
                      onClick={() => toggleProductSelection(produto)}
                      className="absolute right-1 top-1 z-10 rounded-full bg-red-500/80 p-1 text-white transition hover:bg-red-600"
                      title="Remover produto"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {/* Imagem do Produto */}
                    {produto.imagemUrl && (
                      <div className="relative aspect-square w-full">
                        <Image
                          src={produto.imagemUrl}
                          alt={produto.nome}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    {/* Informações do Produto */}
                    <div className="p-2 bg-zinc-800">
                      <h3 className="text-left text-xs font-semibold text-white line-clamp-2 h-8">
                        {produto.nome}
                      </h3>
                      <div className="flex flex-col gap-0.5 mt-1">
                        {(() => {
                          const desconto = lojistaData?.descontoRedesSociais
                          const expiraEm = lojistaData?.descontoRedesSociaisExpiraEm
                          const descontoValido = desconto && desconto > 0 && (!expiraEm || new Date(expiraEm) >= new Date())
                          
                          if (descontoAplicado && descontoValido) {
                            return (
                              <>
                                <p className="text-left text-xs text-zinc-400 line-through">
                                  {formatPrice(produto.preco)}
                                </p>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <p className="text-left text-sm font-bold text-green-500">
                                    {formatPrice(produto.preco ? produto.preco * (1 - (desconto / 100)) : 0)}
                                  </p>
                                  <p className="text-left text-[10px] font-semibold text-green-400 leading-tight">
                                    Desconto aplicado
                                  </p>
                                </div>
                              </>
                            )
                          }
                          return (
                            <p className="text-left text-sm font-bold text-white">
                              {formatPrice(produto.preco)}
                            </p>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aviso sobre seleção de produtos */}
          {userPhotoUrl && (
            <div className="rounded-xl border-2 border-blue-500/50 bg-blue-500/10 backdrop-blur-md p-3 shadow-lg">
              {isRefineMode ? (
                <p className="text-xs font-medium text-blue-200 text-center">
                  ✨ <span className="font-bold">Modo Refinamento:</span> Adicione até <span className="font-bold text-yellow-300">2 acessórios leves</span> (Jóias, Óculos, Cosméticos, Tintura). Roupas e Calçados não são permitidos.
                </p>
              ) : (
                <p className="text-xs font-medium text-blue-200 text-center">
                  💡 Você pode selecionar até <span className="font-bold text-yellow-300">2 produtos</span> de <span className="font-bold text-yellow-300">categorias diferentes</span>
                </p>
              )}
            </div>
          )}

          {/* Caixa de Redes Sociais e Desconto */}
          <div className="rounded-xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md px-4 py-3 shadow-lg">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1.5">
                <p className="text-xs font-medium text-white text-center">
                  Siga, Curta ou Compartilhe !!!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {/* Instagram */}
                {lojistaData?.redesSociais?.instagram ? (
                  <button
                    onClick={() => handleSocialClick(lojistaData.redesSociais.instagram!.startsWith('http') ? lojistaData.redesSociais.instagram! : `https://instagram.com/${lojistaData.redesSociais.instagram!.replace('@', '')}`)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white transition hover:scale-110 cursor-pointer"
                  >
                    <Instagram className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-50">
                    <Instagram className="h-5 w-5" />
                  </div>
                )}
                
                {/* Facebook */}
                {lojistaData?.redesSociais?.facebook ? (
                  <button
                    onClick={() => handleSocialClick(lojistaData.redesSociais.facebook!.startsWith('http') ? lojistaData.redesSociais.facebook! : `https://facebook.com/${lojistaData.redesSociais.facebook!}`)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white transition hover:scale-110 cursor-pointer"
                  >
                    <Facebook className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white opacity-50">
                    <Facebook className="h-5 w-5" />
                  </div>
                )}
                
                {/* TikTok */}
                {lojistaData?.redesSociais?.tiktok ? (
                  <button
                    onClick={() => handleSocialClick(lojistaData.redesSociais.tiktok!.startsWith('http') ? lojistaData.redesSociais.tiktok! : `https://tiktok.com/@${lojistaData.redesSociais.tiktok!.replace('@', '')}`)}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white transition hover:scale-110 cursor-pointer"
                  >
                    <Music2 className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white opacity-50">
                    <Music2 className="h-5 w-5" />
                  </div>
                )}
                
                {/* Compartilhar App */}
                <button
                  onClick={handleShareApp}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white transition hover:scale-110 cursor-pointer"
                  title="Compartilhar aplicativo"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              {/* Mostrar desconto apenas se houver valor cadastrado e não expirado */}
              {(() => {
                const desconto = lojistaData?.descontoRedesSociais
                const expiraEm = lojistaData?.descontoRedesSociaisExpiraEm
                
                // Verificar se há desconto válido
                if (!desconto || desconto <= 0) {
                  return null // Não mostrar se não houver desconto ou for 0
                }
                
                // Verificar se expirou
                if (expiraEm) {
                  const dataExpiracao = new Date(expiraEm)
                  const agora = new Date()
                  if (dataExpiracao < agora) {
                    return null // Não mostrar se expirou
                  }
                }
                
                // Mostrar desconto
                return (
                  <>
                    <p className="text-sm font-semibold text-white text-center">
                      <span className="text-yellow-400 font-bold">GANHE</span> <span className="text-xl md:text-2xl font-bold text-yellow-400">{desconto}%</span> de <span className="text-yellow-400 font-bold">DESCONTO</span> em Todos os Produtos!
                    </p>
                    {descontoAplicado && (
                      <p className="text-xs font-semibold text-green-400 text-center animate-pulse">
                        ✓ Desconto aplicado!
                      </p>
                    )}
                  </>
                )
              })()}
            </div>
          </div>

          {/* Card Principal */}
          <div className="rounded-3xl border-2 border-zinc-700 bg-zinc-800/70 backdrop-blur-md p-6 md:p-8 shadow-lg">

            {/* Abas de Categoria */}
            <div className="mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 sm:mx-0">
              <div className="flex gap-2 justify-start sm:justify-center px-2 sm:px-0 min-w-max sm:min-w-0 flex-wrap sm:flex-nowrap">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                      activeCategory === category
                        ? "bg-purple-600 text-white border-2 border-purple-500 shadow-md"
                        : "bg-zinc-700 text-zinc-300 border-2 border-zinc-600 hover:border-zinc-500"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Aviso de categoria */}
            {categoryWarning && (
              <div className="mb-4 rounded-lg border-2 border-blue-500/50 bg-blue-500/10 px-4 py-3">
                <p className="text-sm font-medium text-blue-200">{categoryWarning}</p>
              </div>
            )}

            {/* Grid de Produtos */}
            {isLoadingCatalog ? (
              <div className="py-12 text-center text-white">Carregando produtos...</div>
            ) : filteredCatalog.length === 0 ? (
              <div className="py-12 text-center text-white/70">
                Nenhum produto encontrado nesta categoria.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pb-4 pr-2 custom-scrollbar">
                {filteredCatalog.map((produto) => {
                  const isSelected = selectedProducts.some((p) => p.id === produto.id)
                  return (
                    <button
                      key={produto.id}
                      onClick={() => toggleProductSelection(produto)}
                      className={`group relative overflow-hidden rounded-xl border-2 transition ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10 shadow-glow ring-2 ring-purple-500"
                          : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"
                      }`}
                    >
                      {produto.imagemUrl && (
                        <div className="relative aspect-square w-full">
                          <Image
                            src={produto.imagemUrl}
                            alt={produto.nome}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-3 bg-zinc-900">
                        <h3 className="text-left text-sm font-semibold text-white line-clamp-2">
                          {produto.nome}
                        </h3>
                        <div className="mt-1 flex flex-col gap-0.5">
                          {(() => {
                            const desconto = lojistaData?.descontoRedesSociais
                            const expiraEm = lojistaData?.descontoRedesSociaisExpiraEm
                            const descontoValido = desconto && desconto > 0 && (!expiraEm || new Date(expiraEm) >= new Date())
                            
                            if (descontoAplicado && descontoValido) {
                              return (
                                <>
                                  <p className="text-left text-xs text-zinc-400 line-through">
                                    {formatPrice(produto.preco)}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className="text-left text-sm font-bold text-green-500">
                                      {formatPrice(produto.preco ? produto.preco * (1 - (desconto / 100)) : 0)}
                                    </p>
                                    <p className="text-left text-[10px] font-semibold text-green-400">
                                      Desconto aplicado
                                    </p>
                                  </div>
                                </>
                              )
                            }
                            return (
                              <p className="text-left text-sm font-bold text-white">
                                {formatPrice(produto.preco)}
                              </p>
                            )
                          })()}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute right-2 top-2 rounded-full bg-purple-600 p-1.5 shadow-lg">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botão FAB - Visualize */}
      {(userPhotoUrl) && selectedProducts.length > 0 && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 p-0.5 sm:p-1 rounded-full shadow-lg" style={{ background: 'linear-gradient(to right, #facc15, #ec4899, #a855f7, #3b82f6, #10b981)' }}>
          <button
            onClick={handleVisualize}
            disabled={isGenerating}
            className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-purple-600 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base md:text-lg font-bold text-white transition hover:bg-purple-700 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-full h-full"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span className="hidden sm:inline">Gerando...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="hidden sm:inline">CRIAR LOOK</span>
                <span className="sm:hidden">CRIAR</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Mensagem de erro */}
      {generationError && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg border-2 border-red-500/50 bg-red-500/10 px-4 py-3 backdrop-blur-md">
          <p className="text-sm font-medium text-red-200">{generationError}</p>
        </div>
      )}

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
                      // Navegar para Tela 3
                      router.push(`/${lojistaId}/resultado?from=favoritos`)
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

