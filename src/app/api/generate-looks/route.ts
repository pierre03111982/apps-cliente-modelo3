import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCAL_BACKEND = "http://localhost:3000";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_LOCAL_BACKEND;

    const paineladmResponse = await fetch(
      `${backendUrl}/api/lojista/composicoes/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await paineladmResponse.json();

    return NextResponse.json(data, { status: paineladmResponse.status });
  } catch (error) {
    console.error("[modelo-1/api/generate-looks] Erro no proxy:", error);
    return NextResponse.json(
      { error: "Erro interno no proxy de geração" },
      { status: 500 }
    );
  }
}

