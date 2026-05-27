const I18N = {
  en: {
    aboutMe: 'About Me', projects: 'Projects', skills: 'Skills', certificates: 'Certificates',
    contact: 'Contact', terminal: 'Terminal', blog: 'Blog', resume: 'Resume',
    finder: 'Finder', aboutThisMac: 'About This Mac', restart: 'Restart',
    letsWork: "Let's work together", contactSub: 'Have a project in mind? Feel free to reach out anytime.',
    sendMessage: 'Send Message', yourName: 'Your Name', yourEmail: 'Your Email', yourMessage: 'Your Message',
    technicalSkills: 'Technical Skills', devopsSecurity: 'DevOps & Security', services: 'Services',
    education: 'Education', internships: 'Internships', certifications: 'Certifications',
    viewAllCerts: 'View All Certificates →', searchCerts: 'Search certificates...',
    total: 'Total', outerCollege: 'Outer College', college: 'College',
    projectsCount: '4 items', viewGitHub: 'View on GitHub →',
    role: 'Embedded Systems & IoT Developer',
    bio1: 'Embedded Systems and IoT Developer skilled in microcontroller programming, sensor integration and hardware-software interfacing. Experienced with Arduino, RFID modules, ESP devices and IoT automation projects.',
    bio2: 'Strong problem-solver with hands-on project experience in embedded design and real-time systems. Passionate about automation, circuit design and embedded technology innovations.',
    visitors: 'visitors', spotlightPh: 'Search apps, blog, commands...',
    soundOn: 'Sound on', soundOff: 'Sound off', lang: 'தமிழ்',
    roles: ['Embedded Systems & IoT Developer', 'Microcontroller Programmer', 'Hardware-Software Integrator', 'Automation Enthusiast']
  },
  ta: {
    aboutMe: 'என்னைப் பற்றி', projects: 'திட்டங்கள்', skills: 'திறன்கள்', certificates: 'சான்றிதழ்கள்',
    contact: 'தொடர்பு', terminal: 'டர்மினல்', blog: 'வலைப்பதிவு', resume: 'ரெசுமே',
    finder: 'Finder', aboutThisMac: 'About This Mac', restart: 'Restart',
    letsWork: 'ஒன்றாக வேலை செய்வோம்', contactSub: 'திட்டம் இருக்கா? எப்போது வேண்டுமானாலும் தொடர்பு கொள்ளுங்கள்.',
    sendMessage: 'செய்தி அனுப்பு', yourName: 'உங்கள் பெயர்', yourEmail: 'உங்கள் மின்னஞ்சல்', yourMessage: 'உங்கள் செய்தி',
    technicalSkills: 'தொழில்நுட்ப திறன்கள்', devopsSecurity: 'DevOps & Security', services: 'சேவைகள்',
    education: 'கல்வி', internships: 'பயிற்சி', certifications: 'சான்றிதழ்கள்',
    viewAllCerts: 'அனைத்து சான்றிதழ்களும் →', searchCerts: 'சான்றிதழ்கள் தேடு...',
    total: 'மொத்தம்', outerCollege: 'வெளி கல்லூரி', college: 'கல்லூரி',
    projectsCount: '4 items', viewGitHub: 'GitHub-ல் பார் →',
    role: 'Embedded Systems & IoT Developer',
    bio1: 'Embedded Systems மற்றும் IoT Developer — microcontroller programming, sensor integration மற்றும் hardware-software interfacing.',
    bio2: 'Embedded design, real-time systems மற்றும் automation-ல் hands-on அனுபவம்.',
    visitors: 'பார்வையாளர்கள்', spotlightPh: 'Apps, blog, commands தேடு...',
    soundOn: 'ஒலி ON', soundOff: 'ஒலி OFF', lang: 'English',
    roles: ['Embedded Systems & IoT Developer', 'Microcontroller Programmer', 'Hardware-Software Integrator', 'Automation Enthusiast']
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang === 'ta' ? 'ta' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (val) el.textContent = val;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = t(el.dataset.i18nPlaceholder);
    if (val) el.placeholder = val;
  });

  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    el.dataset.label = t(el.dataset.i18nLabel);
  });

  const langBtn = document.getElementById('langToggle');
  if (langBtn) langBtn.textContent = t('lang');

  if (typeof roles !== 'undefined' && I18N[lang]?.roles) {
    roles.length = 0;
    I18N[lang].roles.forEach(r => roles.push(r));
  }

  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));

  if (typeof focusedApp !== 'undefined' && focusedApp && typeof focusWindow === 'function') {
    focusWindow(focusedApp);
  }
}
