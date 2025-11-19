import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore"
import { getFirestoreClient, isFirebaseConfigured } from "./firebase"
import type { LojistaData, Produto } from "./types"
import { PRODUTOS_TESTE } from "./produtosTeste"

const produtosCollectionPath = (lojistaId: string) => {
  const db = getFirestoreClient()
  if (!db) return null
  return collection(db, "lojas", lojistaId, "produtos")
}

export async function fetchLojistaData(
  lojistaId: string
): Promise<LojistaData | null> {
  console.log("[fetchLojistaData] Iniciando busca para lojistaId:", lojistaId)
  console.log("[fetchLojistaData] Firebase configurado:", isFirebaseConfigured)
  
  if (!isFirebaseConfigured) {
    console.warn("[fetchLojistaData] Firebase não configurado!")
    return null
  }

  try {
    const db = getFirestoreClient()
    if (!db) {
      console.warn("[fetchLojistaData] Firestore não disponível")
      return null
    }

    console.log("[fetchLojistaData] Buscando em lojas/", lojistaId)
    // Primeiro, tentar buscar dados diretamente do documento da loja
    const docRef = doc(db, "lojas", lojistaId)
    const snapshot = await getDoc(docRef)
    
    console.log("[fetchLojistaData] Snapshot existe:", snapshot.exists())

    if (snapshot.exists()) {
      const data = snapshot.data()
      console.log("[fetchLojistaData] Dados encontrados no documento da loja:", { 
        nome: data?.nome, 
        temNome: !!data?.nome,
        temDescricao: !!data?.descricao 
      })
      if (data?.nome || data?.descricao) {
        const result = {
          id: snapshot.id,
          nome: data.nome ?? "Loja",
          logoUrl: data.logoUrl ?? null,
          descricao: data.descricao ?? null,
          redesSociais: {
            instagram: data.instagram || data.redesSociais?.instagram || null,
            facebook: data.facebook || data.redesSociais?.facebook || null,
            tiktok: data.tiktok || data.redesSociais?.tiktok || null,
          },
          salesConfig: data.salesConfig ?? {},
          descontoRedesSociais: data.descontoRedesSociais ?? null,
          descontoRedesSociaisExpiraEm: data.descontoRedesSociaisExpiraEm ?? null,
        }
        console.log("[fetchLojistaData] Retornando dados da loja:", result.nome)
        return result
      }
    }

    console.log("[fetchLojistaData] Tentando buscar em perfil/dados")
    // Tentar buscar em perfil/dados
    const perfilDadosRef = doc(db, "lojas", lojistaId, "perfil", "dados")
    const perfilDadosSnap = await getDoc(perfilDadosRef)
    
    if (perfilDadosSnap.exists()) {
      const data = perfilDadosSnap.data()
      console.log("[fetchLojistaData] Dados encontrados em perfil/dados:", data?.nome)
      return {
        id: lojistaId,
        nome: data.nome ?? "Loja",
        logoUrl: data.logoUrl ?? null,
        descricao: data.descricao ?? null,
        redesSociais: {
          instagram: data.instagram || data.redesSociais?.instagram || null,
          facebook: data.facebook || data.redesSociais?.facebook || null,
          tiktok: data.tiktok || data.redesSociais?.tiktok || null,
        },
        salesConfig: data.salesConfig ?? {},
        descontoRedesSociais: data.descontoRedesSociais ?? null,
        descontoRedesSociaisExpiraEm: data.descontoRedesSociaisExpiraEm ?? null,
      }
    }

    console.log("[fetchLojistaData] Tentando buscar em perfil/publico")
    // Tentar buscar em perfil/publico
    const perfilPublicoRef = doc(db, "lojas", lojistaId, "perfil", "publico")
    const perfilPublicoSnap = await getDoc(perfilPublicoRef)
    
    if (perfilPublicoSnap.exists()) {
      const data = perfilPublicoSnap.data()
      console.log("[fetchLojistaData] Dados encontrados em perfil/publico:", data?.nome)
      return {
        id: lojistaId,
        nome: data.nome ?? "Loja",
        logoUrl: data.logoUrl ?? null,
        descricao: data.descricao ?? null,
        redesSociais: {
          instagram: data.instagram || data.redesSociais?.instagram || null,
          facebook: data.facebook || data.redesSociais?.facebook || null,
          tiktok: data.tiktok || data.redesSociais?.tiktok || null,
        },
        salesConfig: data.salesConfig ?? {},
        descontoRedesSociais: data.descontoRedesSociais ?? null,
      }
    }

    console.warn("[fetchLojistaData] Nenhum dado encontrado para lojistaId:", lojistaId)
    return null
  } catch (error: any) {
    // Se for erro de permissão, logar mas não quebrar o fluxo
    if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
      console.warn("[fetchLojistaData] Erro de permissão do Firestore:", error.message)
    } else {
      console.error("[fetchLojistaData] Erro ao buscar dados do lojista:", error)
    }
    return null
  }
}

export async function fetchProdutos(
  lojistaId: string,
  opts?: { categoria?: string; limite?: number }
): Promise<Produto[]> {
  let produtos: Produto[] = []

  // Tentar buscar do Firestore se configurado
  if (isFirebaseConfigured) {
    try {
      const baseCollection = produtosCollectionPath(lojistaId)
      if (baseCollection) {
        const filtros = [] as any[]

        if (opts?.categoria) {
          filtros.push(where("categoria", "==", opts.categoria))
        }

        let produtosQuery = query(baseCollection, ...filtros)

        if (opts?.limite) {
          produtosQuery = query(produtosQuery, limit(opts.limite))
        }

        const snapshot = await getDocs(produtosQuery)

        produtos = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data()

          return {
            id: docSnapshot.id,
            nome: typeof data.nome === "string" ? data.nome : "Produto",
            preco: typeof data.preco === "number" ? data.preco : null,
            imagemUrl: typeof data.imagemUrl === "string" ? data.imagemUrl : null,
            categoria: typeof data.categoria === "string" ? data.categoria : null,
            tamanhos: Array.isArray(data.tamanhos) ? (data.tamanhos as string[]) : [],
            cores: Array.isArray(data.cores) ? (data.cores as string[]) : [],
            medidas: typeof data.medidas === "string" ? data.medidas : undefined,
            estoque: typeof data.estoque === "number" ? data.estoque : null,
            obs: typeof data.obs === "string" ? data.obs : undefined,
          }
        })
      }
    } catch (error: any) {
      // Se for erro de permissão, logar mas não quebrar o fluxo
      if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
        console.warn("[fetchProdutos] Erro de permissão do Firestore:", error.message)
      } else {
        console.error("[fetchProdutos] Erro ao buscar produtos:", error)
      }
    }
  }

  // Se não encontrou produtos no Firestore, usar produtos de teste
  if (produtos.length === 0) {
    console.log("[fetchProdutos] Nenhum produto encontrado no Firestore. Usando produtos de teste.")
    produtos = [...PRODUTOS_TESTE]
  }

  // Aplicar filtro de categoria se especificado e usando produtos de teste
  if (opts?.categoria && produtos.length > 0 && produtos[0].id?.startsWith("produto-teste")) {
    produtos = produtos.filter((p) => p.categoria === opts.categoria)
  }

  // Aplicar limite se especificado
  if (opts?.limite && produtos.length > opts.limite) {
    produtos = produtos.slice(0, opts.limite)
  }

  return produtos
}

