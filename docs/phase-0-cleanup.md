# سجل المرحلة 0 — تنظيف الكود

التاريخ: 2026-11-02
الحالة: التنظيف مكتمل وموثّق النتائج أدناه. بناء Android موثّق في نهاية هذا السجل.

## خط الأساس قبل الحذف (على الكود الأصلي كما وصل)

- `tsc --noEmit`: ناجح (exit 0).
- `expo lint`: نظيف، بلا ملاحظات.
- `vitest run`: ‏28 اختباراً ناجحاً و1 متخطّى — منها 3 فقط تخص منتج الدراسة، والباقي اختبارات قالب (CORS ‏25 اختباراً عبر توليد متكرر، وتسجيل خروج).

## ماذا حُذف؟

حُذف كل كود قالب Manus الذي لا يستخدمه منتج «دَرْس» فعلياً (تحققنا من كل ملف بالبحث في الاستيرادات قبل حذفه):

- `server/` بالكامل (Express + tRPC + Drizzle/MySQL + OAuth + LLM + توليد صور + نسخ صوتي + إشعارات خادم).
- `drizzle/` و`drizzle.config.ts` و`shared/` (كانت تخدم الخادم فقط).
- `lib/_core/` (عميل OAuth/API ووقت تشغيل Manus) و`lib/trpc.ts` و`lib/theme-provider.tsx` و`lib/utils.ts`.
- `app/oauth/` و`app/dev/` و`constants/` (OAuth وثيم القالب).
- `hooks/use-auth.ts` و`use-colors.ts` و`use-color-scheme(.web).ts`.
- مكوّنات القالب غير المستخدمة: `hello-wave`، `parallax-scroll-view`، `external-link`، `themed-view`، `screen-container`، `components/ui/`.
- اختبارات القالب: `tests/cors.test.ts` و`tests/auth.logout.test.ts` (يبقى `tests/study-utils.test.ts` الخاص بالمنتج).
- سكربتات القالب: `scripts/generate_qr.mjs` و`scripts/load-env.js`.
- `theme.config.*` وألوان ثيم القالب من `tailwind.config.js` (أصبحت الإعدادات بلا ألوان قالب).
- أصول React الشعارية من قالب Expo (`react-logo*`، `partial-react-logo`) — بلا أي مرجع في الكود.
- من `app.config.ts`: استيراد `load-env`، كائن `publicRuntime` الخاص بـ OAuth، وإضافات `expo-audio` و`expo-video`.
- أرشفة خطة التنفيذ الأصلية من `plan.md` إلى `docs/original-execution-plan.md`، وإضافة `README.md`.

نسخة احتياطية من كل المحذوف محفوظة خارج المشروع في أرشيف عمل المرحلة 0 (`manus-template-backup-pre-phase0.zip`)، فالحذف قابل للاسترجاع عند الحاجة.

## تبسيط `app/_layout.tsx` (122 سطراً ← 29 سطراً)

- حُذف: عميلا tRPC وReact Query، تهيئة Manus Runtime، تجاوزات SafeArea الخاصة بمعاينة الويب، ومزوّد ثيم القالب.
- يبقى: `GestureHandlerRootView` و`SafeAreaProvider` و`StudyStoreProvider` و`Stack` بلا ترويسات.
- إصلاح صغير مترتب: `StatusBar` أصبحت `dark` بدل `auto`، لأن التطبيق فاتح الواجهة فقط (`userInterfaceStyle: "light"`)، فكانت أيقونات الشريط قد تظهر فاتحة على خلفية عاجية في أجهزة الوضع الداكن.

## التبعيات (`package.json`)

- تبعيات الإنتاج: 49 ← 28 (حُذفت 21: ‏@tanstack/react-query، ‏@trpc ×3، ‏axios، ‏clsx، ‏cookie، ‏dotenv، ‏drizzle-orm، ‏express، ‏jose، ‏mysql2، ‏superjson، ‏tailwind-merge، ‏zod، ‏expo-audio، ‏expo-image، ‏expo-secure-store، ‏expo-symbols، ‏expo-video، ‏expo-web-browser).
- تبعيات التطوير: 18 ← 9 (حُذفت: ‏@types/cookie، ‏@types/express، ‏@types/qrcode، ‏concurrently، ‏cross-env، ‏drizzle-kit، ‏esbuild، ‏qrcode، ‏tsx).
- سكربتات التشغيل أصبحت Expo فقط: ‏`start` / `android` / `ios` / `web` / `check` / `lint` / `format` / `test`. واسم الحزمة أصبح `darsstudy` بدل `app-template`.

## قراران واعيان (لا سهو)

1. **أُبقيت `expo-notifications` وإذن `POST_NOTIFICATIONS` و`expo-keep-awake`** رغم عدم استخدامها في الكود بعد — لأنها بنية المرحلة 1 المباشرة (تذكيرات المهام وتنبيه نهاية الجلسة وإبقاء الشاشة أثناء الجلسة). حذفها الآن وإعادتها بعد أسابيع دوران بلا فائدة، وهي مُعلنة هنا صراحة كاستثناء مؤقت.
2. **أُبقي معرّفا الحزمة و`scheme`** (`space.manus.darsstudy.…`) كما هما، لأن بناء Android للمشروع مسجّل عليهما. تغييرهما قرار إصدار يسبق أي نشر عام، ولا يُتخذ ضمن تنظيف كود.

## النتائج بعد الحذف

- ملفات المشروع (باستثناء `node_modules` و`dist`): ‏107 ← 42 ملفاً.
- `pnpm install`: ناجح بقفل محدّث (لا أثر لـ mysql2 أو drizzle في `pnpm-lock.yaml`).
- `tsc --noEmit`: ناجح (exit 0).
- `expo lint`: نظيف (exit 0).
- `vitest run`: ‏3/3 اختبارات المنتج ناجحة.
- `expo config`: تُقرأ الإعدادات سليمة، والإضافات 5 فقط (expo-asset، expo-router، منتقي التاريخ، شاشة البداية، expo-build-properties).
- `expo export --platform android`: ناجح — حزمة JavaScript/Hermes بحجم 4.3MB، ما يثبت أن الحذف لم يكسر أي استيراد في مسار البناء.

## بناء Android — النتيجة الصادقة

**ما تمّ التحقق منه هنا بنجاح:** حزمة التطبيق البرمجية تُبنى سليمة (`expo export --platform android` أنتج حزمة Hermes بحجم 4.3MB)، والإعدادات تُقرأ صحيحة، وكل الفحوصات خضراء. الكود جاهز للبناء في أي بيئة بناء طبيعية.

**ما لم ينجح هنا، ولماذا:** حاولنا البناء الأصلي (Native) داخل بيئة العمل هذه بجدّية كاملة: ثبّتنا JDK 17 وAndroid SDK (منصة 36 وأدوات بناء 36.0.0 وNDK 27.1.12297006 وCMake 3.22.1 وGradle 9.3.1) وولّدنا مشروع Android بـ `expo prebuild` بنجاح. لكن بناء Gradle نفسه يفشل في هذه البيئة قبل أن يبدأ فعلياً: خادم Gradle (الـ daemon) يُقطع اتصاله ويُحذف من سجلّه خلال نحو 10 ثوانٍ من إقلاعه، في كل محاولة (بخادم وبدونه، وبثلاثة مواقع مختلفة لملفاته). سجلات المحاولات محفوظة في أرشيف العمل. الخلاصة: البيئة الحالية لا تسمح ببناء Gradle، وهذا قيد بيئة لا قيد في المشروع — بدليل أن كل خطوة تخص المشروع نفسه نجحت.

**المسارات الجاهزة الآن لإنتاج الـ APK فعلياً (اختر واحداً):**
1. **لوحة التطبيقات (المسار الرسمي الأصلي للمشروع):** شغّل بناء Android من اللوحة على هذه النسخة النظيفة — وهي الخطوة الوحيدة المتبقية هناك.
2. **GitHub Actions (أضفناه في هذه المرحلة):** الملف `.github/workflows/android-apk.yml` يبني الـ APK تلقائياً على خوادم GitHub عند رفع المشروع إلى مستودع وتشغيل الـ workflow، ويُسلّم الملف كأثر (artifact) قابل للتنزيل. يشمل الفحص والاختبارات قبل البناء.
3. **EAS Build (أضفنا إعداده):** `eas.json` جاهز بملف `preview` الذي ينتج APK — يتطلب تسجيل الدخول بحساب Expo ثم `eas build -p android --profile preview`.

تنبيه توقيع: أي APK يُبنى بالإعدادات الافتراضية موقّع بمفتاح Debug — صالح للتثبيت والاختبار على الأجهزة، وغير صالح للنشر في متجر. إنشاء مفتاح توقيع خاص قرار يسبق أي نشر عام.
