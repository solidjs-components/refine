import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'

const entry = './src/index.ts'
export default defineConfig({
    plugins: [
        solid(),
        dts({ entryRoot: 'src', outDir: ['dist'] }),
    ],
    build: {
        emptyOutDir: true,
        sourcemap: false,
        target: 'modules',
        outDir: 'dist',
        lib: {
            entry,
        },
        rollupOptions: {
            external: ['solid-js', 'solid-js/web', 'solid-js/store', '@solidjs-components/utils', '@tanstack/solid-query'],
            output: [
                {
                    format: 'es',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    exports: 'named',
                    dir: 'dist',
                    entryFileNames: () => {
                        return '[name].js'
                    },
                },
            ],
        },
    },
})
