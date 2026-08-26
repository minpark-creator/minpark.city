import type {
  AboutPage,
  JournalEntry,
  Film,
  Project,
  Publication,
  SiteSettings,
} from "./queries";

export const fallbackSettings: SiteSettings = {
  intro:
    "min park is an urban policy researcher working on housing, land governance, and climate adaptation.\n\n* across scales, from detail to system.\n* rooted in inclusivity and climate resilience.\n* output: masterplans, exhibitions, reports, workshops, talks.",
  logos: [
    {
      _key: "l1",
      name: "C40 Cities",
      height: 46,
      image: { url: null },
      timelineGroup: "greenbelts",
      years: "2024\u20132026",
      description:
        "Research post with the Urban Frontiers Foundation, working alongside Nicky Gavron, former Deputy Mayor of London, who laid the political groundwork for C40 Cities and founded the foundation. Co-authored Green Belts 2.0, a 50-page open-access report published on the C40 Knowledge Hub: seven deep-dive cases and five shorter comparisons across twelve cities, sixteen stakeholder interviews, and twenty-odd maps and governance diagrams.",
    },
    {
      _key: "l2",
      name: "Urban Frontiers Foundation",
      height: 46,
      image: { url: null },
      timelineGroup: "greenbelts",
      years: "2024\u20132026",
      description: "",
    },
    {
      _key: "l3",
      name: "UCL",
      height: 44,
      image: { url: null },
      years: "2025\u20132026",
      description:
        "Funded MPLAN Mag, the independent planning publication founded out of the Bartlett. The grant carried Issue 01 from commissioning through to the launch, and Issue 02 into production.",
    },
    {
      _key: "l4",
      name: "Holcim Foundation",
      height: 54,
      image: { url: null },
      years: "2025",
      description:
        "Fellowship, not a commission: one of fifteen selected internationally to work on adaptive reuse, regeneration, and policy-led incentives for low-carbon urban transformation. Brussels.",
    },
    {
      _key: "l5",
      name: "MOLIT",
      height: 44,
      image: { url: null },
      years: "2025",
      description:
        "Invited to brief the Ministry of Land, Infrastructure and Transport in London on UK growth management, planning reform, and their institutional implications. Also a 1st-place MOLIT award in 2021 for a national seismic structural design contest.",
    },
    {
      _key: "l6",
      name: "LH",
      height: 44,
      image: { url: null },
      years: "2025",
      description:
        "Briefed Korea Land and Housing Corporation alongside MOLIT on UK planning reform.",
    },
    {
      _key: "l7",
      name: "KRIHS",
      height: 44,
      image: { url: null },
      years: "2026",
      description:
        "Invited lecture at the Korea Research Institute for Human Settlements on green belt governance and climate adaptation.",
    },
  ],
  logosNote: "Professional Collaborations",
  footerName: "Min Park",
  location: "London, UK",
  origin: "From Seoul, South Korea",
  availability: "Could be anywhere",
  contactNote: "Email reaches me fastest.",
  phone: "+44 7587 455050",
  cvUrl: null,
  contactEmail: "contact.minpark@gmail.com",
  socialLinks: [
    { _key: "s1", label: "linkedin", url: "https://www.linkedin.com/in/minpark-urban-strategy" },
    { _key: "s2", label: "instagram", url: "https://www.instagram.com/iamminggoo/" },
  ],
};

export const fallbackAbout: AboutPage = {
  headline: "Info",
  education: [
    {
      years: "2023\u20132025",
      institution: "University College London",
      degree: "Master of City Planning (MPlan)",
      focus:
        "Distinction. RTPI-accredited. Dissertation: Defining and Measuring Socio-Ecological Publicness in the Privatised City. Working towards MRTPI.",
    },
    {
      years: "2018\u20132023",
      institution: "Yonsei University",
      degree: "Bachelor of Architecture (BArch)",
      focus:
        "Five-year professional programme. Exchange at the National University of Singapore, 2022.",
    },
  ],
  bio: [],
  portrait: null,
  bioText:
    "Min Park is an urban policy researcher working at the intersection of policy, research, and design. Her work translates slow, complicated urban questions such as green belts, peripheral corridors and regeneration sites into frameworks that hold up over decades.\n\nRecent work includes Green Belts 2.0 with C40 Cities, masterplans in the UK and the Middle East at Buro Happold, and academic research at UCL on privately owned public spaces. She is also design lead and co-founder of MPLAN Mag, an independent magazine on planning and strategy.\n\nShe holds an MSc City Planning from UCL and a BArch from Yonsei University. Based in London.",
  contactIntro:
    "Write to me about projects you can't quite frame yet. About cities that need a longer horizon than the next election cycle. About the planning question you've been carrying around but haven't found a place to put down.\n\nI'm always open to new commissions, partnerships, lectures, and conversations, and especially to the briefs that are still being written. The fastest way through is email.",
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
        { year: "", text: "Strategic planning" },
        { year: "", text: "Visioning & spatial narratives" },
        { year: "", text: "Policy research" },
        { year: "", text: "Masterplanning" },
        { year: "", text: "Public speaking & lectures" },
      ],
    },
    {
      title: "Selected Clients",
      items: [
        { year: "2026", text: "C40 Cities: Green Belts 2.0 Policy Report" },
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
      "Working on Green Belts 2.0 with C40 pushed me to question the preservation-versus-development framing that still dominates most policy conversations. Green belts perform best when they're understood as multifunctional landscapes carrying ecosystem services, flood management, and cultural use all at once.\n\nThe hardest part of the report wasn't making the case for this view. It was finding governance and financing structures that could actually sustain it.",
  },
  {
    _id: "j2",
    title: "Field notes: Stratford revisited",
    date: "2025-11-02",
    excerpt: "On severance, and the limits of connectivity.",
    bodyText:
      "Walked Stratford again this month. The 2023 masterplan strategy still holds up in my view: the five anchor destinations are well-served by transit but remain poorly linked to each other on foot. The triangular sites formed by the rail lines are still the most promising opportunity to stitch the district together.\n\nWhat's changed is the pace of new residential on the edges, which is making the severance worse, not better.",
  },
];

export const fallbackPublications: Publication[] = [
  {
    _id: "pub-green-belts",
    title: "Green Belts 2.0: Working Harder for Climate, Cities and Communities",
    kind: "Report",
    year: "2026",
    date: "2026-01-31",
    venue: "C40 Cities Knowledge Hub",
    authors: "Co-author with Georgia Cameron \u00b7 open access, 50 pages",
    abstract:
      "A twelve-city comparative study of green belt governance: seven deep-dive cases and five shorter comparisons, sixteen stakeholder interviews, and twenty-odd maps and governance diagrams. Tests how green belt policy performs against climate resilience, biodiversity, and air quality objectives, and where governance frameworks hold it back.",
    links: [
      {
        label: "full report",
        url: "https://www.c40knowledgehub.org/s/article/Green-belts-2-0-Working-harder-for-climate-cities-and-communities",
      },
    ],
  },
  {
    _id: "pub-thesis",
    title:
      "Defining and Measuring Socio-Ecological Publicness in the Privatised City",
    kind: "Thesis",
    year: "2025",
    date: "2025-06-30",
    venue: "University College London",
    authors: "MPlan dissertation \u00b7 Distinction \u00b7 under preparation for journal submission",
    abstract:
      "Treats publicness as a socio-ecological condition rather than a legal or spatial category, and builds a quantitative framework to measure it. Tested against privately owned public spaces in high-density CBDs in London and Seoul, combining governance document analysis, site-level spatial survey, and environmental performance data across two regulatory regimes. Identifies a social-ecological inversion in Canary Wharf and a regulatory ceiling in Yeouido.",
    links: [],
  },
  {
    _id: "pub-camden-highline",
    title:
      "Camden Highline: Comparative Appraisal of Access, Cost and Public Benefit",
    kind: "Report",
    year: "2024",
    date: "2024-08-31",
    venue: "Just Space community research collection",
    authors: "Co-authored \u00b7 20 pages",
    abstract:
      "A three-way appraisal of the Camden Highline proposal against the Regent's Canal towpath as existing infrastructure and the New York High Line as a delivered precedent. Found the public benefit case resting on unverified assumptions, and set out the displacement risk for a route running directly alongside Camden housing.",
    links: [],
  },
  {
    _id: "pub-startup-city",
    title: "Can You Build a City like a Startup?",
    kind: "Article",
    year: "2026",
    date: "2026-03-31",
    venue: "MPLAN Magazine, Issue 01",
    authors: "Sole author",
    abstract:
      "On what happens when the logic of the startup, with its speed, iteration and product-market fit, is applied to building cities, and where it breaks down.",
    links: [{ label: "the magazine", url: "https://mplanmag.com/" }],
  },
  {
    _id: "pub-mplan-mag",
    title: "MPLAN Magazine, Issue 01",
    kind: "Article",
    year: "2026",
    date: "2026-03-01",
    venue: "MPlan Mag",
    authors: "Co-founder and editorial lead \u00b7 commissioned and edited the issue",
    abstract:
      "An independent urban planning publication founded out of the Bartlett, covering planning theory, policy debate, and urban futures. Issue 01 launched at Omved Gardens to an audience of 100+; Issue 02 is in production.",
    links: [{ label: "the magazine", url: "https://mplanmag.com/" }],
  },
];

export const fallbackFilms: Film[] = [
  {
    _id: "f1",
    title: "Riyadh Ring, site walk",
    date: "2026-02-14",
    location: "Riyadh",
    caption: "Ring corridor, morning light.",
    videoUrl: undefined,
    videoFileUrl: null,
    poster: { url: null },
  },
  {
    _id: "f2",
    title: "Stratford, severance",
    date: "2025-10-08",
    location: "London",
    caption: "Walking the rail edges.",
    videoUrl: undefined,
    videoFileUrl: null,
    poster: { url: null },
  },
  {
    _id: "f3",
    title: "Holcim workshop, day two",
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
      "The report examines green belts as strategically planned open spaces on the urban fringe that function as critical infrastructure for urban problem-solving. Originally developed in London by Nicky Gavron, the initiative proposes moving beyond simple preservation-versus-development debates toward viewing these spaces as multifunctional landscapes.\n\nKey benefits highlighted include climate resilience support, biodiversity enhancement, improved public well-being, and sustainable urban expansion. The report emphasizes that green belts can deliver multiple environmental and social benefits when supported by effective planning, governance, and financing strategies.\n\nThe approach advocates reconceiving green belts as dynamic infrastructure rather than passive reserves. This perspective integrates ecosystem services, including flood management, temperature regulation, species protection, and agricultural production, into comprehensive urban planning and climate adaptation frameworks.",
    track: "research",
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
    track: "planning",
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
    track: "editorial",
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
    track: "research",
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
    track: "research",
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
      "The project addresses urban fragmentation at Stratford despite its strong transport connections. Elevated rail infrastructure and waterways create significant urban severance, limiting pedestrian permeability across the district.\n\nFive key destinations anchor the area: Queen Elizabeth Olympic Park, London Stadium, Stratford Station, Westfield, and Stratford High Street, yet they remain inadequately linked. Rather than expanding outward, the strategy strengthens connections between these existing hubs.\n\nThe approach repurposes three triangular sites formed by railway lines as new urban nodes. Through sectional design and environmental modelling, the proposal integrates pedestrian routes, public spaces, and development plots across multiple levels.\n\nThe result shifts Stratford's character from a transit-accessible zone to a walkable, interconnected district with improved pedestrian flow across previously fragmented areas.",
    isSelected: true,
  },
];

export const fallbackProjects: Project[] = raw.map((p, i) => ({
  ...p,
  _id: `fallback-${i}`,
  images: [],
}));
