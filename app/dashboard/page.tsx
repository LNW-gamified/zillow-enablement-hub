'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
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
type Risk = 'high' | 'mid' | 'low';

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

const SCORE_BUCKETS = [
  { range: '0–59',   min: 0,  max: 59,  fill: '#dc2626' },
  { range: '60–69',  min: 60, max: 69,  fill: '#f59e0b' },
  { range: '70–79',  min: 70, max: 79,  fill: '#86efac' },
  { range: '80–89',  min: 80, max: 89,  fill: '#22c55e' },
  { range: '90–100', min: 90, max: 100, fill: '#16a34a' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(iso));
}

function fmtShortDate(iso: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(iso));
}

function repRisk(rep: Rep): Risk {
  if (!rep.passed) return 'low';
  if (rep.score >= 80) return 'high';
  return 'mid';
}

function gaugeColor(pct: number) {
  if (pct >= 80) return { stroke: '#16a34a', text: 'text-green-600', bg: 'radial-gradient(ellipse at 50% 70%, #f0fdf4 0%, #ffffff 65%)' };
  if (pct >= 70) return { stroke: '#d97706', text: 'text-amber-600', bg: 'radial-gradient(ellipse at 50% 70%, #fffbeb 0%, #ffffff 65%)' };
  return { stroke: '#dc2626', text: 'text-red-600', bg: 'radial-gradient(ellipse at 50% 70%, #fef2f2 0%, #ffffff 65%)' };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TrendUp({ color = 'text-green-500' }: { color?: string }) {
  return (
    <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}
function TrendDown({ color = 'text-red-500' }: { color?: string }) {
  return (
    <svg className={`w-4 h-4 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 17l5-5m0 0l-5-5m5 5H6" />
    </svg>
  );
}
function TrendNeutral() {
  return (
    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
    </svg>
  );
}

function StatCard({
  label, value, sub, topColor, accent, trend, icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  topColor: string;
  accent: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3"
      style={{ borderTop: `3px solid ${topColor}` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold text-zillow-slate uppercase tracking-widest leading-tight">{label}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="font-serif text-5xl text-zillow-navy tabular-nums leading-none">{value}</p>
        <p className="text-xs text-zillow-slate mt-1.5">{sub}</p>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
        {trend === 'up'      && <><TrendUp /><span className="text-green-600">vs. target</span></>}
        {trend === 'down'    && <><TrendDown /><span className="text-amber-600">needs attention</span></>}
        {trend === 'neutral' && <><TrendNeutral /><span>on track</span></>}
      </div>
    </div>
  );
}

function GaugeChart({ pct }: { pct: number }) {
  const r = 80;
  const cx = 100;
  const cy = 100;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct / 100);
  const { stroke, text, bg } = gaugeColor(pct);
  const goNoGo = pct >= 80
    ? { label: '✅ Launch Ready', sub: 'Team has cleared the certification threshold.' }
    : pct >= 70
    ? { label: '⚠️ Proceed with Caution', sub: '1–2 reps need recertification.' }
    : { label: '🚫 Launch Risk', sub: 'Delay go-live — drive recertification.' };

  return (
    <div className="flex flex-col items-center gap-3 h-full justify-between py-2">
      <p className="text-xs font-semibold text-zillow-slate uppercase tracking-widest">Launch Readiness Score</p>
      <div className="relative w-52 h-52">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={stroke}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1), stroke 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-serif text-5xl tabular-nums leading-none ${text}`}>{pct}%</span>
          <span className="text-xs text-zillow-slate mt-1.5 font-medium">Certified</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-semibold text-sm text-zillow-navy">{goNoGo.label}</p>
        <p className="text-xs text-zillow-slate mt-1 leading-relaxed">{goNoGo.sub}</p>
      </div>
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

function RiskDot({ risk }: { risk: Risk }) {
  const cfg = {
    high: { color: 'bg-green-500', label: 'High Confidence' },
    mid:  { color: 'bg-amber-400', label: 'Certified' },
    low:  { color: 'bg-red-500',   label: 'Needs Retry' },
  }[risk];
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.color}`} />
      <span className="text-xs text-zillow-slate">{cfg.label}</span>
    </div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; fill: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zillow-navy text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value} rep{payload[0].value !== 1 ? 's' : ''}</p>
    </div>
  );
}

function LineTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zillow-navy text-white text-xs rounded-lg px-3 py-2 shadow-lg">
      <p className="font-semibold">{label}</p>
      <p>{payload[0].value} certified</p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [realReps, setRealReps]       = useState<Rep[]>([]);
  const [loading, setLoading]         = useState(true);
  const [sortDir, setSortDir]         = useState<SortDir>(null);
  const [search, setSearch]           = useState('');
  const [newRepName, setNewRepName]   = useState<string | null>(null);
  const [incomingRep, setIncomingRep] = useState<string | null>(null);
  const [incomingScore, setIncomingScore]   = useState(0);
  const [incomingPassed, setIncomingPassed] = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const rep = params.get('rep');
    if (rep) {
      setIncomingRep(rep);
      setIncomingScore(parseInt(params.get('score') ?? '0', 10));
      setIncomingPassed(params.get('passed') === 'true');
      setNewRepName(rep.toLowerCase());
    }
  }, []);

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

  const today = useMemo(
    () => new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date()),
    [],
  );

  const daysToLaunch = useMemo(() => {
    const launch = new Date('2026-06-01T00:00:00Z');
    const now = new Date();
    return Math.max(0, Math.ceil((launch.getTime() - now.getTime()) / 86_400_000));
  }, []);

  const allReps: Rep[] = useMemo(() => {
    const seedIds = new Set(realReps.map((r) => r.rep_name.toLowerCase()));
    const merged = [...realReps, ...SEED.filter((s) => !seedIds.has(s.rep_name.toLowerCase()))];
    if (incomingRep) {
      const already = merged.some((r) => r.rep_name.toLowerCase() === incomingRep.toLowerCase());
      if (!already) merged.unshift({ id: 'incoming-rep', rep_name: incomingRep, score: incomingScore, passed: incomingPassed, completed_at: new Date().toISOString(), real: true });
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

  const scoreDistribution = useMemo(() =>
    SCORE_BUCKETS.map((b) => ({
      ...b,
      count: allReps.filter((r) => r.score >= b.min && r.score <= b.max).length,
    })),
  [allReps]);

  const timelineData = useMemo(() => {
    if (!allReps.length) return [];
    const sorted = [...allReps].sort((a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime());
    const start = new Date(sorted[0].completed_at); start.setHours(0, 0, 0, 0);
    const end   = new Date(); end.setHours(23, 59, 59, 999);
    const result: { date: string; certified: number }[] = [];
    let cumulative = 0;
    const cursor = new Date(start);
    while (cursor <= end) {
      const dayStr = cursor.toDateString();
      cumulative += sorted.filter((r) => new Date(r.completed_at).toDateString() === dayStr).length;
      result.push({ date: fmtShortDate(cursor.toISOString()), certified: cumulative });
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  }, [allReps]);

  const filteredReps = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? allReps.filter((r) => r.rep_name.toLowerCase().includes(q)) : allReps;
  }, [allReps, search]);

  const bannerCfg = readyPct >= 80
    ? { bg: 'bg-green-50', border: 'border-green-500', heading: 'text-green-800', sub: 'text-green-700', label: '✅ Launch Ready', body: 'Team has met the certification threshold. Recommend proceeding with Zillow Pro go-live.' }
    : readyPct >= 70
    ? { bg: 'bg-amber-50', border: 'border-amber-500', heading: 'text-amber-800', sub: 'text-amber-700', label: '⚠️ Proceed with Caution', body: 'Most reps are certified but 1–2 need recertification before launch.' }
    : { bg: 'bg-red-50',   border: 'border-red-500',   heading: 'text-red-800',   sub: 'text-red-700',   label: '🚫 Launch Risk', body: 'Team has not met certification threshold. Delay go-live and schedule recertification for at-risk reps.' };

  const launchColor = daysToLaunch <= 14 ? '#f59e0b' : daysToLaunch <= 30 ? '#006AFF' : '#006AFF';

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* ── Hero band ─────────────────────────────────────────────────────── */}
      <div className="hero-gradient px-6 py-10">
        <div className="max-w-7xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Manager View</span>
            <h1 className="font-serif text-white text-4xl mt-1">Zillow Pro Launch Readiness</h1>
            <p className="text-blue-100/70 text-sm mt-1.5">Certification dashboard · {today}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5">
            <span className="text-blue-100 text-xs font-semibold uppercase tracking-widest">Launch Target</span>
            <span className="font-serif text-white text-xl tabular-nums ml-2">June 1, 2026</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* ── Go/No-Go Banner ───────────────────────────────────────────────── */}
        <div className={`rounded-2xl border-l-4 px-6 py-4 flex items-start justify-between gap-4 flex-wrap ${bannerCfg.bg} ${bannerCfg.border}`}>
          <div>
            <p className={`font-bold text-base ${bannerCfg.heading}`}>{bannerCfg.label}</p>
            <p className={`text-sm mt-0.5 leading-relaxed ${bannerCfg.sub}`}>{bannerCfg.body}</p>
          </div>
          <p className={`text-xs whitespace-nowrap opacity-60 pt-0.5 ${bannerCfg.sub}`}>Assessment as of {today}</p>
        </div>

        {/* ── Row 1: Stat cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Total Reps" value={total} sub="enrolled in program"
            topColor="#006AFF" accent="bg-blue-50" trend="neutral"
            icon={<svg className="w-4 h-4 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 118 0m-8 0a4 4 0 100-8 4 4 0 000 8z" /></svg>}
          />
          <StatCard
            label="Certified" value={passed} sub={`${readyPct}% of team`}
            topColor="#22c55e" accent="bg-green-50" trend="up"
            icon={<svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
          />
          <StatCard
            label="Needs Retry" value={failed} sub="scored below 70"
            topColor="#f59e0b" accent="bg-amber-50" trend="down"
            icon={<svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>}
          />
          <StatCard
            label="Avg Score" value={avgScore} sub="out of 100 points"
            topColor="#006AFF" accent="bg-blue-50" trend="up"
            icon={<svg className="w-4 h-4 text-zillow-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
          <StatCard
            label="Days to Launch" value={daysToLaunch} sub="until June 1, 2026"
            topColor={launchColor} accent="bg-amber-50" trend="neutral"
            icon={<svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
        </div>

        {/* ── Row 2: Charts ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Score Distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-zillow-slate uppercase tracking-widest">Score Distribution</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Number of reps per score band</p>
            </div>
            <div className="flex-1" style={{ height: 220 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreDistribution} barCategoryGap="28%">
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#4A5568' }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#4A5568' }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc' }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {scoreDistribution.map((b, i) => <Cell key={i} fill={b.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <div className="h-full bg-gray-50 rounded-xl animate-pulse" />}
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { color: '#dc2626', label: '< 60' },
                { color: '#f59e0b', label: '60–69' },
                { color: '#22c55e', label: '70+' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-zillow-slate">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Gauge */}
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            style={{ background: gaugeColor(readyPct).bg }}
          >
            <GaugeChart pct={readyPct} />
          </div>

          {/* Completion Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
            <div>
              <p className="text-xs font-semibold text-zillow-slate uppercase tracking-widest">Certification Timeline</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Cumulative completions toward launch</p>
            </div>
            <div className="flex-1" style={{ height: 220 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#4A5568' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#4A5568' }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip content={<LineTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="certified"
                      stroke="#006AFF"
                      strokeWidth={2.5}
                      dot={{ fill: '#006AFF', r: 3, strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: '#006AFF' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : <div className="h-full bg-gray-50 rounded-xl animate-pulse" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-zillow-slate">
              <span className="w-6 h-0.5 bg-zillow-blue rounded-full inline-block" />
              Cumulative certifications
            </div>
          </div>
        </div>

        {/* ── Row 3: Rep Performance Table ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Table header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-serif text-xl text-zillow-navy">Rep Performance</h2>
              <p className="text-xs text-zillow-slate mt-0.5">{total} reps · {passed} certified · {failed} need retry</p>
            </div>
            <div className="flex items-center gap-3">
              {loading && (
                <span className="text-xs text-zillow-slate flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-zillow-blue rounded-full animate-spin" />
                  Live data…
                </span>
              )}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Filter reps…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zillow-blue/30 focus:border-zillow-blue transition w-48"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFBFC] border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Rep Name</th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest cursor-pointer select-none hover:text-zillow-blue transition-colors"
                    onClick={() => setSortDir((d) => d === null ? 'desc' : d === 'desc' ? 'asc' : null)}
                  >
                    Score <SortIcon dir={sortDir} />
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Completed</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-zillow-slate uppercase tracking-widest">Readiness Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredReps.map((rep, idx) => {
                  const isNew = newRepName !== null && rep.rep_name.toLowerCase() === newRepName;
                  return (
                    <tr
                      key={rep.id}
                      className={`transition-colors duration-100 hover:bg-blue-50/40 ${
                        isNew ? 'row-highlight-new' : idx % 2 === 1 ? 'bg-gray-50/40' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-zillow-blue">
                              {rep.rep_name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-zillow-navy text-sm">{rep.rep_name}</p>
                            {rep.real && <p className="text-[10px] text-zillow-blue font-medium">Live result</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-zillow-navy tabular-nums text-sm w-7 flex-shrink-0">{rep.score}</span>
                          <div className="w-24 h-1.5 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${rep.passed ? 'bg-green-500' : 'bg-amber-400'}`}
                              style={{ width: `${rep.score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                          rep.passed ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {rep.passed ? 'Certified' : 'Needs Retry'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-zillow-slate text-xs tabular-nums">
                        {fmtDate(rep.completed_at)}
                      </td>
                      <td className="px-6 py-3.5">
                        <RiskDot risk={repRisk(rep)} />
                      </td>
                    </tr>
                  );
                })}
                {filteredReps.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-zillow-slate">
                      No reps match "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 bg-[#FAFBFC] flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-zillow-slate">
              Certifications expire 90 days after completion. Reps must recertify before each major product update.
            </p>
            <div className="flex items-center gap-4">
              {[
                { color: 'bg-green-500', label: 'High Confidence (≥80)' },
                { color: 'bg-amber-400', label: 'Certified (70–79)' },
                { color: 'bg-red-500',   label: 'Needs Retry (<70)' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-zillow-slate">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
