import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCAL_BACKEND = "http://localhost:3000";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

/**
 * GET /api/cliente/find
 * Proxy para buscar cliente por WhatsApp
 * Query params: lojistaId, whatsapp
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lojistaId = searchParams.get("lojistaId");
    const whatsapp = searchParams.get("whatsapp");

    if (!lojistaId || !whatsapp) {
      return NextResponse.json(
        { error: "lojistaId e whatsapp são obrigatórios" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_LOCAL_BACKEND;

    const paineladmResponse = await fetch(
      `${backendUrl}/api/cliente/find?lojistaId=${encodeURIComponent(lojistaId)}&whatsapp=${encodeURIComponent(whatsapp)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await paineladmResponse.json();

    return NextResponse.json(data, { status: paineladmResponse.status });
  } catch (error) {
    console.error("[appmelhorado/api/cliente/find] Erro no proxy:", error);
    return NextResponse.json(
      { error: "Erro interno no proxy de busca de cliente" },
      { status: 500 }
    );
  }
}

