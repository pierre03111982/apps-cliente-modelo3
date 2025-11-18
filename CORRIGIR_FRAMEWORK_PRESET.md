# 🔧 CORRIGIR FRAMEWORK PRESET - URGENTE!

## ⚠️ PROBLEMA ENCONTRADO

O **Framework Preset** está configurado como **"Other"** quando deveria estar como **"Next.js"**.

Isso está causando o erro 404 porque o Vercel não está detectando corretamente que é um projeto Next.js.

---

## ✅ SOLUÇÃO - PASSO A PASSO

### **PASSO 1: Mudar Framework Preset**

1. Na tela que você está vendo, clique no dropdown **"Framework Preset"** (onde está escrito "Other")

2. Selecione **"Next.js"** da lista

3. Você verá que o warning triangle desaparece

---

### **PASSO 2: Verificar Build Command**

Após selecionar "Next.js", o campo **"Build Command"** deve mostrar:
- `npm run build` ou `next build`

Se não aparecer automaticamente:
- Clique no toggle **"Override"** ao lado de "Build Command"
- Digite: `next build`
- Clique em **"Override"** novamente para desativar (deixar o Vercel detectar automaticamente)

---

### **PASSO 3: Verificar Output Directory**

O campo **"Output Directory"** deve estar vazio ou mostrar `.next`

Se não estiver:
- Clique no toggle **"Override"** ao lado de "Output Directory"
- Deixe vazio ou digite: `.next`
- Clique em **"Override"** novamente para desativar

---

### **PASSO 4: Salvar Configurações**

1. Role até o final da página
2. Clique no botão **"Save"** (ou "Salvar")
3. Aguarde a confirmação

---

### **PASSO 5: Fazer Novo Deploy**

Após salvar:

1. Vá para a aba **"Deployments"** (ou "Deployments" no menu lateral)
2. Clique nos três pontinhos (`...`) no último deployment
3. Selecione **"Redeploy"** (ou "Refazer Deploy")
4. Aguarde o deploy completar (1-2 minutos)

---

## 📋 CHECKLIST FINAL

- [ ] Framework Preset = **"Next.js"** (não "Other")
- [ ] Build Command = `next build` ou vazio (para detecção automática)
- [ ] Output Directory = `.next` ou vazio
- [ ] Configurações salvas
- [ ] Novo deploy feito

---

## 🎯 RESULTADO ESPERADO

Após essas correções:
- ✅ O Vercel detectará corretamente o projeto como Next.js
- ✅ O build será feito corretamente
- ✅ A página raiz (`/`) funcionará sem erro 404
- ✅ As rotas dinâmicas (`/[lojistaId]`) funcionarão corretamente

---

**FAÇA ESSAS CORREÇÕES AGORA E FAÇA UM NOVO DEPLOY!** 🚀

