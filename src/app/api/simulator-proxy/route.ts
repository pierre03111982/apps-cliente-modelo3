import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCAL_BACKEND = "http://localhost:3000";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const lojistaId = request.nextUrl.searchParams.get("lojistaId");

  if (!lojistaId) {
    return NextResponse.json(
      { error: "lojistaId é obrigatório" },
      { status: 400 }
    );
  }

  try {
    // Em produção, usamos a URL do paineladm configurada em env.
    // Em desenvolvimento, caímos para localhost.
    const painelBaseUrl =
      process.env.NEXT_PUBLIC_PAINELADM_URL ?? DEFAULT_LOCAL_BACKEND;

    const url = `${painelBaseUrl}/api/simulator/data?lojistaId=${encodeURIComponent(
      lojistaId
    )}`;

    const response = await fetch(url, {
      // Evitar cache agressivo em ambiente serverless
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("[simulator-proxy] Erro ao buscar dados do paineladm:", error);
    return NextResponse.json(
      { error: "Erro ao buscar dados do paineladm" },
      { status: 500 }
    );
  }
}


