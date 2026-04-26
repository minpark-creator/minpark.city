import type {
  AboutPage,
  JournalEntry,
  Film,
  Project,
  SiteSettings,
} from "./queries";

export const fallbackSettings: SiteSettings = {
  title: "minpark.",
  words: ["city", "strategy", "research", "planning"],
  intro:
    "Urban strategy for cities that take the long view.",
  logos: [
    { _key: "l1", name: "C40 Cities", height: 46, image: { url: null } },
    { _key: "l2", name: "Holcim Foundation", height: 54, image: { url: null } },
    { _key: "l3", name: "MPlan Mag", height: 40, image: { url: null } },
    { _key: "l4", name: "Europe-Korea Conference", height: 50, image: { url: null } },
  ],
  heroVideoUrl: undefined,
  heroVideoFileUrl: null,
  heroPoster: null,
};

export const fallbackAbout: AboutPage = {
  headline: "Info",
  bio: [],
  portrait: null,
  bioText:
    "Min Park is an urban strategist and planner working between planning, research, and spatial vision. His practice translates slow, complicated urban questions into frameworks that hold up over decades — policy reports, masterplans, and long-range strategies.\n\nRecent work includes Green Belts 2.0 with C40 Cities, the Riyadh Ring masterplan, the Holcim Foundation Fellowship, and the Stratford Islands masterplan. He is also the editor of MPlan Mag, an independent magazine on planning and strategy that began as a set of conversations he wanted to keep having.\n\nHe is drawn to projects where the brief is still being written, to clients who treat planning as more than approvals, and to cities that are willing to take the long view. Based between Seoul and London.",
  contactIntro:
    "Write to me about projects you can't quite frame yet. About cities that need a longer horizon than the next election cycle. About the planning question you've been carrying around but haven't found a place to put down.\n\nI'm always open to new commissions, partnerships, lectures, and conversations — and especially to the briefs that are still being written. The fastest way through is email.",
  email: "contact.minpark@gmail.com",
  location: "",
  links: [
    { label: "Instagram", url: "https://www.instagram.com/iamminggoo/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/minpark-urban-strategy" },
    { label: "Threads", url: "https://www.threads.com/@iamminggoo" },
  ],
  sections: [
    {
      title: "Expertise",
      items: [
        { year: "—", text: "Strategic planning" },
        { year: "—", text: "Visioning & spatial narratives" },
        { year: "—", text: "Policy research" },
        { year: "—", text: "Masterplanning" },
        { year: "—", text: "Public speaking & lectures" },
      ],
    },
    {
      title: "Selected Clients",
      items: [
        { year: "2026", text: "C40 Cities — Green Belts 2.0 Policy Report" },
        { year: "2026", text: "The Riyadh Ring Masterplan" },
        { year: "2026", text: "MPlan Mag" },
        { year: "2025", text: "Holcim Foundation Fellowship Workshop" },
        { year: "2025", text: "Europe-Korea Conference" },
      ],
    },
  ],
};

export const fallbackJournal: JournalEntry[] = [
  {
    _id: "j1",
    title: "Notes from the Green Belts report",
    date: "2026-03-17",
    excerpt: "Rethinking urban fringes as dynamic infrastructure.",
    bodyText:
      "Working on Green Belts 2.0 with C40 pushed me to question the preservation-versus-development framing that still dominates most policy conversations. Green belts perform best when they're understood as multifunctional landscapes — carrying ecosystem services, flood management, and cultural use all at once.\n\nThe hardest part of the report wasn't making the case for this view. It was finding governance and financing structures that could actually sustain it.",
  },
  {
    _id: "j2",
    title: "Field notes: Stratford revisited",
    date: "2025-11-02",
    excerpt: "On severance, and the limits of connectivity.",
    bodyText:
      "Walked Stratford again this month. The 2023 masterplan strategy still holds up in my view: the five anchor destinations are well-served by transit but remain poorly linked to each other on foot. The triangular sites formed by the rail lines are still the most promising opportunity to stitch the district together.\n\nWhat's changed is the pace of new residential on the edges — it's making the severance worse, not better.",
  },
];

export const fallbackFilms: Film[] = [
  {
    _id: "f1",
    title: "Riyadh Ring — site walk",
    date: "2026-02-14",
    location: "Riyadh",
    caption: "Ring corridor, morning light.",
    videoUrl: undefined,
    videoFileUrl: null,
    poster: { url: null },
  },
  {
    _id: "f2",
    title: "Stratford — severance",
    date: "2025-10-08",
    location: "London",
    caption: "Walking the rail edges.",
    videoUrl: undefined,
    videoFileUrl: null,
    poster: { url: null },
  },
  {
    _id: "f3",
    title: "Holcim workshop — day two",
    date: "2025-06-21",
    location: "Zurich",
    caption: "Working session.",
    videoUrl: undefined,
    videoFileUrl: null,
    poster: { url: null },
  },
];

const raw: Omit<Project, "_id" | "images">[] = [
  {
    title: "Green Belts 2.0 Policy Report",
    slug: "greenbelts2.0",
    year: "2026",
    date: "2026-03-17",
    client: "C40 Cities",
    location: "London",
    role: "Lead researcher",
    summary:
      "A policy report reframing urban green belts as multifunctional infrastructure for climate resilience, biodiversity, and sustainable expansion.",
    body:
      "The report examines green belts as strategically planned open spaces on the urban fringe that function as critical infrastructure for urban problem-solving. Originally developed in London by Nicky Gavron, the initiative proposes moving beyond simple preservation-versus-development debates toward viewing these spaces as multifunctional landscapes.\n\nKey benefits highlighted include climate resilience support, biodiversity enhancement, improved public well-being, and sustainable urban expansion. The report emphasizes that green belts can deliver multiple environmental and social benefits when supported by effective planning, governance, and financing strategies.\n\nThe approach advocates reconceiving green belts as dynamic infrastructure rather than passive reserves. This perspective integrates ecosystem services — including flood management, temperature regulation, species protection, and agricultural production — into comprehensive urban planning and climate adaptation frameworks.",
    isSelected: true,
  },
  {
    title: "The Riyadh Ring Masterplan",
    slug: "riyadhmasterplan",
    year: "2026",
    date: "2026-01-20",
    client: "Confidential",
    location: "Riyadh",
    role: "Urban strategist",
    summary:
      "A masterplan for a new ring corridor around Riyadh, integrating mobility, ecology, and long-term development phasing.",
    body:
      "The Riyadh Ring Masterplan proposes a framework for growth along a new peripheral corridor, balancing mobility, ecological infrastructure, and phased development. The plan uses spatial strategy to align short-term delivery with a long-term urban vision.",
    isSelected: true,
  },
  {
    title: "The MPlan Mag Magazine",
    slug: "mplanmag",
    year: "2026",
    date: "2026-01-05",
    client: "Self-initiated",
    location: "Seoul / London",
    role: "Editor",
    summary:
      "An independent magazine on planning, urban research, and spatial strategy.",
    body:
      "MPlan Mag is a self-initiated magazine gathering essays, interviews, and visual research on the practice of urban planning and strategy. It collects voices from across the discipline and publishes them in a format closer to a reader than a report.",
    isSelected: true,
  },
  {
    title: "Holcim Foundation Fellowship Workshop",
    slug: "holcimfoundationfellowship",
    year: "2025",
    date: "2025-06-21",
    client: "Holcim Foundation",
    location: "Zurich",
    role: "Fellow",
    summary:
      "A research and design workshop as part of the Holcim Foundation Fellowship.",
    body:
      "The fellowship workshop brought together practitioners from across disciplines to examine sustainable construction and urban strategies through a combination of site visits, seminars, and design exercises.",
    isSelected: true,
  },
  {
    title: "Europe-Korea Conference",
    slug: "ekc2025",
    year: "2025",
    date: "2025-08-14",
    client: "EKC 2025",
    location: "Europe / Korea",
    role: "Speaker",
    summary:
      "Presentation and discussion on urban strategy and planning at the Europe-Korea Conference.",
    body:
      "Presented research on urban strategy at the Europe-Korea Conference, contributing to discussions on planning practice and cross-regional exchange between European and Korean cities.",
    isSelected: true,
  },
  {
    title: "Stratford Islands Masterplan",
    slug: "stratfordmasterplan",
    year: "2023",
    date: "2023-06-01",
    client: "Academic work",
    location: "London (Stratford)",
    role: "Urban designer",
    summary:
      "A masterplan that stitches Stratford's fragmented destinations into a walkable, interconnected district.",
    body:
      "The project addresses urban fragmentation at Stratford despite its strong transport connections. Elevated rail infrastructure and waterways create significant urban severance, limiting pedestrian permeability across the district.\n\nFive key destinations anchor the area — Queen Elizabeth Olympic Park, London Stadium, Stratford Station, Westfield, and Stratford High Street — yet remain inadequately linked. Rather than expanding outward, the strategy strengthens connections between these existing hubs.\n\nThe approach repurposes three triangular sites formed by railway lines as new urban nodes. Through sectional design and environmental modelling, the proposal integrates pedestrian routes, public spaces, and development plots across multiple levels.\n\nThe result shifts Stratford's character from a transit-accessible zone to a walkable, interconnected district with improved pedestrian flow across previously fragmented areas.",
    isSelected: true,
  },
];

export const fallbackProjects: Project[] = raw.map((p, i) => ({
  ...p,
  _id: `fallback-${i}`,
  images: [],
}));
