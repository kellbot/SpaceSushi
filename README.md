# essentials

Sushi belt generator. Doesn't play well with fluids.

This is using a fork of factorio-blueprint which supports snapping.
Unfortunately blueprint snapping plays very oddly with train rails. In order for the blocks to be mirrorable with an even-numbered grid size the absolute offset needs to be an odd number (usually 1,1). But because rails can only be placed on even rows you end up with some weird placement problems I haven't been able to sort out.

### Compiles and hot-reloads for development

```
# yarn
yarn dev

# npm
npm run dev

# pnpm
pnpm dev
```

### Compiles and minifies for production

```
# yarn
yarn build

# npm
npm run build

# pnpm
pnpm build
```

### Lints and fixes files

```
# yarn
yarn lint

# npm
npm run lint

# pnpm
pnpm lint
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).
