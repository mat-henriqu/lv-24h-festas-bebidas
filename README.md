# 🍺 LV Distribuidora 24 Horas

> **Suas bebidas favoritas, sempre geladas, entregues rapidinho!**

Website institucional da LV Distribuidora, uma distribuidora de bebidas que funciona 24 horas em Pequis, oferecendo cervejas, whisky, energéticos, copões e muito mais com entrega rápida.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Começando](#-começando)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Deploy](#-deploy)

## 🎯 Sobre o Projeto

O website da LV Distribuidora 24 Horas foi desenvolvido para oferecer uma experiência moderna e interativa aos clientes, facilitando o acesso a informações sobre produtos, localização e contato direto via WhatsApp. O site destaca o principal produto da casa: o **Copão 700ml** - uma mistura de energético com whisky ou gin e gelo saborizado.

### Localização
**Rua Inhambu-Xintã, 75 - Pequis**

## ✨ Funcionalidades

- 🎨 **Design Moderno e Animado**: Interface com gradientes, animações suaves e efeitos visuais atrativos
- 📱 **Responsivo**: Otimizado para todos os dispositivos (mobile, tablet, desktop)
- 🍹 **Catálogo de Produtos**: Showcase completo de bebidas disponíveis
- ⭐ **Destaque do Copão 700ml**: Seção especial para o produto principal da casa
- 📞 **Integração WhatsApp**: Botões de contato direto para pedidos rápidos
- 🗺️ **Localização**: Link direto para Google Maps
- ⏰ **Horário 24h**: Ênfase no funcionamento contínuo
- 🎭 **Animações**: Elementos flutuantes, pulsos e transições suaves
- 🌙 **Dark Mode Ready**: Preparado para tema escuro

## 🛠 Tecnologias

Este projeto foi construído com as seguintes tecnologias:

### Core
- **React 18.3.1** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.8.3** - Superset JavaScript com tipagem estática
- **Vite 5.4.19** - Build tool moderna e rápida

### Estilização
- **Tailwind CSS 3.4.17** - Framework CSS utility-first
- **shadcn/ui** - Componentes UI reutilizáveis e acessíveis
- **Radix UI** - Primitivos de UI sem estilo
- **Lucide React** - Ícones modernos

### Gerenciamento de Estado e Dados
- **React Router DOM 6.30.1** - Roteamento declarativo
- **TanStack React Query 5.83.0** - Gerenciamento de estado do servidor
- **React Hook Form 7.61.1** - Gerenciamento de formulários

### UI Components
- **Sonner** - Toast notifications elegantes
- **Embla Carousel** - Carrossel de imagens
- **Recharts** - Gráficos em React

## 🚀 Começando

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/mat-henriqu/lv-24h-festas-bebidas.git
```

2. Entre no diretório do projeto:
```bash
cd lv-24h-festas-bebidas
```

3. Instale as dependências:
```bash
npm install
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

5. Abra seu navegador em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
lv-24h-festas-bebidas/
├── public/                 # Arquivos estáticos
│   └── robots.txt
├── src/
│   ├── assets/            # Imagens e recursos
│   │   ├── lv-logo.jpeg
│   │   └── copao-whisky.png
│   ├── components/        # Componentes React
│   │   ├── Hero.tsx       # Seção hero com logo e CTA
│   │   ├── Products.tsx   # Catálogo de produtos
│   │   ├── Contact.tsx    # Informações de contato
│   │   ├── Footer.tsx     # Rodapé
│   │   └── ui/           # Componentes UI (shadcn)
│   ├── pages/            # Páginas
│   │   ├── Index.tsx     # Página principal
│   │   └── NotFound.tsx  # Página 404
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilitários
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Entry point
├── index.html            # HTML template
├── package.json          # Dependências
├── tailwind.config.ts    # Configuração Tailwind
├── tsconfig.json         # Configuração TypeScript
└── vite.config.ts        # Configuração Vite
```

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev

# Preview da build
npm run preview

# Lint
npm run lint
```

## 🌐 Deploy

Este projeto pode ser facilmente deployado em diversas plataformas:

- **Vercel** (Recomendado)
- **Netlify**
- **GitHub Pages**
- **Firebase Hosting**

### Deploy na Vercel

1. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

2. Execute:
```bash
vercel
```

3. Siga as instruções na CLI

## 🎨 Customização

### Cores e Tema

As cores principais podem ser customizadas no arquivo `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: "...",
      secondary: "...",
      // ...
    }
  }
}
```

### Número do WhatsApp

Atualize o número do WhatsApp nos componentes:
- `src/components/Hero.tsx`
- `src/components/Products.tsx`
- `src/components/Contact.tsx`

```typescript
const whatsappNumber = "5511999999999"; // Seu número aqui
```

## 📝 Licença

Este projeto é de propriedade da LV Distribuidora 24 Horas.

---

<div align="center">

**Desenvolvido com ❤️ para LV Distribuidora 24 Horas**

🍺 Beba com moderação | 🔞 Venda proibida para menores de 18 anos

</div>
