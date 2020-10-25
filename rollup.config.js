import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import less from 'rollup-plugin-less';
import filesize from 'rollup-plugin-filesize';
import resolve from '@rollup/plugin-node-resolve';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import url from '@rollup/plugin-url';
import json from '@rollup/plugin-json';
import svgr from '@svgr/rollup';
import { terser } from 'rollup-plugin-terser';

import pkg from './package.json';
import path from 'path';

export default {
  input: 'src/lib/index.js',
  output: [
    {
      file: pkg.main,
      exports: 'named',
      format: 'cjs',
    },
    {
      file: pkg.module,
      exports: 'named',
      format: 'esm',
    },
  ],
  plugins: [
    external({
      packageJsonPath: path.resolve(__dirname, './package.json'),
      includeDependencies: true,
    }),
    resolve(),
    commonjs(),
    terser(),
    babel({
      presets: ['react-app'],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-proposal-class-properties',
        'transform-react-remove-prop-types',
      ],
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    postcss({
      plugins: [],
      minimize: true,
      sourceMap: 'inline',
    }),
    url(),
    json(),
    less(),
    svgr(),
    visualizer(),
    sizeSnapshot(),
    filesize(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
};
