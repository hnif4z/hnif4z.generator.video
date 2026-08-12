# PRODUCT VIDEO BY HANIEF4Z

Frontend siap untuk GitHub Pages.

## GitHub Pages
Upload `index.html`, `style.css`, `script.js`, dan folder `api` ke repository.
Aktifkan Settings -> Pages -> Deploy from branch -> main -> /(root).

## Penting
GitHub Pages hanya menjalankan frontend statis. Endpoint `/api/*` tidak berjalan di GitHub Pages. Untuk fungsi Gemini/video generation nyata, deploy backend/serverless secara terpisah dan ubah URL endpoint pada `script.js`.

Jangan pernah menaruh GEMINI_API_KEY di file frontend.
