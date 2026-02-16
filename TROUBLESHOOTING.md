# حل المشاكل | Troubleshooting

## خطأ: `concurrently` غير موجود
```bash
npm install
```

## خطأ: المنفذ مستخدم (Port in use)
- أوقف أي برنامج يستخدم المنفذ 3000 أو 5173
- أو غيّر PORT في `server/server.js` (سطر 9)

## خطأ: `Cannot find module`
```bash
npm run install:all
```

## تشغيل يدوي (بدون concurrently)
افتح **طرفيتين**:

**طرفية 1:**
```bash
cd noor-bazaar/server
npm install
node server.js
```

**طرفية 2:**
```bash
cd noor-bazaar/client
npm install
npm run dev
```

ثم افتح: http://localhost:5173

## على Windows
استخدم الملف `run.bat` - انقر عليه مرتين لتشغيل المشروع.
