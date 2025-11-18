# 🔍 VERIFICAR FRAMEWORK PRESET NO VERCEL

## ⚠️ PROBLEMA CRÍTICO

O erro 404 pode estar acontecendo porque o **Framework Preset** no Vercel não está configurado corretamente.

---

## ✅ VERIFICAÇÃO OBRIGATÓRIA

### **PASSO 1: Verificar Framework Preset**

1. Acesse: https://vercel.com/pierre03111982s-projects/apps-cliente-modelo1/settings/build-and-deployment

2. Role até a seção **"Framework Preset"**

3. **DEVE ESTAR:** `Next.js`

4. **Se estiver diferente ou vazio:**
   - Selecione `Next.js` no dropdown
   - Clique em **"Save"**
   - Faça um novo deploy

---

### **PASSO 2: Verificar Build Command**

Na mesma página, verifique:

- **Build Command:** Deve estar vazio ou `next build`
- **Output Directory:** Deve estar vazio ou `.next`
- **Install Command:** Deve estar vazio ou `npm install` / `yarn install`

---

### **PASSO 3: Verificar Root Directory**

Na mesma página:

- **Root Directory:** Deve estar **VAZIO** ou com `.`
- **NÃO DEVE TER:** `apps-cliente/modelo-1` ou qualquer outro caminho

---

## 🔧 SE O FRAMEWORK PRESET ESTIVER ERRADO

1. **Selecione:** `Next.js` no dropdown
2. **Salve** as configurações
3. **Vá em Deployments**
4. **Faça um novo deploy** (ou aguarde o próximo push)

---

## 📋 CHECKLIST

- [ ] Framework Preset = `Next.js`
- [ ] Build Command = vazio ou `next build`
- [ ] Output Directory = vazio ou `.next`
- [ ] Root Directory = vazio ou `.`
- [ ] Configurações salvas
- [ ] Novo deploy feito

---

**VERIFIQUE O FRAMEWORK PRESET AGORA!** 🔍

Se estiver incorreto, isso pode ser a causa do erro 404.

