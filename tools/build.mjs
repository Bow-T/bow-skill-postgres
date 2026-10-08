// Dựng skills/postgres-best-practices từ bản clone supabase/agent-skills (đổi tên skill, bỏ file chỉ dành cho người soạn).
// Dùng (từ gốc repo): node tools/build.mjs <thư mục clone supabase/agent-skills>
// Mọi chỗ sửa so với nguồn đều đi qua patch() — neo phải khớp ĐÚNG một lần, lệch là dừng,
// nên nguồn đổi câu chữ thì script báo ngay chỗ cần xem lại thay vì âm thầm bỏ sót.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const upClone = process.argv[2];
if (!upClone) throw new Error('thiếu đường dẫn bản clone nguồn');
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function patch(text, find, replace, label) {
  const n = text.split(find).length - 1;
  if (n !== 1) throw new Error(`patch "${label}": neo khớp ${n} lần (cần 1)`);
  return text.replace(find, () => replace);
}

const src = path.join(upClone, 'skills/supabase-postgres-best-practices');
const dst = path.join(repoRoot, 'skills/postgres-best-practices');
fs.rmSync(dst, { recursive: true, force: true });

// File chỉ dành cho người soạn skill ở nguồn — agent không cần.
const DROP = ['CHANGELOG.md', 'references/_contributing.md', 'references/_template.md'];
// 31 file quy tắc + _sections.md. Nguồn thêm / bớt file thì dừng để đọc file mới trước khi chép.
const EXPECTED_REFERENCES = 32;

const files = [];
const walk = (dir, rel) => {
  for (const name of fs.readdirSync(dir).sort()) {
    const abs = path.join(dir, name);
    const r = rel ? `${rel}/${name}` : name;
    if (fs.statSync(abs).isDirectory()) walk(abs, r);
    else files.push(r);
  }
};
walk(src, '');

for (const drop of DROP) {
  if (!files.includes(drop)) throw new Error(`postgres: nguồn không còn ${drop} — xem lại danh sách DROP`);
}
const keep = files.filter((f) => !DROP.includes(f));
for (const f of keep) {
  if (!f.endsWith('.md')) throw new Error(`postgres: file lạ ${f} (chỉ nhận Markdown)`);
  if (f !== 'SKILL.md' && !f.startsWith('references/')) throw new Error(`postgres: file ngoài references/ ${f}`);
}
const refs = keep.filter((f) => f.startsWith('references/'));
if (refs.length !== EXPECTED_REFERENCES) {
  throw new Error(`postgres: ${refs.length} file tham khảo (cần ${EXPECTED_REFERENCES})`);
}

for (const f of keep) {
  let bytes = fs.readFileSync(path.join(src, f));
  if (f === 'SKILL.md') {
    // Tên skill phải trùng tên thư mục. Phần còn lại của SKILL.md giữ nguyên văn.
    bytes = Buffer.from(
      patch(bytes.toString('utf8'), '---\nname: supabase-postgres-best-practices\n', '---\nname: postgres-best-practices\n', 'postgres: tên skill'),
    );
  }
  const out = path.join(dst, f);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, bytes);
}

console.log(`đã dựng xong skills/postgres-best-practices (${keep.length} file)`);
