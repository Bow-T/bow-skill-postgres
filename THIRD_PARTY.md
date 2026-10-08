# Nguồn bên ngoài

Skill chép từ repo khác được ghi ở đây: lấy từ đâu, tại commit nào, giấy phép gì, và đã sửa gì.
Bản chép là **ảnh chụp tại một commit** — bow-gid không tự kéo bản mới của nguồn. Muốn cập nhật
thì làm lại các bước ở cuối file, đọc lại nội dung, rồi mới gắn tag.

| Skill | Nguồn | Commit | Giấy phép | Đã sửa |
| --- | --- | --- | --- | --- |
| `postgres-best-practices` | [supabase/agent-skills](https://github.com/supabase/agent-skills) `skills/supabase-postgres-best-practices` (v1.1.1) | `544bfc56c89afe2b87b20017a59b2c6e9502a1fb` (2026-09-28) | MIT | Đổi `name` trong frontmatter thành `postgres-best-practices` (trùng tên thư mục); bỏ `CHANGELOG.md`, `references/_contributing.md`, `references/_template.md`; nội dung còn lại nguyên văn |

Văn bản giấy phép: [`LICENSES/supabase-agent-skills-MIT.txt`](LICENSES/supabase-agent-skills-MIT.txt).

Mọi chỗ sửa nằm trong [`tools/build.mjs`](tools/build.mjs); không sửa tay file trong `skills/`.

## Vì sao bỏ những phần đó

- `_contributing.md`, `_template.md`, `CHANGELOG.md` chỉ dành cho người soạn skill ở nguồn; agent không
  cần, để lại chỉ tốn chỗ.
- Tên skill đổi để bộ này không mang tên một nhà cung cấp mà dự án không dùng. Mô tả của skill vẫn ghi
  rõ nó do Supabase duy trì và áp dụng cho Postgres chạy ở bất kỳ đâu.

## Đã soát gì trước khi chép (2026-10-08)

- Nội dung giữ lại **giống từng byte** với bản `supabase-postgres-best-practices` trong
  `Bow-T/bow-skill-supabase` v1.0.0 (cùng commit nguồn, đã đọc và soát ngày 2026-10-02), trừ dòng `name`.
  Lần này KHÔNG đọc lại từng dòng của 31 file quy tắc; đã đọc lại `SKILL.md` và `references/_sections.md`.
- Không có script / file thực thi nào — chỉ Markdown.
- Không có ký tự vô hình (tag Unicode, zero-width, bidi).
- Đường link chỉ trỏ tới `supabase.com`, `postgresql.org`, `wiki.postgresql.org`.
- Không có lệnh shell / lệnh mạng nào skill bảo chạy.
- 13 file tham khảo kết bằng một dòng `Reference:` trỏ tới tài liệu ở `supabase.com`. Đó là link đọc
  thêm, không phải chỉ dẫn dùng dịch vụ; giữ nguyên.
- Ba file `security-*` nói về phân quyền và Row-Level Security. RLS là tính năng của Postgres, không
  riêng Supabase; dự án không bật RLS thì agent không cần đọc hai file `security-rls-*`.

## Cập nhật từ nguồn

```bash
git clone --depth 1 https://github.com/supabase/agent-skills /tmp/up && cd /tmp/up && git rev-parse HEAD
# ĐỌC phần khác biệt so với bản ở đây (đặc biệt lệnh / link / file mới) trước khi dựng lại
diff -r /tmp/up/skills/supabase-postgres-best-practices skills/postgres-best-practices
node tools/build.mjs /tmp/up
```
Script dừng nếu nguồn thêm / bớt file hoặc đổi dòng `name`. Sửa bảng ở trên (commit + ngày), tăng
`version` trong `bow-skill.json`, gắn tag mới.
