import { execSync } from 'child_process';
import { createWriteStream } from 'fs';
import { readdir } from 'fs/promises';
import { basename, join } from 'path';

async function bootstrap() {
  const buf = execSync(
    `pnpm exec protoc --ts_out libs/shared/src/proto/pb --ts_opt generate_dependencies --ts_opt output_legacy_commonjs --proto_path proto proto/*.proto`,
  );
  console.log(buf.toString());
  const pbDir = join(process.cwd(), `libs/shared/src/proto/pb`);
  const pbIndex = join(pbDir, 'index.ts');
  const files = await readdir(pbDir);
  const writer = createWriteStream(pbIndex);
  for (const file of files) {
    if (file !== 'index.ts')
      writer.write(`export * from './${basename(file, '.ts')}';\n`);
  }
  writer.close();
}

bootstrap();
