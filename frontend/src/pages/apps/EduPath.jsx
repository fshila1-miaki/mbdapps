import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BookOpen, Trophy, Play, Check, X, Clock, Users, Star, Award, BarChart3, ArrowRight, Lock } from "lucide-react";

const COURSES = [
  { id: "ssc-math", title: "SSC Mathematics — Full Syllabus", level: "SSC", subject: "Mathematics", price: 0, instructor: "Prof. Rahim Khan", lessons: 64, hours: 32, rating: 4.9, students: 12480, color: "#dc2626", icon: "📐", desc: "Master all chapters of SSC Math 2026 syllabus with step-by-step explanations." },
  { id: "ssc-physics", title: "SSC Physics — Concept Builder", level: "SSC", subject: "Physics", price: 0, instructor: "Dr. Tasnia Ahmed", lessons: 48, hours: 24, rating: 4.8, students: 9230, color: "#0891b2", icon: "⚛️", desc: "Visual physics with simulations. Newton's Laws, Optics, Thermodynamics, more." },
  { id: "hsc-chem", title: "HSC Chemistry 1st + 2nd Paper", level: "HSC", subject: "Chemistry", price: 1500, instructor: "Dr. Naimul Islam", lessons: 86, hours: 52, rating: 4.9, students: 8120, color: "#16a34a", icon: "🧪", desc: "Complete HSC Chemistry coverage with 500+ practice problems and past papers." },
  { id: "hsc-bio", title: "HSC Biology — Medical Admission Prep", level: "HSC", subject: "Biology", price: 2000, instructor: "Dr. Sumaiya Begum", lessons: 72, hours: 40, rating: 4.7, students: 6240, color: "#65a30d", icon: "🧬", desc: "Designed for HSC + MBBS admission prep. Diagrams, mnemonics, mock tests." },
  { id: "english", title: "English Spoken & Grammar Mastery", level: "All", subject: "English", price: 800, instructor: "Tahmid Khan", lessons: 40, hours: 20, rating: 4.8, students: 18420, color: "#7c3aed", icon: "🔤", desc: "From basic grammar to fluent conversation. Daily exercises and live sessions." },
  { id: "ict", title: "ICT for SSC & HSC", level: "All", subject: "ICT", price: 0, instructor: "Engr. Hasan Ali", lessons: 32, hours: 16, rating: 4.6, students: 5180, color: "#f59e0b", icon: "💻", desc: "Comprehensive ICT for SSC/HSC + Computer Fundamentals." },
];

const LESSON_QUIZ = [
  { q: "What is the value of √144?", choices: ["10", "11", "12", "13"], correct: 2 },
  { q: "If x + 5 = 12, then x = ?", choices: ["5", "6", "7", "8"], correct: 2 },
  { q: "Area of a circle with radius 7 is approximately:", choices: ["44", "154", "49π", "Both B and C"], correct: 3 },
];

const LEADERBOARD = [
  { rank: 1, name: "Aritra Sen", school: "Notre Dame College", points: 9840, district: "Dhaka" },
  { rank: 2, name: "Tasfia Rahman", school: "Viqarunnisa Noon", points: 9720, district: "Dhaka" },
  { rank: 3, name: "Mahin Islam", school: "Chittagong College", points: 9410, district: "Chittagong" },
  { rank: 4, name: "Faiza Akter", school: "Holy Cross College", points: 9180, district: "Dhaka" },
  { rank: 5, name: "You (Demo Student)", school: "Govt. Laboratory School", points: 8940, district: "Dhaka", you: true },
  { rank: 6, name: "Ridoy Hossain", school: "Cantonment College Jashore", points: 8720, district: "Jashore" },
  { rank: 7, name: "Sumaiya Khanam", school: "Rajshahi College", points: 8560, district: "Rajshahi" },
];

const EduPath = () => {
  const [page, setPage] = useState("home"); // home | catalog | course | lesson | leaderboard | profile
  const [selected, setSelected] = useState(null);
  const [enrolled, setEnrolled] = useState(() => ["ssc-math", "english", "ict"]);
  const [streak, setStreak] = useState(12);
  const [points, setPoints] = useState(8940);

  // Lesson state
  const [lessonStep, setLessonStep] = useState("watch"); // watch | quiz | done
  const [videoSec, setVideoSec] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (page === "lesson" && lessonStep === "watch") {
      const t = setInterval(() => setVideoSec((s) => Math.min(180, s + 1)), 100);
      return () => clearInterval(t);
    }
  }, [page, lessonStep]);

  const enrolledCourses = COURSES.filter((c) => enrolled.includes(c.id));

  const enroll = (id) => {
    if (enrolled.includes(id)) return setPage("course"), setSelected(COURSES.find((c) => c.id === id));
    setEnrolled([...enrolled, id]);
    const c = COURSES.find((x) => x.id === id);
    setSelected(c);
    setPage("course");
  };

  const startQuiz = () => { setLessonStep("quiz"); setQIdx(0); setPicked(null); setScore(0); };
  const submitAnswer = () => {
    const correct = picked === LESSON_QUIZ[qIdx].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 < LESSON_QUIZ.length) { setQIdx((q) => q + 1); setPicked(null); }
      else { setLessonStep("done"); setPoints((p) => p + 50); }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <button onClick={() => setPage("home")} data-testid="edupath-logo" className="flex items-center gap-2 font-bold text-xl tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>
            <span className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center text-xl">📚</span>
            EduPath BD
          </button>
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => setPage("catalog")} data-testid="nav-courses" className={`px-3 py-1.5 rounded-full font-medium ${page === "catalog" ? "bg-white/20" : "hover:bg-white/10"}`}>Courses</button>
            <button onClick={() => setPage("leaderboard")} data-testid="nav-leaderboard" className={`px-3 py-1.5 rounded-full font-medium ${page === "leaderboard" ? "bg-white/20" : "hover:bg-white/10"}`}>Leaderboard</button>
            <div className="hidden sm:flex items-center gap-1 bg-white/15 backdrop-blur px-3 py-1 rounded-full"><span className="text-amber-300">🔥</span> <span className="font-bold tabular-nums">{streak}d streak</span></div>
            <div className="hidden sm:flex items-center gap-1 bg-amber-400 text-amber-900 px-3 py-1 rounded-full font-bold text-xs"><Trophy size={12} /> {points.toLocaleString()} pts</div>
            <Link to="/" data-testid="back-bdapps" className="hidden md:inline-block text-xs opacity-80 hover:opacity-100">Powered by Orbit</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* ─────── HOME ─────── */}
        {page === "home" && (
          <>
            <section className="bg-gradient-to-br from-indigo-500 via-purple-600 to-fuchsia-600 rounded-3xl p-6 sm:p-10 text-white overflow-hidden relative">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold opacity-90">Welcome back, Demo Student 👋</p>
                  <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mt-2 leading-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Your path to <span className="text-amber-300">A+</span> starts here.</h1>
                  <p className="mt-3 opacity-90 max-w-md">Master SSC & HSC subjects with video lessons, quizzes, and BD's largest student community.</p>
                  <div className="mt-5 flex gap-2 flex-wrap">
                    <button onClick={() => setPage("catalog")} data-testid="explore-courses-btn" className="bg-white text-indigo-700 font-bold px-5 h-11 rounded-full hover:bg-amber-300 transition-colors">Explore Courses →</button>
                    <button onClick={() => setPage("leaderboard")} className="bg-white/15 backdrop-blur border border-white/20 font-bold px-5 h-11 rounded-full hover:bg-white/25">View Leaderboard</button>
                  </div>
                </div>
                <div className="hidden md:block">
                  {/* abstract scene */}
                  <div className="relative h-64">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full bg-amber-400/30 blur-2xl"></div>
                    </div>
                    <div className="absolute top-4 left-4 bg-white text-slate-900 rounded-2xl p-3 shadow-xl w-44">
                      <div className="text-xs font-bold text-indigo-600">SSC PHYSICS</div>
                      <div className="font-bold mt-1">Newton's Laws</div>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-2"><div className="h-full bg-emerald-500 rounded-full" style={{ width: "65%" }}></div></div>
                      <div className="text-[11px] text-slate-500 mt-1">65% complete</div>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white text-slate-900 rounded-2xl p-3 shadow-xl w-40">
                      <div className="text-2xl">🏆</div>
                      <div className="font-bold text-sm mt-1">Top 5 Today</div>
                      <div className="text-[11px] text-slate-500">National Rank · Dhaka</div>
                    </div>
                    <div className="absolute top-1/3 right-12 bg-amber-400 text-amber-900 rounded-2xl p-2 shadow-xl">
                      <div className="text-3xl">📐</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Continue learning */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Continue Learning</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {enrolledCourses.slice(0, 3).map((c) => (
                  <button key={c.id} onClick={() => { setSelected(c); setPage("course"); }} data-testid={`continue-${c.id}`}
                    className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                    <div className="h-24 flex items-center justify-center text-5xl text-white" style={{ background: `linear-gradient(135deg, ${c.color}, #312e81)` }}>{c.icon}</div>
                    <div className="p-3">
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{c.level} · {c.subject}</div>
                      <div className="font-bold mt-0.5 line-clamp-1">{c.title}</div>
                      <div className="mt-2 h-1.5 bg-slate-100 rounded-full"><div className="h-full rounded-full" style={{ width: `${Math.floor(Math.random() * 60 + 20)}%`, background: c.color }}></div></div>
                      <div className="text-[11px] text-slate-500 mt-1">Last viewed 2 days ago</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Recommended */}
            <section>
              <div className="flex justify-between items-end mb-3">
                <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Recommended for You</h2>
                <button onClick={() => setPage("catalog")} className="text-xs font-bold text-indigo-600">See all →</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COURSES.slice(0, 3).map((c) => (
                  <CourseCard key={c.id} course={c} onClick={() => { setSelected(c); setPage("course"); }} enrolled={enrolled.includes(c.id)} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─────── CATALOG ─────── */}
        {page === "catalog" && (
          <>
            <button onClick={() => setPage("home")} data-testid="back-home" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> Back to Home</button>
            <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>All Courses <span className="text-slate-400 font-medium text-xl">({COURSES.length})</span></h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {COURSES.map((c) => <CourseCard key={c.id} course={c} onClick={() => { setSelected(c); setPage("course"); }} enrolled={enrolled.includes(c.id)} />)}
            </div>
          </>
        )}

        {/* ─────── COURSE DETAIL ─────── */}
        {page === "course" && selected && (
          <>
            <button onClick={() => setPage("catalog")} data-testid="back-catalog" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> All Courses</button>
            <section className="rounded-3xl overflow-hidden text-white p-6 sm:p-10" style={{ background: `linear-gradient(135deg, ${selected.color}, #1e1b4b)` }}>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-4xl flex-shrink-0">{selected.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-90">{selected.level} · {selected.subject}</div>
                  <h1 className="text-2xl sm:text-4xl font-bold tracking-tight mt-1" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>{selected.title}</h1>
                  <p className="mt-2 opacity-90 max-w-2xl">{selected.desc}</p>
                  <div className="mt-3 flex items-center gap-4 flex-wrap text-sm">
                    <span className="flex items-center gap-1"><Star size={14} className="fill-amber-300 text-amber-300" /><b>{selected.rating}</b> rating</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {selected.students.toLocaleString()} students</span>
                    <span className="flex items-center gap-1"><Clock size={14} /> {selected.hours}h video</span>
                    <span className="flex items-center gap-1"><BookOpen size={14} /> {selected.lessons} lessons</span>
                  </div>
                  <div className="mt-4 flex gap-2 flex-wrap items-center">
                    {enrolled.includes(selected.id) ? (
                      <button onClick={() => { setPage("lesson"); setLessonStep("watch"); setVideoSec(0); }} data-testid="resume-lesson-btn" className="bg-amber-400 text-amber-900 font-bold px-5 h-11 rounded-full hover:bg-amber-300">▶ Resume Lesson 12</button>
                    ) : (
                      <button onClick={() => enroll(selected.id)} data-testid="enroll-btn" className="bg-white text-indigo-700 font-bold px-5 h-11 rounded-full hover:bg-amber-300">
                        {selected.price === 0 ? "Enroll Free" : `Enroll for BDT ${selected.price.toLocaleString()}`}
                      </button>
                    )}
                    <span className="text-xs opacity-80">Instructor: <b>{selected.instructor}</b></span>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-white border border-slate-200 rounded-2xl p-4">
              <h3 className="font-bold mb-3">Course Curriculum</h3>
              <div className="space-y-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <button key={i} disabled={!enrolled.includes(selected.id)} data-testid={`lesson-${i + 1}`}
                    onClick={() => { setPage("lesson"); setLessonStep("watch"); setVideoSec(0); }}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg ${enrolled.includes(selected.id) ? "hover:bg-indigo-50" : "opacity-60 cursor-not-allowed"}`}>
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i < 4 ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                      {i < 4 ? <Check size={14} /> : i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">Lesson {i + 1} — {["Introduction", "Core Concepts", "Worked Examples", "Practice Set", "Past Paper Walkthrough", "Mock Test", "Recap"][i % 7]}</div>
                      <div className="text-[11px] text-slate-500">{Math.floor(Math.random() * 25 + 15)} min · {Math.floor(Math.random() * 8 + 3)} quiz qs</div>
                    </div>
                    {!enrolled.includes(selected.id) ? <Lock size={14} className="text-slate-400" /> : <Play size={14} className="text-indigo-500" />}
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ─────── LESSON PLAYER ─────── */}
        {page === "lesson" && selected && (
          <>
            <button onClick={() => setPage("course")} data-testid="back-course" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> Back to course</button>
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-3">
                {lessonStep === "watch" && (
                  <>
                    <div className="bg-slate-900 rounded-2xl aspect-video relative overflow-hidden">
                      {/* Video placeholder with scene */}
                      <div className="absolute inset-0 flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-6xl mb-2">{selected.icon}</div>
                          <div className="font-bold text-lg">{selected.title}</div>
                          <div className="text-sm opacity-70 mt-1">Lesson 12 · {selected.subject}</div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(videoSec / 180) * 100}%` }}></div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-white text-xs">
                          <button data-testid="play-btn" onClick={() => setVideoSec((s) => Math.min(180, s + 30))} className="bg-white/20 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center"><Play size={14} fill="white" /></button>
                          <div className="font-mono">{String(Math.floor(videoSec / 60)).padStart(2, "0")}:{String(videoSec % 60).padStart(2, "0")} / 03:00</div>
                          <div className="bg-white/20 backdrop-blur px-2 py-1 rounded text-[10px] font-bold">1080p HD</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4">
                      <div className="text-[10px] uppercase tracking-widest font-bold text-indigo-600">Lesson 12 of 64</div>
                      <h2 className="text-xl font-bold tracking-tight mt-1">Pythagoras Theorem — Worked Examples</h2>
                      <p className="text-sm text-slate-600 mt-2">In this lesson we'll work through 6 board exam style problems on right-triangle theorems and their applications.</p>
                      <button onClick={startQuiz} data-testid="start-quiz-btn" className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 h-11 rounded-full inline-flex items-center gap-2">Take the Quiz <ArrowRight size={14} /></button>
                    </div>
                  </>
                )}
                {lessonStep === "quiz" && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold text-indigo-600">QUIZ · QUESTION {qIdx + 1} OF {LESSON_QUIZ.length}</span>
                      <span className="font-mono">Score: {score}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${((qIdx) / LESSON_QUIZ.length) * 100}%` }}></div>
                    </div>
                    <h3 className="text-lg font-bold">{LESSON_QUIZ[qIdx].q}</h3>
                    <div className="mt-4 space-y-2">
                      {LESSON_QUIZ[qIdx].choices.map((ch, i) => {
                        const isCorrect = i === LESSON_QUIZ[qIdx].correct;
                        const cls = picked === null
                          ? "border-slate-200 hover:border-indigo-500"
                          : i === picked
                            ? isCorrect ? "border-emerald-500 bg-emerald-50" : "border-rose-500 bg-rose-50"
                            : isCorrect && picked !== null ? "border-emerald-500 bg-emerald-50" : "border-slate-200 opacity-60";
                        return (
                          <button key={i} disabled={picked !== null} onClick={() => setPicked(i)} data-testid={`quiz-choice-${i}`}
                            className={`w-full text-left p-3 rounded-xl border-2 transition-all font-medium flex items-center gap-3 ${cls}`}>
                            <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                            {ch}
                            {picked === i && isCorrect && <Check size={16} className="ml-auto text-emerald-600" />}
                            {picked === i && !isCorrect && <X size={16} className="ml-auto text-rose-600" />}
                          </button>
                        );
                      })}
                    </div>
                    <button onClick={submitAnswer} disabled={picked === null} data-testid="submit-quiz" className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold h-12 rounded-xl">
                      {qIdx + 1 === LESSON_QUIZ.length ? "Finish Quiz" : "Next Question →"}
                    </button>
                  </div>
                )}
                {lessonStep === "done" && (
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center" data-testid="quiz-complete">
                    <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-5xl">🏆</div>
                    <h2 className="text-3xl font-bold tracking-tight mt-3" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>Lesson Complete!</h2>
                    <p className="text-slate-600 mt-1">You scored <b className="text-indigo-600">{score}/{LESSON_QUIZ.length}</b> · Earned <b className="text-amber-600">+50 points</b></p>
                    <div className="mt-4 inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm"><Award size={14} /> +50 XP · Streak day {streak} 🔥</div>
                    <div className="mt-5 flex justify-center gap-2 flex-wrap">
                      <button onClick={() => { setLessonStep("watch"); setVideoSec(0); }} data-testid="next-lesson-btn" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 h-11 rounded-full">Next Lesson →</button>
                      <button onClick={() => setPage("leaderboard")} className="border border-slate-300 hover:bg-slate-50 font-bold px-5 h-11 rounded-full">View Leaderboard</button>
                    </div>
                  </div>
                )}
              </div>
              <aside className="space-y-3">
                <div className="bg-white border border-slate-200 rounded-2xl p-4">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Progress</div>
                  <div className="text-3xl font-bold tabular-nums">{Math.round((4 / 12) * 100)}%</div>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-2 mb-3"><div className="h-full bg-indigo-500 rounded-full" style={{ width: "33%" }}></div></div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2"><div className="text-[10px] text-slate-500">Lessons</div><div className="font-bold">4 / 12</div></div>
                    <div className="bg-slate-50 rounded-lg p-2"><div className="text-[10px] text-slate-500">Avg Score</div><div className="font-bold">87%</div></div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-2xl p-4">
                  <div className="text-[10px] uppercase tracking-widest font-bold opacity-90">Daily Goal</div>
                  <div className="font-bold text-lg mt-1">Watch 1 lesson</div>
                  <div className="h-1.5 bg-white/30 rounded-full mt-2"><div className="h-full bg-white rounded-full" style={{ width: "100%" }}></div></div>
                  <div className="text-xs mt-1 opacity-90">✓ Done · 12 day streak</div>
                </div>
              </aside>
            </section>
          </>
        )}

        {/* ─────── LEADERBOARD ─────── */}
        {page === "leaderboard" && (
          <>
            <button onClick={() => setPage("home")} className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1"><ChevronLeft size={14} /> Home</button>
            <section className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 text-white">
              <div className="flex items-center gap-3">
                <Trophy size={36} />
                <div>
                  <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Cabinet Grotesk', sans-serif" }}>National Leaderboard</h1>
                  <p className="text-sm opacity-90">Top students across Bangladesh this week</p>
                </div>
              </div>
            </section>
            {/* Top 3 podium */}
            <section className="grid grid-cols-3 gap-3 -mt-4">
              {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, idx) => {
                const realRank = p.rank;
                const heights = ["h-32", "h-40", "h-28"];
                const colors = ["from-slate-400 to-slate-500", "from-amber-400 to-amber-500", "from-orange-400 to-orange-600"];
                return (
                  <div key={p.rank} className="flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colors[idx]} flex items-center justify-center text-2xl font-bold text-white border-4 border-white shadow-lg`}>{realRank}</div>
                    <div className="font-bold text-sm mt-2 text-center px-1">{p.name}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1 text-center">{p.school}</div>
                    <div className={`w-full ${heights[idx]} bg-gradient-to-br ${colors[idx]} mt-2 rounded-t-2xl flex items-end justify-center pb-3 text-white font-bold`}>
                      {p.points.toLocaleString()} pts
                    </div>
                  </div>
                );
              })}
            </section>
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
              {LEADERBOARD.slice(3).map((p) => (
                <div key={p.rank} data-testid={`lb-row-${p.rank}`} className={`px-4 py-3 border-b border-slate-100 last:border-0 flex items-center gap-3 ${p.you ? "bg-indigo-50" : ""}`}>
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm">{p.rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold ${p.you ? "text-indigo-700" : ""}`}>{p.name} {p.you && <span className="text-[10px] uppercase tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-full ml-1">You</span>}</div>
                    <div className="text-xs text-slate-500 truncate">{p.school} · {p.district}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold tabular-nums">{p.points.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">points</div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        EduPath BD · Powered by <span className="text-rose-600 font-bold">Orbit</span> · 2026
      </footer>
    </div>
  );
};

const CourseCard = ({ course, onClick, enrolled }) => (
  <button onClick={onClick} data-testid={`course-card-${course.id}`}
    className="text-left bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all">
    <div className="h-28 flex items-center justify-center text-5xl text-white relative" style={{ background: `linear-gradient(135deg, ${course.color}, #1e1b4b)` }}>
      {course.icon}
      <span className="absolute top-2 left-2 text-[9px] bg-white/20 backdrop-blur text-white px-2 py-0.5 rounded font-bold">{course.level}</span>
      {course.price === 0 && <span className="absolute top-2 right-2 text-[9px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">FREE</span>}
      {enrolled && <span className="absolute bottom-2 right-2 text-[9px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded font-bold">ENROLLED</span>}
    </div>
    <div className="p-3">
      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{course.subject}</div>
      <div className="font-bold mt-0.5 line-clamp-2 text-sm">{course.title}</div>
      <div className="text-[11px] text-slate-500 mt-1">by {course.instructor}</div>
      <div className="flex items-center gap-2 mt-2 text-xs">
        <span className="flex items-center gap-0.5"><Star size={10} className="fill-amber-400 text-amber-400" /><b>{course.rating}</b></span>
        <span className="text-slate-400">·</span>
        <span className="text-slate-500">{(course.students / 1000).toFixed(1)}K</span>
        <span className="ml-auto font-bold text-indigo-600">{course.price === 0 ? "Free" : `৳${course.price}`}</span>
      </div>
    </div>
  </button>
);

export default EduPath;
