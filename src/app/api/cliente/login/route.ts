import { NextRequest, NextResponse } from "next/server";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

/**
 * POST /api/cliente/login
 * Autentica cliente com WhatsApp e senha
 * Body: { lojistaId: string, whatsapp: string, password: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lojistaId, whatsapp, password } = body;

    if (!lojistaId || !whatsapp || !password) {
      return NextResponse.json(
        { error: "lojistaId, whatsapp e senha são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    // Autenticar no backend
    const res = await fetch(`${backendUrl}/api/cliente/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lojistaId,
        whatsapp: cleanWhatsapp,
        password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[Cliente Login] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}

