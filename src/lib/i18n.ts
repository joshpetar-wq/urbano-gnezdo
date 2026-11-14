export const locales = ["mk", "en"] as const;
export type Locale = (typeof locales)[number];

export type L = { mk: string; en: string };

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** Text for a locale. English falls back to Macedonian when empty. */
export function tr(value: unknown, locale: Locale): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const v = value as Partial<L>;
  if (locale === "en") return (v.en && v.en.trim()) || v.mk || "";
  return v.mk || "";
}

/** True when the item has its English title filled in. */
export function hasEnglish(value: unknown): boolean {
  if (!value || typeof value === "string") return Boolean(value);
  const v = value as Partial<L>;
  return Boolean(v.en && v.en.trim());
}

const months = {
  mk: ["јануари", "февруари", "март", "април", "мај", "јуни", "јули", "август", "септември", "октомври", "ноември", "декември"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const monthsShort = {
  mk: ["јан", "фев", "мар", "апр", "мај", "јун", "јул", "авг", "сеп", "окт", "ное", "дек"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

function parts(iso: string) {
  const [y, m, d] = (iso || "").slice(0, 10).split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

export function formatDate(iso: string, locale: Locale): string {
  const p = parts(iso);
  if (!p) return "";
  return locale === "mk"
    ? `${p.d} ${months.mk[p.m - 1]} ${p.y}`
    : `${months.en[p.m - 1]} ${p.d}, ${p.y}`;
}

export function dateBlock(iso: string, locale: Locale) {
  const p = parts(iso);
  if (!p) return null;
  return { day: String(p.d), month: monthsShort[locale][p.m - 1], year: String(p.y) };
}

export const ui = {
  mk: {
    nav: { home: "Почетна", about: "За нас", projects: "Проекти", news: "Вести", events: "Настани", galleries: "Галерии", documents: "Документи", involve: "Вклучи се", contact: "Контакт" },
    menu: "Мени",
    skip: "Прескокни до содржината",
    joinUs: "Стани член",
    ourProjects: "Нашите проекти",
    latestNews: "Последни вести",
    allNews: "Сите вести",
    upcomingEvents: "Претстојни настани",
    pastEvents: "Минати настани",
    allEvents: "Сите настани",
    allProjects: "Сите проекти",
    readMore: "Прочитај повеќе",
    activeProjects: "Тековни проекти",
    completedProjects: "Завршени проекти",
    active: "Тековен",
    completed: "Завршен",
    period: "Период",
    funder: "Поддржано од",
    where: "Каде",
    when: "Кога",
    register: "Пријави се",
    gallery: "Галерија",
    photos: "фотографии",
    download: "Преземи",
    team: "Тим",
    partners: "Партнери и поддржувачи",
    mission: "Мисија",
    vision: "Визија",
    history: "Нашата приказна",
    goals: "Цели",
    noNews: "Сè уште нема објавени вести.",
    noEvents: "Моментално нема закажани настани. Следете нè на социјалните мрежи за најнови информации.",
    noProjects: "Сè уште нема објавени проекти.",
    noGalleries: "Сè уште нема галерии.",
    noDocuments: "Сè уште нема објавени документи.",
    teamSoon: "Тимот наскоро ќе биде претставен тука.",
    back: "Назад",
    relatedNews: "Поврзани вести",
    contactForm: "Пишете ни",
    name: "Име и презиме",
    email: "Е-пошта",
    phone: "Телефон",
    message: "Порака",
    send: "Испрати порака",
    sending: "Се испраќа…",
    sent: "Пораката е испратена. Ќе ви одговориме наскоро.",
    errorRequired: "Пополнете ги задолжителните полиња.",
    errorEmail: "Внесете валидна е-пошта.",
    errorGeneric: "Пораката не е испратена. Обидете се повторно.",
    applyTitle: "Пријава за волонтер или член",
    applyAs: "Сакам да се вклучам како",
    volunteer: "Волонтер",
    member: "Член",
    age: "Години",
    interests: "Што те интересира? (на пр. дизајн, настани, животна средина)",
    apply: "Испрати пријава",
    applied: "Пријавата е испратена. Ќе те контактираме наскоро.",
    minorNote: "Ако имаш помалку од 18 години, за зачленување ти треба согласност од родител.",
    address: "Адреса",
    followUs: "Следете нè",
    allRights: "Сите права задржани.",
    category: "Категорија",
    year: "Година",
    documentsAll: "Сите",
    filterAll: "Сите",
    statute: "Статут",
    reports: "Извештаи",
    decisions: "Одлуки",
    other: "Друго",
    map: "Мапа",
  },
  en: {
    nav: { home: "Home", about: "About", projects: "Projects", news: "News", events: "Events", galleries: "Galleries", documents: "Documents", involve: "Get involved", contact: "Contact" },
    menu: "Menu",
    skip: "Skip to content",
    joinUs: "Become a member",
    ourProjects: "Our projects",
    latestNews: "Latest news",
    allNews: "All news",
    upcomingEvents: "Upcoming events",
    pastEvents: "Past events",
    allEvents: "All events",
    allProjects: "All projects",
    readMore: "Read more",
    activeProjects: "Current projects",
    completedProjects: "Completed projects",
    active: "Current",
    completed: "Completed",
    period: "Period",
    funder: "Supported by",
    where: "Where",
    when: "When",
    register: "Register",
    gallery: "Gallery",
    photos: "photos",
    download: "Download",
    team: "Team",
    partners: "Partners and supporters",
    mission: "Mission",
    vision: "Vision",
    history: "Our story",
    goals: "Goals",
    noNews: "No news has been published yet.",
    noEvents: "There are no scheduled events right now. Follow us on social media for the latest updates.",
    noProjects: "No projects have been published yet.",
    noGalleries: "No galleries yet.",
    noDocuments: "No documents have been published yet.",
    teamSoon: "Our team will be introduced here soon.",
    back: "Back",
    relatedNews: "Related news",
    contactForm: "Write to us",
    name: "Full name",
    email: "Email",
    phone: "Phone",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    sent: "Your message has been sent. We will reply soon.",
    errorRequired: "Fill in the required fields.",
    errorEmail: "Enter a valid email address.",
    errorGeneric: "The message was not sent. Try again.",
    applyTitle: "Apply as a volunteer or member",
    applyAs: "I want to join as a",
    volunteer: "Volunteer",
    member: "Member",
    age: "Age",
    interests: "What interests you? (e.g. design, events, environment)",
    apply: "Send application",
    applied: "Your application has been sent. We will contact you soon.",
    minorNote: "If you are under 18, you need a parent's consent to become a member.",
    address: "Address",
    followUs: "Follow us",
    allRights: "All rights reserved.",
    category: "Category",
    year: "Year",
    documentsAll: "All",
    filterAll: "All",
    statute: "Statute",
    reports: "Reports",
    decisions: "Decisions",
    other: "Other",
    map: "Map",
  },
};

export type Dict = (typeof ui)["mk"];
export function dict(locale: Locale): Dict {
  return ui[locale] as Dict;
}
