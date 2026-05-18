import Link from 'next/link';

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconCRM() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM12 12h.01M8 12h.01M16 12h.01M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2" />
    </svg>
  );
}

function IconNetwork() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m6-4a4 4 0 11-8 0 4 4 0 018 0zm6-4a2 2 0 100-4 2 2 0 000 4zM3 8a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    Icon: IconCRM,
    title: 'Enhanced Follow Up Boss',
    body: 'Real-time Zillow consumer activity insights live inside Follow Up Boss — see what your contacts are viewing, saving, and searching the moment it happens.',
  },
  {
    Icon: IconNetwork,
    title: 'Expanded My Agent',
    body: "Invite any Follow Up Boss contact into a My Agent relationship — not just Zillow leads. Once connected, the agent's branding follows that contact everywhere they go on Zillow.",
  },
  {
    Icon: IconBell,
    title: 'AI-Powered Follow-Up',
    body: 'Smart Messages and Smart Summaries alert agents the moment a contact re-engages or shows a buying signal — shown to double agent response rates.',
  },
];

const stats = [
  { value: '2×', label: 'response rates with Smart Messages' },
  { value: '100%', label: 'real-time visibility into entire contact sphere' },
  { value: '1', label: 'unified platform replacing disconnected tools' },
];

const repNotes = [
  'Zillow Pro unifies Follow Up Boss, My Agent, and Premium Agent Profiles into one suite — pitch it as a single product, not three separate tools bundled together.',
  'The expanded My Agent lets agents invite any Follow Up Boss contact — not just Zillow leads — so the sphere coverage pitch is now broader than ever before.',
  'Smart Messages and Smart Summaries require My Agent connections to be active — help partners get sphere contacts connected first before positioning the AI features.',
  'Early access markets are launching early 2026 with full nationwide availability mid-2026 — set accurate timelines with partners and avoid overpromising on current access.',
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BriefPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="hero-gradient px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 text-blue-200 text-xs font-semibold tracking-widest uppercase border border-white/20">
            Nationwide Launch — Mid 2026
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight mb-5">
            Introducing Zillow Pro
          </h1>
          <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed max-w-2xl mx-auto">
            The AI-powered suite that unites Follow Up Boss, My Agent, and Agent Profiles — built to help agents capture more opportunities and close more deals.
          </p>
          <div className="mt-10 mx-auto w-20 h-0.5 rounded-full bg-white/30" />
        </div>
      </section>

      {/* ── What It Does ─────────────────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zillow-blue mb-2">
            What It Does
          </p>
          <h2 className="font-serif text-3xl text-zillow-navy mb-10">
            Three products. One unified suite.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="hover-card bg-white rounded-2xl border border-gray-100 shadow-sm p-7 flex flex-col"
              >
                <div className="w-12 h-12 rounded-full bg-zillow-blue flex items-center justify-center text-white mb-5 flex-shrink-0">
                  <Icon />
                </div>
                <h3 className="text-base font-bold text-zillow-navy mb-2">{title}</h3>
                <p className="text-sm text-[#374151] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why It Matters ───────────────────────────────────────── */}
      <section className="bg-[#FAFBFC] px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zillow-blue mb-2">
            Why It Matters
          </p>
          <h2 className="font-serif text-3xl text-zillow-navy mb-10">
            The numbers behind the launch.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Stats */}
            <div className="flex flex-col gap-8">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="font-serif text-5xl text-zillow-blue tabular-nums leading-none">
                    {value}
                  </span>
                  <span className="text-xs font-semibold text-zillow-slate uppercase tracking-widest mt-2">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Context paragraph */}
            <div className="flex flex-col justify-center">
              <div className="w-10 h-1 rounded-full bg-zillow-blue mb-5" />
              <p className="text-[#374151] leading-relaxed text-base">
                The number-one pain point for Premier Agent partners is simple:{' '}
                <span className="font-semibold text-zillow-navy">past clients start searching again without telling their agent.</span>
              </p>
              <p className="text-[#374151] leading-relaxed text-base mt-4">
                By the time a past client calls, they've already toured homes with someone they found on Zillow.
                Zillow Pro closes that gap — alerting agents the moment a sphere contact re-engages, inside the
                CRM they already use, in real time.
              </p>
              <p className="text-[#374151] leading-relaxed text-base mt-4">
                This isn't a UX improvement. It's a relationship protection engine — built on data only Zillow has.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── What's Changing for Reps ─────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-zillow-blue mb-2">
            What's Changing for Reps
          </p>
          <h2 className="font-serif text-3xl text-zillow-navy mb-10">
            Four things to know before your next partner call.
          </h2>
          <ol className="flex flex-col gap-6">
            {repNotes.map((note, i) => (
              <li key={i} className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-zillow-blue text-white text-sm font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-[#374151] leading-relaxed pt-1.5">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="px-6 py-16 bg-[#FAFBFC]">
        <div className="max-w-3xl mx-auto">
          <div className="hero-gradient rounded-2xl px-10 py-14 text-center">
            <h2 className="font-serif text-4xl text-white mb-3">
              Ready to get certified?
            </h2>
            <p className="text-blue-100/80 text-base mb-8">
              Complete the Zillow Pro certification to start pitching this suite to Premier Agent partners.
            </p>
            <Link
              href="/certification"
              className="inline-flex items-center gap-2 bg-white text-zillow-blue font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 hover:scale-[1.02] transition-all duration-150 text-sm tracking-wide shadow-sm"
            >
              Begin Certification
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
