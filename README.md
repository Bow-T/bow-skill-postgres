# bow-skill-postgres

Bộ skill cho cơ sở dữ liệu **PostgreSQL**, dùng với [bow-gid](https://github.com/Bow-T/bow-gid).
Theo hướng **mỗi công nghệ một repo**: bộ này không gắn với framework nào, một dự án tick nó CÙNG với bộ
framework của mình (Bun API, Laravel, Next.js…) ở ô **Công nghệ**.

**Dự án đã tick bộ Supabase thì không tick bộ này.** Bộ Supabase mang cùng nội dung dưới tên
`supabase-postgres-best-practices`; tick cả hai là hai skill trùng nhau.

## Cấu trúc

```
bow-skill-postgres/
├── bow-skill.json        # manifest: id "postgres" + quy tắc tự nhận diện repo
├── THIRD_PARTY.md        # chép từ đâu, commit nào, đã sửa gì
├── LICENSES/             # văn bản giấy phép của nguồn
├── tools/build.mjs       # dựng lại skills/ từ bản clone của nguồn (không được trải vào dự án)
└── skills/
    └── postgres-best-practices/
        ├── SKILL.md      # khi nào dùng + bảng hạng mục, trỏ tới file tham khảo cần đọc
        └── references/   # 31 file quy tắc + _sections.md
```

| Skill | Dùng khi | Nguồn |
| --- | --- | --- |
| `postgres-best-practices` | tạo / sửa bảng, cột, index, constraint, trigger, function; viết migration; truy vấn chậm, kẹt khoá, cạn kết nối; hàng đợi và job trong Postgres | Supabase (MIT) |

Nội dung chia theo tiền tố, agent chỉ đọc file liên quan tới việc đang làm:

| Hạng mục | Tiền tố | Số file |
| --- | --- | --- |
| Hiệu năng truy vấn và index | `query-` | 5 |
| Quản lý kết nối | `conn-` | 4 |
| Phân quyền và RLS | `security-` | 3 |
| Thiết kế schema | `schema-` | 6 |
| Đồng thời và khoá | `lock-` | 4 |
| Mẫu truy cập dữ liệu | `data-` | 4 |
| Theo dõi và chẩn đoán | `monitor-` | 3 |
| Tính năng nâng cao | `advanced-` | 2 |

## Khác gì bản gốc

Chỉ đổi tên skill (bỏ tên nhà cung cấp) và bỏ ba file dành cho người soạn skill. Nội dung quy tắc nguyên
văn. Chi tiết và những gì đã soát: [`THIRD_PARTY.md`](THIRD_PARTY.md).

## Tự nhận diện

bow-gid tự tick bộ này cho dự án chưa khai công nghệ khi repo khớp một trong các quy tắc ở `targets.detect`:

| Quy tắc | Nghĩa |
| --- | --- |
| `package.json` chứa `"postgres"` hoặc `"pg"` | backend Node / Bun gọi Postgres bằng driver |
| `schema.prisma` chứa `provider = "postgresql"` | Prisma trỏ Postgres |
| `docker-compose.yml` / `docker-compose.yaml` / `compose.yaml` chứa `image: postgres` | có container Postgres |
| `.env.example` chứa `postgres://`, `postgresql://` hoặc `DB_CONNECTION=pgsql` | chuỗi kết nối mẫu trỏ Postgres |

Chỉ soi file git đã track (không đọc `.env`). Dự án Supabase tự dựng Postgres bằng compose cũng khớp các
quy tắc này; khi đó bỏ tick bộ này ở ô Công nghệ.

## Đăng ký vào bow-gid

Thêm vào `stacks` của registry trên máy (bow chỉ tải repo có trong danh sách này, đúng tag đã ghim):

```json
{ "id": "postgres", "label": "PostgreSQL", "repo": "github.com/Bow-T/bow-skill-postgres", "ref": "v1.0.0" }
```

Thử local trước khi đẩy GitHub: `"repo": "file:///đường/dẫn/tới/bow-skill-postgres"`.

## Phát hành phiên bản mới

Sửa qua PR → tăng `version` trong `bow-skill.json` → gắn tag (`git tag v1.0.1 && git push --tags`) → cập
nhật `ref` trong registry. bow tải theo tag và cache theo `<id>@<ref>`, nên sửa nội dung mà giữ nguyên tag sẽ
KHÔNG được tải lại.

**Đừng sửa tay file trong `skills/`** — sửa `tools/build.mjs` (thêm một `patch()` có nhãn) rồi chạy lại,
không thì lần cập nhật từ nguồn kế tiếp sẽ ghi đè mất. Cách cập nhật: cuối `THIRD_PARTY.md`.
