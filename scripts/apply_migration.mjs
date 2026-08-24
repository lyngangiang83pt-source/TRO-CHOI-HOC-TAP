import fs from 'fs';
import path from 'path';

console.log('--- AUTO SQL MIGRATION TOOL FOR SUPABASE ---');
const schemaPath = path.resolve('schema.sql');
if (fs.existsSync(schemaPath)) {
  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log('✅ Đã đọc thành công file schema.sql (' + sql.length + ' bytes).');
  console.log('📌 Vui lòng mở Supabase Dashboard -> SQL Editor và dán đoạn mã để thực thi:');
  console.log('👉 https://supabase.com/dashboard/project/_/sql');
} else {
  console.error('❌ Không tìm thấy file schema.sql');
}
