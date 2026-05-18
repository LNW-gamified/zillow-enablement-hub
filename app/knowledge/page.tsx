'use client';

import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'Product Knowledge' | 'Objection Handlers' | 'Talk Tracks';
type Tab = 'All' | Category;

type Article = {
  id: number;
  category: Category;
  title: string;
  preview: string;
  full: string;
};

// ─── Content ──────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  {
    id: 1,
    category: 'Product Knowledge',
    title: 'How Zillow Pro Unifies the Agent Experience',
    preview:
      'Zillow Pro brings Follow Up Boss, My Agent, and Premium Agent Profiles into a single suite — giving agents one place to manage their sphere, their brand, and their pipeline.',
    full:
      "Before Zillow Pro, agents using Follow Up Boss, My Agent, and Agent Profiles were managing three disconnected tools with no shared data layer. Zillow Pro changes that by treating these three products as components of a single system. Follow Up Boss becomes the operational center — enriched with real-time consumer data from Zillow. My Agent becomes the relationship layer — extended beyond Zillow leads to the agent's entire Follow Up Boss contact sphere. Premium Agent Profiles become the brand layer — with media, recent sales, and expertise highlights that follow every connected contact across Zillow. The business case for unification is straightforward: agents who can see what their contacts are doing on Zillow in real time, inside the CRM they already use, are in a structurally better position to respond before competitors do.",
  },
  {
    id: 2,
    category: 'Product Knowledge',
    title: 'Real-Time Consumer Insights Inside Follow Up Boss',
    preview:
      "When a contact saved to a Zillow Pro agent's sphere views a listing, saves a search, or re-engages on Zillow, the agent sees it — directly inside Follow Up Boss, in real time.",
    full:
      "The core data integration in Zillow Pro connects Zillow's consumer activity signals to agent contacts in Follow Up Boss. When a contact who has been invited into a My Agent relationship takes action on Zillow — viewing listings, saving properties, adjusting a search — that activity appears in the agent's Follow Up Boss feed as a Smart Summary or triggers a Smart Message alert. This means agents no longer need to wonder whether a past client is back in the market: the signal arrives automatically, in the tool agents already work from, without requiring any action from the contact. The implications for past client engagement are significant — agents are alerted the moment a dormant contact shows buying signals, closing the window in which that contact might reach out to a competitor first.",
  },
  {
    id: 3,
    category: 'Product Knowledge',
    title: 'How the Expanded My Agent Works',
    preview:
      "The expanded My Agent lets agents invite any Follow Up Boss contact — not just Zillow leads — into a branded relationship on Zillow. Once connected, the agent's profile follows that contact everywhere they search.",
    full:
      "The original My Agent feature was limited to contacts who came through Zillow's lead products. With Zillow Pro, agents can invite any contact from their Follow Up Boss database — past clients, sphere relationships, referral contacts — into a My Agent connection. Once a contact accepts the invitation, the agent's branding appears across the Zillow search experience for that contact: on listing pages, in saved searches, and in the search results feed. Zillow Pro also enables real-time activity alerts for all connected contacts, not just those on active searches. The practical result is that an agent's branded presence on Zillow is no longer limited to new Zillow leads — it extends to the full sphere of relationships the agent has built over their career. The connection period is active as long as both parties maintain the relationship in Follow Up Boss.",
  },
  {
    id: 4,
    category: 'Product Knowledge',
    title: 'Smart Messages and Smart Summaries Explained',
    preview:
      'Smart Messages alert agents when a connected contact re-engages on Zillow. Smart Summaries give agents instant context on what that contact has been doing — before they pick up the phone.',
    full:
      "Smart Messages are AI-generated alerts triggered when a contact in a My Agent relationship takes a meaningful action on Zillow — saving a listing, running a new search, or returning to the platform after inactivity. These messages are sent to the agent inside Follow Up Boss and are designed to prompt timely outreach while the contact's intent is high. Smart Summaries accompany those alerts with a snapshot of the contact's recent Zillow activity: listings viewed, price ranges searched, areas of interest, and how their activity has changed over time. Together, Smart Messages and Smart Summaries eliminate the research step that typically slows agent follow-up — agents know exactly what their contact has been doing before making contact. Zillow data shows that Smart Messages have been shown to double agent response rates compared to unprompted outreach.",
  },
  {
    id: 5,
    category: 'Objection Handlers',
    title: "I already use Follow Up Boss — this feels redundant",
    preview:
      "The FUB they already have routes leads and manages contacts. Zillow Pro does something FUB can't do alone: it tells agents what those contacts are doing on Zillow right now.",
    full:
      "Acknowledge the objection directly: if an agent is already proficient in Follow Up Boss, Zillow Pro isn't replacing their workflow — it's enriching the data flowing into it. The Follow Up Boss they already use can track tasks, calls, and emails. What it cannot do on its own is surface when a past client saved three listings last Tuesday at 11pm, or that a sphere contact just started searching in a new zip code. That's the layer Zillow Pro adds. Reframe the conversation around the blind spot problem: Follow Up Boss is excellent at managing known intent. Zillow Pro surfaces hidden intent — the moment a past client starts searching again before they've told anyone. Ask the partner: how many of their agents' past clients are currently searching on Zillow right now without the agent knowing? That question usually lands. Zillow Pro answers it.",
  },
  {
    id: 6,
    category: 'Objection Handlers',
    title: "My agents are good at staying in touch — we don't need alerts",
    preview:
      "The objection isn't about staying in touch — it's about who gets the conversation first when a past client re-enters the market. Staying in touch doesn't help if the contact searches on Zillow before they call.",
    full:
      "This objection is about process confidence, not product understanding. Validate it: agents who stay in touch consistently are better positioned than those who don't. Then introduce the gap: staying in touch is a scheduled, proactive behavior. Zillow Pro alerts are reactive and signal-based — they fire when a contact shows intent, not just when it's time to check in. A monthly touchpoint with a past client doesn't catch them at the moment they save a listing at midnight. An alert does. The frame to use: 'Your agents are doing the right thing. Zillow Pro just adds a layer that catches the moments that fall between the outreach schedule — the moments that usually go to whoever shows up first.' Smart Messages aren't a replacement for relationship skills — they're a trigger to apply those skills at the highest-value moment in the contact's decision process.",
  },
  {
    id: 7,
    category: 'Objection Handlers',
    title: "I don't want Zillow having more access to my client data",
    preview:
      "Address this directly and clearly: Zillow Pro does not give Zillow new access to client data. Agent contacts remain in Follow Up Boss. The integration surfaces Zillow activity to the agent — not the reverse.",
    full:
      "This is a legitimate concern that deserves a straight answer, not a pivot. Clarify the data flow: Zillow Pro surfaces data from Zillow to the agent, via Follow Up Boss — it does not send client data from Follow Up Boss to Zillow. The integration is one-directional in terms of new exposure: agents gain visibility into what their connected contacts are doing on Zillow. Zillow does not gain access to CRM notes, client communications, financial details, or any data the agent has captured in Follow Up Boss. My Agent connections are initiated by the agent and accepted by the contact — no contact is added to the visibility layer without that consent step. If the partner has specific questions about data handling, refer them to Zillow's privacy documentation and offer to follow up with the relevant product resources. Don't speculate — get the right answer and come back with it.",
  },
  {
    id: 8,
    category: 'Objection Handlers',
    title: "We're already locked into another CRM",
    preview:
      "Acknowledge the timing and plant the right seed. Partners locked into a competitor CRM aren't a lost opportunity — they're a pipeline conversation for the renewal cycle.",
    full:
      "Don't try to break the existing CRM contract — that's not the right play and it signals poor judgment. Instead, acknowledge the constraint and shift the conversation forward: 'That makes sense — I don't want to create noise around a tool you're actively using. What I do want to make sure is that when that contract comes up, you have a clear picture of what Zillow Pro offers that your current setup doesn't.' The key differentiator to plant is the one no other CRM can replicate: Zillow consumer activity data flowing directly into the agent's workflow. Competitor CRMs can have workflows, automation, and reporting — but they cannot surface what a past client is searching on Zillow in real time, because they don't have access to Zillow's data. That's the seed to leave. Ask when the current contract renews and set a calendar reminder to follow up. Don't push — position.",
  },
  {
    id: 9,
    category: 'Objection Handlers',
    title: "How is this different from what Premier Agent already offers?",
    preview:
      "Premier Agent puts agents in front of buyers. Zillow Pro keeps agents in front of the clients they already have — the sphere that generates repeat and referral business.",
    full:
      "Premier Agent is a lead generation product: it puts an agent's listing and profile in front of consumers who are actively searching on Zillow but don't yet have an agent relationship. Zillow Pro is a relationship retention product: it ensures agents stay connected to the clients they've already earned — and get alerted when those clients re-engage. The two products serve different stages of the agent business cycle. Premier Agent fills the top of the funnel. Zillow Pro protects the clients already in the funnel from going back to the top — with a different agent. For partners who are already on Premier Agent, the positioning is: 'Premier Agent helps you win new clients. Zillow Pro helps you keep them — and makes sure you know when they're back in the market before they call someone else.' These aren't competing products; they're complementary layers.",
  },
  {
    id: 10,
    category: 'Talk Tracks',
    title: 'Opening the Zillow Pro Conversation with a Skeptical Team Lead',
    preview:
      "Lead with the past client blind spot — not the product. Skeptical Team Leads respond when you surface a problem they recognize before you propose a solution.",
    full:
      "Open with a diagnostic question: 'How many of your agents' past clients do you think are currently searching on Zillow right now?' Most Team Leads will pause — because they have no way of knowing. That gap is the problem Zillow Pro solves, and you've surfaced it before mentioning the product. From there, build the picture: the typical agent closes 80% of their business from repeat and referral clients. Those clients are the most likely to search on Zillow when they re-enter the market — and without Zillow Pro, the agent has no visibility into that behavior until the client calls them. By then, the client may have already toured homes with another agent they found on Zillow. Only after the Team Lead has confirmed the gap should you introduce Zillow Pro as the product that closes it. The sequence — problem, confirmation, solution — lands more credibly than a feature walkthrough.",
  },
  {
    id: 11,
    category: 'Talk Tracks',
    title: 'Connecting Zillow Pro to Premier Agent ROI',
    preview:
      "Tie sphere visibility to repeat and referral revenue — the part of an agent's business that typically requires the least ad spend and closes at the highest rate.",
    full:
      "Start with a number the partner cares about: what percentage of their closed business comes from past clients and referrals. For most established agents and teams, that number is above 60%. Then ask: 'Of those past clients, how many do you think searched on Zillow during their most recent transaction?' The answer is almost certainly 'most of them' — Zillow is the largest real estate search platform in the US. If those clients were searching on Zillow, they saw other agent profiles, ads, and listings. Zillow Pro ensures that when a past client searches, they see their agent's branding — and that the agent is alerted to reach out. Frame it as protecting the ROI of relationships already built: every past client who re-enters the market and finds their agent first is a transaction that doesn't require a new lead. Zillow Pro doesn't generate new business — it protects the existing business partners have already earned.",
  },
  {
    id: 12,
    category: 'Talk Tracks',
    title: 'Positioning Zillow Pro Against Competitor CRMs',
    preview:
      "The unification advantage is real — but the data advantage is the differentiator no competitor can match. Zillow consumer activity data inside a CRM is something only Zillow can offer.",
    full:
      "When a Premier Agent partner is comparing Zillow Pro against a competitor CRM, lead with what the competitor cannot offer: real-time Zillow consumer activity inside the agent's workflow. Competitor CRMs — regardless of their sophistication — cannot show an agent when a past client saved three listings last night on Zillow, because they don't have access to Zillow's behavioral data. That's not a feature gap that can be closed with an integration or a third-party data append; it's structural. Zillow Pro's unification advantage is also worth naming: instead of managing Follow Up Boss, My Agent, and Agent Profiles as separate products, Zillow Pro brings them into a single system where activity in one layer triggers responses in another. But when facing a committed CRM advocate, the data argument is stronger than the unification argument — because unification is a convenience benefit, and real-time buyer intent signals are a competitive one. Lead with the data, support with the unification story.",
  },
];

const TABS: Tab[] = ['All', 'Product Knowledge', 'Objection Handlers', 'Talk Tracks'];

const BADGE_STYLES: Record<Category, string> = {
  'Product Knowledge':  'bg-blue-50 text-zillow-blue border-blue-100',
  'Objection Handlers': 'bg-purple-50 text-purple-700 border-purple-100',
  'Talk Tracks':        'bg-teal-50 text-teal-700 border-teal-100',
};

// ─── Card ─────────────────────────────────────────────────────────────────────

function ArticleCard({ article }: { article: Article }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`hover-card rounded-2xl border border-gray-100 flex flex-col overflow-hidden transition-shadow duration-200 ${expanded ? 'shadow-md' : 'shadow-sm bg-white'}`}>
      <div className="p-6 flex flex-col gap-3 flex-1 bg-white">
        <span className={`self-start text-xs font-semibold px-2.5 py-0.5 rounded-full border ${BADGE_STYLES[article.category]}`}>
          {article.category}
        </span>
        <h3 className="text-base font-bold text-zillow-navy leading-snug">{article.title}</h3>
        <p className="text-sm text-[#374151] leading-relaxed">{article.preview}</p>
      </div>

      {/* Expanded content with distinct background */}
      <div className={`slide-grid ${expanded ? 'slide-grid-open' : 'slide-grid-closed'}`}>
        <div className="overflow-hidden">
          <div className="px-6 py-5 bg-[#F0F7FF] border-t border-blue-100">
            <p className="text-sm text-zillow-navy leading-relaxed">{article.full}</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex items-center gap-1.5 px-6 py-3 border-t text-xs font-semibold text-zillow-blue transition-colors rounded-b-2xl w-full text-left ${
          expanded ? 'border-blue-100 bg-[#F0F7FF] hover:bg-blue-100/70' : 'border-gray-100 bg-white hover:bg-blue-50'
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="currentColor"
        >
          <path d="M8 10.5L2.5 5h11L8 10.5z" />
        </svg>
        {expanded ? 'Show less' : 'Read full article'}
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KnowledgePage() {
  const [query, setQuery]         = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return ARTICLES.filter((a) => {
      const matchesTab    = activeTab === 'All' || a.category === activeTab;
      const matchesSearch = !q || a.title.toLowerCase().includes(q) || a.preview.toLowerCase().includes(q) || a.full.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [query, activeTab]);

  return (
    <div>
      {/* Hero band */}
      <div className="hero-gradient px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Knowledge Base</span>
          <h1 className="font-serif text-white text-4xl mt-1">Zillow Pro Knowledge Base</h1>
          <p className="text-blue-100/70 text-sm mt-2">
            Find answers fast. Everything you need to pitch, handle objections, and support partners.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">

        {/* Search — prominent, rounded-full */}
        <div className="relative">
          <svg
            className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zillow-slate pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-5 py-3.5 rounded-full border border-gray-200 bg-white text-sm text-zillow-navy placeholder-zillow-slate focus:outline-none focus:ring-2 focus:ring-zillow-blue/30 focus:border-zillow-blue shadow-sm focus:shadow-md transition-all"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-semibold border transition-all duration-150 ${
                activeTab === tab
                  ? 'bg-zillow-blue text-white border-zillow-blue shadow-sm'
                  : 'bg-white text-zillow-slate border-gray-200 hover:border-zillow-blue hover:text-zillow-blue'
              }`}
            >
              {tab}
            </button>
          ))}
          {filtered.length > 0 && (
            <span className="ml-auto self-center text-xs text-zillow-slate">
              {filtered.length} article{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Card grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
            <p className="text-sm font-semibold text-zillow-navy">No articles match your search</p>
            <p className="text-xs text-zillow-slate">Try a different keyword or clear the filter.</p>
          </div>
        )}

      </div>
    </div>
  );
}
