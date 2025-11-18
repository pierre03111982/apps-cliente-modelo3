# 🌐 Configurar Subdomínio para Modelo 1

## 🎯 OBJETIVO

Configurar um subdomínio específico para o **Modelo 1** para evitar conflito com o `appmelhorado` que já usa `app.experimenteai.com.br`.

**Sugestão de subdomínio:** `modelo1.experimenteai.com.br` ou `app-modelo1.experimenteai.com.br`

---

## 📋 PASSO A PASSO

### **PASSO 1: Adicionar Domínio no Vercel (Projeto modelo-1)**

1. Acesse: https://vercel.com/pierre03111982s-projects/apps-cliente-modelo1/settings/domains

2. Clique em **"Add Domain"** ou **"Add"**

3. Digite o subdomínio escolhido:
   - `modelo1.experimenteai.com.br` (recomendado)
   - OU `app-modelo1.experimenteai.com.br`

4. Clique em **"Add"**

5. **Aguarde** até que o status mude para:
   - ✅ **"Valid Configuration"** (pode levar alguns minutos)

---

### **PASSO 2: Configurar DNS no Registro.br (ou seu provedor de DNS)**

Se você tem acesso ao DNS do domínio `experimenteai.com.br`:

1. Acesse o painel do seu provedor de DNS (Registro.br, Cloudflare, etc.)

2. Adicione um registro **CNAME**:
   - **Nome/Host:** `modelo1` (ou `app-modelo1`)
   - **Tipo:** CNAME
   - **Valor/Destino:** `cname.vercel-dns.com`
   - **TTL:** 3600 (ou padrão)

3. **Salve** as alterações

4. Aguarde a propagação DNS (pode levar até 24 horas, mas geralmente é mais rápido)

---

### **PASSO 3: Verificar DNS**

Após adicionar o CNAME, verifique se está funcionando:

**Opção A - Via Terminal:**
```bash
nslookup modelo1.experimenteai.com.br
```

**Opção B - Via Site:**
- Acesse: https://dnschecker.org/#CNAME/modelo1.experimenteai.com.br
- Verifique se aparece `cname.vercel-dns.com` em vários locais do mundo

---

### **PASSO 4: Atualizar Variáveis de Ambiente**

#### **4.1 No Vercel (Projeto modelo-1):**

1. Acesse: https://vercel.com/pierre03111982s-projects/apps-cliente-modelo1/settings/environment-variables

2. Adicione/Atualize:
   - **Key:** `NEXT_PUBLIC_BASE_URL`
   - **Value:** `https://modelo1.experimenteai.com.br`
   - **Environment:** Production, Preview, Development

#### **4.2 No Vercel (Projeto paineladm):**

1. Acesse: https://vercel.com/pierre03111982s-projects/[nome-do-projeto-paineladm]/settings/environment-variables

2. Adicione/Atualize:
   - **Key:** `NEXT_PUBLIC_MODELO1_URL`
   - **Value:** `https://modelo1.experimenteai.com.br`
   - **Environment:** Production, Preview, Development

3. **Salve** e faça um **redeploy** do paineladm

---

### **PASSO 5: Atualizar Código (Opcional - se necessário)**

Se precisar usar a URL em algum lugar do código do modelo-1:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://modelo1.experimenteai.com.br'
```

---

## ✅ VERIFICAÇÃO FINAL

Após completar todos os passos:

1. **Aguarde** a propagação DNS (pode levar alguns minutos a horas)

2. **Teste** o acesso:
   - Acesse: `https://modelo1.experimenteai.com.br`
   - Deve aparecer a página raiz do Modelo 1

3. **Teste** com lojistaId:
   - Acesse: `https://modelo1.experimenteai.com.br/[lojistaId]/login`
   - Deve funcionar corretamente

4. **Verifique** no paineladm:
   - Acesse a aba "Aplicativo Cliente"
   - O link do Modelo 1 deve usar `https://modelo1.experimenteai.com.br`

---

## 🔍 TROUBLESHOOTING

### **Erro: "Domain already exists"**
- O domínio pode estar sendo usado por outro projeto
- Verifique em: https://vercel.com/domains
- Remova do projeto antigo antes de adicionar ao novo

### **DNS não está propagando**
- Aguarde até 24 horas (geralmente é mais rápido)
- Verifique se o CNAME está correto: `cname.vercel-dns.com`
- Use https://dnschecker.org para verificar propagação global

### **Erro 404 após configurar domínio**
- Aguarde alguns minutos após adicionar o domínio no Vercel
- Verifique se o DNS está propagado corretamente
- Faça um redeploy do projeto modelo-1

---

## 📝 CHECKLIST

- [ ] Domínio adicionado no Vercel (projeto modelo-1)
- [ ] Status do domínio: "Valid Configuration"
- [ ] CNAME configurado no DNS (modelo1 → cname.vercel-dns.com)
- [ ] DNS propagado (verificado via dnschecker.org)
- [ ] Variável `NEXT_PUBLIC_MODELO1_URL` atualizada no paineladm
- [ ] Variável `NEXT_PUBLIC_BASE_URL` adicionada no modelo-1 (opcional)
- [ ] Redeploy do paineladm feito
- [ ] Teste de acesso funcionando

---

## 🚀 PRÓXIMOS PASSOS

Após configurar o subdomínio:

1. **Atualize** a página raiz do modelo-1 para usar o novo domínio
2. **Teste** todos os links no paineladm
3. **Verifique** se os QR codes estão gerando corretamente

---

**VAMOS COMEÇAR PELO PASSO 1: ADICIONAR O DOMÍNIO NO VERCEL!** 🚀

