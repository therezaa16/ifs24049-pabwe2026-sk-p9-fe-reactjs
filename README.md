# Delcom Blog — Frontend (React + Vite)

## Cara memasang (sekali)
```bash
npm create vite@latest ifs24049-pabwe2026-sk-p9-fe-reactjs -- --template react
cd ifs24049-pabwe2026-sk-p9-fe-reactjs
npm install @tabler/icons-react @toast-ui/editor sweetalert2
npm install -D tailwindcss @tailwindcss/vite vitest @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Lalu SALIN dari zip ini (timpa): `src/` (hapus `App.css` & `assets/` bawaan), `public/`, `index.html`, `vite.config.js`, `vercel.json`, `.env.example`.
Pada `package.json` ubah scripts: `"test": "vitest run --coverage"`.

## Menjalankan
Backend harus hidup di :8081, lalu `npm run dev` -> http://localhost:5174

## Produksi
Buat `.env.production` berisi `VITE_API_BASE_URL=https://URL-BACKEND-ANDA`, lalu `npm run build`.
