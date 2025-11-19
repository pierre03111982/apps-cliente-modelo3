// Armazenamento temporário em memória (em produção, usar Redis ou banco de dados)
export const verificationCodes = new Map<string, { code: string; expiresAt: number; attempts: number }>();

// Limpar códigos expirados periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of verificationCodes.entries()) {
    if (value.expiresAt < now) {
      verificationCodes.delete(key);
    }
  }
}, 60000); // A cada 1 minuto


