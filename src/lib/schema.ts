// Content model shared by the public site and the admin panel.
// To add a field, add it here: the admin form and storage pick it up automatically.

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "images"
  | "file"
  | "date"
  | "number"
  | "url"
  | "email"
  | "select";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  i18n?: boolean;
  required?: boolean;
  help?: string;
  options?: { value: string; label: string }[];
  group?: string;
}

export type CollectionKey =
  | "news"
  | "projects"
  | "events"
  | "galleries"
  | "documents"
  | "team"
  | "partners"
  | "stats";

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  singular: string;
  /** Items get a URL slug and a draft/published status */
  publishable: boolean;
  /** How the admin list and the site sort items */
  sort: "date" | "order";
  fields: Field[];
  /** Field shown as the title in admin lists */
  titleField: string;
  description: string;
}

export type Item = {
  id: string;
  slug?: string;
  status?: "published" | "draft";
  order?: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

const orderField: Field = {
  name: "order",
  label: "Редослед",
  type: "number",
  help: "Помал број се прикажува прв.",
};

export const collections: Record<CollectionKey, CollectionDef> = {
  news: {
    key: "news",
    label: "Вести",
    singular: "вест",
    publishable: true,
    sort: "date",
    titleField: "title",
    description: "Новости, соопштенија и извештаи од активности.",
    fields: [
      { name: "title", label: "Наслов", type: "text", i18n: true, required: true },
      { name: "date", label: "Датум", type: "date", required: true },
      { name: "category", label: "Категорија", type: "text", i18n: true, help: "На пр. Соопштение, Активност, Повик" },
      { name: "cover", label: "Насловна слика", type: "image" },
      { name: "excerpt", label: "Краток опис", type: "textarea", i18n: true, help: "Една до две реченици. Се прикажува во листата на вести." },
      { name: "body", label: "Текст", type: "markdown", i18n: true },
      { name: "images", label: "Дополнителни слики", type: "images" },
      { name: "project", label: "Поврзан проект", type: "select", help: "Веста ќе се прикаже и на страницата на проектот." },
    ],
  },
  projects: {
    key: "projects",
    label: "Проекти",
    singular: "проект",
    publishable: true,
    sort: "date",
    titleField: "title",
    description: "Тековни и завршени проекти на здружението.",
    fields: [
      { name: "title", label: "Име на проектот", type: "text", i18n: true, required: true },
      {
        name: "phase",
        label: "Состојба",
        type: "select",
        options: [
          { value: "active", label: "Тековен" },
          { value: "completed", label: "Завршен" },
        ],
      },
      { name: "date", label: "Датум на почеток", type: "date", required: true, help: "Се користи за подредување." },
      { name: "period", label: "Период (текст)", type: "text", i18n: true, help: "На пр. Јули – Август 2026" },
      { name: "funder", label: "Финансиер / поддржувач", type: "text", i18n: true },
      { name: "cover", label: "Насловна слика", type: "image" },
      { name: "summary", label: "Краток опис", type: "textarea", i18n: true },
      { name: "body", label: "Опис на проектот", type: "markdown", i18n: true },
      { name: "images", label: "Галерија", type: "images" },
    ],
  },
  events: {
    key: "events",
    label: "Настани",
    singular: "настан",
    publishable: true,
    sort: "date",
    titleField: "title",
    description: "Работилници, средби и акции со датум и место.",
    fields: [
      { name: "title", label: "Наслов", type: "text", i18n: true, required: true },
      { name: "date", label: "Датум", type: "date", required: true },
      { name: "time", label: "Време", type: "text", help: "На пр. 18:00" },
      { name: "location", label: "Место", type: "text", i18n: true },
      { name: "cover", label: "Слика", type: "image" },
      { name: "summary", label: "Краток опис", type: "textarea", i18n: true },
      { name: "body", label: "Детали", type: "markdown", i18n: true },
      { name: "link", label: "Линк за пријава", type: "url", help: "На пр. Google Form. Ако е празно, копчето не се прикажува." },
    ],
  },
  galleries: {
    key: "galleries",
    label: "Галерии",
    singular: "галерија",
    publishable: true,
    sort: "date",
    titleField: "title",
    description: "Фото-албуми од активности и настани.",
    fields: [
      { name: "title", label: "Наслов на албумот", type: "text", i18n: true, required: true },
      { name: "date", label: "Датум", type: "date", required: true },
      { name: "description", label: "Опис", type: "textarea", i18n: true },
      { name: "images", label: "Фотографии", type: "images", required: true, help: "Првата фотографија е насловна." },
    ],
  },
  documents: {
    key: "documents",
    label: "Документи",
    singular: "документ",
    publishable: true,
    sort: "date",
    titleField: "title",
    description: "Статут, извештаи, одлуки и други документи за преземање.",
    fields: [
      { name: "title", label: "Наслов", type: "text", i18n: true, required: true },
      {
        name: "category",
        label: "Категорија",
        type: "select",
        options: [
          { value: "statute", label: "Статут" },
          { value: "reports", label: "Извештаи" },
          { value: "decisions", label: "Одлуки" },
          { value: "other", label: "Друго" },
        ],
      },
      { name: "date", label: "Датум", type: "date", required: true },
      { name: "file", label: "Датотека (PDF, Word, Excel)", type: "file", required: true },
      { name: "description", label: "Опис", type: "textarea", i18n: true },
    ],
  },
  team: {
    key: "team",
    label: "Тим",
    singular: "член на тимот",
    publishable: false,
    sort: "order",
    titleField: "name",
    description: "Луѓето зад здружението. Се прикажуваат на страницата „За нас“.",
    fields: [
      { name: "name", label: "Име и презиме", type: "text", i18n: true, required: true, help: "На англиски внесете го името на латиница." },
      { name: "role", label: "Улога", type: "text", i18n: true, help: "На пр. Претседател, Член на Извршен одбор" },
      { name: "photo", label: "Фотографија", type: "image" },
      orderField,
    ],
  },
  partners: {
    key: "partners",
    label: "Партнери",
    singular: "партнер",
    publishable: false,
    sort: "order",
    titleField: "name",
    description: "Логоа на партнери и донатори на почетната и „За нас“.",
    fields: [
      { name: "name", label: "Име", type: "text", i18n: true, required: true },
      { name: "logo", label: "Лого", type: "image" },
      { name: "url", label: "Веб-страна", type: "url" },
      orderField,
    ],
  },
  stats: {
    key: "stats",
    label: "Бројки",
    singular: "бројка",
    publishable: false,
    sort: "order",
    titleField: "label",
    description: "Бројките на почетната страница. Избришете ги сите за да се скрие делот.",
    fields: [
      { name: "value", label: "Вредност", type: "text", required: true, help: "На пр. 120 или 14+" },
      { name: "label", label: "Опис", type: "text", i18n: true, required: true },
      orderField,
    ],
  },
};

export const collectionOrder: CollectionKey[] = [
  "news",
  "projects",
  "events",
  "galleries",
  "documents",
  "team",
  "partners",
  "stats",
];

export function isCollectionKey(v: string): v is CollectionKey {
  return v in collections;
}

export const settingsFields: Field[] = [
  { group: "Име", name: "orgName", label: "Полно име на здружението", type: "text", i18n: true },
  { group: "Име", name: "orgShort", label: "Кратко име", type: "text", i18n: true },
  { group: "Име", name: "place", label: "Место", type: "text", i18n: true },

  { group: "Почетна", name: "heroTitle", label: "Главен наслов", type: "text", i18n: true },
  { group: "Почетна", name: "heroText", label: "Текст под насловот", type: "textarea", i18n: true },
  { group: "Почетна", name: "heroImage", label: "Насловна фотографија", type: "image", help: "Се прикажува во форма на крошна. Најдобро: фотографија од активност со млади." },

  { group: "За нас", name: "aboutShort", label: "Кратко „Кои сме“", type: "textarea", i18n: true, help: "Се прикажува на почетната." },
  { group: "За нас", name: "mission", label: "Мисија", type: "textarea", i18n: true },
  { group: "За нас", name: "vision", label: "Визија", type: "textarea", i18n: true },
  { group: "За нас", name: "history", label: "Нашата приказна", type: "markdown", i18n: true },
  { group: "За нас", name: "goals", label: "Цели", type: "markdown", i18n: true, help: "Листа со цртички (- ) за секоја цел." },

  { group: "Вклучи се", name: "involveIntro", label: "Вовед", type: "markdown", i18n: true },
  { group: "Вклучи се", name: "membership", label: "Како се станува член", type: "markdown", i18n: true },

  { group: "Контакт", name: "address", label: "Адреса", type: "text", i18n: true },
  { group: "Контакт", name: "email", label: "Е-пошта", type: "email" },
  { group: "Контакт", name: "phone", label: "Телефон", type: "text" },
  { group: "Контакт", name: "mapQuery", label: "Локација за мапата", type: "text", help: "Адреса како што би ја пребарале на Google Maps." },
  { group: "Контакт", name: "facebook", label: "Facebook", type: "url" },
  { group: "Контакт", name: "instagram", label: "Instagram", type: "url" },
  { group: "Контакт", name: "youtube", label: "YouTube", type: "url" },
  { group: "Контакт", name: "tiktok", label: "TikTok", type: "url" },
];

export type Settings = Record<string, unknown>;
