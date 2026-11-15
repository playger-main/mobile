// scripts/check-legal-translations.mjs
/**
 * ✅ Проверка полноты переводов юридических документов.
 *
 * Сравнивает структуру перевода с базовой версией: число разделов, заголовки,
 * количество пунктов/абзацев. Если перевод «съехал», экран покажет базовый
 * язык — этот скрипт ловит проблему до релиза.
 *
 * Запуск: node scripts/check-legal-translations.mjs
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

import ts from 'typescript';

const require = createRequire(import.meta.url);

const root = process.cwd();
const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'legal-check-'));

function transpile(from, to) {
  const source = fs.readFileSync(path.join(root, from), 'utf8');
  const out = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  const target = path.join(tmpRoot, to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, out.outputText);
}

transpile('src/content/legal.ts', 'content/legal.js');

const base = require(path.join(tmpRoot, 'content/legal.js'));
const localesDir = path.join(root, 'src/content/legal-overrides');

const localeFiles = fs
  .readdirSync(localesDir)
  .filter((name) => name.endsWith('.ts') && name !== 'index.ts');

let failed = false;

for (const file of localeFiles) {
  const locale = path.basename(file, '.ts');
  transpile(`src/content/legal-overrides/${file}`, `content/legal-overrides/${file.replace(/\.ts$/, '.js')}`);
}

for (const file of localeFiles) {
  const locale = path.basename(file, '.ts');
  const mod = require(
    path.join(tmpRoot, 'content/legal-overrides', `${locale}.js`),
  );

  for (const [docKey, baseList] of [
    ['privacy', base.PRIVACY_SECTIONS],
    ['terms', base.TERMS_SECTIONS],
  ]) {
    const translated = mod[`${locale.toUpperCase()}_${docKey.toUpperCase()}`];

    if (!translated) {
      console.log(`✗ ${locale}/${docKey}: перевода нет`);
      failed = true;
      continue;
    }

    if (translated.length !== baseList.length) {
      console.log(
        `✗ ${locale}/${docKey}: разделов ${translated.length}, ожидалось ${baseList.length}`,
      );
      failed = true;
      continue;
    }

    baseList.forEach((section, index) => {
      const item = translated[index];
      const problems = [];

      if (!item?.title) problems.push('нет заголовка');
      if ((section.bullets?.length ?? 0) !== (item?.bullets?.length ?? 0)) {
        problems.push(
          `пунктов ${item?.bullets?.length ?? 0} из ${section.bullets?.length ?? 0}`,
        );
      }
      if ((section.paragraphs?.length ?? 0) !== (item?.paragraphs?.length ?? 0)) {
        problems.push(
          `абзацев ${item?.paragraphs?.length ?? 0} из ${section.paragraphs?.length ?? 0}`,
        );
      }
      if (Boolean(section.lead) !== Boolean(item?.lead)) {
        problems.push('не совпадает наличие вводного абзаца');
      }

      if (problems.length) {
        console.log(
          `✗ ${locale}/${docKey} раздел ${index + 1} (${section.title.en}): ${problems.join('; ')}`,
        );
        failed = true;
      }
    });

    if (!failed) {
      console.log(`✓ ${locale}/${docKey}: ${translated.length} разделов совпадают по структуре`);
    }
  }
}

fs.rmSync(tmpRoot, { recursive: true, force: true });

if (failed) {
  console.log('\nПеревод неполный — экран покажет английскую/русскую версию.');
  process.exit(1);
}

console.log('\nВсе переводы структурно совпадают с базовой версией.');
