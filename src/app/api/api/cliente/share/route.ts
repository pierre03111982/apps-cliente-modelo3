import { NextRequest, NextResponse } from "next/server";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

/**
 * POST /api/cliente/share
 * Proxy para criar link de compartilhamento no backend (paineladm)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    const response = await fetch(`${backendUrl}/api/cliente/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Cliente Share Proxy] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao criar link de compartilhamento" },
      { status: 500 }
    );
  }
}

