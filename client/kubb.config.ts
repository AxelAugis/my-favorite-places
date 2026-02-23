import {defineConfig} from '@kubb/core'
import {pluginOas} from '@kubb/plugin-oas'
import {pluginTs} from '@kubb/plugin-ts'
import {pluginReactQuery} from '@kubb/plugin-react-query'
import {pluginClient} from "@kubb/plugin-client";

export default defineConfig({
    root: '.',
    input: {
        path: '../server/openapi.json',
    },
    output: {
        path: './src/api',
        clean: true,
    },
    plugins: [
        pluginOas(),
        pluginTs({
            output: {
                path: 'models',
            },
        }),
        pluginClient({
          baseURL: 'http://localhost:3001',
        }),
        pluginReactQuery({
            output: {
                path: 'hooks',
            },
            client: {
                baseURL: 'http://localhost:3001',
            }
        }),
    ],
})
