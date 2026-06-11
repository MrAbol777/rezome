-- ──────────────────────────────────────────────
-- Seed Data for Rezome Portfolio
-- Extracted from messages/fa.json + messages/en.json
-- Paste into Supabase SQL Editor AFTER running schema.sql
-- ──────────────────────────────────────────────

-- ── Projects (3 items) ──
INSERT INTO projects (title, description, tags, github_url, live_url, image_url, featured, sort_order) VALUES
(
  'GoldinPay',
  'پلتفرم اجاره طلا با احراز هویت امن JWT، قیمت‌گذاری لحظه‌ای و کنترل دسترسی چند نقشه. ساخته شده به صورت Monorepo با TypeScript.',
  ARRAY['Next.js 16', 'React 19', 'Express.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'JWT', 'Monorepo'],
  '#',
  '#',
  NULL,
  true,
  1
),
(
  'DanoA',
  'چت‌بات هوشمند برای کودکان با فیلتر محتوای مبتنی بر سن. گفتگوهای امن، سرگرم‌کننده و آموزشی برای بچه‌ها.',
  ARRAY['هوش مصنوعی', 'فیلتر محتوا', 'کودک‌پسند', 'Next.js', 'TypeScript'],
  '#',
  'https://danoa.ir',
  NULL,
  true,
  2
),
(
  'وبسایت پورتفولیو',
  'پورتفولیوی مدرن و دوزبانه با انیمیشن‌های اسکرول سه‌بعدی، طراحی Glassmorphism و حالت دارک/لایت با تغییر تم انیمیشن‌دار.',
  ARRAY['Next.js 15', 'Framer Motion', 'Tailwind CSS', 'TypeScript', 'next-intl'],
  'https://github.com/MrAbol777',
  '#',
  NULL,
  false,
  3
);

-- ── Skills (15 items across 3 categories) ──

-- Frontend (فرانت‌اند)
INSERT INTO skills (name, category, level, icon, sort_order) VALUES
('Next.js 15',    'frontend', 5, '⚛️', 1),
('React',         'frontend', 4, '⚛️', 2),
('TypeScript',    'frontend', 4, '📘', 3),
('Tailwind CSS',  'frontend', 5, '🎨', 4),
('Framer Motion', 'frontend', 4, '✨', 5);

-- Backend (بک‌اند)
INSERT INTO skills (name, category, level, icon, sort_order) VALUES
('Node.js',        'backend', 4, '🟢', 1),
('PHP / Laravel',  'backend', 4, '🐘', 2),
('Python / FastAPI','backend', 4, '🐍', 3),
('REST APIs',      'backend', 4, '🔌', 4),
('JWT Auth',       'backend', 4, '🔐', 5);

-- Database & Tools (دیتابیس و ابزارها)
INSERT INTO skills (name, category, level, icon, sort_order) VALUES
('PostgreSQL', 'devops', 4, '🐘', 1),
('MySQL',      'devops', 4, '🗄️', 2),
('SQLite',     'devops', 4, '📦', 3),
('Prisma ORM', 'devops', 5, '🔷', 4),
('SEO',        'devops', 4, '🔍', 5);

-- ── Experiences (3 items) ──
INSERT INTO experiences (company, role, start_date, end_date, description, is_current, sort_order) VALUES
(
  'خویش‌فرما',
  'توسعه‌دهنده وب فریلنسر',
  '2024-01-01',
  NULL,
  'ساخت اپلیکیشن‌های وب مدرن برای مشتریان با Next.js، React و TypeScript. تحویل راهکارهای ریسپانسیو و سئو بهینه.',
  true,
  1
),
(
  'GoldinPay',
  'توسعه‌دهنده فرانت‌اند',
  '2024-01-01',
  '2024-12-31',
  'توسعه پلتفرم اجاره طلا با احراز هویت امن، موتور قیمت‌گذاری لحظه‌ای و داشبورد چند نقشه.',
  false,
  2
),
(
  'DanoA',
  'توسعه‌دهنده فول‌استک',
  '2024-01-01',
  '2024-12-31',
  'ساخت چت‌بات هوش مصنوعی برای کودکان با فیلتر محتوای مبتنی بر سن، تضمین گفتگوهای امن و آموزشی.',
  false,
  3
);

-- ── Services (3 packages) ──
INSERT INTO services (name, price, duration, description, features, revisions, is_popular, sort_order, cta_text) VALUES
('Basic', 'از ۵ میلیون تومان', '۱ هفته', 'مناسب برای لندینگ پیج و سایت‌های ساده',
 ARRAY['لندینگ پیج', 'ریسپانسیو', 'فرم تماس', 'سئو پایه'], '۲ بار', false, 1, 'سفارش بده'),
('Pro', 'از ۱۵ میلیون تومان', '۳ هفته', 'مناسب برای سایت‌های کامل و فروشگاهی',
 ARRAY['سایت چندصفحه', 'پنل مدیریت', 'دیتابیس', 'احراز هویت', 'سئو پیشرفته'], '۵ بار', true, 2, 'سفارش بده'),
('Custom', 'توافقی', 'توافقی', 'پروژه‌های سازمانی و اختصاصی',
 ARRAY['همه امکانات Pro', 'API اختصاصی', 'پشتیبانی ۳ ماهه', 'مستندات کامل'], 'نامحدود', false, 3, 'مشاوره رایگان');
