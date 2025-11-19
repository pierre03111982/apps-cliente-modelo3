import { NextRequest, NextResponse } from "next/server";

// Forçar renderização dinâmica para evitar erro de build estático
export const dynamic = 'force-dynamic';

type Payload = {
  whatsapp?: string;
  lojistaId?: string;
  code?: string;
  nome?: string;
};

/**
 * Proxy para o backend (paineladm) responsável por:
 *  - Validar o código de verificação no Firestore
 *  - Registrar o cliente na coleção lojas/{lojistaId}/clientes
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Payload;
    const { whatsapp, lojistaId, code, nome } = body;

    if (!whatsapp || !lojistaId || !code) {
      return NextResponse.json(
        { error: "WhatsApp, lojistaId e código são obrigatórios" },
        { status: 400 }
      );
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, "");
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

    console.log("[Verification Validate Proxy] Validando código:", {
      backendUrl,
      lojistaId,
      whatsapp: cleanWhatsapp.substring(0, 5) + "***",
      codeLength: code.length,
    });

    // 1) Validar código no backend (Firestore)
    let res: Response;
    let data: any = {};

    try {
      res = await fetch(`${backendUrl}/api/verification/validate-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsapp: cleanWhatsapp,
          lojistaId,
          code,
        }),
      });

      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text || "Erro desconhecido" };
      }

      if (!res.ok) {
        console.error("[Verification Validate Proxy] Erro do backend:", {
          status: res.status,
          statusText: res.statusText,
          data,
        });
        return NextResponse.json(
          { error: data.error || "Erro ao validar código" },
          { status: res.status }
        );
      }
    } catch (fetchError: any) {
      console.error("[Verification Validate Proxy] Erro na requisição:", {
        message: fetchError?.message,
        stack: fetchError?.stack?.substring(0, 500),
      });
      return NextResponse.json(
        {
          error: `Erro ao conectar com o servidor: ${fetchError?.message || "Erro desconhecido"}`,
        },
        { status: 500 }
      );
    }

    // 2) Verificar se cliente já existe antes de cadastrar
    let clienteExiste = false;
    let clienteId = null;
    let clienteNome = nome; // Nome padrão (do formulário)
    
    try {
      const clienteRes = await fetch(
        `${backendUrl}/api/cliente/find?lojistaId=${encodeURIComponent(lojistaId)}&whatsapp=${encodeURIComponent(cleanWhatsapp)}`
      );
      
      if (clienteRes.ok) {
        const clienteData = await clienteRes.json();
        if (clienteData.cliente) {
          clienteExiste = true;
          clienteId = clienteData.cliente.id;
          clienteNome = clienteData.cliente.nome || nome; // Usar nome do banco se existir
          console.log("[Verification Validate Proxy] ✅ Cliente já existe:", {
            clienteId,
            nome: clienteNome,
          });
        } else {
          console.log("[Verification Validate Proxy] Cliente não encontrado, será cadastrado");
        }
      } else {
        console.warn("[Verification Validate Proxy] Erro ao buscar cliente:", clienteRes.status);
      }
    } catch (err) {
      console.error("[Verification Validate Proxy] Erro ao verificar cliente:", err);
      // Continuar mesmo com erro (não bloqueante)
    }

    // 3) Registrar cliente apenas se não existir
    if (!clienteExiste && nome) {
      try {
        const createRes = await fetch(
          `${backendUrl}/api/lojista/clientes?lojistaId=${encodeURIComponent(lojistaId)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: nome || "",
              whatsapp: cleanWhatsapp,
            }),
          }
        );
        
        if (createRes.ok) {
          const createData = await createRes.json();
          clienteId = createData.clienteId;
          console.log("[Verification Validate Proxy] Cliente cadastrado:", clienteId);
        }
      } catch (err) {
        console.error(
          "[Verification Validate Proxy] Erro ao registrar cliente (não bloqueante):",
          err
        );
      }
    }

    // Retornar resposta com informações do cliente
    return NextResponse.json({
      ...data,
      clienteExiste,
      clienteId,
      cliente: clienteExiste ? {
        id: clienteId,
        nome: clienteNome,
        whatsapp: cleanWhatsapp,
      } : null,
    }, { status: res.status });
  } catch (error: any) {
    console.error("[Verification Validate Proxy] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao validar código de verificação" },
      { status: 500 }
    );
  }
}

