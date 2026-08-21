import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NumerologyMatrix } from '../components/NumerologyMatrix';
import { 
  Heart, 
  User, 
  RefreshCw, 
  ChevronRight, 
  Star, 
  Sparkles, 
  Send,
  MessageSquare 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { StandardNameInput, StandardDateInput } from '../components/StandardFormFields';
import { calculateLoShuGrid, calculateBirthNumber, calculateLifePathNumber } from '../lib/numerology';
import { Link } from 'react-router-dom';
import { BRAND_DATA } from '../lib/constants';
import { useSEO } from '../lib/useSEO';

// Compatibility Chart Data
const compatibilityChart: Record<number, { lucky: number[], neutral: number[], enemy: number[] }> = {
  1: { lucky: [1, 2, 3, 5, 9], neutral: [6, 4, 7], enemy: [8] },
  2: { lucky: [1, 5, 3], neutral: [6, 2, 7], enemy: [9, 4, 8] },
  3: { lucky: [1, 2, 3, 5, 7], neutral: [8, 9, 4], enemy: [6] },
  4: { lucky: [1, 5, 6, 7, 8, 4], neutral: [3], enemy: [2, 9] },
  5: { lucky: [1, 2, 3, 5, 6], neutral: [7, 8, 9, 4], enemy: [] },
  6: { lucky: [4, 5, 6, 7], neutral: [1, 2, 8, 9], enemy: [3] },
  7: { lucky: [1, 4, 5, 6], neutral: [3, 8, 9, 2, 7], enemy: [] },
  8: { lucky: [5, 6, 3, 4, 8], neutral: [9, 7], enemy: [1, 2] },
  9: { lucky: [1, 5, 3], neutral: [7, 6, 8, 9], enemy: [4, 2] }
};

interface CalculationResult {
  boyBirth: number;
  boyLifePath: number;
  girlBirth: number;
  girlLifePath: number;
  boyLoShu: Record<number, number>;
  girlLoShu: Record<number, number>;
  comparisons: {
    label: string;
    num1: number;
    num2: number;
    type: 'Lucky' | 'Neutral' | 'Enemy';
    score: number;
  }[];
  totalScore: number;
  percentage: number;
  analysis: {
    title: string;
    message: string;
  };
}

export default function CompatibilityCalculator() {
  useSEO({
    title: 'Numerology Compatibility Calculator | Destiny Numbers',
    description: 'Check numerology compatibility for marriage, business or relationships. Free love and partnership compatibility calculator by Destiny Numbers.',
    keywords: 'numerology compatibility, name compatibility calculator, marriage compatibility numerology, love compatibility numbers, partner match calculator',
  });
  const whatsappNumber = BRAND_DATA.phone.replace(/[^0-9]/g, '');
  const [boyName, setBoyName] = useState('');
  const [boyDob, setBoyDob] = useState('');
  const [girlName, setGirlName] = useState('');
  const [girlDob, setGirlDob] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const getCompatibility = (num1: number, num2: number) => {
    const chart = compatibilityChart[num1];
    if (chart.lucky.includes(num2)) return { type: 'Lucky' as const, score: 25 };
    if (chart.neutral.includes(num2)) return { type: 'Neutral' as const, score: 15 };
    return { type: 'Enemy' as const, score: 0 };
  };

  const calculateCompatibility = () => {
    if (boyDob.length < 14 || girlDob.length < 14) return;
    
    setIsCalculating(true);
    setResults(null);

    setTimeout(() => {
      const boyBirth = calculateBirthNumber(boyDob);
      const boyLifePath = calculateLifePathNumber(boyDob);
      const girlBirth = calculateBirthNumber(girlDob);
      const girlLifePath = calculateLifePathNumber(girlDob);
      
      const boyLoShu = calculateLoShuGrid(boyDob, boyBirth, boyLifePath);
      const girlLoShu = calculateLoShuGrid(girlDob, girlBirth, girlLifePath);

      const comps = [
        { label: "Boy Birth ↔ Girl Birth", n1: boyBirth, n2: girlBirth },
        { label: "Boy Birth ↔ Girl Life Path", n1: boyBirth, n2: girlLifePath },
        { label: "Boy Life Path ↔ Girl Birth", n1: boyLifePath, n2: girlBirth },
        { label: "Boy Life Path ↔ Girl Life Path", n1: boyLifePath, n2: girlLifePath }
      ];

      const comparisonsResult = comps.map(c => {
        const res = getCompatibility(c.n1, c.n2);
        return {
          label: c.label,
          num1: c.n1,
          num2: c.n2,
          type: res.type,
          score: res.score
        };
      });

      const totalScore = comparisonsResult.reduce((acc, curr) => acc + curr.score, 0);
      const percentage = totalScore; // since max is 100

      let analysis = { title: "", message: "" };
      if (percentage >= 90) {
        analysis = { title: "Excellent Compatibility", message: "Strong energetic alignment and natural harmony." };
      } else if (percentage >= 70) {
        analysis = { title: "Good Compatibility", message: "Positive compatibility with balanced understanding." };
      } else if (percentage >= 40) {
        analysis = { title: "Average Compatibility", message: "Moderate compatibility requiring effort and communication." };
      } else {
        analysis = { title: "Challenging Compatibility", message: "Different vibrations may create emotional and practical conflicts." };
      }

      setResults({
        boyBirth,
        boyLifePath,
        girlBirth,
        girlLifePath,
        boyLoShu,
        girlLoShu,
        comparisons: comparisonsResult,
        totalScore,
        percentage,
        analysis
      });
      setIsCalculating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5ECD7] text-[#1C3557] font-sans selection:bg-[#C9A84C] selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1C3557]/5 blur-[120px] rounded-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C9A84C]/5 blur-[120px] rounded-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-20">
        {/* Section 1: Hero Banner */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: 400,
              lineHeight: 1.3,
              margin: '0 0 4px 0',
              color: '#1C3557',
              letterSpacing: '0',
              textAlign: 'center'
            }}>
              Numerology <span style={{ color: '#C9A84C' }}>compatibility</span> calculator
            </h1>
            <div style={{ width: '60px', height: '1px', background: '#C9A84C', margin: '4px auto 0' }}></div>
          </div>
          <p className="text-sm text-[#1C3557]/70 max-w-2xl mx-auto italic">
            Also explore our <Link to="/calculator" className="text-[#C9A84C] font-semibold hover:underline">free numerology calculator</Link>,{' '}
            <Link to="/services/marriage-matching" className="text-[#C9A84C] font-semibold hover:underline">marriage matching</Link> and{' '}
            <Link to="/services/relationship-compatibility" className="text-[#C9A84C] font-semibold hover:underline">relationship compatibility</Link> consultations.
          </p>
        </div>

        {/* SECTION 2: Input Cards */}
        <div id="input-section" className="mx-auto max-w-[800px] flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Boy Details */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card bg-white border border-[#E0D5C0] p-8 md:p-10 rounded-none relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-mystic-navy/[0.02] blur-[60px] group-hover:bg-mystic-navy/[0.05] transition-all" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-none bg-mystic-navy/5 flex items-center justify-center border border-[#C9A84C]/20">
                  <User className="text-black w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-black">Boy Details</h3>
                  <p className="text-[10px] tracking-widest text-[#C9A84C] font-black uppercase">Masculine energy</p>
                </div>
              </div>

              <div className="space-y-5">
                <StandardNameInput
                  label="Full Name"
                  value={boyName}
                  onChange={setBoyName}
                  placeholder="Enter name"
                  error={!boyName && boyName !== undefined ? "Name is required" : ""}
                />
                <StandardDateInput
                  label="Date of Birth"
                  value={boyDob}
                  onChange={setBoyDob}
                  error={boyDob && boyDob.length < 10 ? "Please enter a valid date" : ""}
                />
              </div>
            </motion.div>

            {/* Girl Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card bg-white border border-[#E0D5C0] p-8 md:p-10 rounded-none relative overflow-hidden group shadow-xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A84C]/[0.02] blur-[60px] group-hover:bg-[#C9A84C]/[0.05] transition-all" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-none bg-[#C9A84C]/5 flex items-center justify-center border border-[#C9A84C]/20">
                  <Heart className="text-[#C9A84C] w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-black text-black">Girl Details</h3>
                  <p className="text-[10px] tracking-widest text-[#C9A84C] font-black uppercase">Feminine energy</p>
                </div>
              </div>

              <div className="space-y-5">
                <StandardNameInput
                  label="Full Name"
                  value={girlName}
                  onChange={setGirlName}
                  placeholder="Enter name"
                  error={!girlName && girlName !== undefined ? "Name is required" : ""}
                />
                <StandardDateInput
                  label="Date of Birth"
                  value={girlDob}
                  onChange={setGirlDob}
                  error={girlDob && girlDob.length < 10 ? "Please enter a valid date" : ""}
                />
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6">
            <button
              onClick={calculateCompatibility}
              disabled={!boyName || !girlName || boyDob.length < 14 || girlDob.length < 14 || isCalculating}
              className={cn(
                "w-full md:flex-1 h-[56px] rounded-none font-serif font-semibold tracking-[0.2em] text-[14px] transition-all flex items-center justify-center gap-4 uppercase shadow-lg",
                (!boyName || !girlName || boyDob.length < 14 || girlDob.length < 14 || isCalculating)
                  ? "bg-mystic-navy text-[#F5ECD7]/80 cursor-not-allowed border border-[#C9A84C]/10"
                  : "bg-mystic-navy text-[#F5ECD7] hover:bg-[#132845] hover:scale-[1.01] active:scale-95 cursor-pointer"
              )}
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-royal-gold" /> Synchronizing energies...
                </>
              ) : (
                <>
                  Decode Compatibility <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    (!boyName || !girlName || boyDob.length < 14 || girlDob.length < 14 || isCalculating) ? "text-royal-gold/80" : "text-royal-gold"
                  )} />
                </>
              )}
            </button>
            
            <button
              onClick={() => { setBoyName(''); setBoyDob(''); setGirlName(''); setGirlDob(''); setResults(null); }}
              className="w-full md:w-48 h-[52px] rounded-none border border-[#E0D5C0] text-[10px] font-black tracking-widest hover:bg-mystic-navy/5 transition-all text-black uppercase"
            >
              Reset Fields
            </button>
          </div>
        </div>

        {/* SECTION 3: Results Dashboard */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Score Circle */}
                <div className="glass-card bg-white border-royal-gold/10 p-10 rounded-none md:col-span-2 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-royal-gold/5 to-transparent pointer-events-none" />
                   
                   <div className="relative w-48 h-48 mb-8">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96" cy="96" r="88"
                          className="stroke-mystic-navy/5 fill-none"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="96" cy="96" r="88"
                          className="stroke-royal-gold fill-none"
                          strokeWidth="12"
                          strokeDasharray={552.92}
                          initial={{ strokeDashoffset: 552.92 }}
                          animate={{ strokeDashoffset: 552.92 - (552.92 * results.percentage) / 100 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-display font-black text-black">{results.percentage}%</span>
                        <span className="text-[10px] tracking-widest text-royal-gold font-black">Harmony</span>
                      </div>
                   </div>

                   <div className="text-center">
                     <h3 className="text-3xl font-display font-black text-black mb-2">{results.analysis.title}</h3>
                     <p className="text-black font-semibold font-sans italic">{results.analysis.message}</p>
                   </div>
                </div>

                {/* Individual Numbers */}
                <div className="space-y-8 flex flex-col items-center justify-center glass-card bg-white border-royal-gold/10 p-10 rounded-[3rem] shadow-xl overflow-hidden">
                   <span className="text-[10px] tracking-widest font-black text-black mb-4 block">Boy's matrix</span>
                   <div className="flex justify-center scale-75 md:scale-90 origin-center">
                      <NumerologyMatrix gridData={results.boyLoShu} />
                   </div>
                   <div className="grid grid-cols-2 gap-10 w-full mt-4">
                      <div className="text-center">
                         <span className="text-2xl font-display font-black text-black">{results.boyBirth}</span>
                         <p className="text-[8px] tracking-widest text-black mt-2 font-black uppercase">Birth Number</p>
                      </div>
                      <div className="text-center">
                         <span className="text-2xl font-display font-black text-royal-gold">{results.boyLifePath}</span>
                         <p className="text-[8px] tracking-widest text-black mt-2 font-black uppercase">Life Path</p>
                      </div>
                   </div>
                </div>

                <div className="space-y-8 flex flex-col items-center justify-center glass-card bg-white border-royal-gold/10 p-10 rounded-[3rem] shadow-xl overflow-hidden">
                   <span className="text-[10px] tracking-widest font-black text-black mb-4 block">Girl's matrix</span>
                   <div className="flex justify-center scale-75 md:scale-90 origin-center">
                      <NumerologyMatrix gridData={results.girlLoShu} />
                   </div>
                   <div className="grid grid-cols-2 gap-10 w-full mt-4">
                      <div className="text-center">
                         <span className="text-2xl font-display font-black text-black">{results.girlBirth}</span>
                         <p className="text-[8px] tracking-widest text-black mt-2 font-black uppercase">Birth Number</p>
                      </div>
                      <div className="text-center">
                         <span className="text-2xl font-display font-black text-royal-gold">{results.girlLifePath}</span>
                         <p className="text-[8px] tracking-widest text-black mt-2 font-black uppercase">Life Path</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* SECTION 4: Detailed Breakdown */}
              <div className="glass-card bg-white border-royal-gold/10 rounded-[3.5rem] overflow-hidden shadow-xl">
                <div className="p-10 border-b border-royal-gold/10 bg-mystic-navy/5">
                   <h3 className="text-2xl font-display font-black text-black flex items-center gap-4">
                     <Sparkles className="text-royal-gold w-6 h-6" /> Detailed comparison matrix
                   </h3>
                </div>
                <div className="divide-y divide-royal-gold/5">
                  {results.comparisons.map((comp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-mystic-navy/[0.02] transition-all"
                    >
                      <div className="flex items-center gap-8">
                         <div className="flex items-center -space-x-4">
                            <div className="w-14 h-14 rounded-full border-2 border-royal-gold/20 bg-white shadow-lg flex items-center justify-center font-display font-black text-black text-xl z-20">{comp.num1}</div>
                            <div className="w-14 h-14 rounded-full border-2 border-royal-gold/20 bg-white shadow-lg flex items-center justify-center font-display font-black text-royal-gold text-xl z-10">{comp.num2}</div>
                         </div>
                         <div>
                            <h4 className="text-black font-display font-black text-lg">{comp.label}</h4>
                            <p className="text-[10px] tracking-widest text-black font-black">Sync intersection {idx + 1}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-12">
                         <div className="text-right">
                            <span className={cn(
                              "text-[10px] tracking-widest font-black px-4 py-2 rounded-full",
                              comp.type === 'Lucky' ? "bg-green-500/10 text-green-600" :
                              comp.type === 'Neutral' ? "bg-royal-gold/10 text-royal-gold" :
                              "bg-red-500/10 text-red-600"
                            )}>
                              {comp.type} match
                            </span>
                         </div>
                         <div className="w-32 text-right">
                            <span className="text-3xl font-display font-black text-royal-gold">+{comp.score}</span>
                            <p className="text-[8px] tracking-widest text-black font-black">Points</p>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 5: Consultation CTA */}
        <div className="mt-40">
           <div className="bg-[#1C3557] border border-royal-gold/10 p-12 md:p-20 rounded-none text-center relative overflow-hidden shadow-2xl text-white">
              <div className="absolute inset-0 bg-[url('/assets/img/sacred-geometry.png')] opacity-5 pointer-events-none" />
              
              <div className="relative z-10">
                 <h2 className="text-4xl md:text-6xl font-display mb-8 italic text-white leading-tight">
                    <span className="text-white">Relationship</span> <span className="text-[#C9A84C]">synchronicity</span>
                 </h2>
                 
                 <p className="text-lg text-white/60 mb-12 max-w-xl mx-auto font-light italic leading-loose">
                    Numerology compatibility reveals emotional, practical, karmic, and energetic relationship patterns. Go beyond basic checks by analyzing your complete resonance with a <strong className="text-[#C9A84C]">master consultation</strong>.
                 </p>
                 
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link to="/consultation" className="px-12 py-6 bg-[#C9A84C] text-[#1C3557] font-display font-black tracking-widest text-[12px] uppercase shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4 rounded-none border border-transparent">
                       Book private session <Star className="w-4 h-4" />
                    </Link>
                    <button className="px-12 py-6 bg-white/5 border border-white/20 text-white font-display font-black tracking-widest text-[12px] uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-4 rounded-none" onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank', 'noopener,noreferrer')}>
                       WhatsApp sync <Send className="w-4 h-4 text-[#C9A84C]" />
                    </button>
                 </div>
              </div>
           </div>
        </div>

        {/* SEO Content */}
        <section className="mt-24 pt-16 border-t border-[#1C3557]/10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-display italic text-[#1C3557] mb-6">About Numerology Compatibility</h2>
          <p className="text-[#1C3557]/80 leading-relaxed mb-4">
            Numerology compatibility is one of the oldest ways to assess relationship potential. Every person carries two primary numbers — the <strong>Birth Number</strong> (Moolank) drawn from the day of birth and the <strong>Life Path Number</strong> (Bhagyank) drawn from the full date. When two people connect, these numbers interact in four combinations that reveal how the relationship flows on a daily basis, how it handles long-term direction, and where the natural friction points sit.
          </p>
          <p className="text-[#1C3557]/80 leading-relaxed mb-4">
            This free compatibility calculator scores each of the four combinations as Lucky, Neutral, or Enemy, and produces an overall harmony percentage backed by a diagnostic message. It also renders individual Lo Shu grids for each partner — a visual snapshot of the planetary strengths and gaps in each person's numerological chart. Use it for love, marriage, dating, business partnerships or family reconciliation.
          </p>
          <p className="text-[#1C3557]/80 leading-relaxed mb-4">
            A low score does not doom a relationship — it simply flags the areas where conscious effort is required. Numerology remedies, mobile number correction and Vastu adjustments can shift the day-to-day energy dramatically. For a full marriage-matching or partner-analysis session with Dr. Arun Poovaiah, please <Link to="/consultation" className="text-[#C9A84C] font-semibold hover:underline">book a private consultation</Link>.
          </p>

          <h3 className="text-2xl font-display italic text-[#1C3557] mt-10 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-[#1C3557] mb-2">Is numerology compatibility the same as astrology matching?</h4>
              <p className="text-[#1C3557]/80 leading-relaxed">No. Astrology matching (like Ashtakoot Milan) uses birth-star and planet positions. Numerology compatibility uses date-of-birth-derived numbers. Both are useful — best when combined.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1C3557] mb-2">What is a good compatibility percentage?</h4>
              <p className="text-[#1C3557]/80 leading-relaxed">A score above 70% indicates natural harmony. 50–70% is a workable match with conscious effort. Below 50% flags karmic friction that benefits from expert analysis before commitment.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1C3557] mb-2">Can two "enemy" numbers make a lasting relationship?</h4>
              <p className="text-[#1C3557]/80 leading-relaxed">Yes. Enemy pairings often produce transformative, karmic relationships. They demand emotional maturity and often benefit from Vastu or name-correction remedies.</p>
            </div>
            <div>
              <h4 className="font-bold text-[#1C3557] mb-2">Does this work for business partnerships too?</h4>
              <p className="text-[#1C3557]/80 leading-relaxed">Absolutely. The same number interactions govern how two founders will operate — how decisions flow, how conflict resolves, and where the partnership creates or drains wealth.</p>
            </div>
          </div>

          <h3 className="text-2xl font-display italic text-[#1C3557] mt-10 mb-4">Explore Deeper Compatibility Services</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/services/marriage-matching" className="px-5 py-2 border border-[#1C3557]/20 text-[#1C3557] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Marriage Matching</Link>
            <Link to="/services/relationship-compatibility" className="px-5 py-2 border border-[#1C3557]/20 text-[#1C3557] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Relationship Compatibility</Link>
            <Link to="/calculator" className="px-5 py-2 border border-[#1C3557]/20 text-[#1C3557] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Numerology Calculator</Link>
            <Link to="/services/horoscope" className="px-5 py-2 border border-[#1C3557]/20 text-[#1C3557] text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Horoscope Analysis</Link>
            <Link to="/consultation" className="px-5 py-2 bg-[#1C3557] text-white text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] transition-all">Book a Consultation</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
