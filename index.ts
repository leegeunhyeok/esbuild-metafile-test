import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Metafile } from 'esbuild';

async function main() {
  const rawMetafile = await readFile(join(__dirname, 'metafile.json'), 'utf-8');
  const metafile = JSON.parse(rawMetafile) as Metafile;
  console.log(metafile.inputs);
}

main().catch(console.error);
