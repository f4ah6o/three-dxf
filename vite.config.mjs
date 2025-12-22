import { defineConfig } from 'rolldown-vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ThreeDxf',
      fileName: (format) => {
        if (format === 'es') return 'three-dxf.mjs';
        if (format === 'cjs') return 'three-dxf.cjs';
        return 'three-dxf.js';
      },
      formats: ['es', 'cjs', 'umd']
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
