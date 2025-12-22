import { defineConfig } from 'rolldown-vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ThreeDxf',
      fileName: (format) => (format === 'es' ? 'three-dxf.mjs' : 'three-dxf.cjs'),
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['three', 'troika-three-text', '@dxfom/mtext'],
      output: {
        globals: {
          three: 'THREE',
          'troika-three-text': 'troikaThreeText',
          '@dxfom/mtext': 'parseDxfMTextContent'
        }
      }
    }
  }
});
