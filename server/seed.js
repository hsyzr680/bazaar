import dotenv from 'dotenv'
import pg from 'pg'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })
dotenv.config({ path: join(__dirname, '../.env') })

const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
})

const PRODUCTS = [
  // إلكترونيات (25)
  { name: 'سماعات لاسلكية بلوتوث', description: 'سماعات رأس مريحة مع إلغاء ضوضاء نشط وجودة صوت استثنائية. بطارية تدوم 30 ساعة.', price: 89.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'electronics' },
  { name: 'ساعة ذكية رياضية', description: 'ساعة ذكية مع قياس معدل ضربات القلب والنوم والخطى. مقاومة للماء ومتصلة بالجوال.', price: 149.00, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'electronics' },
  { name: 'حافظة جوال فاخرة', description: 'حافظة جلود طبيعية تحمي شاشتك من الخدوش والسقوط. تصميم أنيق يناسب الرجال والنساء.', price: 24.99, image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=400', category: 'electronics' },
  { name: 'شاحن لاسلكي سريع 20W', description: 'شاحن لاسلكي سريع متوافق مع أغلب الهواتف. يشحن جهازك بسرعة وأمان.', price: 34.99, image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400', category: 'electronics' },
  { name: 'لابتوب محمول خفيف', description: 'لابتوب بمعالج حديث وذاكرة 8GB. مثالي للعمل والدراسة مع شاشة Full HD.', price: 549.00, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', category: 'electronics' },
  { name: 'كيبورد لاسلكي ميكانيكي', description: 'لوحة مفاتيح ميكانيكية بمفاتيح هادئة. إضاءة RGB وتصميم مريح للكتابة الطويلة.', price: 79.99, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400', category: 'electronics' },
  { name: 'ماوس لاسلكي للألعاب', description: 'ماوس دقة عالية مع أزرار قابلة للبرمجة. مناسب للألعاب والعمل الاحترافي.', price: 45.00, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'electronics' },
  { name: 'سماعات أذن صغيرة', description: 'سماعات داخل الأذن بتقنية إلغاء الضوضاء. صوت نقِي وحجم صغير يناسب الجيب.', price: 59.99, image: 'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=400', category: 'electronics' },
  { name: 'ساعة يد كلاسيكية', description: 'ساعة أنيقة بوجه أبيض وحزام جلد. مناسبة للمناسبات والعمل اليومي.', price: 129.00, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', category: 'electronics' },
  { name: 'كاميرا ويب HD', description: 'كاميرا ويب بدقة 1080p للمكالمات والعمل من المنزل. ميكروفون مدمج.', price: 69.99, image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400', category: 'electronics' },
  { name: 'باور بانك 20000 mAh', description: 'شاحن محمول سعة كبيرة يشحن هاتفك عدة مرات. منافذ متعددة وشحن سريع.', price: 39.99, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400', category: 'electronics' },
  { name: 'تابلت 10 بوصة', description: 'تابلت بشاشة واضحة وذاكرة 64GB. مثالي للمشاهدة والقراءة والألعاب الخفيفة.', price: 199.00, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', category: 'electronics' },
  { name: 'قارئ كتب إلكتروني', description: 'قارئ إلكتروني بشاشة ورقية لا تؤذي العين. آلاف الكتب في جيبك.', price: 119.00, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', category: 'electronics' },
  { name: 'سماعة ذكية للمنزل', description: 'سماعة ذكية تعمل بالأمر الصوتي. تشغيل الموسيقى والأخبار والطقس.', price: 89.00, image: 'https://images.unsplash.com/photo-1558089687-f282ffc85224?w=400', category: 'electronics' },
  { name: 'فلاش للجوال', description: 'وحدة تخزين فلاش توصيل بالجوال. نقل الملفات بسرعة وسهولة.', price: 29.99, image: 'https://images.unsplash.com/photo-1597872200969-2b65d5651341?w=400', category: 'electronics' },
  { name: 'حامل جوال للسيارة', description: 'حامل قوي يثبت الجوال على لوحة القيادة. مناسب لجميع أحجام الهواتف.', price: 19.99, image: 'https://images.unsplash.com/photo-1607860108855-64b4b1c2538b?w=400', category: 'electronics' },
  { name: 'سماعات ألعاب 7.1', description: 'سماعات ألعاب محيطية مع ميكروفون واضح. تجربة غامرة في الألعاب والمكالمات.', price: 74.99, image: 'https://images.unsplash.com/photo-1618366712010-4f9ac11e2f6c?w=400', category: 'electronics' },
  { name: 'محول USB-C متعدد المنافذ', description: 'محول يوصل عدة أجهزة بلابتوبك. HDMI، USB، وشحن في منفذ واحد.', price: 49.99, image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400', category: 'electronics' },
  { name: 'سلك شحن سريع', description: 'كابل شحن سريع متين ومقاوم للالتواء. طول مناسب للاستخدام اليومي.', price: 14.99, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400', category: 'electronics' },
  { name: 'سماعات بلوتوث صغيرة', description: 'سماعات مدمجة بتصميم عصري. صوت قوي وبطارية تدوم طوال اليوم.', price: 42.00, image: 'https://images.unsplash.com/photo-1588423771073-bf2c35f7ac0a?w=400', category: 'electronics' },
  { name: 'ساعة أطفال ذكية', description: 'ساعة ذكية للأطفال مع نظام تتبع ومكالمات. آمنة ومناسبة للأعمار 5-12 سنة.', price: 59.99, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400', category: 'electronics' },
  { name: 'كاميرا مراقبة منزلية', description: 'كاميرا ذكية مع رؤية ليلية وتطبيق للجوال. مراقبة المنزل من أي مكان.', price: 64.99, image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400', category: 'electronics' },
  { name: 'مصباح ذكي LED', description: 'لمبة ذكية تتحكم بها من الجوال. تغيير اللون والسطوع والجدولة.', price: 24.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'electronics' },
  { name: 'مشغل موسيقى محمول', description: 'مشغل موسيقى بتصميم كلاسيكي. دقة صوت عالية وذاكرة قابلة للتوسيع.', price: 89.00, image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400', category: 'electronics' },
  { name: 'سماعات رأس للاستوديو', description: 'سماعات احترافية للاستماع والمونتاج. صوت محايد ودقيق.', price: 129.99, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400', category: 'electronics' },
  // ملابس (25)
  { name: 'تيشيرت قطن بيضاء', description: 'تيشيرت قطن 100% مريح للارتداء اليومي. مقاسات من S إلى XXL وألوان متعددة.', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'clothes' },
  { name: 'جينز كلاسيكي أزرق', description: 'بنطال جينز قطني متين بتصميم ريترو. يناسب كل المناسبات.', price: 49.99, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', category: 'clothes' },
  { name: 'كنزة صوف دافئة', description: 'كنزة صوف ناعمة للشتاء. تصميم بسيط يسهل تنسيقه مع أي قطعة.', price: 59.00, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', category: 'clothes' },
  { name: 'معطف شتوي أنيق', description: 'معطف طويل دافئ مع بطانة داخلية. مثالي للطقس البارد والمظهر الأنيق.', price: 129.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', category: 'clothes' },
  { name: 'حذاء رياضي مريح', description: 'حذاء رياضي خفيف للمشي والجري. نعل مرن وتهوية جيدة.', price: 79.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'clothes' },
  { name: 'فستان صيفي قطني', description: 'فستان خفيف بألوان زاهية. مثالي للخروج في الصيف والمناسبات العادية.', price: 44.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'clothes' },
  { name: 'قميص رجالي رسمي', description: 'قميص قطني للمكتب والمناسبات. ياقة كلاسيكية وأزرار عالية الجودة.', price: 39.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', category: 'clothes' },
  { name: 'حقيبة يد نسائية', description: 'حقيبة يد جلدية بتصميم عصري. تتسع للجوال والمحفظة والمفاتيح.', price: 69.00, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', category: 'clothes' },
  { name: 'حزام جلد طبيعي', description: 'حزام جلد بني كلاسيكي. يصلح مع الجينز والبناطيل الرسمية.', price: 34.99, image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=400', category: 'clothes' },
  { name: 'سترة جلدية كلاسيكية', description: 'سترة جلدية أنيقة للرجال والنساء. قطع مميز وجودة عالية.', price: 149.00, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'clothes' },
  { name: 'شورت صيفي قطني', description: 'شورت خفيف للمشي والرياضة. مريح ومناسب للطقس الحار.', price: 24.99, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', category: 'clothes' },
  { name: 'بلوزة نسائية أنيقة', description: 'بلوزة قطنية بتصميم بسيط. مناسبة للعمل والجامعة.', price: 29.99, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400', category: 'clothes' },
  { name: 'جاكيت رياضي خفيف', description: 'جاكيت رياضي قابل للطي. خفيف ومقاوم للماء ومناسب للتمارين.', price: 54.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'clothes' },
  { name: 'قبعة بيسبول كلاسيكية', description: 'قبعة قطنية بتصميم رياضي. حماية من الشمس ومظهر عصري.', price: 22.00, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', category: 'clothes' },
  { name: 'جوارب قطنية 3 أزواج', description: 'ثلاثة أزواج جوارب قطنية مريحة. ألوان متناسقة للاستخدام اليومي.', price: 14.99, image: 'https://images.unsplash.com/photo-1586352867391-3c3e9b9a5258?w=400', category: 'clothes' },
  { name: 'عباية أنيقة سوداء', description: 'عباية سوداء خفيفة بتصميم عصري. مناسبة للخروج والعمل.', price: 79.99, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', category: 'clothes' },
  { name: 'بدلة رجالية رسمية', description: 'بدلة كاملة للمناسبات الرسمية. قماش عالي الجودة وقصة أنيقة.', price: 199.00, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', category: 'clothes' },
  { name: 'صديري صيفي مريح', description: 'صديري قطني بألوان جميلة. مثالي للبيت والسفر.', price: 26.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', category: 'clothes' },
  { name: 'بنطال رياضي مريح', description: 'بنطال رياضي قطني للمشي والجري. خفيف ويمتص العرق.', price: 34.99, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', category: 'clothes' },
  { name: 'معطف خفيف للربيع', description: 'معطف خفيف للطقس المعتدل. تصميم بسيط وسهل الارتداء.', price: 64.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', category: 'clothes' },
  { name: 'حذاء كلاسيكي أسود', description: 'حذاء رسمي أسود للرجال. جلد طبيعي ومريح للمشي الطويل.', price: 89.00, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400', category: 'clothes' },
  { name: 'قميص بولو رجالي', description: 'قميص بولو قطني للمناسبات شبه الرسمية. مريح وأنيق.', price: 36.99, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', category: 'clothes' },
  { name: 'تنورة قلمية نسائية', description: 'تنورة قلمية مناسبة للعمل. قماش ممتاز وقصة محترفة.', price: 42.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0b0b8?w=400', category: 'clothes' },
  { name: 'وشاح صوف دافئ', description: 'وشاح صوف ناعم بألوان متعددة. يدفئ ويزين في الشتاء.', price: 28.00, image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400', category: 'clothes' },
  { name: 'قفازات جلد شتوية', description: 'قفازات جلد طبيعي للشتاء. دافئة وأنيقة للرجال والنساء.', price: 44.99, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400', category: 'clothes' },
  // عطور (25)
  { name: 'عطر رجالي كلاسيكي', description: 'عطر خشبي فاخر برائحة دافئة ومميزة. يدوم طوال اليوم.', price: 69.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'perfumes' },
  { name: 'عطر نسائي زهري', description: 'عطر نسائي برائحة الورد والياسمين. أنوثة وأناقة.', price: 74.99, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', category: 'perfumes' },
  { name: 'عطر رياضي منعش', description: 'عطر خفيف ومنعش للرجال. مثالي بعد الرياضة والاستحمام.', price: 49.99, image: 'https://images.unsplash.com/photo-1619994121345-228ee393e2e0?w=400', category: 'perfumes' },
  { name: 'عطر أوكسيجين نسائي', description: 'عطر نسائي منعش برائحة الحمضيات والزهور. خفيف ومناسب للنهار.', price: 59.00, image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', category: 'perfumes' },
  { name: 'عطر خشبي فاخر', description: 'عطر رجالي برائحة الصندل والمسك. فخامة وتميز.', price: 89.99, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', category: 'perfumes' },
  { name: 'عطر فلورال للنساء', description: 'عطر زهري خفيف برائحة الفانيليا والياسمين. رومانسي وأنثوي.', price: 64.99, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', category: 'perfumes' },
  { name: 'عطر بحري رجالي', description: 'عطر برائحة البحر والمنعشات. يناسب الصيف والنهار.', price: 54.99, image: 'https://images.unsplash.com/photo-1619994121345-228ee393e2e0?w=400', category: 'perfumes' },
  { name: 'عطر عنبر ومسك', description: 'عطر شرقي فاخر برائحة العنبر والمسك. قوي ويدوم طويلاً.', price: 79.99, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', category: 'perfumes' },
  { name: 'عطر حلويات للنساء', description: 'عطر برائحة الفانيليا والكاراميل. دافئ وحلو.', price: 59.99, image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', category: 'perfumes' },
  { name: 'عطر سيتروس منعش', description: 'عطر حمضيات منعش للرجال والنساء. مثالي للصيف.', price: 44.99, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', category: 'perfumes' },
  { name: 'عطر رومانسي للزوجين', description: 'عطر unisex برائحة دافئة ومميزة. هدية مثالية للأزواج.', price: 69.00, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', category: 'perfumes' },
  { name: 'عطر نهار خفيف', description: 'عطر خفيف للاستخدام اليومي. لا يزعج في الأماكن المغلقة.', price: 39.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'perfumes' },
  { name: 'عطر ليلي فاخر', description: 'عطر قوي للمناسبات الليلية. يدوم ساعات طويلة.', price: 94.99, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', category: 'perfumes' },
  { name: 'عطر أطفال خفيف', description: 'عطر خفيف ولطيف مناسب للأطفال. رائحة ناعمة وآمنة.', price: 24.99, image: 'https://images.unsplash.com/photo-1619994121345-228ee393e2e0?w=400', category: 'perfumes' },
  { name: 'عطر صيفي منعش', description: 'عطر خفيف برائحة الحمضيات والنعناع. منعش في الحر.', price: 49.00, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', category: 'perfumes' },
  { name: 'عطر شتوي دافئ', description: 'عطر دافئ برائحة البخور والخشب. مثالي للشتاء.', price: 74.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'perfumes' },
  { name: 'عطر سفر 30 مل', description: 'عبوة سفر صغيرة 30 مل. مثالية للسفر والجيب.', price: 34.99, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', category: 'perfumes' },
  { name: 'عطر كلاسيكي 100 مل', description: 'عبوة كبيرة 100 مل لعطر كلاسيكي. اقتصادي ويدوم طويلاً.', price: 99.99, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', category: 'perfumes' },
  { name: 'عطر زهري للعروس', description: 'عطر فاخر للعروس برائحة الورد والياسمين. أناقة وجمال.', price: 119.00, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400', category: 'perfumes' },
  { name: 'عطر رياضي نسائي', description: 'عطر خفيف للنساء النشيطات. منعش بعد الرياضة.', price: 44.99, image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', category: 'perfumes' },
  { name: 'عطر خشبي نسائي', description: 'عطر نسائي برائحة خشبية أنيقة. تميز وثقة.', price: 69.99, image: 'https://images.unsplash.com/photo-1619994121345-228ee393e2e0?w=400', category: 'perfumes' },
  { name: 'عطر توستد للرجال', description: 'عطر رجالي برائحة القهوة والتبغ الخفيف. قوي وجذاب.', price: 79.00, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'perfumes' },
  { name: 'عطر فانيليا حلو', description: 'عطر حلو برائحة الفانيليا والكريم. دافئ ومريح.', price: 54.99, image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=400', category: 'perfumes' },
  { name: 'عطر مسك أبيض', description: 'عطر نقي برائحة المسك الأبيض. نظافة وأناقة.', price: 64.99, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400', category: 'perfumes' },
  { name: 'عطر هدية مع علبة', description: 'عطر فاخر في علبة هدية أنيقة. مثالي للهدايا والمناسبات.', price: 89.99, image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400', category: 'perfumes' },
]

async function runSeed() {
  const client = await pool.connect()
  try {
    console.log('🔄 جاري إنشاء الجداول...')
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8')
    await client.query(schema)

    console.log('🗑️ حذف المنتجات القديمة...')
    await client.query('DELETE FROM products')

    console.log('📦 إضافة 75 منتج جديد...')
    for (const p of PRODUCTS) {
      await client.query(
        `INSERT INTO products (name, description, price, image, category) VALUES ($1, $2, $3, $4, $5)`,
        [p.name, p.description, p.price, p.image, p.category]
      )
    }

    const { rows } = await client.query('SELECT COUNT(*) as count FROM products')
    console.log(`✅ تم بنجاح! عدد المنتجات في قاعدة البيانات: ${rows[0].count}`)
  } catch (err) {
    console.error('❌ خطأ:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

runSeed()
