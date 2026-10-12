@echo off
chcp 65001 > nul
echo ==========================================
echo    EatGym - Xuat Backup Database (init.sql)
echo ==========================================
set PGPASSWORD=change-me
"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U eatgym -h localhost -p 5432 -d eatgym --no-owner --no-privileges --clean --if-exists -f "init.sql"
node -e "const fs = require('fs'); let c = fs.readFileSync('init.sql', 'utf8'); c = c.replace(/^\\restrict[^\r\n]*(\r?\n)?/m, '').replace(/^\\unrestrict[^\r\n]*(\r?\n)?/m, '').replace(/^SET transaction_timeout = 0;(\r?\n)?/m, '-- SET transaction_timeout = 0;\n'); fs.writeFileSync('init.sql', c, 'utf8');"
echo.
echo Da xuat thanh cong toan bo du lieu ra file init.sql!
pause
