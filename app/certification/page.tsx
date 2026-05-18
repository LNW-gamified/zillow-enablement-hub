'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

type MCQuestion = {
  type: 'mc';
  text: string;
  options: [string, string, string, string];
  answer: number;
};

type OpenQuestion = {
  type: 'open';
  text: string;
};

type Question = MCQuestion | OpenQuestion;

type ScoreResult = {
  score: number;
  feedback: string;
  model_answer: string;
};

type AnswerRecord = {
  questionText: string;
  type: 'mc' | 'open';
  userAnswer: string;
  score: number;
  correct?: boolean;
  feedback?: string;
  modelAnswer?: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUESTIONS: Question[] = [
  {
    type: 'mc',
    text: 'What three products does Zillow Pro unite?',
    options: [
      'Zillow Rentals, Trulia, and ShowingTime',
      'Follow Up Boss, My Agent, and Agent Profiles',
      'Zillow Home Loans, Premier Agent, and FUB',
      'ShowingTime, Zestimate, and My Agent',
    ],
    answer: 1,
  },
  {
    type: 'mc',
    text: 'What does the expanded My Agent feature allow agents to do?',
    options: [
      'Buy leads in new zip codes',
      'Invite any Follow Up Boss contact into a My Agent relationship',
      'Access Zillow Home Loans data',
      'Auto-respond to all inquiries',
    ],
    answer: 1,
  },
  {
    type: 'mc',
    text: "Where do agents see their contacts' real-time Zillow activity?",
    options: [
      'In a separate Zillow dashboard',
      'Via weekly email reports',
      'Directly inside Follow Up Boss',
      'On their Agent Profile page',
    ],
    answer: 2,
  },
  {
    type: 'mc',
    text: 'Smart Messages have been shown to do what?',
    options: [
      'Reduce CRM costs by 30%',
      'Increase profile views by 50%',
      'Double agent response rates',
      'Automate listing appointments',
    ],
    answer: 2,
  },
  {
    type: 'mc',
    text: 'Which Premier Agent partner pain point does Zillow Pro most directly address?',
    options: [
      'High subscription costs',
      'Past clients searching again without telling their agent',
      'Lack of listing inventory',
      'Competition from discount brokers',
    ],
    answer: 1,
  },
  {
    type: 'mc',
    text: 'When is Zillow Pro available nationwide?',
    options: [
      'It launched January 2025',
      'Q4 2025',
      'Mid-2026',
      'Early 2027',
    ],
    answer: 2,
  },
  {
    type: 'open',
    text: 'A Premier Agent partner says: "I already use Follow Up Boss — I don\'t see why I need Zillow Pro on top of it." How do you respond?',
  },
  {
    type: 'open',
    text: 'Explain the value of the expanded My Agent feature to a skeptical Team Lead who thinks their agents already do a good job staying in touch with past clients.',
  },
  {
    type: 'open',
    text: 'Your manager asks you to demo Zillow Pro to a high-value Premier Agent partner who has been considering switching to a competitor CRM. How do you position it?',
  },
  {
    type: 'open',
    text: "A Premier Agent partner emails you three weeks after adopting Zillow Pro saying their agents aren't using the My Agent connection feature. How do you respond?",
  },
];

const PASS_THRESHOLD = 70;
const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CertificationPage() {
  const [phase, setPhase] = useState<'entry' | 'quiz' | 'results'>('entry');
  const [repName, setRepName] = useState('');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [openText, setOpenText] = useState('');
  const [isScoring, setIsScoring] = useState(false);
  const [openResult, setOpenResult] = useState<ScoreResult | null>(null);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const savedRef = useRef(false);

  const question = QUESTIONS[currentQ];
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const passed = totalScore >= PASS_THRESHOLD;
  const progressPct = Math.round((currentQ / QUESTIONS.length) * 100);

  // ── Supabase save ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'results' || savedRef.current) return;
    savedRef.current = true;
    supabase
      .from('certifications')
      .insert({ rep_name: repName, score: totalScore, passed, completed_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.error('Supabase save failed:', error.message); });
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleBegin() {
    if (!repName.trim()) return;
    setPhase('quiz');
  }

  function handleMCSelect(idx: number) {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);
    const q = question as MCQuestion;
    const correct = idx === q.answer;
    setAnswers((prev) => [...prev, { questionText: q.text, type: 'mc', userAnswer: q.options[idx], score: correct ? 10 : 0, correct }]);
  }

  async function handleOpenSubmit() {
    if (!openText.trim() || isScoring) return;
    setIsScoring(true);
    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.text, answer: openText }),
      });
      const result: ScoreResult = await res.json();
      setOpenResult(result);
      setHasAnswered(true);
      setAnswers((prev) => [...prev, { questionText: question.text, type: 'open', userAnswer: openText, score: result.score, feedback: result.feedback, modelAnswer: result.model_answer }]);
    } catch {
      console.error('Scoring request failed');
    } finally {
      setIsScoring(false);
    }
  }

  function handleNext() {
    const nextQ = currentQ + 1;
    if (nextQ >= QUESTIONS.length) {
      setPhase('results');
    } else {
      setCurrentQ(nextQ);
      setSelectedOption(null);
      setHasAnswered(false);
      setOpenText('');
      setOpenResult(null);
    }
  }

  // ── Shared hero band ─────────────────────────────────────────────────────────

  const hero = (
    <div className="hero-gradient px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <span className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Zillow Pro</span>
        <h1 className="font-serif text-white text-3xl mt-1">Sales Certification</h1>
        <p className="text-blue-100/70 text-sm mt-1.5">
          {phase === 'results'
            ? `${repName} · ${passed ? '✓ Passed' : 'Did not pass'}`
            : '10 questions · AI-scored open responses · 70 points to pass'}
        </p>
      </div>
    </div>
  );

  // ── Render: Entry ────────────────────────────────────────────────────────────

  if (phase === 'entry') {
    return (
      <>
        {hero}
        <div className="flex flex-col items-center px-6 py-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-10 max-w-md w-full text-center">
            <p className="text-[#374151] text-sm mb-8 leading-relaxed">
              Demonstrate your Zillow Pro product knowledge and sales readiness. Earn 70 or more points to earn certification.
            </p>
            <input
              type="text"
              placeholder="Your full name"
              value={repName}
              onChange={(e) => setRepName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBegin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-zillow-navy text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-zillow-blue/30 focus:border-zillow-blue transition"
            />
            <button
              onClick={handleBegin}
              disabled={repName.trim().length === 0}
              className="w-full bg-zillow-blue text-white font-semibold py-3 rounded-full text-sm hover:bg-[#0052CC] hover:scale-[1.02] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Begin Certification
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Render: Results ──────────────────────────────────────────────────────────

  if (phase === 'results') {
    return (
      <>
        {hero}
        <div className="max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">

          {/* Certificate card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg px-10 py-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-zillow-slate mb-6">Zillow Pro · Sales Certification</p>
            <p className="text-base text-zillow-slate mb-2">{repName}</p>
            <div className="my-4">
              <span className="font-serif text-8xl text-zillow-blue tabular-nums leading-none">{totalScore}</span>
              <span className="font-serif text-3xl text-zillow-slate/60"> / 100</span>
            </div>
            <span
              className={`inline-block px-6 py-2 rounded-full text-sm font-semibold mt-2 ${
                passed
                  ? 'bg-green-600 text-white'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}
            >
              {passed ? '✓ Certified in Zillow Pro' : 'Not Yet Certified'}
            </span>
            {!passed && (
              <p className="text-[#374151] text-sm mt-5 leading-relaxed">
                You need {PASS_THRESHOLD} points to pass. Review the feedback below and try again.
              </p>
            )}
            <p className="text-xs text-gray-400 mt-6">
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date())}
            </p>
          </div>

          {/* Question breakdown */}
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl text-zillow-navy">Question Breakdown</h2>
            {answers.map((a, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="text-sm font-semibold text-zillow-navy leading-snug flex-1">
                    {i + 1}. {a.questionText}
                  </p>
                  <span
                    className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                      a.type === 'mc'
                        ? a.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        : 'bg-blue-50 text-zillow-blue'
                    }`}
                  >
                    {a.score}/10
                  </span>
                </div>
                <p className="text-xs text-zillow-slate mb-1">
                  <span className="font-medium">Your answer:</span> {a.userAnswer}
                </p>
                {a.feedback && (
                  <p className="text-xs text-[#374151] mt-2 leading-relaxed">
                    <span className="font-medium text-zillow-navy">Feedback:</span> {a.feedback}
                  </p>
                )}
                {a.modelAnswer && (
                  <p className="text-xs text-[#374151] mt-1 leading-relaxed">
                    <span className="font-medium text-zillow-navy">Ideal answer:</span> {a.modelAnswer}
                  </p>
                )}
              </div>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="self-center inline-flex items-center gap-2 bg-zillow-blue text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#0052CC] hover:scale-[1.02] transition-all duration-150 text-sm"
          >
            View Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </>
    );
  }

  // ── Render: Quiz ─────────────────────────────────────────────────────────────

  return (
    <>
      {hero}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-xs text-zillow-slate mb-2">
              <span className="font-medium">Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span className="font-semibold text-zillow-blue">{progressPct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(to right, #006AFF, #4DA3FF)',
                  transition: 'width 600ms cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
          </div>

          {/* Question content */}
          <div className="border border-gray-100 rounded-xl p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-zillow-blue mb-4">
              {question.type === 'mc' ? 'Multiple Choice' : 'Open Response'} · {currentQ + 1}/{QUESTIONS.length}
            </p>
            <h2 className="font-serif text-xl text-zillow-navy leading-snug mb-6">
              {question.text}
            </h2>

            {/* MC options */}
            {question.type === 'mc' && (
              <div className="flex flex-col gap-3">
                {(question as MCQuestion).options.map((opt, idx) => {
                  const q = question as MCQuestion;
                  const isCorrect  = hasAnswered && idx === q.answer;
                  const isWrong    = hasAnswered && idx === selectedOption && idx !== q.answer;
                  const isDimmed   = hasAnswered && idx !== q.answer && idx !== selectedOption;

                  const optClass = [
                    'flex items-center gap-4 p-4 rounded-xl border border-l-4 text-sm font-medium transition-all duration-150 cursor-pointer text-left w-full',
                    !hasAnswered && 'border-gray-200 border-l-gray-200 hover:border-zillow-blue hover:border-l-zillow-blue hover:bg-blue-50 hover:shadow-sm',
                    isCorrect  && 'border-green-300 border-l-green-500 bg-green-50 text-green-800',
                    isWrong    && 'border-red-200 border-l-red-500 bg-red-50 text-red-700',
                    isDimmed   && 'border-gray-100 border-l-gray-100 text-gray-300 cursor-default',
                  ].filter(Boolean).join(' ');

                  return (
                    <button
                      key={idx}
                      className={optClass}
                      onClick={() => handleMCSelect(idx)}
                      disabled={hasAnswered}
                    >
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-150 ${
                          isCorrect ? 'bg-green-500 text-white' :
                          isWrong   ? 'bg-red-500 text-white'   :
                          'bg-gray-100 text-zillow-navy'
                        }`}
                      >
                        {isCorrect ? <CheckIcon /> : isWrong ? <XIcon /> : OPTION_LETTERS[idx]}
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}

                {hasAnswered && (
                  <div
                    className={`mt-1 rounded-xl px-5 py-3 text-sm font-medium ${
                      selectedOption === (question as MCQuestion).answer
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {selectedOption === (question as MCQuestion).answer
                      ? '✓ Correct — nice work!'
                      : `✗ Incorrect. The right answer is ${OPTION_LETTERS[(question as MCQuestion).answer]}.`}
                  </div>
                )}
              </div>
            )}

            {/* Open response */}
            {question.type === 'open' && (
              <div className="flex flex-col gap-4">
                <textarea
                  rows={5}
                  placeholder="Type your answer here…"
                  value={openText}
                  onChange={(e) => setOpenText(e.target.value)}
                  disabled={hasAnswered}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-zillow-navy resize-none focus:outline-none focus:ring-2 focus:ring-zillow-blue/30 focus:border-zillow-blue transition disabled:bg-gray-50 disabled:text-zillow-slate"
                />

                {!hasAnswered && (
                  <button
                    onClick={handleOpenSubmit}
                    disabled={!openText.trim() || isScoring}
                    className="self-start bg-zillow-blue text-white font-semibold px-6 py-2.5 rounded-full text-sm hover:bg-[#0052CC] hover:scale-[1.02] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isScoring ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Scoring…
                      </>
                    ) : 'Submit Answer'}
                  </button>
                )}

                {/* Slide-down AI feedback */}
                <div className={`slide-grid ${openResult ? 'slide-grid-open' : 'slide-grid-closed'}`}>
                  <div className="overflow-hidden">
                    {openResult && (
                      <div className="flex flex-col gap-3 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="font-serif text-3xl text-zillow-blue tabular-nums">{openResult.score}/10</span>
                          <div className="h-2.5 flex-1 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${openResult.score * 10}%`,
                                background: 'linear-gradient(to right, #006AFF, #4DA3FF)',
                              }}
                            />
                          </div>
                        </div>
                        <div className="rounded-xl bg-[#F0F7FF] border-l-4 border-zillow-blue px-5 py-4 text-sm text-zillow-navy leading-relaxed">
                          <p className="font-semibold mb-1 text-xs uppercase tracking-widest text-zillow-blue">AI Feedback</p>
                          <p className="text-[#374151]">{openResult.feedback}</p>
                        </div>
                        <div className="rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 text-sm leading-relaxed">
                          <p className="font-semibold text-zillow-navy mb-1 text-xs uppercase tracking-widest">Ideal Answer</p>
                          <p className="text-[#374151]">{openResult.model_answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Next button */}
          {hasAnswered && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 bg-zillow-blue text-white font-semibold px-8 py-3 rounded-full text-sm hover:bg-[#0052CC] hover:scale-[1.02] transition-all duration-150"
              >
                {currentQ + 1 < QUESTIONS.length ? 'Next Question' : 'See Results'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
