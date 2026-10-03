/**
 * Build do Zuno.
 *   node build.mjs          -> dist/index.html (app completo em um arquivo)
 *                              dist/artifact.html (mesmo app, formato de publicação Claude)
 *   node build.mjs --watch  -> recompila a cada alteração
 */
import * as esbuild from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap';

async function build() {
  const result = await esbuild.build({
    entryPoints: ['src/main.js'],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['es2019', 'safari13'],
    // Artes do Zuno viram arquivos separados (carregados só quando aparecem)
    loader: { '.webp': 'file', '.png': 'file' },
    assetNames: 'assets/[name]-[hash]',
    publicPath: '.',
    outdir: 'out',
    write: false,
    legalComments: 'none',
    // Variáveis de ambiente públicas (nunca chaves secretas)
    define: { __ZUNO_API_BASE__: JSON.stringify(process.env.ZUNO_API_BASE || '') },
  });
  const js = result.outputFiles.find((f) => f.path.endsWith('.js')).text;
  const css = result.outputFiles.find((f) => f.path.endsWith('.css')).text;

  const head = [
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    `<link rel="stylesheet" href="${FONTS}">`,
    `<style>${css}</style>`,
  ].join('\n  ');
  const body = [
    '<a class="skip-link" href="#main">Pular para o conteúdo</a>',
    '<div id="app" aria-busy="true"></div>',
    `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`,
  ].join('\n  ');

  const template = await readFile('index.html', 'utf8');
  await mkdir('dist/assets', { recursive: true });
  const { rm } = await import('node:fs/promises');
  await rm('dist/assets', { recursive: true, force: true });
  await mkdir('dist/assets', { recursive: true });
  for (const f of result.outputFiles.filter((o) => /\.(webp|png)$/.test(o.path))) {
    await writeFile(`dist/assets/${f.path.split('/').pop()}`, f.contents);
  }
  await writeFile('dist/index.html', template.replace('<!--HEAD-->', () => head).replace('<!--BODY-->', () => body));
  await writeFile(
    'dist/artifact.html',
    ['<title>Zuno</title>', '<meta name="theme-color" content="#f7f6f1">', head, body].join('\n'),
  );
  console.log(`build ok · js ${(js.length / 1024).toFixed(0)}KB · css ${(css.length / 1024).toFixed(0)}KB`);
}

if (process.argv.includes('--watch')) {
  const { watch } = await import('node:fs');
  await build();
  let t;
  watch('src', { recursive: true }, () => { clearTimeout(t); t = setTimeout(() => build().catch(console.error), 120); });
  console.log('observando src/ ...');
} else {
  await build();
}
