# app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Deploy

Deploy works automatically with each push to github pages. The template is deployed to [dhbw-ka-webengineering.github.io/Template_Vue/](https://dhbw-ka-webengineering.github.io/Template_Vue/)

Because of the _Template_Vue_ path in the URL, `base: process.env.NODE_ENV === 'production' ? '/Template_Vue/' : '/',` is required in line 16 of the [vite.config.ts file](vite.config.ts). If you deploy the repo to a different URL, you will need to adapt or remove this part.
