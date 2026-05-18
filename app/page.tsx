import Link from 'next/link';

// ─── Icons ────────────────────────────────────────────────────────────────────

function BriefIcon() {
  return (
    <svg className="w-7 h-7 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CertIcon() {
  return (
    <svg className="w-7 h-7 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function DashIcon() {
  return (
    <svg className="w-7 h-7 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function KbIcon() {
  return (
    <svg className="w-7 h-7 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const programCards = [
  {
    title: 'Launch Brief',
    href: '/brief',
    desc: 'Master the product story, competitive positioning, and launch timeline.',
    Icon: BriefIcon,
  },
  {
    title: 'Certification',
    href: '/certification',
    desc: 'Complete a 10-question AI-scored exam to earn your Zillow Pro certification.',
    Icon: CertIcon,
  },
  {
    title: 'Manager Dashboard',
    href: '/dashboard',
    desc: 'Track team readiness and certification progress across your org.',
    Icon: DashIcon,
  },
  {
    title: 'Knowledge Base',
    href: '/knowledge',
    desc: 'Access talk tracks, objection handlers, and product training articles.',
    Icon: KbIcon,
  },
];

const problemStats = [
  '68% of sellers re-use their previous agent — if that agent stays top of mind',
  'Zillow Pro gives agents real-time visibility into their entire sphere\'s search activity',
  'Smart Messages have been shown to double agent response rates',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="hero-gradient px-6 py-20 md:py-28">
        <div className="max-w-5xl mx-auto">
          <img
            src="/zillow-logo.svg"
            alt="Zillow"
            style={{ height: '28px', width: 'auto', filter: 'brightness(0) invert(1)', marginBottom: '40px' }}
          />
          <div className="max-w-2xl">
            <h1 className="font-serif text-white text-4xl md:text-5xl leading-tight mb-6">
              Zillow Pro Launch Readiness Program
            </h1>
            <p className="text-blue-100/80 text-lg leading-relaxed mb-10">
              A product enablement system designed to certify Zillow's sales team before the Zillow Pro nationwide launch.
            </p>
            <Link
              href="/brief"
              className="inline-flex items-center gap-2.5 bg-white text-zillow-blue font-semibold px-8 py-4 rounded-full text-base hover:bg-blue-50 hover:scale-[1.02] transition-all duration-150 shadow-lg"
            >
              Begin Program
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ── The Problem ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <h2 className="font-serif text-3xl text-zillow-navy leading-tight mb-10">
              Past clients are searching again — and agents don't know it.
            </h2>
            <div className="flex flex-col gap-6">
              {problemStats.map((stat, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-bold text-zillow-blue">{i + 1}</span>
                  </div>
                  <p className="text-[#374151] text-sm leading-relaxed pt-1">{stat}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:pt-2">
            <div className="bg-zillow-light rounded-2xl p-8 border border-gray-100">
              <p className="text-sm font-semibold uppercase tracking-widest text-zillow-blue mb-4">The Opportunity</p>
              <p className="text-[#374151] leading-relaxed mb-4">
                Agents are losing past clients to competitors not because they've failed — but because they've gone quiet.
                Zillow Pro closes the visibility gap between agents and the people already in their sphere who are ready to move again.
              </p>
              <p className="text-[#374151] leading-relaxed">
                By unifying Follow Up Boss, My Agent, and AI-powered Smart Messages into a single platform, Zillow Pro gives
                agents the tools to surface intent signals at exactly the right moment — before a competitor does.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Program ───────────────────────────────────────────────────── */}
      <section className="bg-zillow-light py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-zillow-blue mb-3">Enablement Modules</p>
            <h2 className="font-serif text-3xl text-zillow-navy">The Program</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {programCards.map(({ title, href, desc, Icon }) => (
              <Link
                key={href}
                href={href}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5 hover-card group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Icon />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="font-serif text-lg text-zillow-navy">{title}</h3>
                  <p className="text-sm text-zillow-slate leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zillow-blue group-hover:gap-2.5 transition-all duration-150">
                  Explore
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Program Notes ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-gray-50 border-l-4 border-zillow-blue rounded-xl p-8 md:p-10">
          <h3 className="font-serif text-xl text-zillow-navy mb-4">About This Program</h3>
          <p className="text-[#374151] text-sm leading-relaxed mb-6 max-w-2xl">
            This enablement system was designed by Chris Oliver as a demonstration of product launch readiness program design.
            Every element — the launch brief, certification, manager dashboard, hypothesis log, and knowledge base — maps directly
            to a core competency required for senior product enablement roles.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://www.linkedin.com/in/chrisoliver-pmp"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zillow-blue hover:text-[#0052CC] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href="https://olivermethod.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-zillow-blue hover:text-[#0052CC] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              olivermethod.com
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
