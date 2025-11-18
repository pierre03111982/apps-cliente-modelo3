# 📋 RESUMO: Configuração do Subdomínio para Modelo 1

## 🎯 DECISÃO

**Subdomínio escolhido:** `modelo1.experimenteai.com.br`

**Por quê?**
- Evita conflito com `app.experimenteai.com.br` (usado pelo appmelhorado)
- Mais fácil de lembrar e gerenciar
- Mantém consistência com o nome do projeto

---

## ✅ AÇÕES NECESSÁRIAS

### **1. No Vercel (Projeto apps-cliente-modelo1):**

1. Acesse: https://vercel.com/pierre03111982s-projects/apps-cliente-modelo1/settings/domains
2. Clique em **"Add Domain"**
3. Digite: `modelo1.experimenteai.com.br`
4. Clique em **"Add"**
5. Aguarde status: **"Valid Configuration"**

### **2. No DNS (Registro.br ou seu provedor):**

1. Adicione registro **CNAME**:
   - **Nome:** `modelo1`
   - **Tipo:** CNAME
   - **Valor:** `cname.vercel-dns.com`
2. Salve e aguarde propagação (minutos a horas)

### **3. No Vercel (Projeto paineladm):**

1. Acesse: Settings → Environment Variables
2. Adicione/Atualize:
   - **Key:** `NEXT_PUBLIC_MODELO1_URL`
   - **Value:** `https://modelo1.experimenteai.com.br`
3. Salve e faça redeploy

---

## 🔗 LINKS ÚTEIS

- **Adicionar domínio no Vercel:** https://vercel.com/pierre03111982s-projects/apps-cliente-modelo1/settings/domains
- **Verificar DNS:** https://dnschecker.org/#CNAME/modelo1.experimenteai.com.br
- **Gerenciar domínios Vercel:** https://vercel.com/domains

---

## 📝 CHECKLIST RÁPIDO

- [ ] Domínio `modelo1.experimenteai.com.br` adicionado no Vercel
- [ ] CNAME configurado no DNS
- [ ] Variável `NEXT_PUBLIC_MODELO1_URL` atualizada no paineladm
- [ ] Redeploy do paineladm feito
- [ ] Teste de acesso funcionando

---

**COMEÇE PELO PASSO 1 NO VERCEL!** 🚀

