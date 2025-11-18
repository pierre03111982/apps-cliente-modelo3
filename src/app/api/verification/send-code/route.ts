import { NextRequest, NextResponse } from "next/server";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

/**
 * Proxy para o backend (paineladm) responsável por:
 *  - Gerar e armazenar o código de verificação no Firestore
 *  - Enviar o código via WhatsApp Cloud API
 *
 * POST /api/verification/send-code
 * Body: { whatsapp: string, lojistaId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsapp, lojistaId } = body as {
      whatsapp?: string;
      lojistaId?: string;
    };

    if (!whatsapp || !lojistaId) {
      return NextResponse.json(
        { error: "WhatsApp e lojistaId são obrigatórios" },
        { status: 400 }
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    const res = await fetch(`${backendUrl}/api/verification/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ whatsapp, lojistaId }),
    });

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error("[Verification Send Code Proxy] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao enviar código de verificação" },
      { status: 500 }
    );
  }
}
