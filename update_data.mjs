import fs from 'fs';

// Read the file as text
let raw = fs.readFileSync('src/assets/data.js', 'utf-8');

// Find the array part
let arrayStart = raw.indexOf('export const SCENARIOS_DATABASE = ') + 'export const SCENARIOS_DATABASE = '.length;
let arrayStr = raw.substring(arrayStart);
if (arrayStr.endsWith(';\n')) arrayStr = arrayStr.slice(0, -2);
else if (arrayStr.endsWith(';')) arrayStr = arrayStr.slice(0, -1);
// Also remove any trailing whitespace before the semicolon
arrayStr = arrayStr.trim();
if (arrayStr.endsWith(';')) arrayStr = arrayStr.slice(0, -1);

// We can evaluate it safely since it's just data
let scenarios;
try {
  scenarios = eval('(' + arrayStr + ')');
} catch (e) {
  console.log("Error evaluating:", e);
  process.exit(1);
}

function expandEvidence(ev) {
  let expanded = ev;
  let added = false;
  if(ev.includes('حروق') || ev.includes('كهرب') || ev.includes('صعق') || ev.includes('تيار') || ev.includes('نار')) {
    expanded = ev + "، مما يؤكد تماماً استخدام تيار عالي الجهد أو مواد حارقة بشكل احترافي ومدروس للصعق المتعمد وطمس الأدلة الحيوية.";
    added = true;
  }
  else if(ev.includes('كاميرا') || ev.includes('مراقبة') || ev.includes('تسجيل') || ev.includes('تصوير')) {
    expanded = ev + "، وقد أظهرت تقنيات التحسين البصري المتقدمة في المعمل الجنائي أن الفاعل كان خبيراً في تجنب النقاط العمياء ومدركاً لتوزيع أجهزة الرصد.";
    added = true;
  }
  else if(ev.includes('بصمة') || ev.includes('بصمات') || ev.includes('حذاء') || ev.includes('آثار') || ev.includes('شعر')) {
    expanded = ev + "، وتم مطابقتها جزئياً عبر أجهزة التحليل الحيوي الدقيقة لتشير إلى تواجد شخص من دائرة المعارف القريبة للضحية في توقيت مشبوه.";
    added = true;
  }
  else if(ev.includes('سُم') || ev.includes('سم') || ev.includes('مادة') || ev.includes('سيانيد') || ev.includes('غاز')) {
    expanded = ev + "، وتشير تحليلات علم السموم المعقدة أن هذا التكوين الكيميائي النادر لا يمكن الحصول عليه أو استخدامه إلا عبر قنوات متخصصة جداً ومعرفة علمية واسعة.";
    added = true;
  }
  else if(ev.includes('سلاح') || ev.includes('سكين') || ev.includes('رصاص') || ev.includes('طعن') || ev.includes('دماء') || ev.includes('دم')) {
    expanded = ev + "، وبتحليل مسرح الجريمة وزاوية الهجوم، تأكد المحققون أن القاتل يمتلك ثباتاً انفعالياً عالياً وخبرة في توجيه الضربات القاتلة السريعة التي لا تترك مجالاً للنجاة.";
    added = true;
  }
  else if(ev.includes('رسالة') || ev.includes('ورقة') || ev.includes('هاتف') || ev.includes('مكالمة') || ev.includes('وثيقة') || ev.includes('ملف')) {
    expanded = ev + "، وبعد تتبع شفرات التشفير والمصادر، تم التأكد من أن هذا الدليل الورقي أو الرقمي يمثل الخيط السري والدافع الخفي الذي قصم ظهر البعير في هذه القضية الشائكة.";
    added = true;
  }
  
  if (!added) {
    expanded = "من خلال الفحص الجنائي المكثف والتدقيق المجهري الشديد، تبين أن " + ev + "، وهو اكتشاف خطير وغير متوقع يربط بين مكان الحادث وسلوك الجاني الماكر في إخفاء جرائمه.";
  }
  
  return expanded;
}

scenarios.forEach(sc => {
  // Expand evidences
  if (sc.evidences) {
    sc.evidences = sc.evidences.map(ev => expandEvidence(ev));
  }
  // Process jobs
  if (sc.jobs) {
    sc.jobs.forEach(job => {
      // Delete recap
      if (job.recap !== undefined) {
        delete job.recap;
      }
      
      // Fix missing 'd' just in case
      if (!job.d || job.d.trim() === '') {
        job.d = "قمت بالتخطيط بعناية فائقة ونفذت جريمتك مستغلاً كل مهاراتك الخاصة وموقعك، لإنهاء حياة الضحية بدم بارد وإخفاء جميع الآثار خلفك.";
      }
    });
  }
});

let newOutput = JSON.stringify(scenarios, null, 2);
newOutput = newOutput.replace(/"([^"]+)":/g, '$1:');

const finalFileContent = '// data.js - قاعدة بيانات "المصلحة" المتكاملة (100 سيناريو كبرى)\nexport const SCENARIOS_DATABASE = ' + newOutput + ';\n';

fs.writeFileSync('src/assets/data.js', finalFileContent, 'utf-8');
console.log('Successfully updated data.js');
