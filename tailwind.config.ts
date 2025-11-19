import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#0a0a0f", // Fundo quase preto minimalista
        "card-bg": "rgba(21, 21, 32, 0.6)", // Fundo de card escuro elegante com 60% transparência
        "card-border": "#2a2a3a", // Borda sutil de card
        "input-bg": "rgba(26, 26, 37, 0.6)", // Fundo de input escuro com 60% transparência
        "input-border": "#333344", // Borda de input
        "accent-emerald": "#10b981", // Verde esmeralda elegante
        "accent-blue": "#3b82f6", // Azul royal elegante
        "accent-gold": "#f59e0b", // Dourado suave
        "accent-purple": "#8b5cf6", // Roxo suave
        "text-primary": "#f8fafc", // Texto principal branco suave
        "text-secondary": "#cbd5e1", // Texto secundário cinza claro
      },
      boxShadow: {
        "elegant": "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)", // Sombra elegante
        "elegant-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)", // Sombra elegante grande
        "glow-emerald": "0 0 15px rgba(16, 185, 129, 0.4)", // Brilho verde esmeralda
        "glow-blue": "0 0 15px rgba(59, 130, 246, 0.4)", // Brilho azul
        "glow-gold": "0 0 15px rgba(245, 158, 11, 0.4)", // Brilho dourado
      },
      borderRadius: {
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
export default config
