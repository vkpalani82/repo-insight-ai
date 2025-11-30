import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// Dev proxy: forwards /api/* requests to your backend to avoid CORS in development
export default defineConfig({
plugins: [react()],
server: {
proxy: {
'/api': {
target: 'https://ai-powered-tool-that-analyzes-any-github.onrender.com',
changeOrigin: true,
secure: true,
// If your backend expects /analyze (i.e. POST /analyze), you can either call
// '/api/analyze' from the client (this will forward to target/analyze),
// or uncomment the rewrite below to strip '/api' when forwarding.
// rewrite: (path) => path.replace(/^\/api/, ''),
},
},
},
})
