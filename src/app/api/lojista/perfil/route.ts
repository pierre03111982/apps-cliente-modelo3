import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCAL_BACKEND = "http://localhost:3000";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

/**
 * GET /api/lojista/perfil
 * Busca dados do perfil da loja
 * Query: lojistaId
 */
export async function GET(request: NextRequest) {
  try {
    const lojistaId = request.nextUrl.searchParams.get("lojistaId");

    if (!lojistaId) {
      return NextResponse.json(
        { error: "lojistaId é obrigatório" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      process.env.NEXT_PUBLIC_PAINELADM_URL ||
      DEFAULT_LOCAL_BACKEND;

    const response = await fetch(
      `${backendUrl}/api/lojista/perfil?lojistaId=${encodeURIComponent(lojistaId)}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[modelo-1/api/lojista/perfil] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao buscar perfil da loja" },
      { status: 500 }
    );
  }
}

