const ITERATIONS = [
  {
    id: 1,
    status: 'Complete' as const,
    hypothesis:
      'Reps who read the Launch Brief before certifying will score higher on Zillow Pro product knowledge questions.',
    data: 'Reps who skipped the brief averaged 61 on questions 1–6 vs 84 for those who read it.',
    change:
      'Added a brief completion gate — reps must mark the Launch Brief as read before unlocking certification.',
    result:
      'Average score on product knowledge questions increased from 61 to 79 in the following cohort.',
  },
  {
    id: 2,
    status: 'Complete' as const,
    hypothesis:
      "Question 8 on My Agent skepticism objections was too abstract — low scores indicate reps don't have a concrete framework for handling team leads who believe their agents already stay in touch.",
    data: "62% of reps scored below 6 on question 8, with feedback showing they understood the value but couldn't articulate a response to the 'we already do this' objection.",
    change:
      'Added a new talk track card to the Knowledge Base specifically for My Agent skepticism with a three-part response framework built around the blind spot problem.',
    result:
      'Average score on question 8 increased from 5.2 to 7.8 in the next certification cohort.',
  },
  {
    id: 3,
    status: 'Pending' as const,
    hypothesis:
      'Reps are failing recertification at higher rates than initial certification — content may not be reinforcing retention of Zillow Pro feature details.',
    data: 'Initial pass rate 78%, recertification pass rate 61% — gap suggests knowledge decay between launches.',
    change:
      'Introduced a monthly 5-question Zillow Pro pulse check pushed via Slack to all certified reps.',
    result:
      'Pending — pulse check launched April 2026, recertification cohort scheduled for July 2026.',
  },
];

type SectionKey = 'hypothesis' | 'data' | 'change' | 'result';

const SECTIONS: { key: SectionKey; label: string }[] = [
  { key: 'hypothesis', label: 'Hypothesis' },
  { key: 'data',       label: 'What the data showed' },
  { key: 'change',     label: 'Change made' },
  { key: 'result',     label: 'Result' },
];

export default function HypothesisPage() {
  return (
    <div>
      {/* Hero band */}
      <div className="hero-gradient px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Enablement Ops</span>
          <h1 className="font-serif text-white text-4xl mt-1">Hypothesis Log</h1>
          <p className="text-blue-100/70 text-sm mt-2">
            How we iterate on Zillow Pro enablement based on performance data.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-10">

        {/* Intro */}
        <p className="text-sm text-[#374151] leading-relaxed border-l-4 border-zillow-blue pl-5 py-1">
          This log documents enablement hypotheses, the data that informed them, changes made to
          content or delivery, and measured outcomes. It is updated after each certification cohort.
        </p>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {ITERATIONS.map((item) => (
            <div
              key={item.id}
              className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover-card"
              style={{ borderLeft: '4px solid #006AFF' }}
            >
              {/* Background watermark number */}
              <span
                className="absolute top-2 right-5 font-serif font-bold leading-none select-none pointer-events-none"
                style={{ fontSize: '110px', color: 'rgba(0, 106, 255, 0.055)' }}
              >
                {String(item.id).padStart(2, '0')}
              </span>

              {/* Card header */}
              <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-gray-50 relative">
                <span className="text-xs font-bold text-zillow-slate uppercase tracking-widest">
                  Iteration {item.id}
                </span>
                <span
                  className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold ${
                    item.status === 'Complete'
                      ? 'bg-green-600 text-white'
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              {/* Sections */}
              <div className="divide-y divide-gray-50 relative">
                {SECTIONS.map(({ key, label }) => (
                  <div key={key} className="px-8 py-6 flex flex-col gap-2">
                    <p className="text-xs font-semibold text-zillow-blue uppercase tracking-widest">
                      {label}
                    </p>
                    {key === 'hypothesis' ? (
                      <p className="font-serif text-xl text-zillow-navy leading-snug">
                        {item[key]}
                      </p>
                    ) : (
                      <p className="text-sm text-[#374151] leading-relaxed">
                        {item[key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer meta */}
        <p className="text-xs text-zillow-slate text-center pb-4 tracking-wide">
          Maintained by Sales Enablement · Updated after each certification cohort · For internal use only
        </p>

      </div>
    </div>
  );
}
