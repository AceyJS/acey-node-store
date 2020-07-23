import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

import pkg from './package.json'

const config = {
    input: './index.ts',
    external: ['fs', 'util'],
    output: [
        {
            file: pkg.main,
            format: 'cjs'
        },
    ],
    plugins: [
        typescript({
            tsconfig: 'tsconfig.json',
            clean: true
        }),
        nodeResolve({
            preferBuiltins: true
        }),
        commonjs()
    ]
}

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(uglify());
}

export default config