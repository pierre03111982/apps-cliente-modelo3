import { NextRequest, NextResponse } from "next/server";

const DEFAULT_LOCAL_BACKEND = "http://localhost:3000";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ?? DEFAULT_LOCAL_BACKEND;

    console.log("[modelo-1/api/generate-looks] Iniciando requisição:", {
      backendUrl,
      hasPersonImageUrl: !!body.personImageUrl,
      productIdsCount: body.productIds?.length || 0,
      lojistaId: body.lojistaId,
      customerId: body.customerId,
    });

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

    if (!paineladmResponse.ok) {
      console.error("[modelo-1/api/generate-looks] Erro do backend:", {
        status: paineladmResponse.status,
        error: data.error,
        details: data.details,
      });
      
      return NextResponse.json(
        {
          error: data.error || "Erro ao gerar composição",
          details: data.details || `Status: ${paineladmResponse.status}`,
        },
        { status: paineladmResponse.status }
      );
    }

    console.log("[modelo-1/api/generate-looks] Sucesso:", {
      composicaoId: data.composicaoId,
      looksCount: data.looks?.length || 0,
    });

    return NextResponse.json(data, { status: paineladmResponse.status });
  } catch (error) {
    console.error("[modelo-1/api/generate-looks] Erro no proxy:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    return NextResponse.json(
      {
        error: "Erro interno no proxy de geração",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

