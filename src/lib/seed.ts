// Starting content. It is shown until the first save from the admin panel,
// after which everything comes from storage.
import type { CollectionKey, Item, Settings } from "./schema";

const t = "2026-11-14T12:00:00.000Z";

export const seedSettings: Settings = {
  orgName: { mk: "Здружение на млади Урбано Гнездо Кривогаштани", en: "Youth Association Urban Nest Krivogashtani" },
  orgShort: { mk: "Урбано Гнездо", en: "Urban Nest" },
  place: { mk: "Кривогаштани", en: "Krivogashtani" },
  heroTitle: {
    mk: "Гнездо за идеите на младите од Кривогаштани",
    en: "A nest for the ideas of young people in Krivogashtani",
  },
  heroText: {
    mk: "Здружение на млади што работи за граѓанско учество, младински активизам и подобар живот во општина Кривогаштани. Учиме заедно и ги претвораме идеите во акции.",
    en: "A youth association working for civic participation, youth activism and a better life in the Municipality of Krivogashtani. We learn together and turn ideas into action.",
  },
  heroImage: "",
  aboutShort: {
    mk: "Урбано Гнездо е доброволно, непрофитно и непартиско здружение на граѓани од Кривогаштани. Создаваме простор каде младите го кажуваат својот глас, учат нови вештини и учествуваат во одлуките што ја обликуваат нашата заедница.",
    en: "Urban Nest is a voluntary, non-profit and non-partisan citizens' association from Krivogashtani. We create a space where young people speak up, learn new skills and take part in the decisions that shape our community.",
  },
  mission: {
    mk: "Да ги поттикнеме младите од општина Кривогаштани активно да учествуваат во животот на заедницата преку неформално образование, волонтерство и граѓански иницијативи.",
    en: "To encourage young people in the Municipality of Krivogashtani to take an active part in community life through non-formal education, volunteering and civic initiatives.",
  },
  vision: {
    mk: "Кривогаштани како заедница во која младите остануваат, создаваат и одлучуваат.",
    en: "Krivogashtani as a community where young people stay, create and decide.",
  },
  history: {
    mk: "Урбано Гнездо е здружение на млади од Кривогаштани што сакаат да направат нешто за своето место, наместо да чекаат промените да дојдат однадвор. Штркот на нашето лого е знак на Пелагонија, а гнездото е местото кон кое секогаш се враќаме.\n\nЗдружението организира обуки, акции и настани за млади, соработува со институции и организации од земјата и странство и учествува во работата на Локалниот младински совет на Општина Кривогаштани.",
    en: "Urban Nest is an association of young people from Krivogashtani who want to do something for their hometown instead of waiting for change to come from outside. The stork in our logo is a symbol of Pelagonia, and the nest is the place we always return to.\n\nThe association organises trainings, actions and events for young people, works with institutions and organisations at home and abroad, and takes part in the Local Youth Council of the Municipality of Krivogashtani.",
  },
  goals: {
    mk: "- Унапредување на демократските процеси и доброто владеење на локално, национално и меѓународно ниво\n- Граѓанско учество и младински активизам во креирањето на политиките\n- Неформално образование за млади и граѓани со помалку можности\n- Младинско вклучување и волонтерство\n- Транспарентност и отчетност на локалната самоуправа\n- Одржлив развој, заштита на животната средина и биодиверзитетот\n- Човекови права, владеење на правото и меѓуетнички соработка\n- Европеизација на македонското општество и членство во Европската Унија",
    en: "- Strengthening democratic processes and good governance at local, national and international level\n- Civic participation and youth activism in policy making\n- Non-formal education for young people and citizens with fewer opportunities\n- Youth inclusion and volunteering\n- Transparency and accountability of local government\n- Sustainable development, protection of the environment and biodiversity\n- Human rights, rule of law and inter-ethnic cooperation\n- Europeanisation of Macedonian society and EU membership",
  },
  involveIntro: {
    mk: "Имаш идеја за Кривогаштани? Сакаш да научиш нешто ново, да организираш настан или само да бидеш дел од екипа што прави нешто корисно? Пријави се како волонтер или член, а ние ќе те контактираме.",
    en: "Do you have an idea for Krivogashtani? Want to learn something new, organise an event or simply be part of a team that does something useful? Apply as a volunteer or member and we will get in touch.",
  },
  membership: {
    mk: "- Член може да биде секој полнолетен граѓанин што доброволно ќе пристапи кон здружението.\n- Млади од 14 до 18 години се зачленуваат со согласност од родител.\n- Зачленувањето се врши со потпишување пристапница.\n- Членовите учествуваат во активностите и одлуките на здружението.",
    en: "- Any adult citizen who voluntarily joins the association can become a member.\n- Young people aged 14 to 18 can join with a parent's consent.\n- Membership starts by signing a membership form.\n- Members take part in the activities and decisions of the association.",
  },
  address: { mk: "ул. „Македонски просветители“ бр. 33, Кривогаштани", en: "33 Makedonski Prosvetiteli St., Krivogashtani" },
  email: "",
  phone: "",
  mapQuery: "Македонски Просветители 33, Кривогаштани",
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
};

export const seedCollections: Record<CollectionKey, Item[]> = {
  news: [
    {
      id: "seed-news-2",
      slug: "nova-veb-strana",
      status: "published",
      createdAt: t,
      updatedAt: t,
      title: { mk: "Урбано Гнездо доби нова веб-страна", en: "Urban Nest launches a new website" },
      date: "2026-11-14",
      category: { mk: "Соопштение", en: "Announcement" },
      cover: "",
      excerpt: {
        mk: "На едно место: вести, проекти, настани, галерии и документи на здружението, на македонски и англиски.",
        en: "Everything in one place: the association's news, projects, events, galleries and documents, in Macedonian and English.",
      },
      body: {
        mk: "Од денес сите информации за работата на Урбано Гнездо се достапни на нашата нова веб-страна.\n\nТука ќе ги објавуваме вестите и повиците за млади, проектите што ги спроведуваме, настаните што доаѓаат, фотографиите од активностите и документите на здружението.\n\nПреку страницата [Вклучи се](/mk/involve) можеш директно да се пријавиш како волонтер или член.",
        en: "From today, all information about Urban Nest's work is available on our new website.\n\nThis is where we will publish news and calls for young people, the projects we run, upcoming events, photos from our activities and the association's documents.\n\nYou can apply as a volunteer or member directly on the [Get involved](/en/involve) page.",
      },
      images: [],
      project: "",
    },
    {
      id: "seed-news-1",
      slug: "lokalen-mladinski-sovet",
      status: "published",
      createdAt: t,
      updatedAt: t,
      title: {
        mk: "Урбано Гнездо во новиот состав на Локалниот младински совет",
        en: "Urban Nest joins the new Local Youth Council",
      },
      date: "2026-11-10",
      category: { mk: "Младинско учество", en: "Youth participation" },
      cover: "",
      excerpt: {
        mk: "Здружението е дел од новиот состав на Локалниот младински совет на Општина Кривогаштани.",
        en: "The association is part of the new Local Youth Council of the Municipality of Krivogashtani.",
      },
      body: {
        mk: "Здружението на млади Урбано Гнездо е дел од новиот состав на Локалниот младински совет на Општина Кривогаштани.\n\nЛокалниот младински совет е тело преку кое младите директно ги пренесуваат своите потреби и предлози до општината. Нашата цел е гласот на младите од сите населени места во општината да биде слушнат.",
        en: "The Youth Association Urban Nest is part of the new Local Youth Council of the Municipality of Krivogashtani.\n\nThe Local Youth Council is the body through which young people bring their needs and proposals directly to the municipality. Our goal is to make sure young people from every village in the municipality are heard.",
      },
      images: [],
      project: "",
    },
  ],
  projects: [
    {
      id: "seed-project-1",
      slug: "urbano-leto-2026",
      status: "published",
      createdAt: t,
      updatedAt: t,
      title: { mk: "Урбано лето 2026", en: "Urban Summer 2026" },
      phase: "completed",
      date: "2026-07-01",
      period: { mk: "Лето 2026", en: "Summer 2026" },
      funder: { mk: "", en: "" },
      cover: "",
      summary: {
        mk: "Летна програма на Урбано Гнездо со активности за млади во Кривогаштани.",
        en: "Urban Nest's summer programme of activities for young people in Krivogashtani.",
      },
      body: {
        mk: "Урбано лето е летната програма на здружението што ги собира младите од Кривогаштани околу дружење, учење и активности на отворено.\n\nТука додадете опис на активностите, бројот на учесници, партнерите и резултатите.",
        en: "Urban Summer is the association's summer programme that brings young people in Krivogashtani together for socialising, learning and outdoor activities.\n\nAdd a description of the activities, number of participants, partners and results here.",
      },
      images: [],
    },
  ],
  events: [
    {
      id: "seed-event-1",
      slug: "sredba-za-novi-chlenovi",
      status: "published",
      createdAt: t,
      updatedAt: t,
      title: { mk: "Отворена средба за нови членови", en: "Open meeting for new members" },
      date: "2026-12-05",
      time: "18:00",
      location: { mk: "Просториите на здружението, Кривогаштани", en: "Association premises, Krivogashtani" },
      cover: "",
      summary: {
        mk: "Дојди да се запознаеме, да ти кажеме што правиме и да ги слушнеме твоите идеи.",
        en: "Come meet us, hear what we do and share your ideas.",
      },
      body: {
        mk: "Средбата е отворена за сите млади од општина Кривогаштани. Не е потребно претходно искуство.",
        en: "The meeting is open to all young people from the Municipality of Krivogashtani. No previous experience needed.",
      },
      link: "",
    },
  ],
  galleries: [],
  documents: [
    {
      id: "seed-doc-1",
      status: "published",
      slug: "statut",
      createdAt: t,
      updatedAt: t,
      title: { mk: "Статут на здружението", en: "Statute of the association (in Macedonian)" },
      category: "statute",
      date: "2025-02-24",
      file: "/docs/statut-urbano-gnezdo.pdf",
      description: { mk: "Донесен на седница одржана на 24.02.2025 година.", en: "Adopted at the session held on 24 February 2025." },
    },
  ],
  team: [],
  partners: [],
  stats: [
    { id: "seed-stat-1", createdAt: t, updatedAt: t, order: 1, value: "14+", label: { mk: "години за зачленување", en: "minimum age to join" } },
    { id: "seed-stat-2", createdAt: t, updatedAt: t, order: 2, value: "12", label: { mk: "населени места во општината", en: "villages in the municipality" } },
    { id: "seed-stat-3", createdAt: t, updatedAt: t, order: 3, value: "17", label: { mk: "цели за одржлив развој во нашиот статут", en: "sustainable development goals in our statute" } },
  ],
};
