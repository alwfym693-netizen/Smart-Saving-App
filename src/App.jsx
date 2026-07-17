import { useState, useEffect, useRef, useCallback } from "react";

/* ─── PALETTE ─────────────────────────────────────────────────── */
const P = {
  forest:"#1B4332", forestM:"#2D6A4F", forestL:"#40916C",
  sage:"#74C69D", mist:"#D8F3DC",
  cream:"#FDFAF5", ivory:"#F8F2E8", sand:"#EDE8DC",
  bark:"#6B3A2A", barkL:"#8B5E3C", barkHL:"#A0784A",
  gold:"#E8A44A", goldL:"#F5C878", goldD:"#C8842A",
  rose:"#C9474A", roseL:"#E07070",
  sky:"#4A90D9", white:"#FFFFFF", near:"#1A1A1A",
  apple:"#D32F2F", appleL:"#EF5350", appleD:"#B71C1C", appleHL:"#FF8A80",
  leaf0:"#2E7D32", leaf1:"#388E3C", leaf2:"#43A047", leaf3:"#66BB6A", leaf4:"#A5D6A7", leafHL:"#DCEDC8",
};

/* ─── STRINGS ─────────────────────────────────────────────────── */
const A = {
  app:"ازدهار", tag:"اِزرع ثروتك", tagSub:"كل ريال بذرة تنمو",
  home:"الرئيسية", tree:"شجرتي", missions:"المهام", harvest:"الحصاد", ai:"ازدهار AI",
  morning:"صباح النور ✨", balance:"رصيدي",
  deposit:"إيداع", withdraw:"سحب", myTree:"شجرتي",
  tapApple:"انقر التفاحة! 🍎", wonderful:"رائع! 🌱",
  appleReward:"مكافأة التفاحة 🍎",
  levelUp:"🎊 مرحلة جديدة!",
  depT:"إيداع 💰", depS:"كل ريال ينمي شجرتك",
  quick:"مبالغ سريعة", custom:"مبلغ مخصص",
  xpE:"نقاط مكتسبة", appleIn:"🍎 تفاحة قادمة!",
  seeTree:"شاهد شجرتي 🌳", goHome:"الرئيسية",
  fruitOn:"ظهرت تفاحة على شجرتك!", back:"← رجوع",
  wdT:"سحب الأموال", wdAvail:"المتاح:",
  wdReason:"لماذا تريد السحب؟", wdPH:"مثلاً: دفع إيجار، طارئ...",
  wdReq:"أخبرنا السبب للمتابعة", askAI:"اسأل ازدهار ←",
  keepSaving:"💚 سأُكمل ادخاري!", stillWd:"أحتاج السحب رغم ذلك",
  wdDone:"تم السحب ✅",
  missT:"مهام اليوم ⚡", allDone:"أحسنت! أكملت كل المهام 🏆",
  claimR:"احتسب مكافأتك", refreshIn:"تتجدد خلال:",
  seasonH:"سوق الأسهم 📈", seasonSub:"استثمر بذكاء، كالمحترفين",
  demoMode:"وضع التدريب", realMode:"الاستثمار الحقيقي",
  demoDesc:"تدرّب بأموال افتراضية بدون مخاطر",
  demoBalance:"رصيد التدريب",
  plantNow:"ازرع استثماراً جديداً 🌾", chooseBasket:"اختر سلة الاستثمار",
  invested:"المستثمر", currentVal:"القيمة الآن", profit:"الربح/الخسارة",
  simulate:"⏩ محاكاة ١٠ أيام", harvestNow:"احصد الآن 🌾",
  readyLabel:"جاهز للحصاد 🌾", daysLeft:"يوم متبقي",
  noHarvests:"لا استثمارات حالياً",
  rewardsBag:"حقيبة الجوائز 🎁", rewardsBagSub:"كل مكافآتك في مكان واحد",
  noRewards:"لم تكسب أي جوائز بعد. استمر بالادخار ونمو شجرتك! 🌱",
  useNow:"استخدم الآن", codeL:"الكود", earnedOn:"تاريخ الحصول", expiresOn:"صالح حتى",
  stAvail:"متاحة", stUsed:"مستخدمة", stExpired:"منتهية",
  chatT:"ازدهار AI", chatSub:"مساعدتك المالية الذكية",
  chatPH:"اكتب سؤالك هنا...", thinking:"ازدهار تفكر...",
  sugg:["كيف أرفع مستوى شجرتي؟","نصائح للادخار 💡","كيف يعمل الحصاد الموسمي؟","أريد سحب مالي","كيف أزيد ثماري؟"],
  customize:"تخصيص الشجرة 🎨", leafThemeL:"نمط الأوراق", decorL:"الديكور",
  login:"دخول", signup:"حساب جديد",
  welcomeB:"أهلاً بعودتك ←", startG:"ابدأ النمو ←",
  afterWd:"بعد السحب", dropWarn:"⚠️ قد تنزل شجرتك لمرحلة",
  months:"شهر",
};

/* ─── TREE LEVELS ─────────────────────────────────────────────── */
const LEVELS = [
  {lv:1,  name:"البذرة",           min:0,     apples:0,  sky:"#B8D4E8"},
  {lv:2,  name:"البادرة",          min:100,   apples:1,  sky:"#A8CCE0"},
  {lv:3,  name:"الشتلة",           min:250,   apples:1,  sky:"#98C4D8"},
  {lv:4,  name:"الشجيرة",          min:600,   apples:2,  sky:"#88BCCC"},
  {lv:5,  name:"الشجرة الصغيرة",  min:1200,  apples:3,  sky:"#78B4C0"},
  {lv:6,  name:"الشجرة الناضجة",  min:2500,  apples:5,  sky:"#68ACBC"},
  {lv:7,  name:"الشجرة المزهرة",  min:4500,  apples:7,  sky:"#5494B0"},
  {lv:8,  name:"الشجرة العظيمة",  min:7000,  apples:9,  sky:"#3A7898"},
  {lv:9,  name:"شجرة الحكمة",     min:10000, apples:11, sky:"#1E5C7A"},
  {lv:10, name:"الأسطورية",        min:15000, apples:14, sky:"#0A3C58"},
];
const getLv   = s => { let l=LEVELS[0]; for(const x of LEVELS){if(s>=x.min)l=x;} return l; };
const getNext = s => { for(const x of LEVELS){if(s<x.min)return x;} return null; };
// Persist app state to localStorage so balances/progress survive a refresh.
const STORAGE_KEY = "izdihar-state-v3";
const loadSavedState = () => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch { return null; }
};
const saveState = (state) => {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* storage unavailable - ignore */ }
};
// Each un-harvested tree apple keeps a permanent screen "slot" assigned once,
// at the moment it's earned, so harvesting one apple never shifts the others.
const nextFreeSlot = (treeApples) => {
  const used = new Set(treeApples.map(a=>a.slot));
  let s = 0; while (used.has(s)) s++;
  return s;
};
// A single deposit/action can never award more than this many new apples at
// once. The tree can only ever display ~13 anyway (lv10 cap), so anything
// beyond a generous buffer is pointless - and, more importantly, without a
// cap an extreme deposit amount could crossing thousands of savings
// milestones in one go and freeze the app trying to create that many apples.
const MAX_APPLES_PER_GRANT = 20;
const addTreeApples = (existing, count) => {
  const n = Math.max(0, Math.min(Math.floor(count) || 0, MAX_APPLES_PER_GRANT));
  const additions = [];
  // Build the used-slot set once, then just increment a cursor - O(existing + n)
  // instead of recomputing the whole set on every single new apple.
  const used = new Set(existing.map(a=>a.slot));
  let cursor = 0;
  for (let i=0;i<n;i++){
    while (used.has(cursor)) cursor++;
    used.add(cursor);
    additions.push({id:`${Date.now()}-${i}-${Math.random().toString(36).slice(2,7)}`, createdAt:Date.now(), slot:cursor});
    cursor++;
  }
  return additions;
};

/* ─── LEAF THEMES ─────────────────────────────────────────────── */
const THEMES = [
  {id:"spring", name:"ربيعي 🌸",  minS:0,    c:[P.leaf0,P.leaf1,P.leaf2,P.leaf3,P.leafHL]},
  {id:"summer", name:"صيفي ☀️",  minS:500,  c:["#1B5E20","#2E7D32","#388E3C","#43A047","#C8E6C9"]},
  {id:"autumn", name:"خريفي 🍂", minS:1200, c:["#5D4037","#E65100","#F57F17","#FFA000","#FFE082"]},
  {id:"winter", name:"شتوي ❄️",  minS:2500, c:["#1A237E","#283593","#3949AB","#7986CB","#E8EAF6"]},
  {id:"golden", name:"ذهبي ✨",   minS:5000, c:["#F57F17","#F9A825","#FBC02D","#FDD835","#FFF9C4"]},
  {id:"cherry", name:"أرجواني 💜",minS:8000, c:["#4A148C","#6A1B9A","#8E24AA","#BA68C8","#F3E5F5"]},
];

/* ─── DECOR ───────────────────────────────────────────────────── */
const DECOR = [
  {id:"rock",    e:"🪨", name:"صخرة",   min:0,    x:58,  y:242},
  {id:"lantern", e:"🏮", name:"فانوس",  min:200,  x:220, y:236},
  {id:"bench",   e:"🪑", name:"مقعد",   min:600,  x:42,  y:246},
  {id:"flowers", e:"🌸", name:"زهور",   min:400,  x:72,  y:248},
  {id:"mushroom",e:"🍄", name:"فطر",    min:100,  x:200, y:250},
  {id:"butterfly",e:"🦋",name:"فراشة",  min:800,  x:165, y:195},
  {id:"moon",    e:"🌙", name:"قمر",    min:3000, x:234, y:30},
  {id:"rainbow", e:"🌈", name:"قوس قزح",min:6000, x:140, y:22},
];

/* ─── APPLE REWARDS ──────────────────────────────────────────── */
/* validDays:null → no expiration. category kept generic so partner-brand
   rewards can be appended later with the exact same shape. */
const REWARDS = [
  {id:"albaik",  e:"🍗", brand:"البيك",      name:"وجبة مجانية من البيك",
    desc:"وجبة كاملة مجانية من أي فرع للبيك في المملكة",       code:"ALB-A353Df5", c:"#FF6B35", validDays:14, category:"food"},
  {id:"careem",  e:"🚗", brand:"كريم",        name:"توصيل مجاني من كريم",
    desc:"رحلة توصيل مجانية عبر تطبيق كريم حتى ٣٠ ريال",        code:"CRM-B72Ks91", c:"#1A9E5A", validDays:21, category:"service"},
  {id:"hm",      e:"👗", brand:"H&M",         name:"خصم ٣٠٪ من H&M",
    desc:"خصم ٣٠٪ على أي مشترياتك من فروع أو متجر H&M",        code:"HMG-HM92Qa1", c:"#E53935", validDays:30, category:"retail"},
  {id:"fitness", e:"💪", brand:"Fitness Time",name:"يوم مجاني في فتنس تايم",
    desc:"دخول مجاني ليوم كامل لأي فرع من فتنس تايم",           code:"FTM-FT552Lp", c:"#1565C0", validDays:14, category:"fitness"},
  {id:"euro",    e:"⚽", brand:"ملاعب يورو",  name:"ساعة مجانية في يورو",
    desc:"ساعة لعب مجانية في أي ملعب من ملاعب يورو",            code:"EUR-EU77Zx8", c:"#2E7D32", validDays:21, category:"entertainment"},
  {id:"starbucks",e:"☕",brand:"ستاربكس",     name:"مشروب مجاني من ستاربكس",
    desc:"مشروب مجاني بأي حجم من أي فرع لستاربكس",              code:"STR-K41Pm9X", c:"#00704A", validDays:14, category:"food"},
  {id:"noon",    e:"🛒", brand:"نون",          name:"خصم ١٥٪ من نون",
    desc:"خصم ١٥٪ على طلبك القادم من تطبيق نون",                code:"NON-R88Zq2T", c:"#FFCC00", validDays:30, category:"retail"},
  {id:"xp",      e:"⭐", brand:"نقاط XP",     name:"مكافأة +٣٠٠ نقطة خبرة",
    desc:"نقاط خبرة إضافية تُضاف مباشرةً لحسابك",                code:"XP-BONUS",   c:P.gold,   validDays:null, category:"xp"},
];

/* ─── STOCKS ──────────────────────────────────────────────────── */
const STOCKS = [
  {
    id:"aramco", name:"أرامكو السعودية", nameEn:"Saudi Aramco", e:"🛢️", logo:"/logos/aramco.jpg", c:"#00796B",
    ticker:"2222", exchange:"تداول", sector:"الطاقة", risk:"low", months:3, ret:9,
    desc:"أكبر شركة نفط في العالم بحصة إنتاجية تتجاوز ١٠٪ من إمدادات النفط العالمية",
    price:28.50, change:+0.8, cap:"٧.٢ تريليون ريال", dividend:"4.2٪",
    high52:"31.2", low52:"24.8",
    about:"أرامكو السعودية هي الشركة الأكثر ربحية في العالم وأكبر منتج للنفط الخام. مملوكة بأغلبيتها للحكومة السعودية، وتُدار بكفاءة عالية مع هوامش ربح استثنائية تجعلها من أكثر الأسهم استقراراً في المنطقة.",
    whyInvest:"توزيعات أرباح منتظمة ومضمونة، مركز مالي متين، وطلب عالمي مستدام على النفط لعقود قادمة.",
    risks:"أسعار النفط العالمية تتأثر بالقرارات السياسية والأوضاع الاقتصادية. التحول نحو الطاقة المتجددة قد يؤثر على الطلب على المدى البعيد.",
    stability:"تاريخياً مستقر جداً مع تقلبات منخفضة مقارنة بأسهم القطاع",
    category:"طاقة - دفاعي",
    historicalReturns:{d:+0.8,w:+2.1,m:-1.2,m3:+4.5,m6:+8.2,y:+12.4,y5:+38.6,all:+85.0},
  },
  {
    id:"alinma", name:"مصرف الإنماء", nameEn:"Alinma Bank", e:"🏦", logo:"/logos/alinma.jpg", c:"#0F2A4A",
    ticker:"1150", exchange:"تداول", sector:"البنوك الإسلامية", risk:"low", months:3, ret:12,
    desc:"أحد أسرع البنوك الإسلامية نمواً في المملكة بحضور رقمي متوسّع",
    price:32.40, change:+1.1, cap:"٤٥ مليار ريال", dividend:"3.5٪",
    high52:"36.8", low52:"27.2",
    about:"مصرف الإنماء بنك إسلامي سعودي يجمع بين الالتزام بالضوابط الشرعية والتحول الرقمي المتسارع. يقدّم حلولاً مصرفية للأفراد والشركات ويُعدّ من أبرز البنوك نمواً في المملكة خلال السنوات الأخيرة.",
    whyInvest:"نمو متسارع في المحفظة الائتمانية، استثمارات كبيرة في التحول الرقمي، وقاعدة عملاء متوسعة.",
    risks:"المنافسة الشديدة من البنوك الكبرى، وحساسية الأرباح لتغيرات أسعار الفائدة والسياسات التنظيمية.",
    stability:"نمو ثابت مع تذبذبات معتدلة مرتبطة بأداء القطاع المصرفي",
    category:"مالية - إسلامي",
    historicalReturns:{d:+1.1,w:+2.6,m:+4.4,m3:+9.5,m6:+15.8,y:+20.2,y5:+48.6,all:+98.0},
  },
  {
    id:"stc", name:"اتصالات السعودية STC", nameEn:"STC Group", e:"📡", logo:"/logos/stc.png", c:"#1565C0",
    ticker:"7010", exchange:"تداول", sector:"الاتصالات والتقنية", risk:"low", months:3, ret:11,
    desc:"رائدة التقنية والاتصالات في المملكة مع توسع إقليمي ودولي",
    price:48.20, change:+1.2, cap:"١٩٢ مليار ريال", dividend:"4.5٪",
    high52:"54.8", low52:"40.2",
    about:"STC تحولت من شركة اتصالات تقليدية إلى مجموعة تقنية متكاملة تشمل الحوسبة السحابية والأمن السيبراني والذكاء الاصطناعي. تمتلك حصصاً في شركات تقنية بارزة حول العالم.",
    whyInvest:"توزيعات أرباح عالية، تحول تقني ناجح، وعقود حكومية ضخمة في إطار رؤية 2030.",
    risks:"المنافسة في قطاع الاتصالات مكثفة. التكاليف العالية للبنية التحتية لشبكات الجيل الخامس.",
    stability:"مستقر مع تذبذب معتدل مرتبط بأداء القطاع التقني",
    category:"اتصالات - نمو",
    historicalReturns:{d:+1.2,w:+2.8,m:+4.2,m3:+9.8,m6:+16.5,y:+21.3,y5:+55.8,all:+120.0},
  },
  {
    id:"sabic", name:"سابك للبتروكيماويات", nameEn:"SABIC", e:"⚗️", logo:"/logos/sabic.png", c:"#6A1B9A",
    ticker:"2010", exchange:"تداول", sector:"الكيماويات", risk:"low", months:4, ret:8,
    desc:"من أكبر شركات البتروكيماويات عالمياً، تابعة لأرامكو السعودية",
    price:82.00, change:+0.5, cap:"٢٤٦ مليار ريال", dividend:"3.1٪",
    high52:"91.6", low52:"70.8",
    about:"سابك تحول المواد الخام البترولية إلى منتجات كيميائية تدخل في صناعة البلاستيك والأسمدة والمواد الإنشائية. حضور في أكثر من ٥٠ دولة مع قدرة إنتاجية ضخمة.",
    whyInvest:"قاعدة عملاء متنوعة ومستدامة، تكاملية مع أرامكو، وطلب صناعي عالمي متصاعد.",
    risks:"أسعار المواد الخام المتقلبة وتراجع الطلب الصناعي العالمي خلال فترات الركود.",
    stability:"شبه مستقر مع تأثر دوري بأوضاع الاقتصاد العالمي",
    category:"مواد أساسية - دوري",
    historicalReturns:{d:+0.5,w:+1.4,m:-0.8,m3:+3.2,m6:+7.1,y:+10.5,y5:+28.4,all:+65.0},
  },
  {
    id:"americana", name:"أمريكانا للمطاعم", nameEn:"Americana Restaurants", e:"🍔", logo:"/logos/americana.png", c:"#E65100",
    ticker:"6015", exchange:"تداول", sector:"المطاعم والتجزئة الغذائية", risk:"med", months:4, ret:15,
    desc:"امتياز KFC وBurger King وPizza Hut في منطقة الشرق الأوسط وأفريقيا",
    price:3.15, change:+2.1, cap:"٥٢ مليار ريال", dividend:"2.4٪",
    high52:"3.68", low52:"2.42",
    about:"أمريكانا تمتلك وتدير آلاف المطاعم العالمية في أكثر من ١٠ دول. نموذج عملها قائم على الامتياز التجاري الذي يمنحها تدفقات نقدية مستدامة حتى في أوقات التباطؤ الاقتصادي.",
    whyInvest:"علامات تجارية عالمية راسخة، طلب استهلاكي مستدام، وتوسع جغرافي متسارع.",
    risks:"ارتفاع تكاليف الغذاء والعمالة، والمنافسة المتصاعدة من المطاعم المحلية والتوصيل الرقمي.",
    stability:"نمو تدريجي مع تذبذبات معتدلة مرتبطة بالإنفاق الاستهلاكي",
    category:"تجزئة استهلاكية - دفاعي",
    historicalReturns:{d:+2.1,w:+4.5,m:+6.2,m3:+14.8,m6:+22.3,y:+31.5,y5:+78.0,all:+110.0},
  },
  {
    id:"lucid", name:"لوسيد موتورز", nameEn:"Lucid Group", e:"🚗", logo:"/logos/lucid.png", c:"#0D47A1",
    ticker:"LCID", exchange:"ناسداك", sector:"السيارات الكهربائية", risk:"high", months:4, ret:22,
    desc:"شركة سيارات كهربائية فاخرة مدعومة من صندوق الاستثمارات العامة السعودي",
    price:4.20, change:-0.3, cap:"١١ مليار دولار", dividend:"لا يوجد",
    high52:"6.40", low52:"2.29",
    about:"لوسيد تُصنّع سيارة Air الكهربائية الفاخرة ذات أطول مدى شحن في العالم. الحكومة السعودية من أكبر مساهميها، وتسعى الشركة لبناء مصنع في المملكة.",
    whyInvest:"تقنية بطاريات متقدمة، دعم سيادي سعودي، وطلب متصاعد على السيارات الكهربائية الفاخرة.",
    risks:"الشركة لا تزال في مرحلة النمو وتُسجّل خسائر. المنافسة من Tesla وشركات السيارات الكبرى شديدة.",
    stability:"متقلب جداً - مناسب للمستثمرين بشهية مخاطرة عالية ومدى زمني طويل",
    category:"تقنية نظيفة - نمو عالي",
    historicalReturns:{d:-0.3,w:-1.8,m:-8.4,m3:-12.2,m6:+18.5,y:-35.4,y5:-52.0,all:-58.0},
  },
  {
    id:"apple", name:"آبل", nameEn:"Apple Inc.", e:"🍎", logo:"/logos/apple.jpg", c:"#555555",
    ticker:"AAPL", exchange:"ناسداك", sector:"التكنولوجيا الاستهلاكية", risk:"low", months:3, ret:14,
    desc:"الشركة الأكثر قيمة في العالم - صانعة iPhone وMac وiPad",
    price:185.50, change:+0.9, cap:"٢.٨ تريليون دولار", dividend:"0.5٪",
    high52:"199.6", low52:"143.9",
    about:"آبل تجمع بين أجهزة فاخرة ونظام بيئي متكامل من الخدمات. App Store وApple Music وiCloud تُدرّ إيرادات متكررة بهوامش ربح استثنائية، مما يجعل آبل أكثر من مجرد صانع هواتف.",
    whyInvest:"ولاء استثنائي للعملاء، إيرادات خدمات متكررة، وعمليات إعادة شراء الأسهم المستمرة تعزز القيمة.",
    risks:"اعتماد كبير على iPhone. توترات التجارة مع الصين تؤثر على سلسلة التوريد.",
    stability:"من أكثر الأسهم استقراراً وثقةً في التاريخ مع نمو طويل الأمد",
    category:"تكنولوجيا - بلو تشيب",
    historicalReturns:{d:+0.9,w:+2.4,m:+6.8,m3:+15.2,m6:+22.8,y:+38.5,y5:+245.0,all:+8200.0},
  },
  {
    id:"microsoft", name:"مايكروسوفت", nameEn:"Microsoft", e:"💻", logo:"/logos/microsoft.jpg", c:"#0078D4",
    ticker:"MSFT", exchange:"ناسداك", sector:"البرمجيات والسحابة", risk:"low", months:3, ret:16,
    desc:"رائدة البرمجيات والذكاء الاصطناعي - Azure وOffice وCopilot",
    price:415.20, change:+1.4, cap:"٣.١ تريليون دولار", dividend:"0.7٪",
    high52:"430.8", low52:"309.4",
    about:"مايكروسوفت تحولت من شركة برمجيات تقليدية إلى عملاق السحابة والذكاء الاصطناعي. Azure ثاني أكبر منصة سحابية عالمياً، واستثمارها في OpenAI يضعها في صدارة ثورة الذكاء الاصطناعي.",
    whyInvest:"نمو قوي في إيرادات السحابة، شراكة استراتيجية مع OpenAI، وقاعدة عملاء مؤسسية واسعة.",
    risks:"المنافسة الشديدة من Amazon AWS وGoogle Cloud. متطلبات الذكاء الاصطناعي الاستثمارية ضخمة.",
    stability:"من أكثر الأسهم موثوقيةً عالمياً مع نمو ثابت على مدار عقود",
    category:"تكنولوجيا - بلو تشيب",
    historicalReturns:{d:+1.4,w:+3.1,m:+8.5,m3:+18.4,m6:+28.6,y:+52.4,y5:+280.5,all:+3800.0},
  },
  {
    id:"nvidia", name:"إنفيديا", nameEn:"NVIDIA", e:"🎮", logo:"/logos/nvidia.jpg", c:"#76B900",
    ticker:"NVDA", exchange:"ناسداك", sector:"أشباه الموصلات والذكاء الاصطناعي", risk:"med", months:3, ret:28,
    desc:"صانعة بطاقات GPU المُحركة لثورة الذكاء الاصطناعي العالمية",
    price:875.40, change:+3.2, cap:"٢.١ تريليون دولار", dividend:"0.03٪",
    high52:"974.0", low52:"373.0",
    about:"إنفيديا تصنع المعالجات الأكثر طلباً في تاريخ الحوسبة. كل نموذج ذكاء اصطناعي ضخم في العالم - من ChatGPT إلى Gemini - يعمل على بطاقاتها. الطلب يفوق العرض بفارق كبير.",
    whyInvest:"هيمنة شبه احتكارية على بنية الذكاء الاصطناعي. نمو إيرادات غير مسبوق وهوامش ربح عالية جداً.",
    risks:"تقييم مرتفع جداً يعكس توقعات نمو طموحة. أي تباطؤ في الذكاء الاصطناعي قد يؤثر بشدة.",
    stability:"شهد نمواً استثنائياً لكن مع تذبذبات حادة - مناسب للمدى المتوسط والطويل",
    category:"أشباه الموصلات - نمو عالي",
    historicalReturns:{d:+3.2,w:+8.4,m:+22.6,m3:+48.5,m6:+82.3,y:+195.0,y5:+1840.0,all:+22000.0},
  },
  {
    id:"amazon", name:"أمازون", nameEn:"Amazon", e:"📦", logo:"/logos/amazon.webp", c:"#FF9900",
    ticker:"AMZN", exchange:"ناسداك", sector:"التجارة الإلكترونية والسحابة", risk:"med", months:4, ret:18,
    desc:"عملاق التجارة الإلكترونية وأكبر مزود خدمات سحابية في العالم عبر AWS",
    price:182.80, change:+2.1, cap:"١.٩ تريليون دولار", dividend:"لا يوجد",
    high52:"201.2", low52:"118.4",
    about:"أمازون تجمع بين أكبر منصة تجارة إلكترونية في العالم وأكبر خدمة سحابية AWS. إيرادات AWS تتسارع مع طلب الشركات على الذكاء الاصطناعي، مما يجعل أمازون ركيزة أساسية في الاقتصاد الرقمي.",
    whyInvest:"هيمنة على التجارة الإلكترونية والسحابة معاً. نمو Prime وAWS يبشر باستمرار التوسع.",
    risks:"هوامش ربح متفاوتة بين الأقسام. المنافسة الشرسة في كل قطاع تعمل فيه.",
    stability:"نمو قوي طويل الأمد مع تذبذبات دورية",
    category:"تكنولوجيا وتجزئة - نمو",
    historicalReturns:{d:+2.1,w:+5.2,m:+12.4,m3:+24.8,m6:+38.5,y:+68.0,y5:+125.0,all:+18000.0},
  },
];

/* ─── MISSIONS ───────────────────────────────────────────────── */
const MISSION_POOL = [
  {id:"m1",title:"وفّر ٢٠ ريالاً اليوم",    e:"💰",xp:60, type:"deposit",  rType:"xp",    desc:"أكمل إيداعاً بقيمة ٢٠ ريال"},
  {id:"m2",title:"افتح التطبيق اليوم",       e:"📱",xp:30, type:"open",     rType:"xp",    desc:"الحضور اليومي يحسب"},
  {id:"m3",title:"تحقق من نمو شجرتك",       e:"🌳",xp:40, type:"tree",     rType:"xp",    desc:"قم بزيارة شاشة الشجرة"},
  {id:"m4",title:"اسأل ازدهار AI سؤالاً",     e:"✨",xp:50, type:"chat",     rType:"xp",    desc:"تحدث مع مساعدتك الذكية"},
  {id:"m5",title:"اشترِ سهمك الأول",  e:"📈",xp:100,type:"harvest",  rType:"apple", desc:"استثمر في سهم لأول مرة"},
  {id:"m6",title:"وفّر أكثر من ١٠٠ ريال",  e:"💪",xp:120,type:"dep100",   rType:"apple", desc:"إيداع بمجموع ١٠٠ ريال"},
  {id:"m7",title:"اقطف تفاحة من شجرتك",    e:"🍎",xp:90, type:"apple",    rType:"apple", desc:"انقر على تفاحة ناضجة"},
  {id:"m8",title:"خصّص شجرتك",             e:"🎨",xp:45, type:"customize",rType:"xp",    desc:"غيّر نمط شجرتك"},
];
const TODAY = new Date().toDateString();
const getDailyMissions = () => {
  const day = new Date().getDay();
  const seen = new Set();
  return [0,1,2,3,4]
    .map(i => MISSION_POOL[(day*3+i*7) % MISSION_POOL.length])
    .filter(m => { if(seen.has(m.id))return false; seen.add(m.id); return true; })
    .map(m => ({...m, progress:0, done:false}));
};

/* ─── INITIAL STATE ─────────────────────────────────────────── */
const INIT = {
  balance:0, totalSaved:0, streak:0, xp:0,
  treeApples:[], harvestedApples:[], rewards:[],
  missions:getDailyMissions(), missionsDate:TODAY,
  activity:[], harvests:[], demoBalance:50000,
  chatHistory:[{role:"assistant", text:"أهلاً! أنا ازدهار 🌱، رفيقتك المالية الذكية. شجرتك بدأت كبذرة صغيرة اليوم - ادخر أول ريال وشاهد السحر! اسألني أي شيء عن الادخار أو الاستثمار."}],
  leafTheme:"spring", unlockedThemes:["spring"], placedDecor:[],
  badges:[
    {id:1,e:"🌱",name:"البذرة الأولى", unlocked:false},
    {id:2,e:"🍎",name:"قاطف التفاح",  unlocked:false},
    {id:3,e:"🌾",name:"المستثمر",     unlocked:false},
    {id:4,e:"🎨",name:"المزيّن",       unlocked:false},
  ],
};

/* ─── CSS ─────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Cairo:wght@600;700;800;900&display=swap');
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;margin:0;padding:0;}
::-webkit-scrollbar{display:none;}

/* Apple interactions ONLY */
@keyframes appleShake{0%,100%{transform:rotate(0deg)}15%{transform:rotate(-18deg)}30%{transform:rotate(16deg)}45%{transform:rotate(-12deg)}60%{transform:rotate(9deg)}75%{transform:rotate(-6deg)}}
@keyframes appleLaunch{0%,100%{transform:rotate(0deg) scale(1);opacity:1}15%{transform:rotate(-18deg) scale(1)}30%{transform:rotate(16deg) scale(1)}45%{transform:rotate(-12deg) scale(1.04)}62%{transform:rotate(10deg) scale(1.12);opacity:1}82%{transform:translateY(-14px) scale(1.3);opacity:0.85}100%{transform:translateY(-46px) scale(0.15);opacity:0}}
@keyframes overlayFadeIn{from{opacity:0}to{opacity:1}}
@keyframes appleFall{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(290px) rotate(900deg);opacity:0.9}}
@keyframes appleBounce{0%{transform:translateY(0) scaleY(1)}22%{transform:translateY(-42px) scaleY(1.04)}40%{transform:translateY(0) scaleY(0.82)}55%{transform:translateY(-18px) scaleY(1.02)}70%{transform:translateY(0) scaleY(0.92)}83%{transform:translateY(-7px)}100%{transform:translateY(0) scaleY(1)}}
@keyframes appleOpen{0%{transform:scale(1) rotate(0deg)}40%{transform:scale(1.4) rotate(-22deg)}100%{transform:scale(0) rotate(210deg);opacity:0}}
@keyframes appleGlowPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(211,47,47,0.6))}50%{filter:drop-shadow(0 0 18px rgba(211,47,47,0.95)) drop-shadow(0 0 32px rgba(255,82,82,0.5))}}
@keyframes appleFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-4px) scale(1.03)}}
@keyframes petalFall{0%{transform:translateY(0) rotate(0deg) translateX(0);opacity:1}100%{transform:translateY(150px) rotate(750deg) translateX(var(--dx));opacity:0}}
@keyframes goldRing{0%{transform:scale(1);opacity:0.7}100%{transform:scale(4);opacity:0}}
@keyframes rewardPop{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.12) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}
@keyframes readyPill{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(-8px)}}

/* Tree entrance only */
@keyframes treeIn{from{opacity:0;transform:scale(0.9) translateY(12px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes seedIn{0%{transform:scale(0.2);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}

/* UI */
@keyframes bounceIn{0%{transform:scale(0.15);opacity:0}60%{transform:scale(1.14)}100%{transform:scale(1);opacity:1}}
@keyframes fadeUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
@keyframes glowBox{0%,100%{box-shadow:0 0 12px rgba(232,164,74,0.4)}50%{box-shadow:0 0 28px rgba(232,164,74,0.85),0 0 50px rgba(245,200,120,0.4)}}
@keyframes modalUp{from{transform:scale(0.82) translateY(40px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
@keyframes starBurst{0%{transform:scale(0) rotate(0deg);opacity:0}55%{transform:scale(1.45) rotate(200deg);opacity:1}100%{transform:scale(1) rotate(360deg);opacity:1}}
@keyframes chatIn{from{transform:translateY(10px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
@keyframes lineIn{from{stroke-dashoffset:600}to{stroke-dashoffset:0}}
@keyframes profitFloat{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-55px);opacity:0}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes sheetIn{from{transform:translateY(100%)}to{transform:translateY(0)}}
@keyframes backdropIn{from{opacity:0}to{opacity:1}}

/* Living crop (portfolio) */
@keyframes cropSwayStrong{0%,100%{transform:rotate(-3.2deg)}50%{transform:rotate(3deg)}}
@keyframes cropSway{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(2deg)}}
@keyframes cropSwaySlow{0%,100%{transform:rotate(-1.1deg)}50%{transform:rotate(1deg)}}
@keyframes cropLeafFall{0%{transform:translateY(0) rotate(0deg);opacity:0.9}100%{transform:translateY(54px) rotate(200deg);opacity:0}}
@keyframes cropFlowerPulse{0%,100%{opacity:0.88;transform:scale(1)}50%{opacity:1;transform:scale(1.16)}}
@keyframes cropGlow{0%,100%{filter:drop-shadow(0 0 3px rgba(232,164,74,0.35))}50%{filter:drop-shadow(0 0 9px rgba(232,164,74,0.75))}}

input,textarea,button{font-family:'Tajawal',sans-serif;direction:rtl;}
input:focus,textarea:focus{border-color:${P.forestL}!important;outline:none;}
textarea{resize:none;}
`;

/* ═══════════════════════════════════════════════════════════════
   🌳 CARTOON APPLE TREE SVG
   Matches reference: forked brown trunk, round lush canopy,
   large glossy red apples at branch tips, cartoon shading
═══════════════════════════════════════════════════════════════ */
function CartoonAppleTree({ lv, appleCount, appleSlots, pendingApple, onTapApple, leafTheme="spring", placedDecor=[], size=300 }) {
  const [mounted,    setMounted]    = useState(false);
  const [shakingIdx, setShakingIdx] = useState(null);
  const uid = useRef("t" + Math.random().toString(36).slice(2,6)).current;
  const theme = THEMES.find(t => t.id === leafTheme) || THEMES[0];
  const [lDark, lMid, lLight, lBright, lHL] = theme.c;

  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, [lv]);

  const tap = (i) => {
    const ap = apples[i];
    if (!ap || !ap.harvestable) return;
    setShakingIdx(i);
    setTimeout(() => { setShakingIdx(null); onTapApple(ap.id); }, 750);
  };

  // ── Geometry: everything scaled to fit 280×260 viewBox at ALL levels ──────
  // Key insight: total tree height = trunk + canopy. We scale both so the
  // full tree always fits, with canopy top at Y≈10 and roots at Y≈252.
  const CX  = 140;
  const GY  = 252;   // ground Y
  const TOP = 12;    // minimum Y for canopy top

  // Total drawable height
  const totalH = GY - TOP;  // = 240

  // Split: trunk takes bottom 30-40%, canopy takes top 60-70%
  // At lv1 (seed) there's no trunk/canopy - handled separately
  const trkFrac  = 0.30 + lv * 0.008;   // trunk fraction of totalH (grows slightly)
  const trkH     = Math.round(totalH * Math.min(trkFrac, 0.42));
  const trkBW    = 14 + lv * 1.4;       // base half-width
  const trkTW    =  6 + lv * 0.55;      // top half-width
  const trkTY    = GY - trkH;           // trunk top Y

  // Canopy fills remaining space above trunk
  const cRY  = Math.round((trkTY - TOP) * 0.52);   // canopy Y-radius
  const cRX  = Math.round(cRY * (1.18 + lv*0.01)); // slightly wider than tall
  const cCY  = trkTY - Math.round(cRY * 0.55);     // canopy centre Y

  // Apple positions: generated (not hand-picked) so apples are always evenly
  // spaced around the canopy by angle, never overlap, and never sit on top
  // of the canopy centre / trunk. 1-6 apples sit on a single ring; 7+ apples
  // alternate between two ring depths so angular neighbours are also
  // separated in depth, keeping every apple easy to tell apart and tap.
  // Each [normX, normY]: fraction of cRX/cRY from canopy centre.
  const ringLayout = (n) => {
    if (n <= 0) return [];
    if (n === 1) return [[ 0.42,-0.42]];
    if (n === 2) return [[-0.66, 0.06],[ 0.66,-0.10]];
    const baseR = 0.70, outerAdd = 0.18, innerSub = 0.18, ryScale = 0.94;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const angle = (-90 + i * (360 / n)) * Math.PI / 180;
      const r = n <= 6 ? baseR : (i % 2 === 0 ? baseR + outerAdd : baseR - innerSub);
      pts.push([
        Math.round(Math.cos(angle) * r * 100) / 100,
        Math.round(Math.sin(angle) * r * ryScale * 100) / 100,
      ]);
    }
    return pts;
  };
  const ATPL = { 1:[], 2:[] };
  for (let L = 3; L <= 10; L++) {
    const cap = (LEVELS.find(x => x.lv === L) || {}).apples || 0;
    ATPL[L] = ringLayout(cap);
  }
  const APL_R = 11;
  const useSlots = Array.isArray(appleSlots);
  // The sprout (lv2) has its own small hand-drawn canopy that doesn't follow
  // the generic canopy math used by the full tree (lv>=3), so its very first
  // fruit gets a fixed spot that actually sits on its foliage.
  const SPROUT_SPOTS = [[CX+15, GY-62]];
  const posTable = lv === 2
    ? SPROUT_SPOTS.map(([x,y]) => ({x,y}))
    : (ATPL[Math.min(lv,10)] || []).map(([nx,ny]) => ({
        x: Math.round(CX  + nx * cRX),
        y: Math.round(cCY + ny * cRY),
      }));
  const lvCap = (LEVELS.find(x=>x.lv===lv) || {}).apples;
  const maxSlotsForLevel = typeof lvCap === "number" ? Math.min(posTable.length, lvCap) : posTable.length;

  let apples;
  if (useSlots) {
    // Every un-harvested apple carries its own permanent `slot`, assigned once
    // when it was earned - so this only ever positions currently-owned fruit,
    // never reshuffles it. Apples whose slot is beyond the current level's
    // capacity simply wait (queued) until the tree grows enough room.
    apples = appleSlots
      .filter(ap => typeof ap.slot === "number" && ap.slot < maxSlotsForLevel)
      .sort((a,b) => a.slot - b.slot)
      .map(ap => {
        const pos = posTable[ap.slot];
        return { x:pos.x, y:pos.y, r:APL_R, id:ap.id, harvestable:true };
      });
  } else {
    // Legacy decorative mode (preview trees): fixed count, no reward tracking.
    apples = posTable.slice(0, appleCount || 0).map((pos, i) => ({
      x:pos.x, y:pos.y, r:APL_R, id:i, harvestable:(i === 0 && !!pendingApple),
    }));
  }
  const readyCount = apples.filter(a=>a.harvestable).length;
  // Shared apple visuals so the sprout stage (lv2) and the full tree (lv>=3)
  // can both render real, individually-harvestable fruit.
  const appleLayer = apples.map((ap, i) => {
    const isH = ap.harvestable;
    const isS = shakingIdx === i;
    const r   = ap.r;
    return (
      <g key={ap.id}
        onClick={() => isH ? tap(i) : null}
        style={{cursor: isH ? "pointer" : "default"}}>
        {isH && (
          <>
            <circle cx={ap.x} cy={ap.y} r={r+18} fill="#D32F2F" opacity="0.08"
              style={{animation:"appleFloat 2s ease-in-out infinite"}}/>
            <circle cx={ap.x} cy={ap.y} r={r+10} fill="#D32F2F" opacity="0.14"
              style={{animation:"appleFloat 2s ease-in-out infinite",animationDelay:"0.22s"}}/>
          </>
        )}
        {/* Stem */}
        <path
          d={`M${ap.x+2} ${ap.y-r+2} C${ap.x+2} ${ap.y-r-5} ${ap.x+3} ${ap.y-r-11} ${ap.x+3} ${ap.y-r-14}`}
          stroke="#3E2A10" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        {/* Leaf */}
        <path
          d={`M${ap.x+3} ${ap.y-r-8} C${ap.x+10} ${ap.y-r-17} ${ap.x+18} ${ap.y-r-14} ${ap.x+15} ${ap.y-r-6} C${ap.x+10} ${ap.y-r-1} ${ap.x+4} ${ap.y-r-5} ${ap.x+3} ${ap.y-r-8}Z`}
          fill="#2E7D32"/>
        <path
          d={`M${ap.x+3} ${ap.y-r-8} Q${ap.x+9} ${ap.y-r-14} ${ap.x+14} ${ap.y-r-11}`}
          stroke="#1B5E20" strokeWidth="0.85" fill="none" strokeLinecap="round" opacity="0.58"/>
        {/* Drop shadow */}
        <ellipse cx={ap.x+2} cy={ap.y+r*0.88+3} rx={r*0.75} ry={r*0.22} fill="#00000022"/>
        {/* Body */}
        <g style={{
          transformOrigin:`${ap.x}px ${ap.y}px`,
          animation: isS ? "appleLaunch 0.75s ease-in forwards"
            : isH ? "appleFloat 2.2s ease-in-out infinite, appleGlowPulse 2.2s ease-in-out infinite"
            : "none",
          filter: isH ? "url(#"+uid+"GL)" : "none",
        }}>
          <circle cx={ap.x} cy={ap.y} r={r}
            fill={isH ? "url(#"+uid+"APG)" : "url(#"+uid+"AP)"}/>
          <path d={`M${ap.x-2} ${ap.y-r+2} Q${ap.x} ${ap.y-r-3} ${ap.x+2} ${ap.y-r+2}`}
            fill="none" stroke="#8B0000" strokeWidth="1.8" strokeLinecap="round" opacity="0.58"/>
          <ellipse
            cx={ap.x-r*0.28} cy={ap.y-r*0.22}
            rx={r*0.38} ry={r*0.54}
            fill="#FFFFFF" opacity="0.56"
            transform={`rotate(-20,${ap.x-r*0.28},${ap.y-r*0.22})`}/>
          <circle cx={ap.x-r*0.15} cy={ap.y-r*0.44} r={r*0.14} fill="#FFFFFF" opacity="0.84"/>
          <circle cx={ap.x-r*0.07} cy={ap.y-r*0.56} r={r*0.07}  fill="#FFFFFF" opacity="0.68"/>
          <ellipse cx={ap.x+r*0.08} cy={ap.y+r*0.58} rx={r*0.65} ry={r*0.24}
            fill="#8B0000" opacity="0.18"/>
        </g>
      </g>
    );
  });

  // Canopy blob layers [relCX, relCY, rxMult, ryMult, colorIndex]
  const BLOBS = [
    [0,0,1,1,0],[-.55,.10,.58,.56,0],[.55,.08,.58,.56,0],
    [0,-.55,.56,.50,0],[-.36,-.36,.50,.46,0],[.36,-.36,.50,.46,0],
    [-.20,.56,.44,.40,0],[.20,.56,.44,.40,0],
    [0,.10,.88,.85,1],[-.48,.15,.50,.48,1],[.48,.14,.50,.48,1],
    [0,-.44,.50,.46,1],[-.28,-.22,.44,.42,1],[.28,-.22,.44,.42,1],
    [-.14,.50,.40,.36,1],[.14,.50,.40,.36,1],
    [0,.05,.72,.70,2],[-.34,.10,.42,.40,2],[.34,.10,.42,.40,2],
    [0,-.32,.42,.40,2],[-.20,-.10,.38,.36,2],[.20,-.10,.38,.36,2],
    [0,-.06,.54,.50,3],[-.22,-.04,.30,.28,3],[.22,-.04,.30,.28,3],[0,-.22,.30,.28,3],
    [-.06,-.16,.26,.22,4],[.10,-.22,.20,.18,4],
  ];
  const COLS = [lDark, lMid, lLight, lBright, lHL];
  const BUMPS = [0,18,36,55,74,92,110,130,148,168,187,206,225,244,262,280,300,320,340];
  const bumpR = 12 + lv * 0.5;

  return (
    <div style={{position:"relative", width:size, height:Math.round(size * 260/280), userSelect:"none"}}>
      <svg width={size} height={Math.round(size * 260/280)}
        viewBox="0 0 280 260" fill="none" style={{overflow:"hidden",display:"block"}}>
        <defs>
          <linearGradient id={uid+"TK"} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3D1C06"/>
            <stop offset="20%"  stopColor="#7A4020"/>
            <stop offset="45%"  stopColor="#A0622C"/>
            <stop offset="70%"  stopColor="#8B5025"/>
            <stop offset="100%" stopColor="#3D1C06"/>
          </linearGradient>
          <linearGradient id={uid+"TH"} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="transparent"/>
            <stop offset="38%"  stopColor="#D4A060" stopOpacity="0.42"/>
            <stop offset="65%"  stopColor="#C49050" stopOpacity="0.22"/>
            <stop offset="100%" stopColor="transparent"/>
          </linearGradient>
          <radialGradient id={uid+"AP"} cx="30%" cy="24%" r="64%">
            <stop offset="0%"   stopColor="#FF7070"/>
            <stop offset="36%"  stopColor="#E53935"/>
            <stop offset="70%"  stopColor="#C62828"/>
            <stop offset="100%" stopColor="#B71C1C"/>
          </radialGradient>
          <radialGradient id={uid+"APG"} cx="30%" cy="24%" r="64%">
            <stop offset="0%"   stopColor="#FF9090"/>
            <stop offset="36%"  stopColor="#FF1744"/>
            <stop offset="100%" stopColor="#B71C1C"/>
          </radialGradient>
          <radialGradient id={uid+"GS"} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00000032"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          <radialGradient id={uid+"CS"} cx="50%" cy="80%" r="55%">
            <stop offset="0%"   stopColor="#00000020"/>
            <stop offset="100%" stopColor="transparent"/>
          </radialGradient>
          <filter id={uid+"BL"}><feGaussianBlur stdDeviation="3.5"/></filter>
          <filter id={uid+"GL"} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* SEED */}
        {lv === 1 && (
          <g style={{animation:mounted?"seedIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both":"none"}}>
            <ellipse cx={CX} cy={GY+4} rx="28" ry="9" fill="#7A5225" opacity="0.5"/>
            <ellipse cx={CX} cy={GY}   rx="20" ry="7" fill="#5D3A16" opacity="0.72"/>
            <ellipse cx={CX} cy={GY-6} rx="13" ry="9" fill="#8B5225"/>
            <ellipse cx={CX-2} cy={GY-8} rx="6.5" ry="4" fill="#A06830" opacity="0.4"/>
            <path d={`M${CX} ${GY-14} C${CX+1} ${GY-23} ${CX+3} ${GY-30} ${CX+5} ${GY-34}`}
              stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d={`M${CX+1} ${GY-22} C${CX+7} ${GY-30} ${CX+15} ${GY-28} ${CX+13} ${GY-21} C${CX+10} ${GY-14} ${CX+2} ${GY-18} ${CX+1} ${GY-22}Z`}
              fill="#66BB6A"/>
            <path d={`M${CX+1} ${GY-25} C${CX-5} ${GY-33} ${CX-12} ${GY-31} ${CX-10} ${GY-24} C${CX-8} ${GY-17} ${CX-1} ${GY-20} ${CX+1} ${GY-25}Z`}
              fill="#81C784" opacity="0.82"/>
            <circle cx={CX-14} cy={GY+6} r="2.5" fill="#5D3A16" opacity="0.32"/>
            <circle cx={CX+16} cy={GY+5} r="2"   fill="#5D3A16" opacity="0.28"/>
          </g>
        )}

        {/* SPROUT */}
        {lv === 2 && (
          <g style={{animation:mounted?"treeIn 0.55s ease-out both":"none"}}>
            <rect x={CX-4} y={GY-42} width="8" height="42" rx="4"
              fill={"url(#"+uid+"TK)"} opacity="0.9"/>
            <path d={`M${CX-2} ${GY-28} C${CX-16} ${GY-40} ${CX-27} ${GY-38} ${CX-24} ${GY-28} C${CX-22} ${GY-19} ${CX-6} ${GY-23} ${CX-2} ${GY-28}Z`}
              fill={lMid} opacity="0.9"/>
            <path d={`M${CX-2} ${GY-28} C${CX+12} ${GY-40} ${CX+23} ${GY-38} ${CX+20} ${GY-28} C${CX+18} ${GY-19} ${CX+2} ${GY-23} ${CX-2} ${GY-28}Z`}
              fill={lLight} opacity="0.85"/>
            <ellipse cx={CX-1} cy={GY-52} rx="26" ry="22" fill={lDark}/>
            <ellipse cx={CX-11} cy={GY-46} rx="17" ry="14" fill={lMid}/>
            <ellipse cx={CX+9}  cy={GY-46} rx="17" ry="14" fill={lMid}/>
            <ellipse cx={CX-1}  cy={GY-60} rx="21" ry="16" fill={lLight}/>
            <ellipse cx={CX-1}  cy={GY-66} rx="14" ry="11" fill={lBright}/>
            <ellipse cx={CX-3}  cy={GY-70} rx="9"  ry="7"  fill={lHL} opacity="0.62"/>
            {appleLayer}
          </g>
        )}

        {/* FULL TREE lv 3-10 */}
        {lv >= 3 && (
          <g style={{animation:mounted?"treeIn 0.55s ease-out both":"none"}}>

            {/* Ground */}
            <ellipse cx={CX} cy={GY+6} rx={22+lv*4} ry="7"
              fill={"url(#"+uid+"GS)"} filter={"url(#"+uid+"BL)"}/>
            <ellipse cx={CX} cy={GY+2} rx={18+lv*3} ry="5" fill="#4CAF50" opacity="0.48"/>
            {Array.from({length:6+lv},(_,i)=>{
              const gx = CX - 26 - lv*3 + i*(52+lv*6)/(5+lv);
              return (
                <g key={i}>
                  <path d={`M${gx} ${GY+2} C${gx-2} ${GY-6} ${gx-1} ${GY-12} ${gx+1} ${GY-16}`}
                    stroke="#388E3C" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.85"/>
                  <path d={`M${gx+4} ${GY+2} C${gx+6} ${GY-5} ${gx+5} ${GY-10} ${gx+4} ${GY-14}`}
                    stroke="#4CAF50" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.7"/>
                  <path d={`M${gx-3} ${GY+2} C${gx-5} ${GY-4} ${gx-4} ${GY-9} ${gx-2} ${GY-12}`}
                    stroke="#66BB6A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
                </g>
              );
            })}

            {/* Roots */}
            {[
              [CX-trkBW+4, CX-trkBW-10, CX-trkBW-30-lv*2, -2, trkBW*0.48],
              [CX+trkBW-4, CX+trkBW+10, CX+trkBW+30+lv*2, -2, trkBW*0.48],
              ...(lv>=6 ? [
                [CX-trkBW+2, CX-trkBW-18, CX-trkBW-46-lv*2, 0, trkBW*0.30],
                [CX+trkBW-2, CX+trkBW+18, CX+trkBW+46+lv*2, 0, trkBW*0.30],
              ] : []),
            ].map(([sx, mx, ex, cy2, sw], i) => (
              <g key={i}>
                <path d={`M${sx} ${GY-4} C${mx} ${GY+cy2} ${ex-8} ${GY+1} ${ex} ${GY-7}`}
                  stroke="#3D1C06" strokeWidth={sw+3} strokeLinecap="round" fill="none"
                  opacity="0.25" transform="translate(3,4)"/>
                <path d={`M${sx} ${GY-4} C${mx} ${GY+cy2} ${ex-8} ${GY+1} ${ex} ${GY-7}`}
                  stroke={"url(#"+uid+"TK)"} strokeWidth={sw} strokeLinecap="round" fill="none"/>
                <path d={`M${sx} ${GY-4} C${mx} ${GY+cy2} ${ex-8} ${GY+1} ${ex} ${GY-7}`}
                  stroke="#D4A060" strokeWidth={sw*0.2} strokeLinecap="round" fill="none" opacity="0.32"/>
              </g>
            ))}

            {/* Trunk shadow */}
            <path d={[
              `M${CX-trkBW} ${GY}`,
              `C${CX-trkBW+2} ${GY-16} ${CX-trkTW-6} ${trkTY+26} ${CX-trkTW} ${trkTY}`,
              `L${CX+trkTW} ${trkTY}`,
              `C${CX+trkTW+6} ${trkTY+26} ${CX+trkBW-2} ${GY-16} ${CX+trkBW} ${GY} Z`,
            ].join(" ")} fill="#3D1C06" opacity="0.22" transform="translate(5,0)"/>
            {/* Trunk body */}
            <path d={[
              `M${CX-trkBW} ${GY}`,
              `C${CX-trkBW+2} ${GY-16} ${CX-trkTW-6} ${trkTY+26} ${CX-trkTW} ${trkTY}`,
              `L${CX+trkTW} ${trkTY}`,
              `C${CX+trkTW+6} ${trkTY+26} ${CX+trkBW-2} ${GY-16} ${CX+trkBW} ${GY} Z`,
            ].join(" ")} fill={"url(#"+uid+"TK)"}/>
            {/* Trunk highlight */}
            <path d={[
              `M${CX-trkBW} ${GY}`,
              `C${CX-trkBW+2} ${GY-16} ${CX-trkTW-6} ${trkTY+26} ${CX-trkTW} ${trkTY}`,
              `L${CX+trkTW} ${trkTY}`,
              `C${CX+trkTW+6} ${trkTY+26} ${CX+trkBW-2} ${GY-16} ${CX+trkBW} ${GY} Z`,
            ].join(" ")} fill={"url(#"+uid+"TH)"}/>
            {/* Bark rings */}
            {[0.18,0.35,0.52,0.68,0.82].slice(0,Math.min(lv-1,5)).map((t,i)=>{
              const y = trkTY + (GY-trkTY)*t;
              const w = trkTW + (trkBW-trkTW)*(1-t);
              return(
                <path key={i}
                  d={`M${CX-w*0.88} ${y} C${CX-w*0.28} ${y+2.5} ${CX+w*0.28} ${y+2.5} ${CX+w*0.88} ${y}`}
                  stroke="#3D1C06" strokeWidth="1.2" fill="none" opacity="0.17" strokeLinecap="round"/>
              );
            })}
            {/* Trunk highlight line */}
            <path
              d={`M${CX-trkTW*0.14} ${trkTY+6} Q${CX-trkTW*0.09} ${trkTY+(GY-trkTY)*0.5} ${CX-trkBW*0.09} ${GY-8}`}
              stroke="#D4A060" strokeWidth={Math.max(1.5,trkTW*0.26)}
              fill="none" opacity="0.40" strokeLinecap="round"/>

            {/* Branches */}
            {(()=>{
              const bT = Math.max(4, 11 - lv*0.35);
              const fY = trkTY;
              const branches = [
                {d:`M${CX-trkTW+2} ${fY+6} C${CX-24} ${fY-6} ${CX-56} ${fY-26} ${CX-82-lv*3} ${fY-46-lv*2}`,w:bT},
                {d:`M${CX+trkTW-2} ${fY+6} C${CX+24} ${fY-6} ${CX+56} ${fY-26} ${CX+82+lv*3} ${fY-46-lv*2}`,w:bT},
                ...(lv>=4?[
                  {d:`M${CX-trkTW+1} ${fY+2} C${CX-18} ${fY-30} ${CX-40} ${fY-62} ${CX-54-lv*2} ${fY-84-lv*2}`,w:bT-2},
                  {d:`M${CX+trkTW-1} ${fY+2} C${CX+18} ${fY-30} ${CX+40} ${fY-62} ${CX+54+lv*2} ${fY-84-lv*2}`,w:bT-2},
                ]:[]),
                ...(lv>=5?[{d:`M${CX} ${fY} C${CX-4} ${fY-40} ${CX-2} ${fY-80} ${CX+1} ${fY-106-lv*3}`,w:bT-2.5}]:[]),
                ...(lv>=6?[
                  {d:`M${CX-trkTW} ${fY+10} C${CX-34} ${fY+2} ${CX-70} ${fY-12} ${CX-98-lv*2} ${fY-24}`,w:bT-4},
                  {d:`M${CX+trkTW} ${fY+10} C${CX+34} ${fY+2} ${CX+70} ${fY-12} ${CX+98+lv*2} ${fY-24}`,w:bT-4},
                ]:[]),
              ];
              return branches.map((b,i)=>(
                <g key={i}>
                  <path d={b.d} stroke="#3D1C06" strokeWidth={b.w+3}
                    fill="none" strokeLinecap="round" opacity="0.25" transform="translate(3,5)"/>
                  <path d={b.d} stroke={"url(#"+uid+"TK)"} strokeWidth={b.w}
                    fill="none" strokeLinecap="round"/>
                  <path d={b.d} stroke="#D4A060" strokeWidth={Math.max(1,b.w*0.22)}
                    fill="none" strokeLinecap="round" opacity="0.32"/>
                </g>
              ));
            })()}

            {/* Canopy drop shadow */}
            <ellipse cx={CX} cy={cCY+8} rx={cRX*0.86} ry={cRY*0.44}
              fill="#00000016" filter={"url(#"+uid+"BL)"}/>

            {/* Organic edge bumps */}
            {BUMPS.map((deg,i)=>{
              const rad = deg * Math.PI / 180;
              return(
                <circle key={i}
                  cx={CX  + Math.cos(rad)*cRX}
                  cy={cCY + Math.sin(rad)*cRY}
                  r={bumpR} fill={lDark} opacity="0.9"/>
              );
            })}

            {/* Blob layers */}
            {BLOBS.map(([rcx,rcy,rxM,ryM,ci],i)=>(
              <ellipse key={i}
                cx={CX  + rcx*cRX}
                cy={cCY + rcy*cRY}
                rx={rxM*cRX}
                ry={ryM*cRY}
                fill={COLS[ci]}/>
            ))}

            {/* Canopy bottom shadow */}
            <ellipse cx={CX} cy={cCY+cRY*0.55}
              rx={cRX*0.78} ry={cRY*0.38}
              fill={"url(#"+uid+"CS)"}/>

            {/* Dappled light dots */}
            {lv>=4 && [
              [-0.22,-0.28],[0.16,-0.32],[0.36,-0.10],
              [-0.12,-0.48],[0.06,-0.14],
              ...(lv>=6?[[-0.36,-0.06],[0.26,-0.38],[0.42,-0.22]]:[] ),
              ...(lv>=8?[[-0.04,-0.56],[0.38,-0.44],[-0.28,-0.50]]:[] ),
            ].map(([rx,ry],i)=>(
              <ellipse key={i}
                cx={CX+rx*cRX} cy={cCY+ry*cRY}
                rx={8+lv*0.4} ry={6+lv*0.3}
                fill={lHL} opacity="0.20"/>
            ))}

            {/* APPLES - drawn on top of leaves */}
            {appleLayer}

            {/* Decor */}
            {placedDecor.map(id => {
              const item = DECOR.find(d=>d.id===id);
              if (!item) return null;
              return (
                <text key={id} x={item.x} y={item.y} textAnchor="middle"
                  fontSize={id==="moon"||id==="rainbow"?"20":"15"}>
                  {item.e}
                </text>
              );
            })}
          </g>
        )}
      </svg>

      {readyCount > 0 && (
        <div onClick={() => { const idx = apples.findIndex(a=>a.harvestable); if (idx>=0) tap(idx); }} style={{
          position:"absolute", top:"10%", left:"50%",
          background:"linear-gradient(135deg,#D32F2F,#B71C1C)",
          color:"#FFFFFF", fontSize:12, fontWeight:900,
          padding:"6px 22px", borderRadius:99, whiteSpace:"nowrap",
          boxShadow:"0 5px 22px rgba(211,47,47,0.7)",
          animation:"readyPill 1.6s ease-in-out infinite",
          cursor:"pointer", zIndex:10, fontFamily:"Tajawal",
        }}>
          {readyCount > 1 ? `🍎 لديك ${readyCount} تفاحات جاهزة للقطف` : A.tapApple}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ APPLE FALL ANIMATOR ═══════════════════════════ */
function RewardRevealPopup({ reward, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);

  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"all"}}>
      <div style={{position:"absolute",inset:0,background:"rgba(5,12,8,0.84)",backdropFilter:"blur(6px)",
        animation:"overlayFadeIn 0.35s ease both"}}/>
      <div style={{position:"relative",zIndex:1002,maxWidth:320,width:"90%",
        background:P.cream,borderRadius:32,padding:"32px 26px 28px",
        textAlign:"center",direction:"rtl",
        boxShadow:"0 32px 80px rgba(0,0,0,0.7)",
        animation:"modalUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both"}}>
        <div style={{position:"absolute",inset:-2,borderRadius:34,
          border:`2px solid ${reward.c}66`,animation:"glowBox 2s ease-in-out infinite",
          pointerEvents:"none"}}/>
        <div style={{width:72,height:72,borderRadius:22,
          background:`${reward.c}18`,border:`2px solid ${reward.c}44`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:36,margin:"0 auto 12px",animation:"bounceIn 0.6s both"}}>
          {reward.e}
        </div>
        <div style={{display:"inline-block",background:`${reward.c}20`,
          border:`1.5px solid ${reward.c}66`,borderRadius:10,padding:"3px 14px",marginBottom:12}}>
          <span style={{fontSize:11,fontWeight:900,color:reward.c,fontFamily:"Tajawal"}}>
            {A.appleReward} - {reward.brand}
          </span>
        </div>
        <div style={{fontFamily:"Cairo",fontSize:19,fontWeight:900,color:P.near,
          marginBottom:10,lineHeight:1.4}}>{reward.name}</div>
        {/* Reward code */}
        <div style={{background:P.forest,borderRadius:14,padding:"14px 18px",
          marginBottom:20,position:"relative",overflow:"hidden"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"Tajawal",marginBottom:6}}>
            كود المكافأة - انسخه
          </div>
          <div style={{fontFamily:"Cairo",fontSize:22,fontWeight:900,color:P.gold,
            letterSpacing:"0.08em"}}>{reward.code}</div>
        </div>
        <button onClick={onClose} style={{width:"100%",padding:14,
          background:`linear-gradient(135deg,${P.forest},${P.forestM})`,
          color:P.white,border:"none",borderRadius:16,fontSize:15,
          fontWeight:800,cursor:"pointer",fontFamily:"Cairo"}}>
          رائع! تم 🎉
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ LEVEL UP OVERLAY ══════════════════════════════ */
function LevelUpOverlay({ level, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{position:"fixed",inset:0,zIndex:997,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      background:"rgba(0,0,0,0.8)",backdropFilter:"blur(8px)",direction:"rtl"}}>
      <div style={{textAlign:"center",animation:"modalUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both"}}>
        <div style={{fontSize:72,animation:"starBurst 0.7s ease-out both"}}>🎊</div>
        <div style={{fontFamily:"Cairo",fontSize:28,fontWeight:900,color:P.goldL,marginTop:12}}>
          {A.levelUp}
        </div>
        <div style={{fontFamily:"Cairo",fontSize:24,fontWeight:900,color:P.white,marginTop:8}}>
          {level.name}
        </div>
        <div style={{marginTop:18,display:"flex",gap:4,justifyContent:"center"}}>
          {Array.from({length:level.lv},(_,i)=>(
            <div key={i} style={{width:8,height:8,borderRadius:"50%",background:P.gold,
              animation:`pulse ${0.8+i*0.1}s ease-in-out infinite`,animationDelay:`${i*0.1}s`}}/>
          ))}
        </div>
        <button onClick={onClose} style={{marginTop:22,padding:"12px 34px",
          background:`linear-gradient(135deg,${P.gold},${P.goldD})`,
          color:P.near,border:"none",borderRadius:16,fontSize:15,
          fontWeight:900,cursor:"pointer",fontFamily:"Cairo"}}>
          رائع! 🌳
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ SHARED UI ═════════════════════════════════════ */
function Prog({v, max, color=P.forestL, h=8}) {
  const p = Math.min(100, Math.round((v/max)*100));
  return (
    <div style={{background:"#EDE8DC",borderRadius:99,height:h,overflow:"hidden"}}>
      <div style={{width:`${p}%`,height:"100%",
        background:`linear-gradient(90deg,${color},${P.goldL})`,
        borderRadius:99,transition:"width 1s cubic-bezier(0.4,0,0.2,1)",
        boxShadow:`0 0 10px ${color}44`}}/>
    </div>
  );
}
function Card({children, style={}, onClick}) {
  return (
    <div onClick={onClick} style={{background:P.white,borderRadius:22,padding:"18px 20px",
      boxShadow:"0 2px 18px rgba(0,0,0,0.07)",border:"1px solid #EDE8DC",
      cursor:onClick?"pointer":"default",transition:"transform 0.14s",...style}}
      onMouseDown={onClick?e=>{e.currentTarget.style.transform="scale(0.975)"}:undefined}
      onMouseUp={onClick?e=>{e.currentTarget.style.transform="scale(1)"}:undefined}>
      {children}
    </div>
  );
}
function StockLogo({stock, size=46, fontSize=22, radius=14, border=1.5}) {
  return (
    <div style={{width:size,height:size,borderRadius:radius,background:stock.logo?P.white:`${stock.c}1c`,
      border:`${border}px solid ${stock.c}44`,display:"flex",alignItems:"center",
      justifyContent:"center",fontSize,flexShrink:0,overflow:"hidden"}}>
      {stock.logo
        ? <img src={stock.logo} alt={stock.nameEn||stock.name}
            style={{width:"72%",height:"72%",objectFit:"contain"}}/>
        : stock.e}
    </div>
  );
}
function XPBadge({v}) {
  return (
    <span style={{background:`linear-gradient(135deg,${P.gold},${P.goldD})`,
      color:P.white,fontSize:11,fontWeight:800,padding:"3px 11px",
      borderRadius:99,whiteSpace:"nowrap"}}>
      +{v} XP
    </span>
  );
}
function BottomNav({screen, setScreen}) {
  const tabs=[
    {id:"home",   e:"🏠",l:A.home},
    {id:"tree",   e:"🌳",l:A.tree},
    {id:"missions",e:"⚡",l:A.missions},
    {id:"harvest",e:"🌾",l:A.harvest},
    {id:"chat",   e:"✨",l:A.ai},
  ];
  return (
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
      width:"100%",maxWidth:430,background:P.white,borderTop:"1px solid #EDE8DC",
      display:"flex",padding:"8px 0 14px",zIndex:100,
      boxShadow:"0 -4px 24px rgba(0,0,0,0.09)"}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setScreen(t.id)}
          style={{flex:1,background:"none",border:"none",cursor:"pointer",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 0"}}>
          <div style={{fontSize:screen===t.id?23:20,transition:"all 0.22s",
            filter:screen===t.id?"none":"grayscale(0.65) opacity(0.5)",
            transform:screen===t.id?"scale(1.18)":"scale(1)"}}>
            {t.e}
          </div>
          <span style={{fontSize:10,fontWeight:screen===t.id?800:500,
            color:screen===t.id?P.forestM:"#AAA",fontFamily:"Tajawal"}}>
            {t.l}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ═══════════════ SPLASH ═════════════════════════════════════════*/
function Splash({ onDone }) {
  const [ph, setPh] = useState(0);
  useEffect(() => {
    const t1=setTimeout(()=>setPh(1),400);
    const t2=setTimeout(()=>setPh(2),1300);
    const t3=setTimeout(onDone,3000);
    return ()=>[t1,t2,t3].forEach(clearTimeout);
  },[]);
  return (
    <div style={{height:"100%",background:`linear-gradient(165deg,${P.forest},${P.forestM} 55%,${P.forestL})`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      position:"relative",overflow:"hidden",direction:"rtl"}}>
      <div style={{position:"absolute",width:320,height:320,borderRadius:"50%",
        background:`${P.goldL}10`,top:-80,right:-80}}/>
      <div style={{position:"absolute",width:220,height:220,borderRadius:"50%",
        background:`${P.sage}15`,bottom:40,left:-60}}/>
      <div style={{opacity:ph>=1?1:0,transform:ph>=1?"translateY(0) scale(1)":"translateY(32px) scale(0.8)",
        transition:"all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
        display:"flex",flexDirection:"column",alignItems:"center",gap:22}}>
        <div style={{width:100,height:100,borderRadius:32,
          background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:52,boxShadow:`0 24px 56px ${P.goldD}55`}}>
          🌱
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontFamily:"Cairo",fontSize:58,fontWeight:900,color:P.white,
            letterSpacing:"-0.02em",lineHeight:1}}>ازدهار</div>
          <div style={{opacity:ph>=2?1:0,transform:ph>=2?"translateY(0)":"translateY(10px)",
            transition:"all 0.5s ease 0.2s",
            color:`rgba(212,242,219,0.85)`,fontSize:15,fontWeight:500,
            marginTop:10,fontFamily:"Tajawal",letterSpacing:"0.12em"}}>
            {A.tag}
          </div>
        </div>
        {ph>=2 && (
          <div style={{fontFamily:"Tajawal",fontSize:13,color:"rgba(255,255,255,0.6)",marginTop:-8}}>
            {A.tagSub}
          </div>
        )}
      </div>
      <div style={{position:"absolute",bottom:70,display:"flex",gap:8,
        opacity:ph>=2?1:0,transition:"opacity 0.5s 0.5s"}}>
        {[0,1,2].map(i=>(
          <div key={i} style={{width:i===0?22:8,height:8,borderRadius:99,
            background:i===0?P.gold:`${P.gold}40`,
            animation:"pulse 1.3s ease-in-out infinite",animationDelay:`${i*0.22}s`}}/>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ AUTH ═══════════════════════════════════════════*/
function Auth({ onAuth }) {
  const [mode, setMode] = useState("login");
  const inp = {width:"100%",padding:"14px 16px",border:"1.5px solid #EDE8DC",borderRadius:14,
    fontSize:15,background:P.cream,color:P.near,outline:"none",
    fontFamily:"Tajawal",boxSizing:"border-box",textAlign:"right",direction:"rtl"};
  return (
    <div style={{height:"100%",background:P.cream,display:"flex",flexDirection:"column",
      overflow:"auto",direction:"rtl"}}>
      <div style={{background:`linear-gradient(165deg,${P.forest},${P.forestM})`,
        padding:"62px 28px 46px",borderRadius:"0 0 40px 40px",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:160,height:160,borderRadius:"50%",
          background:`${P.gold}14`,top:-45,left:-45}}/>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{width:56,height:56,borderRadius:18,
            background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:28,marginBottom:14,boxShadow:`0 8px 24px ${P.goldD}44`}}>
            🌱
          </div>
          <div style={{fontFamily:"Cairo",fontSize:40,fontWeight:900,color:P.white}}>ازدهار</div>
          <div style={{color:`rgba(212,242,219,0.8)`,fontSize:14,marginTop:6,fontFamily:"Tajawal"}}>
            {A.tag} 🌿
          </div>
        </div>
      </div>
      <div style={{padding:"28px 24px 0"}}>
        <div style={{display:"flex",background:"#EDE8DC",borderRadius:14,padding:4,gap:4,marginBottom:22}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>setMode(m)}
              style={{flex:1,padding:11,border:"none",borderRadius:11,
                background:mode===m?P.white:"transparent",
                color:mode===m?P.near:"#AAA",fontWeight:700,fontSize:14,
                cursor:"pointer",fontFamily:"Tajawal",transition:"all 0.2s",
                boxShadow:mode===m?"0 2px 10px rgba(0,0,0,0.12)":"none"}}>
              {m==="login"?A.login:A.signup}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {mode==="signup" && <input style={inp} placeholder="الاسم"/>}
          <input style={inp} placeholder="البريد الإلكتروني"/>
          <input type="password" style={inp} placeholder="كلمة المرور"/>
        </div>
        <button onClick={onAuth} style={{width:"100%",padding:17,marginTop:20,
          background:`linear-gradient(135deg,${P.forest},${P.forestM})`,
          color:P.white,border:"none",borderRadius:18,fontSize:16,fontWeight:800,
          cursor:"pointer",fontFamily:"Cairo",boxShadow:`0 10px 30px ${P.forest}44`}}>
          {mode==="login" ? A.welcomeB : A.startG}
        </button>
        {mode==="login" && (
          <div style={{background:`linear-gradient(135deg,${P.goldL}22,${P.gold}11)`,
            border:`1px solid ${P.gold}44`,borderRadius:16,padding:"16px 18px",
            marginTop:16,display:"flex",gap:14,alignItems:"center",
            animation:"fadeUp 0.5s ease-out both"}}>
            <div style={{fontSize:30}}>🌳</div>
            <div>
              <div style={{fontWeight:800,fontSize:14,color:P.near,fontFamily:"Tajawal"}}>
                شجرتك اشتاقت إليك
              </div>
              <div style={{fontSize:12,color:"#888",marginTop:3,fontFamily:"Tajawal"}}>
                سجّل دخولك لإبقائها تنمو
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ HOME ═══════════════════════════════════════════*/
function Home({ state, setState, setScreen }) {
  const lv  = getLv(state.totalSaved);
  const nxt = getNext(state.totalSaved);
  const doneMissions = state.missions.filter(m=>m.done).length;

  useEffect(() => {
    setState(s => ({...s, missions:s.missions.map(m=>m.type==="open"&&!m.done?{...m,progress:1,done:true}:m)}));
  }, []);

  return (
    <div style={{paddingBottom:88,direction:"rtl"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(165deg,${P.forest},${P.forestM})`,
        padding:"52px 24px 30px",borderRadius:"0 0 34px 34px",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:200,height:200,borderRadius:"50%",
          background:`${P.gold}0D`,top:-55,left:-40}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{color:`rgba(180,230,195,0.8)`,fontSize:12,fontWeight:600,
              letterSpacing:"0.12em",fontFamily:"Tajawal"}}>{A.morning}</div>
            <div style={{fontFamily:"Cairo",fontSize:22,fontWeight:900,color:P.white,marginTop:4}}>
              مرحباً بك 🌱
            </div>
          </div>
          <div style={{display:"flex",gap:9,alignItems:"center"}}>
            <div style={{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,borderRadius:13,
              padding:"7px 13px",display:"flex",alignItems:"center",gap:6,animation:"glowBox 3s ease-in-out infinite"}}>
              <span>🔥</span>
              <span style={{color:P.goldL,fontWeight:800,fontSize:14,fontFamily:"Cairo"}}>
                {state.streak||0}
              </span>
            </div>
          </div>
        </div>
        <div style={{marginTop:24,textAlign:"center"}}>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:12,letterSpacing:"0.14em",
            fontWeight:600,fontFamily:"Tajawal"}}>{A.balance}</div>
          <div style={{fontFamily:"Cairo",fontSize:46,fontWeight:900,color:P.white,marginTop:4}}>
            {state.balance.toLocaleString("ar-SA",{minimumFractionDigits:2,maximumFractionDigits:2})} ر.س
          </div>
          <div style={{color:P.goldL,fontSize:13,marginTop:5,fontFamily:"Tajawal"}}>
            🌳 {lv.name} · المستوى {lv.lv}
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:22}}>
          {[{l:A.deposit,e:"💰",a:()=>setScreen("deposit")},
            {l:A.withdraw,e:"💸",a:()=>setScreen("withdraw")},
            {l:A.myTree,e:"🌳",a:()=>setScreen("tree")},
            {l:"الجوائز",e:"🎁",a:()=>setScreen("rewards"),
              badge:state.rewards.filter(r=>r.status==="available"&&(!r.expiresAt||r.expiresAt>Date.now())).length}].map(b=>(
            <button key={b.l} onClick={b.a}
              style={{flex:1,padding:"12px 4px",background:"rgba(255,255,255,0.14)",
                border:"1px solid rgba(255,255,255,0.2)",borderRadius:18,color:P.white,
                fontWeight:700,fontSize:12,cursor:"pointer",position:"relative",
                display:"flex",flexDirection:"column",alignItems:"center",gap:5,
                fontFamily:"Tajawal",backdropFilter:"blur(10px)"}}>
              {!!b.badge && (
                <span style={{position:"absolute",top:4,left:8,background:P.gold,color:P.white,
                  fontSize:9,fontWeight:800,borderRadius:99,minWidth:16,height:16,
                  display:"flex",alignItems:"center",justifyContent:"center",padding:"0 3px",
                  fontFamily:"Tajawal",border:`1.5px solid ${P.forest}`}}>
                  {b.badge}
                </span>
              )}
              <span style={{fontSize:21}}>{b.e}</span>{b.l}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"18px 18px 0",display:"flex",flexDirection:"column",gap:14}}>
        {/* New user seed welcome */}
        {state.totalSaved === 0 && (
          <Card style={{background:`linear-gradient(135deg,${P.mist},${P.cream})`,border:`1.5px solid ${P.forestL}44`}}>
            <div style={{textAlign:"center",padding:"8px 0"}}>
              <div style={{marginBottom:12,display:"flex",justifyContent:"center",overflow:"hidden",height:130}}>
                <CartoonAppleTree lv={1} appleCount={0} pendingApple={null} onTapApple={()=>{}}
                  size={140} leafTheme="spring" placedDecor={[]}/>
              </div>
              <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.forest,marginBottom:8}}>
                ابدأ رحلتك الآن!
              </div>
              <p style={{fontFamily:"Tajawal",fontSize:13,color:"#666",lineHeight:1.7,marginBottom:16}}>
                بذرتك بانتظارك. ادّخر أول ريال وشاهد الشجرة تنمو وتُثمر 🍎
              </p>
              <button onClick={()=>setScreen("deposit")}
                style={{padding:"12px 30px",background:`linear-gradient(135deg,${P.forest},${P.forestM})`,
                  color:P.white,border:"none",borderRadius:14,fontSize:15,
                  fontWeight:800,cursor:"pointer",fontFamily:"Cairo"}}>
                ادخر الآن 💰
              </button>
            </div>
          </Card>
        )}

        {/* Missions snapshot */}
        <Card style={{background:"linear-gradient(135deg,#4C1D9522,#7C3AED11)",border:"1.5px solid #7C3AED33"}}
          onClick={()=>setScreen("missions")}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontWeight:800,color:P.near,fontSize:15,fontFamily:"Cairo"}}>⚡ مهام اليوم</div>
            <div style={{background:"#7C3AED22",border:"1px solid #7C3AED44",borderRadius:99,padding:"3px 12px"}}>
              <span style={{fontWeight:800,color:"#7C3AED",fontSize:12,fontFamily:"Cairo"}}>
                {doneMissions}/{state.missions.length}
              </span>
            </div>
          </div>
          <Prog v={doneMissions} max={state.missions.length} color="#7C3AED" h={7}/>
          {doneMissions === state.missions.length && (
            <div style={{marginTop:10,textAlign:"center",fontFamily:"Cairo",fontSize:12,fontWeight:800,color:"#7C3AED"}}>
              🏆 {A.allDone}
            </div>
          )}
        </Card>

        {/* Tree progress */}
        {state.totalSaved > 0 && (
          <Card style={{background:`linear-gradient(135deg,${P.mist},${P.cream})`,border:`1.5px solid ${P.forestL}33`}}
            onClick={()=>setScreen("tree")}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{fontSize:42}}>🌳</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                  <span style={{fontWeight:800,color:P.forest,fontSize:15,fontFamily:"Cairo"}}>{lv.name}</span>
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    {state.treeApples.length > 0 && (
                      <span style={{background:`${P.apple}22`,border:`1px solid ${P.apple}66`,
                        borderRadius:99,padding:"2px 10px",fontSize:11,fontWeight:800,
                        color:P.apple,animation:"pulse 1.2s infinite",fontFamily:"Tajawal"}}>
                        🍎 {state.treeApples.length > 1 ? `${state.treeApples.length} جاهزة!` : "جاهزة!"}
                      </span>
                    )}
                    <span style={{background:`${P.gold}22`,border:`1px solid ${P.gold}44`,
                      borderRadius:99,padding:"2px 8px",fontSize:11,fontWeight:700,
                      color:P.goldD,fontFamily:"Cairo"}}>Lv.{lv.lv}</span>
                  </div>
                </div>
                {nxt ? (
                  <>
                    <Prog v={state.totalSaved-lv.min} max={nxt.min-lv.min} color={P.forestL} h={8}/>
                    <div style={{fontSize:11,color:"#888",marginTop:5,fontFamily:"Tajawal"}}>
                      {(nxt.min-state.totalSaved).toLocaleString()} ر.س للمستوى {nxt.name}
                    </div>
                  </>
                ) : (
                  <div style={{fontSize:12,color:P.goldL,fontWeight:700,fontFamily:"Tajawal"}}>👑 أعلى مرحلة!</div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Harvest shortcut */}
        <Card style={{background:`linear-gradient(135deg,${P.forest}18,${P.forestL}0A)`,border:`1.5px solid ${P.forest}33`}}
          onClick={()=>setScreen("harvest")}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:48,height:48,borderRadius:15,
              background:`linear-gradient(135deg,${P.forest}44,${P.forestM}33)`,
              border:`1.5px solid ${P.forest}66`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
              🌾
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:P.forest,fontSize:15,fontFamily:"Cairo"}}>{A.seasonH}</div>
              <div style={{fontSize:12,color:"#888",marginTop:2,fontFamily:"Tajawal"}}>{A.seasonSub}</div>
            </div>
            <span style={{color:"#CCC",fontSize:18}}>‹</span>
          </div>
        </Card>

        {/* AI Chat */}
        <Card onClick={()=>setScreen("chat")}
          style={{background:`linear-gradient(135deg,${P.forest},${P.forestM})`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:46,height:46,borderRadius:15,
              background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,
              animation:"glowBox 3s ease-in-out infinite"}}>✨</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,color:P.white,fontSize:15,fontFamily:"Cairo"}}>ازدهار AI</div>
              <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:2,fontFamily:"Tajawal"}}>
                اسألني عن الادخار والاستثمار وشجرتك 🌱
              </div>
            </div>
            <span style={{color:"rgba(255,255,255,0.4)",fontSize:20}}>‹</span>
          </div>
        </Card>

        {/* Activity */}
        {state.activity.length > 0 && (
          <div>
            <div style={{fontWeight:800,color:P.near,fontSize:16,marginBottom:11,fontFamily:"Cairo"}}>
              النشاط الأخير
            </div>
            <Card style={{padding:"6px 0"}}>
              {state.activity.slice(0,4).map((act,i,arr)=>(
                <div key={act.id} style={{display:"flex",alignItems:"center",gap:12,
                  padding:"12px 16px",borderBottom:i<arr.length-1?"1px solid #F8F2E8":"none"}}>
                  <div style={{width:40,height:40,borderRadius:13,
                    background:act.type==="deposit"?`${P.forestL}22`:act.type==="apple"?`${P.apple}18`:`${P.gold}20`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                    {act.type==="deposit"?"💰":act.type==="apple"?"🍎":act.type==="harvest"?"🌾":"🔥"}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,fontSize:13,color:P.near,fontFamily:"Tajawal"}}>{act.desc}</div>
                    <div style={{fontSize:11,color:"#AAA",fontFamily:"Tajawal"}}>{act.time}</div>
                  </div>
                  {act.amount>0 && (
                    <div style={{fontWeight:800,fontSize:13,color:P.forestL,fontFamily:"Cairo"}}>
                      +{act.amount.toFixed(0)} ر.س
                    </div>
                  )}
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ TREE VIEW ══════════════════════════════════════*/
function TreeView({ state, setState }) {
  const [animApple, setAnimApple] = useState(null);
  const [lvUp, setLvUp] = useState(null);
  const [tab, setTab] = useState("tree");
  const lv  = getLv(state.totalSaved);
  const nxt = getNext(state.totalSaved);

  const tapApple = (appleId) => {
    if (!appleId) return;
    const r = REWARDS[Math.floor(Math.random() * REWARDS.length)];
    const now = Date.now();
    const rewardEntry = {
      id:`${now}-${r.id}`, rewardId:r.id, source:"tree", partner:null,
      brand:r.brand, title:r.name, desc:r.desc||"", icon:r.e, color:r.c, code:r.code,
      dateEarned:now, expiresAt:r.validDays ? now+r.validDays*86400000 : null, status:"available",
    };
    // Harvest happens right away: this specific apple is removed and the
    // reward is granted immediately - every other apple on the tree is
    // untouched. The popup below is just showing what was already earned.
    setState(s => ({...s,
      treeApples:s.treeApples.filter(a=>a.id!==appleId),
      harvestedApples:[...s.harvestedApples, r.id],
      rewards:[rewardEntry, ...s.rewards], xp:s.xp+200,
      badges:s.badges.map(b=>b.id===2?{...b,unlocked:true}:b),
      missions:s.missions.map(m=>m.type==="apple"&&!m.done?{...m,progress:1,done:true}:m),
      activity:[{id:Date.now(),type:"apple",amount:0,desc:`قطفت "${r.name}" 🍎`,time:"الآن"},...s.activity],
    }));
    setAnimApple(r);
  };
  const closeRewardPopup = () => setAnimApple(null);

  const setLeafTheme = (id) => {
    setState(s => ({...s, leafTheme:id,
      badges:s.badges.map(b=>b.id===4?{...b,unlocked:true}:b),
      missions:s.missions.map(m=>m.type==="customize"&&!m.done?{...m,progress:1,done:true}:m),
    }));
  };

  const toggleDecor = (id) => {
    setState(s => ({...s,
      placedDecor:s.placedDecor.includes(id)
        ? s.placedDecor.filter(d=>d!==id)
        : [...s.placedDecor, id],
    }));
  };

  return (
    <div style={{background:P.cream,minHeight:"100%",paddingBottom:100,direction:"rtl"}}>
      {animApple && <RewardRevealPopup reward={animApple} onClose={closeRewardPopup}/>}
      {lvUp && <LevelUpOverlay level={lvUp} onClose={()=>setLvUp(null)}/>}

      {/* Sky gradient header */}
      <div style={{background:`linear-gradient(180deg,${lv.sky} 0%,${lv.sky}AA 55%,#EDE8DC44 100%)`,
        padding:"52px 24px 18px",borderRadius:"0 0 32px 32px"}}>
        <div style={{fontFamily:"Cairo",fontSize:22,fontWeight:900,
          color:lv.lv>=7?P.white:P.forest}}>
          شجرتي 🌳
        </div>
        <div style={{fontSize:13,marginTop:3,fontFamily:"Tajawal",
          color:lv.lv>=7?`rgba(255,255,255,0.8)`:P.forestM}}>
          {lv.name} · المستوى {lv.lv} · {lv.apples} تفاحة
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{display:"flex",margin:"14px 18px 0",background:"#EDE8DC",borderRadius:14,padding:4,gap:4}}>
        {[{id:"tree",l:"🌳 الشجرة"},{id:"customize",l:"🎨 تخصيص"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:10,border:"none",borderRadius:11,
              background:tab===t.id?P.white:"transparent",
              color:tab===t.id?P.forest:"#AAA",fontWeight:700,fontSize:13,
              cursor:"pointer",fontFamily:"Tajawal",transition:"all 0.2s",
              boxShadow:tab===t.id?"0 2px 10px rgba(0,0,0,0.1)":"none"}}>
            {t.l}
          </button>
        ))}
      </div>

      {tab === "tree" && (
        <>
          {/* TREE CANVAS - fixed height, full tree always visible */}
          <div style={{
            background:`linear-gradient(180deg,${lv.sky}66 0%,${lv.sky}22 60%,rgba(237,232,220,0.4) 100%)`,
            padding:"10px 0 6px",
            display:"flex", flexDirection:"column", alignItems:"center",
            position:"relative", height:320, overflow:"hidden"}}>
            <CartoonAppleTree
              lv={lv.lv}
              appleSlots={state.treeApples}
              onTapApple={tapApple}
              size={280}
              leafTheme={state.leafTheme}
              placedDecor={state.placedDecor}/>
            <div style={{textAlign:"center",marginTop:2,zIndex:3,position:"relative"}}>
              <div style={{fontFamily:"Cairo",fontSize:16,fontWeight:900,color:lv.lv>=7?P.forest:P.forest}}>
                {lv.name}
              </div>
            </div>
          </div>

          <div style={{padding:"14px 18px 0",display:"flex",flexDirection:"column",gap:14}}>
            {nxt && (
              <Card>
                <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:10,fontFamily:"Tajawal"}}>
                  تقدم الشجرة
                </div>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                  <span style={{fontWeight:700,color:P.near,fontSize:14,fontFamily:"Cairo"}}>
                    Lv.{lv.lv} {lv.name}
                  </span>
                  <span style={{fontWeight:700,color:P.forestL,fontSize:14,fontFamily:"Cairo"}}>
                    Lv.{nxt.lv} {nxt.name} ←
                  </span>
                </div>
                <Prog v={state.totalSaved-lv.min} max={nxt.min-lv.min} color={P.forestL} h={12}/>
                <div style={{display:"flex",justifyContent:"space-between",marginTop:7}}>
                  <span style={{fontSize:12,color:"#AAA",fontFamily:"Tajawal"}}>
                    {state.totalSaved.toLocaleString()} ر.س
                  </span>
                  <span style={{fontSize:12,color:P.gold,fontWeight:700,fontFamily:"Tajawal"}}>
                    تبقى {(nxt.min-state.totalSaved).toLocaleString()} ر.س
                  </span>
                </div>
              </Card>
            )}
            {/* Level roadmap */}
            <Card>
              <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:14,fontFamily:"Tajawal"}}>
                خريطة نمو الشجرة 🗺️
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:7}}>
                {LEVELS.map(l=>{
                  const reached = state.totalSaved >= l.min;
                  const current = l.lv === lv.lv;
                  return (
                    <div key={l.lv} style={{display:"flex",alignItems:"center",gap:12,
                      padding:"10px 13px",borderRadius:13,
                      background:current?`linear-gradient(135deg,${P.goldL}22,${P.gold}12)`:reached?"#F0FDF4":"#F8F2E8",
                      border:current?`2px solid ${P.gold}`:"1px solid #EDE8DC",
                      opacity:!reached&&l.min>state.totalSaved*3?0.4:1}}>
                      <div style={{width:32,height:32,borderRadius:10,
                        background:reached?`linear-gradient(135deg,${P.forestL},${P.forest})`:"#EDE8DC",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:13,fontWeight:900,color:reached?P.white:"#AAA",
                        fontFamily:"Cairo",flexShrink:0}}>
                        {reached?(current?"🌳":"✓"):l.lv}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:P.near,fontSize:13,fontFamily:"Cairo"}}>
                          Lv.{l.lv} {l.name}
                        </div>
                        <div style={{fontSize:10,color:"#AAA",fontFamily:"Tajawal"}}>
                          {l.min.toLocaleString()} ر.س · {l.apples} تفاحة
                        </div>
                      </div>
                      {current && <span style={{fontSize:13}}>👈</span>}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}

      {tab === "customize" && (
        <div style={{padding:"14px 18px 0",display:"flex",flexDirection:"column",gap:14}}>
          {/* Live preview */}
          <Card style={{background:`linear-gradient(135deg,${P.mist},${P.cream})`,border:`1.5px solid ${P.forestL}33`,textAlign:"center",padding:16}}>
            <div style={{fontFamily:"Cairo",fontSize:13,fontWeight:700,color:P.forest,marginBottom:12}}>
              معاينة مباشرة
            </div>
            <div style={{display:"flex",justifyContent:"center",overflow:"hidden",height:180}}>
              <CartoonAppleTree
                lv={Math.max(lv.lv, 6)}
                appleCount={5}
                pendingApple={null}
                onTapApple={()=>{}}
                size={190}
                leafTheme={state.leafTheme}
                placedDecor={state.placedDecor}/>
            </div>
          </Card>

          {/* Leaf themes */}
          <Card>
            <div style={{fontFamily:"Cairo",fontSize:15,fontWeight:800,color:P.near,marginBottom:14}}>
              🍃 نمط الأوراق
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {THEMES.map(th=>{
                const unlocked = state.totalSaved >= th.minS || th.id==="spring";
                const active   = state.leafTheme === th.id;
                return (
                  <button key={th.id} onClick={unlocked?()=>setLeafTheme(th.id):undefined}
                    style={{padding:"12px 6px",borderRadius:14,
                      border:`2px solid ${active?P.forest:unlocked?"#EDE8DC":"#E0E0E0"}`,
                      background:active?`${P.forest}14`:unlocked?P.cream:"#F8F2E8",
                      cursor:unlocked?"pointer":"default",fontFamily:"Tajawal",
                      textAlign:"center",opacity:unlocked?1:0.55,transition:"all 0.2s",
                      position:"relative"}}>
                    <div style={{display:"flex",justifyContent:"center",gap:3,marginBottom:6}}>
                      {th.c.slice(0,4).map((c,i)=>(
                        <div key={i} style={{width:12,height:12,borderRadius:"50%",background:c}}/>
                      ))}
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:active?P.forest:P.near}}>{th.name}</div>
                    {!unlocked && <div style={{fontSize:10,color:"#AAA",marginTop:3}}>🔒 {th.minS.toLocaleString()} ر.س</div>}
                    {active && (
                      <div style={{position:"absolute",top:6,left:8,width:16,height:16,borderRadius:"50%",
                        background:P.forest,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        <span style={{color:P.white,fontSize:10}}>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Decor */}
          <Card>
            <div style={{fontFamily:"Cairo",fontSize:15,fontWeight:800,color:P.near,marginBottom:14}}>
              🏡 ديكور البيئة
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
              {DECOR.map(item=>{
                const unlocked = state.totalSaved >= item.min;
                const placed   = state.placedDecor.includes(item.id);
                return (
                  <button key={item.id} onClick={unlocked?()=>toggleDecor(item.id):undefined}
                    style={{padding:"12px 6px",borderRadius:14,
                      border:`2px solid ${placed?P.forest:unlocked?"#EDE8DC":"#E0E0E0"}`,
                      background:placed?`${P.forest}14`:unlocked?P.cream:"#F8F2E8",
                      cursor:unlocked?"pointer":"default",fontFamily:"Tajawal",
                      textAlign:"center",opacity:unlocked?1:0.5,transition:"all 0.2s"}}>
                    <div style={{fontSize:24,marginBottom:4}}>{item.e}</div>
                    <div style={{fontSize:10,fontWeight:700,color:P.near,lineHeight:1.2}}>{item.name}</div>
                    {!unlocked && <div style={{fontSize:9,color:"#AAA",marginTop:3}}>🔒{item.min.toLocaleString()}</div>}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ═══════════════ MISSIONS VIEW ══════════════════════════════════*/
function MissionsView({ state, setState }) {
  const [rewardPop, setRewardPop] = useState(null);
  const [claimed,   setClaimed]   = useState([]);

  useEffect(() => {
    if (state.missionsDate !== TODAY) {
      setState(s=>({...s, missions:getDailyMissions(), missionsDate:TODAY}));
    }
  }, []);

  const completeMission = (m) => {
    if (m.done) return;
    setState(s=>({...s, missions:s.missions.map(x=>x.id===m.id?{...x,progress:x.total||1,done:true}:x)}));
    setTimeout(()=>claimReward({...m,done:true}), 400);
  };
  const claimReward = (m) => {
    if (claimed.includes(m.id)) return;
    setClaimed(c=>[...c,m.id]);
    setRewardPop(m);
    setState(s=>({...s, xp:s.xp+(m.rType==="xp"?m.xp:0),
      treeApples: m.rType==="apple"
        ? [...s.treeApples, ...addTreeApples(s.treeApples, 1)]
        : s.treeApples,
    }));
  };

  const done = state.missions.filter(m=>m.done).length;
  const mColor = {deposit:P.forestL,open:"#7C3AED",tree:P.forest,chat:P.gold,
    harvest:P.forestM,dep100:P.forestL,apple:P.apple,customize:"#E91E8C"};

  return (
    <div style={{background:P.cream,minHeight:"100%",paddingBottom:100,direction:"rtl"}}>
      {rewardPop && (
        <div style={{position:"fixed",inset:0,zIndex:996,display:"flex",alignItems:"center",
          justifyContent:"center",direction:"rtl"}} onClick={()=>setRewardPop(null)}>
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)"}}/>
          <div style={{position:"relative",zIndex:997,background:P.cream,borderRadius:28,
            padding:"30px 24px",maxWidth:280,width:"90%",textAlign:"center",
            animation:"modalUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow:"0 24px 60px rgba(0,0,0,0.5)"}}>
            <div style={{fontSize:52,marginBottom:8,animation:"rewardPop 0.5s ease-out both"}}>
              {rewardPop.rType==="apple"?"🍎":"⭐"}
            </div>
            <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.near,marginBottom:6}}>
              مكافأة المهمة!
            </div>
            <div style={{fontFamily:"Tajawal",fontSize:13,color:"#666",lineHeight:1.65,marginBottom:16}}>
              {rewardPop.title}
            </div>
            <div style={{background:`${P.gold}18`,border:`1px solid ${P.gold}44`,borderRadius:12,
              padding:"10px 16px",display:"flex",justifyContent:"center",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{rewardPop.rType==="apple"?"🍎":"⭐"}</span>
              <span style={{fontWeight:800,color:P.goldD,fontSize:15,fontFamily:"Cairo"}}>
                +{rewardPop.xp} {rewardPop.rType==="apple"?"تفاحة":"نقطة"}
              </span>
            </div>
          </div>
        </div>
      )}

      <div style={{background:`linear-gradient(165deg,#4C1D95,#6D28D9)`,
        padding:"52px 24px 28px",borderRadius:"0 0 32px 32px",
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",
          background:"rgba(255,255,255,0.08)",top:-45,left:-40}}/>
        <div style={{fontFamily:"Cairo",fontSize:28,fontWeight:900,color:P.white}}>{A.missionsT}</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:14,marginTop:4,fontFamily:"Tajawal"}}>
          أكمل مهامك واحصد المكافآت
        </div>
        <div style={{marginTop:16,background:"rgba(255,255,255,0.12)",borderRadius:16,padding:"14px 16px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{color:P.white,fontWeight:700,fontSize:14,fontFamily:"Cairo"}}>مكتملة</span>
            <span style={{color:P.goldL,fontWeight:900,fontSize:18,fontFamily:"Cairo"}}>
              {done}/{state.missions.length}
            </span>
          </div>
          <Prog v={done} max={state.missions.length} color={P.goldL} h={9}/>
        </div>
      </div>

      <div style={{padding:"18px 18px",display:"flex",flexDirection:"column",gap:11}}>
        {state.missions.map((m,i)=>{
          const color   = mColor[m.type] || "#7C3AED";
          const isClaim = claimed.includes(m.id);
          return (
            <div key={m.id} style={{animation:`fadeUp 0.35s ease-out ${i*0.06}s both`}}>
              <Card style={{border:`1.5px solid ${m.done?color+"44":"#EDE8DC"}`,background:m.done?`${color}07`:P.white}}>
                <div style={{display:"flex",alignItems:"center",gap:13}}>
                  <div style={{width:52,height:52,borderRadius:16,
                    background:m.done?`${color}22`:`${color}12`,
                    border:`2px solid ${m.done?color:color+"44"}`,
                    display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
                    {m.done?"✅":m.e}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{fontWeight:800,color:P.near,fontSize:14,fontFamily:"Cairo",
                        textDecoration:m.done?"line-through":"none",opacity:m.done?0.65:1}}>
                        {m.title}
                      </div>
                      {m.rType==="apple" ? <span style={{fontSize:15}}>🍎</span> : <XPBadge v={m.xp}/>}
                    </div>
                    <div style={{fontSize:11,color:"#999",fontFamily:"Tajawal"}}>{m.desc}</div>
                  </div>
                </div>
                {!m.done && (
                  <button onClick={()=>completeMission(m)} style={{width:"100%",marginTop:10,padding:10,
                    background:`linear-gradient(135deg,${color}22,${color}12)`,
                    border:`1.5px solid ${color}55`,borderRadius:12,color,
                    fontWeight:800,fontSize:13,cursor:"pointer",fontFamily:"Cairo"}}>
                    أكمل المهمة ✓
                  </button>
                )}
                {m.done && !isClaim && (
                  <button onClick={()=>claimReward(m)} style={{width:"100%",marginTop:8,padding:10,
                    background:`linear-gradient(135deg,${P.gold},${P.goldD})`,border:"none",
                    borderRadius:12,color:P.white,fontWeight:800,fontSize:13,
                    cursor:"pointer",fontFamily:"Cairo",animation:"glowBox 2s ease-in-out infinite"}}>
                    {A.claimR} {m.rType==="apple"?"🍎":"⭐"}
                  </button>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════ MARKET HELPERS (live prices, charts, AI score) ═*/
function hashStr(str){
  let h=0; for(let i=0;i<str.length;i++){h=(h*31+str.charCodeAt(i))|0;} return h>>>0;
}
function mulberry32(seed){
  return function(){
    seed |= 0; seed = seed+0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed>>>15, 1 | seed);
    t = t + Math.imul(t ^ t>>>7, 61 | t) ^ t;
    return ((t ^ t>>>14)>>>0)/4294967296;
  };
}
function genSeries(stock, tf){
  const pctMap = {w:stock.historicalReturns.w, m:stock.historicalReturns.m,
    m3:stock.historicalReturns.m3, y:stock.historicalReturns.y};
  const totalPct = pctMap[tf] ?? stock.historicalReturns.m;
  const n = 22;
  const rnd = mulberry32(hashStr(stock.id+"-"+tf));
  const start = 100;
  const end = start*(1+totalPct/100);
  const pts = [start];
  for(let i=1;i<n-1;i++){
    const base = start + (end-start)*(i/(n-1));
    const noise = (rnd()-0.5)*(Math.abs(end-start)||6)*0.4;
    pts.push(base+noise);
  }
  pts.push(end);
  return pts;
}
function useLivePrices(){
  const [prices, setPrices] = useState(()=>{
    const init = {};
    STOCKS.forEach(s=>{ init[s.id] = {price:s.price, change:s.change}; });
    return init;
  });
  useEffect(()=>{
    const iv = setInterval(()=>{
      setPrices(prev=>{
        const next = {...prev};
        STOCKS.forEach(s=>{
          const cur = prev[s.id] ? prev[s.id].price : s.price;
          const drift = (Math.random()-0.47)*cur*0.0035;
          let np = cur+drift;
          np = Math.max(s.price*0.85, Math.min(s.price*1.25, np));
          const chg = ((np-s.price)/s.price)*100;
          next[s.id] = {price:np, change:chg};
        });
        return next;
      });
    }, 3200);
    return ()=>clearInterval(iv);
  },[]);
  return prices;
}
function getConfidence(stock){
  let base = stock.risk==="low" ? 76 : stock.risk==="med" ? 64 : 50;
  base += stock.historicalReturns.y>0 ? 8 : -10;
  base += stock.historicalReturns.m>0 ? 4 : -4;
  return Math.max(32, Math.min(93, Math.round(base)));
}
function getAiText(stock, conf){
  const trendWord = stock.historicalReturns.y>=0 ? "مستقراً وإيجابياً" : "متذبذباً بشكل ملحوظ";
  const riskWord  = stock.risk==="low" ? "منخفض" : stock.risk==="med" ? "متوسط" : "مرتفع";
  const yr = stock.historicalReturns.y;
  return `أظهر السهم أداءً ${trendWord} خلال العام الماضي (${yr>=0?"+":""}${yr}٪). بناءً على مستوى المخاطرة ${riskWord} وظروف السوق الحالية، تُقدّر ازدهار AI مستوى الثقة في هذا الاستثمار بنحو ${conf}٪. هذا تحليل تعليمي وليس نصيحة مالية.`;
}
function MiniSpark({ points, w=56, h=26, color }){
  if(!points || points.length<2) return null;
  const vMin=Math.min(...points), vMax=Math.max(...points);
  const vR=(vMax-vMin)||1;
  const toX=i=>(i/(points.length-1))*w;
  const toY=v=>h-((v-vMin)/vR)*h;
  const d=points.map((v,i)=>`${i===0?"M":"L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block",flexShrink:0}}>
      <path d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function BigSpark({ points, w=350, h=90, color }){
  if(!points || points.length<2) return null;
  const vMin=Math.min(...points)*0.99, vMax=Math.max(...points)*1.01;
  const vR=(vMax-vMin)||1;
  const toX=i=>(i/(points.length-1))*w;
  const toY=v=>h-((v-vMin)/vR)*h;
  const d=points.map((v,i)=>`${i===0?"M":"L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const area = d + ` L${toX(points.length-1).toFixed(1)},${h} L0,${h} Z`;
  const gid = "bg"+hashStr(points.join(","));
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{display:"block"}}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {[0.25,0.5,0.75].map(y=>(
        <line key={y} x1="0" y1={h*y} x2={w} y2={h*y} stroke="#E0DCD0" strokeWidth="1" strokeDasharray="3,4"/>
      ))}
      <path d={area} fill={`url(#${gid})`}/>
      <path d={d} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="700" style={{animation:"lineIn 1s ease-out both"}}/>
      <circle cx={toX(points.length-1)} cy={toY(points[points.length-1])} r="4.5" fill={color} stroke={P.white} strokeWidth="2"/>
    </svg>
  );
}
function CircleProgress({ pct, size=64, stroke=7, color=P.gold, track="#EDE8DC" }){
  const r = (size-stroke)/2;
  const c = 2*Math.PI*r;
  const offset = c*(1-pct/100);
  return (
    <svg width={size} height={size} style={{transform:"rotate(-90deg)",display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
        style={{transition:"stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)"}}/>
    </svg>
  );
}
function StatBox({ label, value, color=P.near }){
  return (
    <div style={{background:P.white,border:"1px solid #EDE8DC",borderRadius:14,padding:"10px 12px"}}>
      <div style={{fontSize:10.5,color:"#999",fontFamily:"Tajawal",marginBottom:4}}>{label}</div>
      <div style={{fontFamily:"Cairo",fontWeight:800,fontSize:14,color}}>{value}</div>
    </div>
  );
}
function ConfirmRow({ label, value, bold }){
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12.5,color:"#888",fontFamily:"Tajawal"}}>{label}</span>
      <span style={{fontFamily:"Cairo",fontWeight:bold?900:700,fontSize:bold?16:13.5,color:bold?P.forest:P.near}} dir="ltr">
        {value}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   🌾 LIVING CROP — premium visual health indicator for a holding
   Every stock a user owns is rendered as a growing/drying crop
   instead of a plain row of numbers. Stage, colour, blade count,
   wheat-ear detail and bend all map directly to the position's
   live profit/loss percentage — modelled on realistic wheat
   illustrations (layered kernels, awns, gradient shading, glossy
   blade highlights) rather than a flat cartoon.
═══════════════════════════════════════════════════════════════ */
// Small deterministic hash + PRNG so each holding gets a stable, unique
// "personality" (blade angles, kernel jitter) that doesn't reshuffle on
// every re-render, without needing to store extra random state anywhere.
const cropHash = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};
const cropRand = (seed) => {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// 6 stages: 4 growth tiers on the way up, 2 decline tiers on the way down.
const getCropStage = (pct) => {
  if (pct <= -15) return "damaged";
  if (pct <= -3)  return "wilting";
  if (pct <= 1)   return "sprout";
  if (pct <= 5)   return "young";
  if (pct <= 15)  return "mature";
  return "flourishing";
};
const CROP_STAGE_LABEL = {
  flourishing: { e:"🌟", t:"مزدهرة" },
  mature:      { e:"🌾", t:"ناضجة" },
  young:       { e:"🌿", t:"تنمو" },
  sprout:      { e:"🌱", t:"مستقرة" },
  wilting:     { e:"🍂", t:"تذبل" },
  damaged:     { e:"🔥", t:"متضررة" },
};

// One reusable wheat-ear "spike": alternating rows of layered, gradient-shaded
// kernels narrowing toward the tip, with fine awns (whisker lines) flaring
// outward — modelled on the reference illustrations rather than a flat blob.
function wheatEar({ cx, baseY, tipY, uid, fill, fillLight, awnColor, rows, awns, keyPrefix }) {
  const els = [];
  const h = baseY - tipY;
  for (let r = 0; r < rows; r++) {
    const t = r / Math.max(1, rows - 1); // 0 base .. 1 tip
    const y = baseY - t * h;
    const spread = (1 - t * 0.6) * 5.4;
    const kw = 5.6 - t * 2.4;
    const kh = 8.2 - t * 3.4;
    const rot = 16 + t * 14;
    els.push(
      <g key={`${keyPrefix}k${r}`}>
        <ellipse cx={cx - spread} cy={y} rx={kh} ry={kw} fill={fill}
          transform={`rotate(${-rot} ${cx - spread} ${y})`}/>
        <ellipse cx={cx + spread} cy={y} rx={kh} ry={kw} fill={fill}
          transform={`rotate(${rot} ${cx + spread} ${y})`}/>
        <ellipse cx={cx - spread * 0.72} cy={y - 1.1} rx={kh * 0.48} ry={kw * 0.4} fill={fillLight} opacity={0.65}
          transform={`rotate(${-rot} ${cx - spread * 0.72} ${y - 1.1})`}/>
        <ellipse cx={cx + spread * 0.72} cy={y - 1.1} rx={kh * 0.48} ry={kw * 0.4} fill={fillLight} opacity={0.65}
          transform={`rotate(${rot} ${cx + spread * 0.72} ${y - 1.1})`}/>
      </g>
    );
    if (awns) {
      const awnLen = 9 + t * 7;
      els.push(
        <g key={`${keyPrefix}a${r}`} opacity={0.5}>
          <path d={`M ${cx - spread},${y - kw * 0.4} L ${cx - spread - 3 - t * 4},${y - kw * 0.4 - awnLen}`}
            stroke={awnColor} strokeWidth={0.7} strokeLinecap="round" fill="none"/>
          <path d={`M ${cx + spread},${y - kw * 0.4} L ${cx + spread + 3 + t * 4},${y - kw * 0.4 - awnLen}`}
            stroke={awnColor} strokeWidth={0.7} strokeLinecap="round" fill="none"/>
        </g>
      );
    }
  }
  els.push(<path key={`${keyPrefix}tip`} d={`M ${cx - 1.6},${tipY + 9} L ${cx},${tipY - 7} L ${cx + 1.6},${tipY + 9} Z`} fill={fill}/>);
  return els;
}

function CropPlant({ plPct = 0, seedKey = "0", width = 132, height = 150 }) {
  const stage = getCropStage(plPct);
  const uid = `cp${cropHash(String(seedKey)).toString(36)}`;
  const seed = cropHash(String(seedKey));
  const rand = (i) => cropRand(seed + i * 97);

  const clamped = Math.max(-30, Math.min(30, plPct));
  const stalkH = 48 + ((clamped + 30) / 60) * 66; // 48 .. 114
  const GY = height - 20; // ground line
  const CX = width / 2;

  const bend = stage === "damaged" ? 13 + rand(1) * 7
             : stage === "wilting" ? 5 + rand(2) * 4
             : 0;
  const bendDir = rand(3) > 0.5 ? 1 : -1;

  const bladeCount = stage === "flourishing" ? 8
                    : stage === "mature"     ? 7
                    : stage === "young"      ? 5
                    : stage === "sprout"     ? 3
                    : stage === "wilting"    ? 4
                    : 3;

  // Deep→light gradient stops per stage, tuned toward richer, more natural
  // colour than flat cartoon fills — dusk-shaded greens, sun-warmed golds.
  const THEME = {
    flourishing: { l0:"#1B5E20", l1:"#3E9142", l2:"#7BC77E", l3:"#D9F2CE",
                   grain:"#D98A1F", grainL:"#FCE39A", awn:"#C98A2E", soil0:"#4A3320", soil1:"#2E2013", glow:true },
    mature:      { l0:"#1E6B2C", l1:"#3D8B3F", l2:"#74B96E", l3:"#CDE9C0",
                   grain:"#D9A63F", grainL:"#F6DFA0", awn:"#B98A3E", soil0:"#4A3320", soil1:"#2E2013", glow:false },
    young:       { l0:"#1F6B33", l1:"#3D8F45", l2:"#7FC17E", l3:"#DDF3D2",
                   grain:"#8FBF5C", grainL:"#DCEFB8", awn:"#8FAE55", soil0:"#4A3320", soil1:"#2E2013", glow:false },
    sprout:      { l0:"#237A3B", l1:"#3F9C4C", l2:"#8ED089", l3:"#E7F8DC",
                   grain:null, grainL:null, awn:null, soil0:"#4A3320", soil1:"#2E2013", glow:false },
    wilting:     { l0:"#7A6224", l1:"#A9863A", l2:"#CBAD5E", l3:"#E9DBA8",
                   grain:null, grainL:null, awn:null, soil0:"#5A4830", soil1:"#3C2E1C", glow:false },
    damaged:     { l0:"#3A2A18", l1:"#5B4225", l2:"#7A5C36", l3:"#93744A",
                   grain:null, grainL:null, awn:null, soil0:"#6B5A44", soil1:"#463A29", glow:false },
  }[stage];

  const swayAnim = stage === "flourishing" ? `cropSwayStrong 3.2s ease-in-out infinite`
                  : stage === "mature"     ? `cropSway 3.6s ease-in-out infinite`
                  : stage === "young"      ? `cropSway 4s ease-in-out infinite`
                  : stage === "sprout"     ? `cropSwaySlow 4.4s ease-in-out infinite`
                  : stage === "wilting"    ? `cropSwaySlow 5.2s ease-in-out infinite`
                  : "none"; // growth stopped — a damaged crop no longer moves with the wind

  // Smooth cubic-bezier blade with a subtle glossy highlight stripe down its
  // spine, instead of a flat quad-triangle — this is what sells "premium".
  const bladeGroup = (baseX, baseY, len, curve, w, keyId) => {
    const tipX = baseX + curve, tipY = baseY - len;
    const c1x = baseX - w * 0.5, c1y = baseY - len * 0.38;
    const c2x = tipX - curve * 0.28, c2y = tipY + len * 0.22;
    const c3x = tipX + curve * 0.06, c3y = tipY + len * 0.14;
    const c4x = baseX + w * 0.85, c4y = baseY - len * 0.32;
    const d = `M ${baseX - w},${baseY} C ${c1x},${c1y} ${c2x},${c2y} ${tipX},${tipY} `
            + `C ${c3x},${c3y} ${c4x},${c4y} ${baseX + w},${baseY} Z`;
    const hiD = `M ${baseX - w * 0.15},${baseY - 3} C ${baseX},${baseY - len * 0.4} ${tipX - curve * 0.15},${tipY + len * 0.3} ${tipX},${tipY + 4}`;
    return (
      <g key={keyId}>
        <path d={d} fill={`url(#leafGrad-${uid})`} opacity={stage === "damaged" ? 0.88 : 1}/>
        <path d={hiD} stroke={THEME.l3} strokeWidth={0.9} fill="none" opacity={0.35} strokeLinecap="round"/>
      </g>
    );
  };

  const blades = [];
  for (let i = 0; i < bladeCount; i++) {
    const spread = (i - (bladeCount - 1) / 2) / Math.max(1, bladeCount - 1); // -0.5..0.5
    const curve = spread * stalkH * 0.9 + (rand(i) - 0.5) * 8;
    const len = stalkH * (0.7 + Math.abs(spread) * -0.2 + rand(i + 10) * 0.14);
    const w = 4.4 + rand(i + 20) * 2;
    blades.push(bladeGroup(CX, GY, len, curve, w, `bl${i}`));
  }

  const headTipY = GY - stalkH;
  // Growth-side flourishes: a small green bud on a young plant, a full golden
  // ear bundle (main + two flanking spikes, echoing the reference bouquet)
  // once the position is genuinely thriving.
  let earLayer = null;
  if (stage === "young") {
    earLayer = (
      <g>
        <ellipse cx={CX} cy={headTipY + 6} rx={4.2} ry={7} fill={`url(#grainGradYoung-${uid})`}/>
        <ellipse cx={CX} cy={headTipY + 6} rx={1.6} ry={3.4} fill={THEME.l3} opacity={0.5}/>
      </g>
    );
  } else if (stage === "mature" || stage === "flourishing") {
    const sideOffset = stalkH * 0.22;
    earLayer = (
      <g>
        {wheatEar({ cx:CX - sideOffset, baseY:GY - stalkH * 0.62, tipY:headTipY - stalkH * 0.14,
          uid, fill:`url(#grainGrad-${uid})`, fillLight:THEME.grainL, awnColor:THEME.awn,
          rows: stage === "flourishing" ? 6 : 5, awns:true, keyPrefix:"eL" })}
        {wheatEar({ cx:CX + sideOffset, baseY:GY - stalkH * 0.58, tipY:headTipY - stalkH * 0.10,
          uid, fill:`url(#grainGrad-${uid})`, fillLight:THEME.grainL, awnColor:THEME.awn,
          rows: stage === "flourishing" ? 6 : 5, awns:true, keyPrefix:"eR" })}
        {wheatEar({ cx:CX, baseY:GY - stalkH * 0.7, tipY:headTipY,
          uid, fill:`url(#grainGrad-${uid})`, fillLight:THEME.grainL, awnColor:THEME.awn,
          rows: stage === "flourishing" ? 7 : 6, awns:true, keyPrefix:"eC" })}
      </g>
    );
  }

  // Sparkle flecks — an extra premium flourish reserved for real outperformance.
  const sparkles = stage === "flourishing" ? [0, 1, 2].map(i => {
    const sx = CX + (rand(i + 60) - 0.5) * stalkH * 0.9;
    const sy = GY - stalkH * (0.5 + rand(i + 70) * 0.5);
    return (
      <path key={`sp${i}`} d={`M ${sx},${sy - 4} L ${sx + 1.1},${sy - 1.1} L ${sx + 4},${sy} L ${sx + 1.1},${sy + 1.1} L ${sx},${sy + 4} L ${sx - 1.1},${sy + 1.1} L ${sx - 4},${sy} L ${sx - 1.1},${sy - 1.1} Z`}
        fill={THEME.grainL}
        style={{transformOrigin:`${sx}px ${sy}px`, animation:`cropFlowerPulse ${2 + i * 0.5}s ease-in-out infinite`}}/>
    );
  }) : null;

  // Falling / fallen leaves for a heavily damaged crop, plus a visible break
  // in the main stalk rather than just a droop.
  const fallingLeaves = stage === "damaged" ? [0, 1, 2].map(i => (
    <ellipse key={`fl${i}`} cx={CX + (i - 1) * 17} cy={headTipY + 8}
      rx={5.2} ry={2.8} fill={`url(#leafGrad-${uid})`}
      style={{transformOrigin:`${CX + (i - 1) * 17}px ${headTipY + 8}px`,
        animation:`cropLeafFall ${2.6 + i * 0.5}s ease-in ${i * 0.6}s infinite`}}/>
  )) : null;
  const burnMarks = stage === "damaged" ? [0, 1].map(i => (
    <ellipse key={`bm${i}`} cx={CX + (i === 0 ? -6 : 7)} cy={GY - stalkH * (0.32 + i * 0.24)}
      rx={5.4} ry={3.2} fill="#1E140C" opacity={0.5}/>
  )) : null;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{display:"block",
      filter: THEME.glow ? "drop-shadow(0 0 7px rgba(232,164,74,0.4))" : "none"}}>
      <defs>
        <linearGradient id={`leafGrad-${uid}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%"  stopColor={THEME.l0}/>
          <stop offset="45%" stopColor={THEME.l1}/>
          <stop offset="85%" stopColor={THEME.l2}/>
          <stop offset="100%" stopColor={THEME.l3}/>
        </linearGradient>
        {THEME.grain && (
          <linearGradient id={`grainGrad-${uid}`} x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%"  stopColor={THEME.grain}/>
            <stop offset="100%" stopColor={THEME.grainL}/>
          </linearGradient>
        )}
        {stage === "young" && (
          <linearGradient id={`grainGradYoung-${uid}`} x1="0" y1="1" x2="0.3" y2="0">
            <stop offset="0%"  stopColor={THEME.l1}/>
            <stop offset="100%" stopColor={THEME.l3}/>
          </linearGradient>
        )}
        <radialGradient id={`soilGrad-${uid}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%"  stopColor={THEME.soil0}/>
          <stop offset="100%" stopColor={THEME.soil1}/>
        </radialGradient>
      </defs>

      {/* soil */}
      <ellipse cx={CX} cy={GY + 6} rx={width * 0.42} ry={9} fill={`url(#soilGrad-${uid})`}/>
      <ellipse cx={CX} cy={GY + 2.5} rx={width * 0.26} ry={4.6} fill={THEME.soil1} opacity={0.5}/>
      {(stage === "wilting" || stage === "damaged") && (
        <>
          <path d={`M ${CX-14},${GY+2} q4,4 0,8`} stroke="#241A10" strokeWidth={1} fill="none" opacity={0.55}/>
          <path d={`M ${CX+10},${GY+1} q-3,5 2,8`} stroke="#241A10" strokeWidth={1} fill="none" opacity={0.55}/>
        </>
      )}

      <g style={{transform:`rotate(${bend * bendDir}deg)`, transformOrigin:`${CX}px ${GY}px`, animation:swayAnim}}>
        {blades}
        {earLayer}
        {sparkles}
        {burnMarks}
      </g>
      {fallingLeaves}
    </svg>
  );
}

/* ═══════════════ STOCK MARKET (browse, analyze, buy) ════════════*/
function HarvestView({ state, setState }) {
  const [tab, setTab]           = useState("stocks");
  const [isDemo, setIsDemo]     = useState(false);
  const [drawerStock, setDrawerStock] = useState(null);
  const [drawerClosing, setDrawerClosing] = useState(false);
  const [tf, setTf]             = useState("m");
  const [shares, setShares]     = useState("");
  const [confirm, setConfirm]   = useState(null);
  const [toast, setToast]       = useState(null);
  const liveMap = useLivePrices();

  const liveOf = (stockId) => liveMap[stockId] || {price:0, change:0};

  const openDrawer = (s) => { setShares(""); setTf("m"); setDrawerStock(s); setDrawerClosing(false); };
  const closeDrawer = () => {
    setDrawerClosing(true);
    setTimeout(()=>{ setDrawerStock(null); setDrawerClosing(false); }, 240);
  };

  const holdings   = state.harvests.filter(h=>!!h.isDemo===isDemo);
  const holdingFor = (stockId) => holdings.find(h=>h.stockId===stockId);

  const totalInvested = holdings.reduce((a,h)=>a+h.shares*h.avgPrice,0);
  const totalValue    = holdings.reduce((a,h)=>a+h.shares*liveOf(h.stockId).price,0);
  const totalPL        = totalValue - totalInvested;
  const totalPLPct      = totalInvested>0 ? (totalPL/totalInvested)*100 : 0;

  const doBuy = () => {
    const c = confirm;
    if (!c) return;
    const maxBal = c.isDemo ? state.demoBalance : state.balance;
    if (c.total > maxBal) return;
    setState(s=>{
      const idx = s.harvests.findIndex(h=>h.stockId===c.stock.id && !!h.isDemo===c.isDemo);
      let harvests;
      if (idx>=0) {
        const h = s.harvests[idx];
        const newShares = h.shares + c.shares;
        const newAvg = (h.avgPrice*h.shares + c.price*c.shares)/newShares;
        harvests = s.harvests.map((x,i)=>i===idx ? {...x, shares:newShares, avgPrice:newAvg} : x);
      } else {
        harvests = [...s.harvests, {
          id:Date.now(), stockId:c.stock.id, name:c.stock.name, e:c.stock.e, logo:c.stock.logo, color:c.stock.c,
          ticker:c.stock.ticker, risk:c.stock.risk, shares:c.shares, avgPrice:c.price, isDemo:c.isDemo,
        }];
      }
      return {...s,
        balance:     c.isDemo ? s.balance     : s.balance - c.total,
        demoBalance: c.isDemo ? s.demoBalance - c.total : s.demoBalance,
        harvests,
        badges:  s.badges.map(b=>b.id===3 ? {...b,unlocked:true} : b),
        missions:s.missions.map(m=>m.type==="harvest" && !m.done ? {...m,progress:1,done:true} : m),
        activity:[{id:Date.now(), type:"harvest", amount:0,
          desc:`اشتريت ${c.shares} سهم من "${c.stock.name}" ${c.isDemo?"[تدريب]":""} 📈`, time:"الآن"}, ...s.activity],
      };
    });
    setToast({type:"buy", name:c.stock.name, e:c.stock.e, shares:c.shares, total:c.total});
    setConfirm(null);
    closeDrawer();
    setTimeout(()=>setToast(null), 2600);
  };

  const doSell = () => {
    const c = confirm;
    if (!c) return;
    const value = c.holding.shares * c.price;
    setState(s=>({...s,
      balance:     c.isDemo ? s.balance     : s.balance + value,
      demoBalance: c.isDemo ? s.demoBalance + value : s.demoBalance,
      harvests: s.harvests.filter(h=>h.id!==c.holding.id),
      activity:[{id:Date.now(), type:"harvest", amount:c.isDemo?0:value,
        desc:`بعت ${c.holding.shares} سهم من "${c.holding.name}" ${c.isDemo?"[تدريب]":""}`, time:"الآن"}, ...s.activity],
    }));
    setToast({type:"sell", name:c.holding.name, e:c.holding.e, shares:c.holding.shares, total:value});
    setConfirm(null);
    setTimeout(()=>setToast(null), 2600);
  };

  const sharesNum = parseInt(shares) || 0;
  const drawerLive = drawerStock ? liveOf(drawerStock.id) : null;
  const drawerSeries = drawerStock ? genSeries(drawerStock, tf) : null;
  const drawerConf = drawerStock ? getConfidence(drawerStock) : 0;
  const drawerExisting = drawerStock ? holdingFor(drawerStock.id) : null;
  const buyTotal = drawerLive ? sharesNum*drawerLive.price : 0;

  return (
    <div style={{background:P.cream,minHeight:"100%",paddingBottom:100,direction:"rtl"}}>

      {toast && (
        <div style={{position:"fixed",top:"10%",left:"50%",transform:"translateX(-50%)",zIndex:800,
          background:P.white,borderRadius:99,padding:"11px 22px",boxShadow:"0 8px 28px rgba(0,0,0,0.22)",
          display:"flex",alignItems:"center",gap:9,animation:"fadeUp 0.32s ease both",maxWidth:"88%"}}>
          <span style={{fontSize:20}}>{toast.type==="buy" ? "✅" : "💰"}</span>
          <span style={{fontFamily:"Cairo",fontWeight:800,fontSize:12.5,color:P.near}}>
            {toast.type==="buy"
              ? `تم شراء ${toast.shares} سهم من ${toast.name} ${toast.e}`
              : `تم بيع ${toast.shares} سهم بـ ${toast.total.toFixed(2)} ر.س`}
          </span>
        </div>
      )}

      <div style={{background:`linear-gradient(165deg,${P.forestM},${P.forest})`,
        padding:"52px 24px 22px",borderRadius:"0 0 32px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:180,height:180,borderRadius:"50%",
          background:`${P.goldL}12`,top:-45,left:-40}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"Cairo",fontSize:26,fontWeight:900,color:P.white}}>سوق الأسهم 📈</div>
            <div style={{color:"rgba(180,230,195,0.8)",fontSize:13,marginTop:4,fontFamily:"Tajawal"}}>
              استثمر بذكاء، كالمحترفين
            </div>
          </div>
          <button onClick={()=>setIsDemo(d=>!d)}
            style={{padding:"8px 16px",background:isDemo?P.sky:"rgba(255,255,255,0.16)",border:"none",
              borderRadius:12,color:P.white,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Tajawal",
              whiteSpace:"nowrap"}}>
            {isDemo ? "وضع التدريب" : "حساب حقيقي"}
          </button>
        </div>

        <div style={{marginTop:16,background:"rgba(255,255,255,0.12)",borderRadius:18,padding:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"Tajawal",marginBottom:4}}>
                {isDemo ? "رصيد التدريب" : "رصيدي المتاح"}
              </div>
              <div style={{fontFamily:"Cairo",fontSize:22,fontWeight:900,color:P.white}}>
                {(isDemo?state.demoBalance:state.balance).toFixed(2)} ر.س
              </div>
            </div>
            {holdings.length>0 && (
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"Tajawal",marginBottom:4}}>
                  الربح/الخسارة
                </div>
                <div style={{fontFamily:"Cairo",fontSize:16,fontWeight:900,
                  color:totalPL>=0?"#86EFAC":"#FCA5A5"}} dir="ltr">
                  {totalPL>=0?"+":""}{totalPL.toFixed(2)} ({totalPLPct>=0?"+":""}{totalPLPct.toFixed(1)}٪)
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{display:"flex",gap:8,marginTop:16}}>
          {[["stocks","الأسهم"],["portfolio","محفظتي"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)}
              style={{flex:1,padding:"10px 0",borderRadius:12,border:"none",cursor:"pointer",
                fontFamily:"Cairo",fontWeight:800,fontSize:13,
                background:tab===k?P.white:"rgba(255,255,255,0.14)",
                color:tab===k?P.forest:"rgba(255,255,255,0.8)"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {tab==="stocks" && (
        <div style={{padding:"18px 18px",display:"flex",flexDirection:"column",gap:11}}>
          {STOCKS.map(s=>{
            const live = liveOf(s.id);
            const spark = genSeries(s,"m");
            const col = live.change>=0 ? P.forestL : P.rose;
            return (
              <Card key={s.id} onClick={()=>openDrawer(s)} style={{border:"1px solid #EDE8DC"}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <StockLogo stock={s} size={46} fontSize={22} radius={14} border={1.5}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:800,color:P.near,fontSize:14,fontFamily:"Cairo",
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                      {s.name}
                    </div>
                    <div style={{fontSize:11,color:"#999",fontFamily:"Tajawal",marginTop:2}}>
                      {s.ticker} · {s.exchange}
                    </div>
                  </div>
                  <MiniSpark points={spark} w={52} h={24} color={col}/>
                  <div style={{textAlign:"left",minWidth:72}}>
                    <div style={{fontWeight:800,fontFamily:"Cairo",fontSize:14,color:P.near}} dir="ltr">
                      {live.price.toFixed(2)}
                    </div>
                    <div style={{fontSize:11,fontWeight:700,fontFamily:"Tajawal",color:col}} dir="ltr">
                      {live.change>=0?"▲":"▼"} {Math.abs(live.change).toFixed(2)}٪
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {tab==="portfolio" && (
        <div style={{padding:"18px 18px",display:"flex",flexDirection:"column",gap:12}}>
          {holdings.length===0 ? (
            <Card style={{textAlign:"center",padding:"30px 20px"}}>
              <div style={{fontSize:48,marginBottom:10}}>📊</div>
              <div style={{fontFamily:"Cairo",fontSize:16,fontWeight:900,color:P.forest,marginBottom:6}}>
                لا توجد أسهم في محفظتك بعد
              </div>
              <p style={{fontFamily:"Tajawal",fontSize:13,color:"#777",lineHeight:1.7}}>
                تصفّح الأسهم وابدأ أول استثمار حقيقي لك، أو جرّب وضع التدريب أولاً!
              </p>
            </Card>
          ) : holdings.map(h=>{
            const live = liveOf(h.stockId);
            const invested = h.shares*h.avgPrice;
            const curVal = h.shares*live.price;
            const pl = curVal-invested;
            const plPct = invested>0 ? (pl/invested)*100 : 0;
            const isUp = pl>=0;
            const stage = getCropStage(plPct);
            const stageInfo = CROP_STAGE_LABEL[stage];
            const fieldBg = stage==="flourishing" ? `linear-gradient(180deg,${P.mist}CC,${P.sand}55)`
                          : stage==="mature"       ? `linear-gradient(180deg,${P.mist}AA,${P.sand}55)`
                          : stage==="young"        ? `linear-gradient(180deg,${P.mist}77,${P.sand}55)`
                          : stage==="sprout"       ? `linear-gradient(180deg,${P.ivory},${P.sand}55)`
                          : stage==="wilting"      ? `linear-gradient(180deg,#F3ECDD,${P.sand}77)`
                          : `linear-gradient(180deg,#EDE3D3,#DED0B8)`;
            return (
              <Card key={h.id} style={{border:`1.5px solid ${h.color}33`, padding:0, overflow:"hidden"}}>
                {/* ── The crop: the main visual, tells the whole story at a glance ── */}
                <div style={{position:"relative", background:fieldBg, padding:"14px 14px 0"}}>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <StockLogo stock={{...h, c:h.color}} size={38} fontSize={18} radius={12} border={1.5}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:800,color:P.near,fontSize:14,fontFamily:"Cairo",
                        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{h.name}</div>
                      <div style={{fontSize:10.5,color:"#888",marginTop:1,fontFamily:"Tajawal"}}>
                        {h.ticker} · {h.shares} سهم {h.isDemo?"· تدريب":""}
                      </div>
                    </div>
                    <div style={{background:isUp?`${P.forestL}1c`:`${P.rose}1c`,
                      border:`1px solid ${isUp?P.forestL:P.rose}44`,
                      borderRadius:99,padding:"4px 10px",display:"flex",alignItems:"center",gap:5,
                      flexShrink:0}}>
                      <span style={{fontSize:12}}>{stageInfo.e}</span>
                      <span style={{fontSize:11,fontWeight:800,fontFamily:"Tajawal",
                        color:isUp?P.forestL:P.rose}} dir="ltr">
                        {isUp?"+":""}{plPct.toFixed(1)}٪
                      </span>
                    </div>
                  </div>
                  <div style={{display:"flex",justifyContent:"center",marginTop:-4}}>
                    <CropPlant plPct={plPct} seedKey={String(h.id)} width={132} height={140}/>
                  </div>
                  <div style={{textAlign:"center",fontSize:11,fontWeight:700,color:isUp?P.forestM:"#8A6A3E",
                    fontFamily:"Tajawal",marginTop:-10,paddingBottom:8}}>
                    {stage==="flourishing" && "🌟 محصولك يزدهر بامتياز!"}
                    {stage==="mature"      && "🌾 محصولك ناضج وقوي"}
                    {stage==="young"       && "🌿 محصولك ينمو بشكل جيد"}
                    {stage==="sprout"      && "🌱 محصولك مستقر وثابت"}
                    {stage==="wilting"     && "🍂 محصولك بدأ يذبل — راقبه"}
                    {stage==="damaged"     && "🔥 محصولك متضرر — يحتاج انتباهك"}
                  </div>
                </div>

                {/* ── Numbers: still here, just secondary to the crop above ── */}
                <div style={{padding:"12px 16px 16px"}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                    <StatBox label="متوسط الشراء" value={`${h.avgPrice.toFixed(2)}`} />
                    <StatBox label="القيمة الآن" value={`${curVal.toFixed(2)}`} color={isUp?P.forestL:P.rose}/>
                    <StatBox label="عدد الأسهم" value={h.shares} />
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <span style={{fontSize:11.5,color:"#999",fontFamily:"Tajawal"}}>الربح/الخسارة</span>
                    <span style={{fontFamily:"Cairo",fontWeight:900,fontSize:14,
                      color:isUp?P.forestL:P.rose}} dir="ltr">
                      {isUp?"+":""}{pl.toFixed(2)} ر.س
                    </span>
                  </div>
                  <button onClick={()=>setConfirm({mode:"sell", holding:h, price:live.price, isDemo:h.isDemo})}
                    style={{width:"100%",padding:11,borderRadius:12,border:`1.5px solid ${P.rose}44`,
                      background:`${P.rose}12`,color:P.rose,fontWeight:800,fontSize:12.5,
                      cursor:"pointer",fontFamily:"Cairo"}}>
                    بيع المركز بالكامل
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Sliding stock analysis + buy drawer ── */}
      {drawerStock && (
        <div style={{position:"fixed",inset:0,zIndex:600,display:"flex",
          alignItems:"flex-end",justifyContent:"center"}}>
          <div onClick={closeDrawer} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",
            opacity:drawerClosing?0:1,transition:"opacity 0.24s ease",
            animation:drawerClosing?"none":"backdropIn 0.24s ease both"}}/>
          <div style={{position:"relative",width:"100%",maxWidth:430,maxHeight:"88%",overflowY:"auto",
            background:P.cream,borderRadius:"26px 26px 0 0",padding:"14px 20px 30px",
            boxShadow:"0 -10px 40px rgba(0,0,0,0.25)",
            transform:drawerClosing?"translateY(100%)":"translateY(0)",
            transition:"transform 0.26s cubic-bezier(0.32,0.72,0,1)",
            animation:drawerClosing?"none":"sheetIn 0.3s cubic-bezier(0.32,0.72,0,1) both"}}>
            <div style={{width:42,height:5,background:"#DDD",borderRadius:99,margin:"0 auto 16px"}}/>

            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <StockLogo stock={drawerStock} size={52} fontSize={26} radius={16} border={2}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:"Cairo",fontWeight:900,fontSize:17,color:P.near}}>{drawerStock.name}</div>
                <div style={{fontSize:12,color:"#999",fontFamily:"Tajawal"}}>
                  {drawerStock.ticker} · {drawerStock.exchange}
                </div>
              </div>
              <button onClick={closeDrawer}
                style={{background:"#EDE8DC",border:"none",width:32,height:32,borderRadius:99,
                  fontSize:16,cursor:"pointer",color:"#777",flexShrink:0}}>×</button>
            </div>

            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <div style={{fontFamily:"Cairo",fontWeight:900,fontSize:30,color:P.near}} dir="ltr">
                {drawerLive.price.toFixed(2)} <span style={{fontSize:14,color:"#999",fontWeight:600}}>ر.س</span>
              </div>
              <div style={{padding:"4px 10px",borderRadius:99,fontSize:13,fontWeight:800,fontFamily:"Tajawal",
                background:drawerLive.change>=0?`${P.forestL}18`:`${P.rose}18`,
                color:drawerLive.change>=0?P.forestL:P.rose}} dir="ltr">
                {drawerLive.change>=0?"▲":"▼"} {Math.abs(drawerLive.change).toFixed(2)}٪ اليوم
              </div>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:10}}>
              {[["w","أسبوع"],["m","شهر"],["m3","٣ أشهر"],["y","سنة"]].map(([k,l])=>(
                <button key={k} onClick={()=>setTf(k)}
                  style={{flex:1,padding:"7px 0",borderRadius:10,border:"none",cursor:"pointer",
                    fontFamily:"Tajawal",fontWeight:700,fontSize:12,
                    background:tf===k?P.forest:"#EDE8DC",color:tf===k?P.white:"#888"}}>
                  {l}
                </button>
              ))}
            </div>

            <div style={{background:P.white,borderRadius:16,padding:"14px 14px 8px",marginBottom:14,
              border:"1px solid #EDE8DC"}}>
              <BigSpark points={drawerSeries}
                color={drawerSeries[drawerSeries.length-1]>=drawerSeries[0]?P.forestL:P.rose}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                <span style={{fontSize:10,color:"#BBB",fontFamily:"Tajawal"}}>البداية</span>
                <span style={{fontSize:10,color:"#BBB",fontFamily:"Tajawal"}}>اليوم</span>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <StatBox label="مستوى المخاطرة"
                value={drawerStock.risk==="low"?"منخفضة":drawerStock.risk==="med"?"متوسطة":"عالية"}
                color={drawerStock.risk==="low"?P.forestL:drawerStock.risk==="med"?P.gold:P.rose}/>
              <StatBox label="العائد المتوقع سنوياً" value={`${drawerStock.ret}٪`} color={P.forestL}/>
              <StatBox label="أعلى ٥٢ أسبوع" value={drawerStock.high52}/>
              <StatBox label="أدنى ٥٢ أسبوع" value={drawerStock.low52}/>
            </div>

            <div style={{background:`linear-gradient(135deg,${P.forest}10,${P.gold}10)`,
              border:`1.5px solid ${P.forest}33`,borderRadius:16,padding:16,marginBottom:16,
              display:"flex",gap:14,alignItems:"center"}}>
              <div style={{position:"relative",width:62,height:62,flexShrink:0}}>
                <CircleProgress pct={drawerConf} size={62} stroke={7} color={P.gold}/>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
                  justifyContent:"center",fontFamily:"Cairo",fontWeight:900,fontSize:14,color:P.forest}}>
                  {drawerConf}٪
                </div>
              </div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Cairo",fontWeight:800,fontSize:13,color:P.forest,marginBottom:4}}>
                  ✨ توصية ازدهار AI
                </div>
                <div style={{fontSize:11.5,color:"#666",fontFamily:"Tajawal",lineHeight:1.6}}>
                  {getAiText(drawerStock, drawerConf)}
                </div>
              </div>
            </div>

            {drawerExisting && (
              <div style={{background:P.white,border:"1px solid #EDE8DC",borderRadius:14,
                padding:"12px 14px",marginBottom:14,display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:12,color:"#888",fontFamily:"Tajawal"}}>تملك حالياً</span>
                <span style={{fontFamily:"Cairo",fontWeight:800,fontSize:13,color:P.near}}>
                  {drawerExisting.shares} سهم بمتوسط {drawerExisting.avgPrice.toFixed(2)} ر.س
                </span>
              </div>
            )}

            <div style={{background:P.white,border:`1.5px solid ${P.forest}33`,borderRadius:18,padding:16}}>
              <div style={{fontFamily:"Cairo",fontWeight:800,fontSize:13,color:P.near,marginBottom:10}}>
                شراء الأسهم
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
                <input type="number" min="1" value={shares} onChange={e=>setShares(e.target.value)}
                  placeholder="عدد الأسهم"
                  style={{flex:1,padding:"12px 14px",border:"1.5px solid #EDE8DC",borderRadius:12,
                    fontSize:16,fontWeight:700,fontFamily:"Cairo",color:P.near,outline:"none",
                    background:P.cream,boxSizing:"border-box"}}/>
                <div style={{fontSize:12,color:"#999",fontFamily:"Tajawal",flexShrink:0}}>سهم</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 2px",
                borderTop:"1px dashed #EDE8DC",marginBottom:12}}>
                <span style={{fontSize:12,color:"#888",fontFamily:"Tajawal"}}>السعر × الكمية</span>
                <span style={{fontFamily:"Cairo",fontWeight:800,fontSize:15,color:P.forest}} dir="ltr">
                  {buyTotal.toFixed(2)} ر.س
                </span>
              </div>
              <button disabled={!sharesNum}
                onClick={()=>setConfirm({mode:"buy", stock:drawerStock, shares:sharesNum,
                  price:drawerLive.price, total:buyTotal, isDemo})}
                style={{width:"100%",padding:14,borderRadius:14,border:"none",
                  cursor:sharesNum?"pointer":"not-allowed",
                  background:sharesNum?`linear-gradient(135deg,${P.forestL},${P.forest})`:"#EDE8DC",
                  color:sharesNum?P.white:"#AAA",fontFamily:"Cairo",fontWeight:800,fontSize:15}}>
                {sharesNum ? `شراء بـ ${buyTotal.toFixed(2)} ر.س` : "أدخل عدد الأسهم"}
              </button>
              <div style={{marginTop:10,fontSize:11,color:"#999",fontFamily:"Tajawal",textAlign:"center"}}>
                {isDemo ? `رصيد التدريب: ${state.demoBalance.toFixed(2)} ر.س` : `رصيدك: ${state.balance.toFixed(2)} ر.س`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Investment confirmation ── */}
      {confirm && (
        <div style={{position:"fixed",inset:0,zIndex:700,display:"flex",alignItems:"center",
          justifyContent:"center",background:"rgba(0,0,0,0.55)",padding:22}}>
          <div style={{background:P.white,borderRadius:22,padding:24,width:"100%",maxWidth:360,
            direction:"rtl",animation:"modalUp 0.3s cubic-bezier(0.34,1.4,0.64,1) both"}}>
            <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <StockLogo stock={confirm.mode==="buy" ? confirm.stock : {...confirm.holding, c:confirm.holding.color}}
                size={64} fontSize={38} radius={18} border={0}/>
            </div>
            <div style={{textAlign:"center",fontFamily:"Cairo",fontWeight:900,fontSize:17,
              color:P.near,marginBottom:16}}>
              {confirm.mode==="buy" ? "تأكيد الشراء" : "تأكيد البيع"}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:16}}>
              <ConfirmRow label="السهم" value={confirm.mode==="buy" ? confirm.stock.name : confirm.holding.name}/>
              <ConfirmRow label="السعر للسهم" value={`${confirm.price.toFixed(2)} ر.س`}/>
              <ConfirmRow label="عدد الأسهم" value={confirm.mode==="buy" ? confirm.shares : confirm.holding.shares}/>
              <ConfirmRow label="الإجمالي"
                value={`${(confirm.mode==="buy" ? confirm.total : confirm.holding.shares*confirm.price).toFixed(2)} ر.س`}
                bold/>
              <ConfirmRow label="الرصيد المتاح"
                value={`${(confirm.isDemo?state.demoBalance:state.balance).toFixed(2)} ر.س`}/>
            </div>
            {confirm.mode==="buy" && confirm.total > (confirm.isDemo?state.demoBalance:state.balance) && (
              <div style={{background:`${P.rose}15`,border:`1.5px solid ${P.rose}44`,borderRadius:12,
                padding:"10px 14px",color:P.rose,fontFamily:"Cairo",fontWeight:800,fontSize:13,
                textAlign:"center",marginBottom:14}}>
                رصيد غير كافٍ ⚠️
              </div>
            )}
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setConfirm(null)}
                style={{flex:1,padding:13,borderRadius:14,border:"1.5px solid #EDE8DC",background:"none",
                  color:"#888",fontFamily:"Tajawal",fontWeight:700,cursor:"pointer"}}>
                إلغاء
              </button>
              <button
                disabled={confirm.mode==="buy" && confirm.total > (confirm.isDemo?state.demoBalance:state.balance)}
                onClick={confirm.mode==="buy" ? doBuy : doSell}
                style={{flex:1.4,padding:13,borderRadius:14,border:"none",fontFamily:"Cairo",fontWeight:800,
                  cursor:(confirm.mode==="buy" && confirm.total > (confirm.isDemo?state.demoBalance:state.balance))
                    ? "not-allowed" : "pointer",
                  background:(confirm.mode==="buy" && confirm.total > (confirm.isDemo?state.demoBalance:state.balance))
                    ? "#EDE8DC"
                    : confirm.mode==="buy"
                      ? `linear-gradient(135deg,${P.forestL},${P.forest})`
                      : `linear-gradient(135deg,${P.rose},${P.roseL})`,
                  color:(confirm.mode==="buy" && confirm.total > (confirm.isDemo?state.demoBalance:state.balance))
                    ? "#AAA" : P.white}}>
                {confirm.mode==="buy" ? "تأكيد الشراء" : "تأكيد البيع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════ AI CHAT ════════════════════════════════════════*/
function ChatView({ state, setState, setScreen }) {
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const lv  = getLv(state.totalSaved);
  const nxt = getNext(state.totalSaved);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior:"smooth"});
  }, [state.chatHistory, loading]);

  const markChatMission = useCallback(() => {
    setState(s=>({...s,
      missions:s.missions.map(m=>m.type==="chat"&&!m.done?{...m,progress:1,done:true}:m),
    }));
  }, []);

  const send = useCallback(async (msg) => {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setInput("");
    markChatMission();

    const hist = [...state.chatHistory, {role:"user", text:userMsg, ts:Date.now()}];
    setState(s=>({...s, chatHistory:hist}));
    setLoading(true);

    try {
      const activeH = state.harvests.filter(h=>h.status!=="harvested"&&!h.isDemo);
      const totalPnl = activeH.reduce((a,h)=>a+(h.currentValue-h.invested),0);
      const sys = `أنت "ازدهار"، مساعدة مالية ذكية وعاطفية للغاية في تطبيق ادخار عربي اسمه "ازدهار". أنت مثل صديقة حكيمة ومحبة تريد للمستخدم أفضل حياة مالية.

━━ بيانات المستخدم الكاملة ━━
الرصيد: ${state.balance.toFixed(2)} ر.س | الشجرة: Lv.${lv.lv} "${lv.name}"
${nxt ? `للمستوى التالي "${nxt.name}": يحتاج ${(nxt.min-state.totalSaved).toFixed(0)} ر.س` : "وصل للمستوى العاشر الأسطوري!"}
السلسلة: ${state.streak||0} يوم | إجمالي المدخرات: ${state.totalSaved.toFixed(2)} ر.س
نقاط: ${state.xp} XP | التفاح: ${state.harvestedApples.length}
استثمارات: ${activeH.length > 0 ? activeH.map(h=>`${h.name}(${h.currentValue.toFixed(0)}ر.س)`).join(', ') : "لا يوجد"}
${activeH.length > 0 ? `إجمالي ربح/خسارة: ${totalPnl>=0?"ربح":"خسارة"} ${Math.abs(totalPnl).toFixed(2)} ر.س` : ""}
مهام اليوم: ${state.missions.filter(m=>m.done).length}/${state.missions.length} مكتملة

━━ إجابات دقيقة لأسئلة مهمة ━━
"كيف أرفع مستوى شجرتي؟" → اذكر الرقم الدقيق: ${nxt?(nxt.min-state.totalSaved).toFixed(0)+" ر.س مطلوبة":""} واقترح خطة "ادخر ${nxt?Math.ceil((nxt.min-state.totalSaved)/30):""} ر.س يومياً".
"نصائح الادخار" → ٣ نصائح عملية مناسبة لرصيده ${state.balance.toFixed(0)} ر.س.
"الحصاد الموسمي" → اشرح: ازرع ثم انتظر ثم احصد. ذكر الأسهم: أرامكو، STC، الإنماء، سابك، أمريكانا، لوسيد. وضع التدريب للمبتدئين.
"أريد السحب" → اسأل عن السبب، ذكّر بشجرته Lv.${lv.lv}، اقترح بدائل.
"كيف أزيد الثمار؟" → كل ١٠٠ ر.س = تفاحة جديدة. شجرته لها ${lv.apples} تفاحات حالياً.
"وضع التدريب" → رصيد افتراضي ٥٠٠٠٠ ر.س للتجربة بدون خسارة حقيقية.

أسلوبك: عربية فصحى مبسطة دافئة، ٢-٤ جمل، رموز تعبيرية طبيعية، احتفلي بالإنجازات، لا تعظي.`;

      const messages = hist.map(m=>({role:m.role==="assistant"?"assistant":"user",content:m.text}));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages}),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "شجرتك تنمو بجمال! 🌳 استمر في ادخارك 💚";
      setState(s=>({...s, chatHistory:[...hist,{role:"assistant",text:reply,ts:Date.now()}]}));
    } catch {
      setState(s=>({...s, chatHistory:[...hist,{role:"assistant",text:"حدث خطأ صغير. لكن شجرتك لا تزال تنمو! 🌳 جرب مرة أخرى.",ts:Date.now()}]}));
    }
    setLoading(false);
  }, [state, loading, lv, nxt, markChatMission]);

  const handleSend = () => send(input);
  const handleKey  = (e) => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();handleSend();} };

  return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",background:P.cream,direction:"rtl"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(165deg,${P.forest},${P.forestM})`,
        padding:"52px 24px 22px",borderRadius:"0 0 28px 28px",flexShrink:0,
        position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:130,height:130,borderRadius:"50%",
          background:`${P.gold}0E`,top:-35,left:-25}}/>
        <button onClick={()=>setScreen("home")}
          style={{background:"rgba(255,255,255,0.2)",border:"none",color:P.white,
            padding:"6px 16px",borderRadius:10,cursor:"pointer",fontFamily:"Tajawal",
            fontSize:12,fontWeight:600,marginBottom:14,position:"relative",zIndex:1}}>
          {A.back}
        </button>
        <div style={{display:"flex",alignItems:"center",gap:13,position:"relative",zIndex:1}}>
          <div style={{width:50,height:50,borderRadius:16,
            background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,
            boxShadow:`0 6px 20px ${P.goldD}55`,position:"relative"}}>
            ✨
            <div style={{position:"absolute",bottom:-2,right:-2,width:14,height:14,
              borderRadius:"50%",background:"#22C55E",border:"2px solid "+P.white}}/>
          </div>
          <div>
            <div style={{fontWeight:900,color:P.white,fontSize:17,fontFamily:"Cairo"}}>{A.chatT}</div>
            <div style={{fontSize:12,color:`rgba(180,230,195,0.85)`,fontFamily:"Tajawal",marginTop:2}}>
              🌳 Lv.{lv.lv} {lv.name} · متصلة الآن
            </div>
          </div>
          <div style={{marginRight:"auto",background:"rgba(255,255,255,0.15)",borderRadius:99,
            padding:"5px 13px",border:"1px solid rgba(255,255,255,0.2)"}}>
            <span style={{color:P.goldL,fontSize:11,fontWeight:700,fontFamily:"Cairo"}}>
              {lv.apples} 🍎
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{flex:1,overflow:"auto",padding:"18px 16px 4px",display:"flex",flexDirection:"column",gap:4}}>
        {state.chatHistory.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-start":"flex-end",
            marginBottom:10,animation:"chatIn 0.3s ease-out both"}}>
            {m.role==="assistant" && (
              <div style={{width:34,height:34,borderRadius:11,
                background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:16,flexShrink:0,marginLeft:9,alignSelf:"flex-end",
                boxShadow:`0 3px 10px ${P.goldD}33`}}>
                ✨
              </div>
            )}
            <div style={{maxWidth:"78%"}}>
              <div style={{padding:"13px 17px",
                borderRadius:m.role==="user"?"18px 18px 18px 4px":"18px 4px 18px 18px",
                background:m.role==="user"?`linear-gradient(135deg,${P.forest},${P.forestM})`:P.white,
                color:m.role==="user"?P.white:P.near,
                fontSize:14,lineHeight:1.75,
                boxShadow:m.role==="user"?`0 4px 14px ${P.forest}44`:"0 2px 12px rgba(0,0,0,0.08)",
                border:m.role==="assistant"?"1px solid #EDE8DC":"none",
                direction:"rtl",textAlign:"right",fontFamily:"Tajawal"}}>
                {m.text}
              </div>
              {m.ts && (
                <div style={{fontSize:10,color:"#CCC",textAlign:m.role==="user"?"right":"left",
                  marginTop:4,paddingRight:6,paddingLeft:6,fontFamily:"Tajawal"}}>
                  {new Date(m.ts).toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"})}
                </div>
              )}
            </div>
            {m.role==="user" && (
              <div style={{width:34,height:34,borderRadius:11,background:"#EDE8DC",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,flexShrink:0,marginRight:9,alignSelf:"flex-end"}}>
                👤
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:10}}>
            <div style={{width:34,height:34,borderRadius:11,
              background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16,flexShrink:0,marginLeft:9,alignSelf:"flex-end"}}>
              ✨
            </div>
            <div style={{padding:"14px 20px",background:P.white,border:"1px solid #EDE8DC",
              borderRadius:"18px 4px 18px 18px",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",
              display:"flex",gap:6,alignItems:"center"}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{width:9,height:9,borderRadius:"50%",background:P.forestL,
                  animation:`dotBounce 1.1s ease-in-out infinite`,animationDelay:`${i*0.18}s`}}/>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Quick suggestions */}
      <div style={{padding:"0 16px 8px",display:"flex",gap:7,overflowX:"auto",flexShrink:0}}>
        {A.sugg.map(s=>(
          <button key={s} onClick={()=>send(s)}
            style={{flexShrink:0,padding:"8px 14px",border:`1.5px solid ${P.forestL}44`,
              borderRadius:99,background:`${P.forestL}10`,color:P.forest,
              fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Tajawal",whiteSpace:"nowrap"}}>
            {s}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div style={{padding:"9px 16px 26px",display:"flex",gap:10,
        borderTop:"1px solid #EDE8DC",background:P.white,flexShrink:0,
        direction:"rtl",alignItems:"flex-end"}}>
        <button onClick={handleSend} disabled={!input.trim()||loading}
          style={{width:48,height:48,borderRadius:15,border:"none",
            background:input.trim()&&!loading?`linear-gradient(135deg,${P.forestL},${P.forest})`:"#EDE8DC",
            color:P.white,fontSize:20,cursor:input.trim()&&!loading?"pointer":"default",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
            transition:"all 0.2s",
            boxShadow:input.trim()&&!loading?`0 4px 14px ${P.forest}44`:"none"}}>
          ←
        </button>
        <textarea ref={inputRef} value={input}
          onChange={e=>{setInput(e.target.value);e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,120)+"px";}}
          onKeyDown={handleKey}
          placeholder={A.chatPH}
          rows={1}
          style={{flex:1,padding:"13px 17px",border:"1.5px solid #EDE8DC",borderRadius:15,
            fontSize:14,background:P.cream,color:P.near,fontFamily:"Tajawal",
            textAlign:"right",direction:"rtl",lineHeight:1.5,
            maxHeight:120,overflowY:"auto",minHeight:48}}/>
      </div>
    </div>
  );
}

/* ═══════════════ DEPOSIT ════════════════════════════════════════*/
/* ═══════════════ REWARDS BAG ════════════════════════════════════*/
function RewardsCard({ r, index=0, onUse }) {
  const now = Date.now();
  const status = r.status==="used" ? "used" : (r.expiresAt && r.expiresAt<now) ? "expired" : "available";
  const statusMap = {
    available:{l:A.stAvail,  bg:`${P.forestL}18`, c:P.forestL},
    used:     {l:A.stUsed,   bg:"#EDE8DC",         c:"#999"},
    expired:  {l:A.stExpired,bg:`${P.rose}15`,     c:P.rose},
  };
  const sm = statusMap[status];
  const dateFmt = ts => new Date(ts).toLocaleDateString("ar-SA",{day:"numeric",month:"short",year:"numeric"});

  return (
    <Card style={{border:`1.5px solid ${r.color}33`, opacity:status==="expired"?0.62:1,
      animation:`fadeUp 0.45s ease ${Math.min(index*0.06,0.4)}s both`}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:13}}>
        <div style={{width:52,height:52,borderRadius:16,background:`${r.color}1c`,
          border:`2px solid ${r.color}44`,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:26,flexShrink:0}}>
          {r.icon}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
            <div style={{fontWeight:800,color:P.near,fontSize:14.5,fontFamily:"Cairo"}}>{r.title}</div>
            <span style={{background:sm.bg,color:sm.c,fontSize:10.5,fontWeight:800,borderRadius:99,
              padding:"3px 10px",fontFamily:"Tajawal",whiteSpace:"nowrap",flexShrink:0}}>
              {sm.l}
            </span>
          </div>
          {r.brand && (
            <div style={{fontSize:11.5,color:r.color,fontWeight:700,marginTop:2,fontFamily:"Tajawal"}}>
              {r.brand}
            </div>
          )}
          <div style={{fontSize:12,color:"#888",marginTop:5,fontFamily:"Tajawal",lineHeight:1.6}}>
            {r.desc}
          </div>
          <div style={{display:"flex",gap:14,marginTop:9,flexWrap:"wrap"}}>
            <span style={{fontSize:10.5,color:"#AAA",fontFamily:"Tajawal"}}>
              {A.earnedOn}: {dateFmt(r.dateEarned)}
            </span>
            {r.expiresAt && (
              <span style={{fontSize:10.5,color:status==="expired"?P.rose:"#AAA",fontFamily:"Tajawal"}}>
                {A.expiresOn}: {dateFmt(r.expiresAt)}
              </span>
            )}
          </div>
        </div>
      </div>
      {status==="available" && (
        <button onClick={()=>onUse(r.id)}
          style={{width:"100%",marginTop:12,padding:11,borderRadius:12,border:"none",cursor:"pointer",
            background:`linear-gradient(135deg,${P.forestL},${P.forest})`,color:P.white,
            fontWeight:800,fontSize:12.5,fontFamily:"Cairo"}}>
          {A.useNow}
        </button>
      )}
      {status==="used" && (
        <div style={{marginTop:10,paddingTop:10,borderTop:"1px dashed #EDE8DC",
          fontSize:11,color:"#AAA",fontFamily:"Tajawal",textAlign:"center"}}>
          {A.codeL}: {r.code}
        </div>
      )}
    </Card>
  );
}

function RewardsBag({ state, setState, setScreen }) {
  const useReward = (id) => {
    setState(s=>{
      const found = s.rewards.find(r=>r.id===id);
      return {...s, rewards:s.rewards.map(r=>r.id===id?{...r,status:"used"}:r),
        activity:[{id:Date.now(),type:"apple",amount:0,
          desc:`استخدمت مكافأة "${found?found.title:""}" 🎁`,time:"الآن"},...s.activity]};
    });
  };

  const now    = Date.now();
  const sorted = [...state.rewards].sort((a,b)=>b.dateEarned-a.dateEarned);
  const availableCount = state.rewards.filter(r=>r.status!=="used" && (!r.expiresAt||r.expiresAt>now)).length;

  return (
    <div style={{minHeight:"100%",background:P.cream,paddingBottom:40,direction:"rtl"}}>
      <div style={{background:`linear-gradient(165deg,${P.forestM},${P.forest})`,
        padding:"52px 24px 30px",borderRadius:"0 0 28px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:170,height:170,borderRadius:"50%",
          background:`${P.goldL}12`,top:-40,left:-35}}/>
        <button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.2)",border:"none",
          color:P.white,padding:"8px 18px",borderRadius:11,cursor:"pointer",
          fontFamily:"Tajawal",fontSize:13,fontWeight:600,marginBottom:18}}>
          {A.back}
        </button>
        <div style={{fontSize:44,marginBottom:8,animation:"bounceIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both"}}>
          🎁
        </div>
        <div style={{fontFamily:"Cairo",fontSize:24,fontWeight:900,color:P.white}}>{A.rewardsBag}</div>
        <div style={{color:"rgba(255,255,255,0.7)",fontSize:13,marginTop:4,fontFamily:"Tajawal"}}>
          {A.rewardsBagSub}
        </div>
        {state.rewards.length>0 && (
          <div style={{marginTop:16,background:"rgba(255,255,255,0.12)",borderRadius:16,
            padding:"12px 16px",display:"flex",justifyContent:"space-between"}}>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"Tajawal"}}>الإجمالي</div>
              <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.white}}>{state.rewards.length}</div>
            </div>
            <div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.6)",fontFamily:"Tajawal"}}>متاحة</div>
              <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.goldL}}>{availableCount}</div>
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"20px 18px",display:"flex",flexDirection:"column",gap:12}}>
        {sorted.length===0 ? (
          <div style={{textAlign:"center",padding:"54px 20px",animation:"fadeUp 0.5s ease both"}}>
            <div style={{fontSize:78,marginBottom:16}}>🎒</div>
            <p style={{fontFamily:"Tajawal",fontSize:14,color:"#888",lineHeight:1.8,
              maxWidth:260,margin:"0 auto"}}>
              {A.noRewards}
            </p>
          </div>
        ) : sorted.map((r,i)=><RewardsCard key={r.id} r={r} index={i} onUse={useReward}/>)}
      </div>
    </div>
  );
}

function Deposit({ state, setState, setScreen }) {
  const [amt,    setAmt]    = useState("");
  const [isDone, setIsDone] = useState(false);
  const [lvUp,   setLvUp]   = useState(null);
  const presets = [20,50,100,200,500];
  const MAX_DEPOSIT = 1000000; // sane per-transaction ceiling

  const parsedAmt   = parseFloat(amt);
  const tooLarge    = amt !== "" && !isNaN(parsedAmt) && parsedAmt > MAX_DEPOSIT;
  const invalidAmt  = amt !== "" && (isNaN(parsedAmt) || parsedAmt <= 0 || tooLarge);

  const go = () => {
    const a = parseFloat(amt); if(!a||a<=0||a>MAX_DEPOSIT) return;
    const xp     = Math.round(a*2);
    const oldLv  = getLv(state.totalSaved);
    const newT   = state.totalSaved+a;
    const newLv  = getLv(newT);
    const milestonesCrossed = Math.floor(newT/100) - Math.floor(state.totalSaved/100);
    if (newLv.lv > oldLv.lv) setLvUp(newLv);
    setState(s=>({...s,balance:s.balance+a,totalSaved:newT,xp:s.xp+xp,streak:(s.streak||0)+1,
      treeApples: milestonesCrossed>0
        ? [...s.treeApples, ...addTreeApples(s.treeApples, milestonesCrossed)]
        : s.treeApples,
      badges:s.badges.map(b=>b.id===1&&newT>0?{...b,unlocked:true}:b),
      missions:s.missions.map(m=>m.type==="deposit"&&!m.done?{...m,progress:Math.min(1,a/20),done:a>=20}:m.type==="dep100"&&!m.done?{...m,progress:Math.min(100,(m.progress||0)+a),done:(m.progress||0)+a>=100}:m),
      activity:[{id:Date.now(),type:"deposit",amount:a,desc:"إيداع",time:"الآن"},...s.activity],
    }));
    setIsDone(true);
  };

  if (isDone) {
    const a = parseFloat(amt);
    const gotApl = Math.floor((state.totalSaved+a)/100) > Math.floor(state.totalSaved/100);
    return (
      <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
        justifyContent:"center",padding:32,gap:16,background:P.cream,direction:"rtl"}}>
        {lvUp && <LevelUpOverlay level={lvUp} onClose={()=>setLvUp(null)}/>}
        <div style={{fontSize:76,animation:"starBurst 0.6s ease-out both"}}>🎉</div>
        <div style={{fontFamily:"Cairo",fontSize:30,fontWeight:900,color:P.forest,textAlign:"center"}}>
          تم الادخار!
        </div>
        <div style={{fontFamily:"Cairo",fontSize:48,fontWeight:900,color:P.forestL,
          animation:"bounceIn 0.5s 0.2s both"}}>
          +{a.toFixed(2)} ر.س
        </div>
        <XPBadge v={Math.round(a*2)}/>
        {gotApl && (
          <div style={{background:`${P.apple}12`,border:`1.5px solid ${P.apple}44`,
            borderRadius:18,padding:"16px 20px",width:"100%",textAlign:"center",
            animation:"bounceIn 0.5s 0.3s both"}}>
            <div style={{fontSize:32,marginBottom:6}}>🍎</div>
            <div style={{fontWeight:800,color:P.near,fontSize:14,fontFamily:"Cairo"}}>{A.fruitOn}</div>
          </div>
        )}
        <div style={{display:"flex",gap:10,width:"100%"}}>
          <button onClick={()=>setScreen("tree")}
            style={{flex:1,padding:15,background:`linear-gradient(135deg,${P.forestL},${P.forest})`,
              color:P.white,border:"none",borderRadius:16,fontSize:14,fontWeight:800,
              cursor:"pointer",fontFamily:"Cairo"}}>
            {A.seeTree}
          </button>
          <button onClick={()=>setScreen("home")}
            style={{flex:1,padding:15,background:`linear-gradient(135deg,${P.forest},${P.forestM})`,
              color:P.white,border:"none",borderRadius:16,fontSize:14,fontWeight:800,
              cursor:"pointer",fontFamily:"Cairo"}}>
            {A.goHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight:"100%",background:P.cream,paddingBottom:100,direction:"rtl"}}>
      <div style={{background:`linear-gradient(165deg,${P.forest},${P.forestM})`,
        padding:"52px 24px 32px",borderRadius:"0 0 28px 28px"}}>
        <button onClick={()=>setScreen("home")}
          style={{background:"rgba(255,255,255,0.2)",border:"none",color:P.white,
            padding:"8px 18px",borderRadius:11,cursor:"pointer",fontFamily:"Tajawal",
            fontSize:13,fontWeight:600,marginBottom:18}}>
          {A.back}
        </button>
        <div style={{fontFamily:"Cairo",fontSize:28,fontWeight:900,color:P.white}}>{A.depT}</div>
        <div style={{color:"rgba(180,230,195,0.8)",fontSize:14,marginTop:5,fontFamily:"Tajawal"}}>
          {A.depS}
        </div>
      </div>
      <div style={{padding:"22px 18px",display:"flex",flexDirection:"column",gap:16}}>
        <Card>
          <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:14,fontFamily:"Tajawal"}}>
            {A.quick}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
            {presets.map(p=>(
              <button key={p} onClick={()=>setAmt(String(p))}
                style={{padding:"11px 18px",
                  border:`1.5px solid ${amt===String(p)?P.forestL:"#EDE8DC"}`,
                  borderRadius:13,
                  background:amt===String(p)?`${P.forestL}18`:P.cream,
                  color:amt===String(p)?P.forest:P.near,
                  fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"Cairo",transition:"all 0.15s"}}>
                {p} ر.س
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:12,fontFamily:"Tajawal"}}>
            {A.custom}
          </div>
          <div style={{position:"relative"}}>
            <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="٠٫٠٠"
              style={{width:"100%",padding:"16px 16px 16px 56px",border:"1.5px solid #EDE8DC",
                borderRadius:14,fontSize:26,fontWeight:800,color:P.near,
                background:P.cream,outline:"none",fontFamily:"Cairo",
                boxSizing:"border-box",direction:"rtl"}}/>
            <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",
              fontSize:13,color:P.forestL,fontWeight:700,fontFamily:"Tajawal"}}>ر.س</span>
          </div>
          {invalidAmt && (
            <div style={{marginTop:10,padding:"9px 14px",background:`${P.rose}12`,
              border:`1.5px solid ${P.rose}44`,borderRadius:11,
              color:P.rose,fontSize:12.5,fontWeight:700,fontFamily:"Tajawal",textAlign:"center"}}>
              {tooLarge
                ? `الحد الأقصى للإيداع هو ${MAX_DEPOSIT.toLocaleString()} ر.س`
                : "الرجاء إدخال مبلغ أكبر من صفر"}
            </div>
          )}
          {amt && !invalidAmt && (
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:7}}>
              <div style={{padding:"9px 14px",background:`${P.sage}14`,borderRadius:11,
                display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,color:"#777",fontFamily:"Tajawal"}}>{A.xpE}</span>
                <XPBadge v={Math.round(parseFloat(amt||0)*2)}/>
              </div>
              {Math.floor((state.totalSaved+parseFloat(amt||0))/100) > Math.floor(state.totalSaved/100) && (
                <div style={{padding:"9px 14px",background:`${P.apple}10`,borderRadius:11,
                  display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,color:"#777",fontFamily:"Tajawal"}}>مكافأة الشجرة</span>
                  <span style={{fontSize:13,fontWeight:800,color:P.apple,fontFamily:"Tajawal"}}>
                    {A.appleIn}
                  </span>
                </div>
              )}
            </div>
          )}
        </Card>
        <button onClick={go} disabled={!amt||invalidAmt}
          style={{width:"100%",padding:17,
            background:!amt||invalidAmt?"#EDE8DC":`linear-gradient(135deg,${P.forestL},${P.forest})`,
            color:!amt||invalidAmt?"#AAA":P.white,border:"none",borderRadius:18,
            fontSize:16,fontWeight:800,cursor:(!amt||invalidAmt)?"not-allowed":"pointer",fontFamily:"Cairo",
            boxShadow:amt&&!invalidAmt?`0 10px 28px ${P.forest}44`:"none"}}>
          {A.deposit} {isNaN(parseFloat(amt))?"0.00":parseFloat(amt||0).toFixed(2)} ر.س
        </button>
      </div>
    </div>
  );
}

/* ═══════════════ WITHDRAW ═══════════════════════════════════════*/
function Withdraw({ state, setState, setScreen }) {
  const [amt,    setAmt]    = useState("");
  const [step,   setStep]   = useState("amount");
  const [reason, setReason] = useState("");
  const [aiTxt,  setAiTxt]  = useState("");
  const [loading,setLoading]= useState(false);
  const lv = getLv(state.totalSaved);

  const askAI = async () => {
    if (reason.trim().length < 5) return;
    setStep("ai"); setLoading(true);
    try {
      const sys = `أنت ازدهار، مساعدة ادخار عاطفية. شجرة المستخدم: Lv.${lv.lv} "${lv.name}". رصيده: ${state.balance.toFixed(2)} ر.س. السحب: ${parseFloat(amt).toFixed(2)} ر.س. السبب: "${reason}". اكتب رداً عاطفياً متعاطفاً ٣ جمل، اذكر شجرته، لا تعظ.`;
      const r = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:sys}]})});
      const d = await r.json();
      setAiTxt(d.content?.[0]?.text || "أسمعك. شجرتك لا تزال تحبك 🌳💚");
    } catch { setAiTxt("أسمعك وأحترم قرارك. شجرتك ستنتظرك 🌳"); }
    setLoading(false);
  };

  const confirm = () => {
    setState(s=>({...s,balance:s.balance-parseFloat(amt),
      activity:[{id:Date.now(),type:"withdraw",amount:-parseFloat(amt),desc:"سحب",time:"الآن"},...s.activity],
    }));
    setStep("done");
  };

  if (step === "done") return (
    <div style={{height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:32,gap:16,background:P.cream,direction:"rtl"}}>
      <div style={{fontSize:62}}>✅</div>
      <div style={{fontFamily:"Cairo",fontSize:26,fontWeight:900,color:P.near}}>{A.wdDone}</div>
      <div style={{fontFamily:"Cairo",fontSize:40,fontWeight:900,color:P.rose}}>
        -{parseFloat(amt).toFixed(2)} ر.س
      </div>
      <p style={{color:"#888",textAlign:"center",fontSize:14,lineHeight:1.7,fontFamily:"Tajawal"}}>
        نتمنى أن يكون في محله! شجرتك تنتظرك 🌳
      </p>
      <button onClick={()=>setScreen("home")}
        style={{width:"100%",padding:16,
          background:`linear-gradient(135deg,${P.forest},${P.forestM})`,
          color:P.white,border:"none",borderRadius:18,fontSize:16,fontWeight:800,
          cursor:"pointer",fontFamily:"Cairo"}}>
        {A.goHome}
      </button>
    </div>
  );

  return (
    <div style={{minHeight:"100%",background:P.cream,paddingBottom:100,direction:"rtl"}}>
      <div style={{background:`linear-gradient(165deg,${P.forest},${P.forestM})`,
        padding:"52px 24px 28px",borderRadius:"0 0 28px 28px"}}>
        <button onClick={()=>step==="amount"?setScreen("home"):setStep(step==="reason"?"amount":"reason")}
          style={{background:"rgba(255,255,255,0.2)",border:"none",color:P.white,
            padding:"8px 18px",borderRadius:11,cursor:"pointer",fontFamily:"Tajawal",
            fontSize:13,fontWeight:600,marginBottom:18}}>
          {A.back}
        </button>
        <div style={{fontFamily:"Cairo",fontSize:24,fontWeight:900,color:P.white}}>
          {step==="amount"?A.wdT:step==="reason"?A.wdReason:"ازدهار تقول... ✨"}
        </div>
        <div style={{color:"rgba(180,230,195,0.8)",fontSize:13,marginTop:4,fontFamily:"Tajawal"}}>
          {A.wdAvail} {state.balance.toFixed(2)} ر.س
        </div>
      </div>
      <div style={{padding:"22px 18px",display:"flex",flexDirection:"column",gap:16}}>

        {step==="amount" && (
          <>
            <Card>
              <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:12,fontFamily:"Tajawal"}}>
                المبلغ
              </div>
              <div style={{position:"relative"}}>
                <input type="number" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="٠٫٠٠"
                  style={{width:"100%",padding:"16px 16px 16px 56px",border:"1.5px solid #EDE8DC",
                    borderRadius:14,fontSize:26,fontWeight:800,color:P.near,background:P.cream,
                    outline:"none",fontFamily:"Cairo",boxSizing:"border-box",direction:"rtl"}}/>
                <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",
                  fontSize:13,color:P.rose,fontWeight:700,fontFamily:"Tajawal"}}>ر.س</span>
              </div>
              {amt&&parseFloat(amt)>state.balance && (
                <div style={{marginTop:9,color:P.rose,fontSize:13,fontFamily:"Tajawal"}}>
                  ⚠️ يتجاوز رصيدك
                </div>
              )}
            </Card>
            <button onClick={()=>{if(!amt||parseFloat(amt)<=0||parseFloat(amt)>state.balance)return;setStep("reason");}}
              disabled={!amt||parseFloat(amt)<=0||parseFloat(amt)>state.balance}
              style={{width:"100%",padding:17,
                background:!amt||parseFloat(amt)<=0||parseFloat(amt)>state.balance?"#EDE8DC":P.rose,
                color:!amt||parseFloat(amt)<=0||parseFloat(amt)>state.balance?"#AAA":P.white,
                border:"none",borderRadius:18,fontSize:16,fontWeight:800,cursor:"pointer",fontFamily:"Cairo"}}>
              متابعة ←
            </button>
          </>
        )}

        {step==="reason" && (
          <>
            <div style={{background:`linear-gradient(160deg,${P.forest},${P.forestM})`,
              borderRadius:22,padding:"20px",textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",overflow:"hidden",height:150}}>
                <CartoonAppleTree
                  lv={Math.max(lv.lv,3)}
                  appleCount={Math.min(lv.apples,3)}
                  pendingApple={null} onTapApple={()=>{}}
                  size={160} leafTheme="spring" placedDecor={[]}/>
              </div>
              <div style={{color:P.goldL,fontWeight:800,fontSize:14,marginTop:4,fontFamily:"Cairo"}}>
                شجرتك {lv.name} تنمو 🌱
              </div>
            </div>
            <Card>
              <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"center"}}>
                <div style={{width:38,height:38,borderRadius:12,
                  background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>
                  ✨
                </div>
                <div>
                  <div style={{fontWeight:800,color:P.near,fontSize:14,fontFamily:"Cairo"}}>
                    ازدهار تريد أن تفهم
                  </div>
                  <div style={{fontSize:12,color:"#888",marginTop:2,fontFamily:"Tajawal"}}>
                    مساعدتك الشخصية
                  </div>
                </div>
              </div>
              <p style={{color:P.near,fontSize:14,lineHeight:1.7,margin:"0 0 14px",fontFamily:"Tajawal"}}>
                لماذا تريد سحب <strong>{parseFloat(amt||0).toFixed(2)} ر.س</strong>؟
              </p>
              <textarea value={reason} onChange={e=>setReason(e.target.value)} placeholder={A.wdPH} rows={3}
                style={{width:"100%",padding:"13px 15px",
                  border:`1.5px solid ${reason.length>4?P.forestL:"#EDE8DC"}`,
                  borderRadius:14,fontSize:14,color:P.near,background:P.cream,
                  fontFamily:"Tajawal",boxSizing:"border-box",lineHeight:1.6,
                  direction:"rtl",textAlign:"right",transition:"border-color 0.2s"}}/>
              <div style={{fontSize:11,color:reason.length>4?"#AAA":P.rose,marginTop:7,
                fontWeight:600,fontFamily:"Tajawal"}}>
                {reason.length<5 ? A.wdReq : `${reason.length} حرف ✓`}
              </div>
            </Card>
            <button onClick={askAI} disabled={reason.trim().length<5}
              style={{width:"100%",padding:17,
                background:reason.trim().length<5?"#EDE8DC":`linear-gradient(135deg,${P.forestL},${P.forest})`,
                color:reason.trim().length<5?"#AAA":P.white,border:"none",borderRadius:18,
                fontSize:16,fontWeight:800,cursor:reason.trim().length<5?"not-allowed":"pointer",
                fontFamily:"Cairo"}}>
              {A.askAI}
            </button>
          </>
        )}

        {step==="ai" && (
          <>
            <Card style={{background:`linear-gradient(135deg,${P.goldL}10,${P.gold}07)`,border:`1.5px solid ${P.gold}44`}}>
              <div style={{display:"flex",gap:13,marginBottom:14,alignItems:"center"}}>
                <div style={{width:46,height:46,borderRadius:15,
                  background:`linear-gradient(135deg,${P.goldL},${P.gold})`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  ✨
                </div>
                <div>
                  <div style={{fontWeight:800,color:P.near,fontSize:15,fontFamily:"Cairo"}}>ازدهار AI</div>
                  <div style={{fontSize:11,color:"#AAA",fontFamily:"Tajawal"}}>مساعدتك المالية</div>
                </div>
              </div>
              {loading ? (
                <div style={{display:"flex",gap:8,alignItems:"center",padding:"10px 0"}}>
                  {[0,1,2].map(i=>(
                    <div key={i} style={{width:9,height:9,borderRadius:"50%",background:P.forestL,
                      animation:`dotBounce 1.1s ease-in-out infinite`,animationDelay:`${i*0.18}s`}}/>
                  ))}
                  <span style={{fontSize:13,color:"#AAA",marginRight:6,fontFamily:"Tajawal"}}>
                    {A.thinking}
                  </span>
                </div>
              ) : (
                <p style={{color:P.near,fontSize:14,lineHeight:1.75,margin:0,
                  fontFamily:"Tajawal",direction:"rtl"}}>{aiTxt}</p>
              )}
            </Card>
            {!loading && (
              <>
                <Card>
                  <div style={{fontSize:12,color:"#999",fontWeight:700,marginBottom:12,fontFamily:"Tajawal"}}>
                    {A.afterWd}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#AAA",marginBottom:5,fontFamily:"Tajawal"}}>الآن</div>
                      <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.near}}>
                        {state.balance.toFixed(2)} ر.س
                      </div>
                    </div>
                    <span style={{fontSize:22,color:P.rose}}>←</span>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontSize:11,color:"#AAA",marginBottom:5,fontFamily:"Tajawal"}}>بعد السحب</div>
                      <div style={{fontFamily:"Cairo",fontSize:18,fontWeight:900,color:P.rose}}>
                        {(state.balance-parseFloat(amt)).toFixed(2)} ر.س
                      </div>
                    </div>
                  </div>
                  {getLv(state.totalSaved-parseFloat(amt)).lv < lv.lv && (
                    <div style={{marginTop:10,background:`${P.rose}10`,border:`1px solid ${P.rose}44`,
                      borderRadius:11,padding:"10px 13px",fontSize:12,color:P.rose,
                      fontWeight:700,fontFamily:"Tajawal"}}>
                      {A.dropWarn} {getLv(state.totalSaved-parseFloat(amt)).name}
                    </div>
                  )}
                </Card>
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  <button onClick={()=>setScreen("home")}
                    style={{width:"100%",padding:17,
                      background:`linear-gradient(135deg,${P.forestL},${P.forest})`,
                      color:P.white,border:"none",borderRadius:18,fontSize:15,
                      fontWeight:800,cursor:"pointer",fontFamily:"Cairo",
                      animation:"glowBox 3s ease-in-out infinite"}}>
                    {A.keepSaving}
                  </button>
                  <button onClick={confirm}
                    style={{width:"100%",padding:15,background:"transparent",color:P.rose,
                      border:`1.5px solid ${P.rose}`,borderRadius:18,fontSize:14,
                      fontWeight:700,cursor:"pointer",fontFamily:"Cairo"}}>
                    {A.stillWd}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════ ROOT APP ═══════════════════════════════════════*/
export default function IzdiharApp() {
  const [app,    setApp]    = useState("splash");
  const [screen, setScreen] = useState("home");
  const [state,  setState]  = useState(() => {
    const saved = loadSavedState();
    return saved ? {...INIT, ...saved} : INIT;
  });

  useEffect(() => { saveState(state); }, [state]);

  const navScreens = ["home","tree","missions","harvest","chat"];
  const showNav    = navScreens.includes(screen) && app==="app";
  const nav        = useCallback(s=>setScreen(s),[]);

  const render = () => {
    switch(screen) {
      case "home":     return <Home      state={state} setState={setState} setScreen={nav}/>;
      case "tree":     return <TreeView  state={state} setState={setState}/>;
      case "missions": return <MissionsView state={state} setState={setState}/>;
      case "harvest":  return <HarvestView  state={state} setState={setState}/>;
      case "chat":     return <ChatView  state={state} setState={setState} setScreen={nav}/>;
      case "deposit":  return <Deposit   state={state} setState={setState} setScreen={nav}/>;
      case "withdraw": return <Withdraw  state={state} setState={setState} setScreen={nav}/>;
      case "rewards":  return <RewardsBag state={state} setState={setState} setScreen={nav}/>;
      default: return null;
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",
      minHeight:"100vh",background:"#060D08",fontFamily:"'Tajawal','Segoe UI',sans-serif"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:430,height:"100vh",maxHeight:900,
        position:"relative",overflow:"hidden",background:P.cream,
        boxShadow:"0 0 120px rgba(0,0,0,0.88)",
        borderRadius:window.innerWidth>500?50:0}}>
        <div style={{height:"100%",overflow:"auto",position:"relative"}}>
          {app==="splash" && <Splash onDone={()=>setApp("auth")}/>}
          {app==="auth"   && <Auth   onAuth={()=>setApp("app")}/>}
          {app==="app"    && render()}
        </div>
        {showNav && <BottomNav screen={screen} setScreen={nav}/>}
      </div>
    </div>
  );
}
