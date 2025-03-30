This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

src/
├── app/              # Carpeta base de Next.js con el App Router
│   ├── layout.tsx    # Layout principal del sistema
│   ├── page.tsx      # Página principal
│   ├── login/        # Carpeta para la página de inicio de sesión
│   ├── admin/        # Carpeta para las funcionalidades de admin
│   ├── gerente/      # Carpeta para las funcionalidades de gerente
│   ├── miembro/      # Carpeta para las funcionalidades de miembro
├── components/       # Componentes reutilizables
├── hooks/            # Hooks personalizados
├── lib/              # Funciones auxiliares y configuración
├── services/         # Archivo para la  services generales
├── styles/           # Archivos de estilos globales
├── types/            # Tipos y modelos de datos
