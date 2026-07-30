import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: '2m Tall Voronoi Camel', dest: '.' },
        { src: 'Colossal Sculpture with Sergio Furnari', dest: '.' },
        { src: 'Corbusier Saudi Style Sofa', dest: '.' },
        { src: 'DIY Home Solar', dest: '.' },
        { src: 'Fibonacci Project', dest: '.' },
        { src: 'Floor Piano', dest: '.' },
        { src: 'Gallery', dest: '.' },
        { src: 'hero-banner', dest: '.' },
        { src: 'Life Sized Voronoi Arabian Leopard', dest: '.' },
        { src: 'MOA Crew Painting with Reid Stowe', dest: '.' },
        { src: 'Nosecone Project', dest: '.' },
        { src: 'Resume', dest: '.' },
        { src: 'SawySawy CNC Plasma Cutter', dest: '.' },
        { src: 'SawySawy Robot Hand', dest: '.' },
        { src: 'Starship Game', dest: '.' },
        { src: 'Starship Schooner Anne', dest: '.' },
      ],
    }),
  ],
  base: '/Portfolio/',
  server: {
    open: true,
  },
})
