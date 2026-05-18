'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type Rep = {
  id: string;
  rep_name: string;
  score: number;
  passed: boolean;
  completed_at: string;
  real: boolean;
};

type SortDir = 'asc' | 'desc' | null;

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED: Rep[] = [
  { id: 's1', rep_name: 'Jordan Mills',  score: 92, passed: true,  completed_at: '2026-05-01T10:00:00Z', real: false },
  { id: 's2', rep_name: 'Priya Nair',    score: 88, passed: true,  completed_at: '2026-05-02T09:30:00Z', real: false },
  { id: 's3', rep_name: 'Derek Walsh',   score: 74, passed: true,  completed_at: '2026-05-03T14:15:00Z', real: false },
  { id: 's4', rep_name: 'Cami Torres',   score: 68, passed: false, completed_at: '2026-05-04T11:00:00Z', real: false },
  { id: 's5', rep_name: 'Marcus Lee',    score: 95, passed: true,  completed_at: '2026-05-05T08:45:00Z', real: false },
  { id: 's6', rep_name: 'Brie Hoffman',  score: 55, passed: false, completed_at: '2026-05-06T13:00:00Z', real: false },
  { id: 's7', rep_name: 'Nate Okafor',   score: 81, passed: true,  completed_at: '2026-05-07T10:30:00Z', real: false },
  { id: 's8', rep_name: 'Simone Grant',  score: 71, passed: true,  completed_at: '2026-05-08T09:00:00Z', real: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

function gaugeColor(pct: number): { stroke: string; textClass: string } {
  if (pct >= 75) return { stroke: '#16a34a', textClass: 'text-green-600' };
  if (pct >= 50) return { stroke: '#d97706', textClass: 'text-amber-600' };
  return { stroke: '#dc2626', textClass: 'text-red-600' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, accent, topColor,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  topColor: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
      style={{ borderTop: `4px solid ${topColor}` }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-zillow-slate uppercase tracking-widest">{label}</p>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${accent}`}>
          {icon}
        </div>
      </div>
      <p className="font-serif text-4xl text-zillow-navy tabular-nums leading-none">{value}</p>
      {sub && <p className="text-xs text-zillow-slate mt-2">{sub}</p>}
    </div>
  );
}

function Gauge({ pct }: { pct: number }) {
  const r = 72;
  const cx = 90;
  const cy = 90;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const { stroke, textClass } = gaugeColor(pct);
  const label = pct >= 75 ? 'Ready for launch.' : pct >= 50 ? 'More reps need to certify.' : 'Certification drive required.';

  return (
    <div
      className="w-full rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center gap-4"
      style={{ background: 'radial-gradient(ellipse at 50% 70%, #EFF6FF 0%, #FFFFFF 65%)' }}
    >
      <h2 className="text-xs font-semibold text-zillow-slate uppercase tracking-widest">Team Readiness</h2>
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 180 180" className="w-full h-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-serif text-6xl tabular-nums leading-none ${textClass}`}>{pct}%</span>
          <span className="text-sm text-zillow-slate mt-2 font-medium">Certified</span>
        </div>
      </div>
      <p className="text-sm text-center text-zillow-slate leading-relaxed max-w-[220px] font-medium">{label}</p>
    </div>
  );
}

function SortIcon({ dir }: { dir: SortDir }) {
  return (
    <svg className="inline w-3.5 h-3.5 ml-1 text-zillow-slate" viewBox="0 0 16 16" fill="currentColor">
      {dir === 'asc'  && <path d="M8 4l4 6H4l4-6z" />}
      {dir === 'desc' && <path d="M8 12l4-6H4l4 6z" />}
      {dir === null   && <path d="M8 3l3 4H5l3-4zm0 10l3-4H5l3 4z" />}
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function DashboardContent() {
  const [realReps, setRealReps] = useState<Rep[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [newRepName, setNewRepName] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const incomingRep   = searchParams.get('rep');
  const incomingScore = parseInt(searchParams.get('score') ?? '0', 10);
  const incomingPassed = searchParams.get('passed') === 'true';

  useEffect(() => {
    if (incomingRep) setNewRepName(incomingRep.toLowerCase());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const today = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
    [],
  );

  useEffect(() => {
    supabase
      .from('certifications')
      .select('id, rep_name, score, passed, completed_at')
      .order('completed_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setRealReps(data.map((r) => ({ ...r, id: String(r.id), real: true })));
        setLoading(false);
      });
  }, []);

  const allReps: Rep[] = useMemo(() => {
    const seedIds = new Set(realReps.map((r) => r.rep_name.toLowerCase()));
    const merged = [...realReps, ...SEED.filter((s) => !seedIds.has(s.rep_name.toLowerCase()))];

    if (incomingRep) {
      const alreadyPresent = merged.some((r) => r.rep_name.toLowerCase() === incomingRep.toLowerCase());
      if (!alreadyPresent) {
        merged.unshift({
          id: 'incoming-rep',
          rep_name: incomingRep,
          score: incomingScore,
          passed: incomingPassed,
          completed_at: new Date().toISOString(),
          real: true,
        });
      }
    }

    if (sortDir === 'asc')  return [...merged].sort((a, b) => a.score - b.score);
    if (sortDir === 'desc') return [...merged].sort((a, b) => b.score - a.score);
    return merged;
  }, [realReps, sortDir, incomingRep, incomingScore, incomingPassed]);

  const total    = allReps.length;
  const passed   = allReps.filter((r) => r.passed).length;
  const failed   = total - passed;
  const avgScore = total ? Math.round(allReps.reduce((s, r) => s + r.score, 0) / total) : 0;
  const readyPct = total ? Math.round((passed / total) * 100) : 0;

  function toggleSort() {
    setSortDir((d) => (d === null ? 'desc' : d === 'desc' ? 'asc' : null));
  }

  return (
    <div>
      {/* Hero band */}
      <div className="hero-gradient px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Manager View</span>
          <h1 className="font-serif text-white text-4xl mt-1">Zillow Pro Launch Readiness</h1>
          <p className="text-blue-100/70 text-sm mt-2">Certification results as of {today} — Nationwide launch target: Mid-2026</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">

        {/* Gauge — full-width hero metric */}
        <Gauge pct={readyPct} />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Reps" value={total} sub="enrolled"
            accent="bg-blue-50" topColor="#006AFF"
            icon={
              <svg className="w-5 h-5 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 118 0m-8 0a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            }
          />
          <StatCard
            label="Certified" value={passed} sub="passed ≥ 70"
            accent="bg-green-50" topColor="#22c55e"
            icon={
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          <StatCard
            label="Needs Retry" value={failed} sub="scored < 70"
            accent="bg-amber-50" topColor="#f59e0b"
            icon={
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
          />
          <StatCard
            label="Avg Score" value={avgScore} sub="out of 100"
            accent="bg-blue-50" topColor="#006AFF"
            icon={
              <svg className="w-5 h-5 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>

        {/* Rep results table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-serif text-xl text-zillow-navy">Rep Results</h2>
            {loading && (
              <span className="text-xs text-zillow-slate flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-zillow-blue rounded-full animate-spin" />
                Loading live data…
              </span>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Rep Name</th>
                  <th
                    className="text-center px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest cursor-pointer select-none hover:text-zillow-blue transition-colors"
                    onClick={toggleSort}
                  >
                    Score <SortIcon dir={sortDir} />
                  </th>
                  <th className="text-center px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {allReps.map((rep, idx) => {
                  const isNew = newRepName !== null && rep.rep_name.toLowerCase() === newRepName;
                  return (
                  <tr
                    key={rep.id}
                    className={`transition-colors duration-100 hover:bg-blue-50/40 ${
                      isNew ? 'row-highlight-new' : idx % 2 === 1 ? 'bg-gray-50/60' : 'bg-white'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-zillow-blue">
                            {rep.rep_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-zillow-navy">{rep.rep_name}</p>
                          {rep.real && <p className="text-xs text-zillow-blue">Live result</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-bold text-zillow-navy tabular-nums w-8 text-right">{rep.score}</span>
                        <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${rep.passed ? 'bg-green-500' : 'bg-amber-400'}`}
                            style={{ width: `${rep.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          rep.passed
                            ? 'bg-green-600 text-white'
                            : 'bg-amber-500 text-white'
                        }`}
                      >
                        {rep.passed ? 'Certified' : 'Needs Retry'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-zillow-slate tabular-nums text-xs">
                      {fmtDate(rep.completed_at)}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-gray-100 bg-[#FAFBFC]">
            <p className="text-xs text-zillow-slate leading-relaxed">
              Certifications expire 90 days after completion. Reps must recertify before each major product update.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-zillow-slate text-sm">Loading dashboard…</div>}>
      <DashboardContent />
    </Suspense>
  );
}
