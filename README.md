# Web-Apps-nCent

## Getting started

### Install dependencies

```
npm i
```

To use local version of ux-components:

1. Create `.env.local` file with relative path to the ux-components directory

   ```
   VITE_UI_LIB_PATH=path_to_ux-components
   ```

2. In ux-components project directory run (only the first time)

   ```bash
   npm link
   ```

3. In app project directory run

   ```bash
   npm link @ncent-holdings/ux-components
   ```

### Run service for development

1. Start development server

   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in browser

## Generate `api-types` from capabilities

This repo contains scripts to generate TypeScript interfaces based on capabilities states in [caps-packs](https://github.com/nCent-Holdings/caps-packs) repo

```bash
npm run generate-types -- nCent -b nCent-caps-pack
```

See help by running

```bash
npm run generate-types -- -h
```
