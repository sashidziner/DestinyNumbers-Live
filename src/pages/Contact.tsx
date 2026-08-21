import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, Briefcase, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { SOCIAL_LINKS } from '../lib/constants';
import { StandardNameInput, StandardEmailInput, StandardSelect, StandardTextArea } from '../components/StandardFormFields';
import { HeroHeader } from '../components/HeroHeader';
import { useSEO } from '../lib/useSEO';

const MAILER_URL = (import.meta.env.VITE_MAILER_URL as string) || `${import.meta.env.BASE_URL}send-mail.php`;

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  service: 'Commercial Brand Naming',
  message: ''
};

function validate(formData: typeof EMPTY_FORM) {
  const errors: Record<string, string> = {};
  if (!formData.firstName.trim()) errors.firstName = 'First name is required';
  if (!formData.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Enter a valid email address';
  if (!formData.message.trim()) errors.message = 'Message is required';
  else if (formData.message.trim().length < 10) errors.message = 'Please provide more detail (min. 10 characters)';
  return errors;
}

export default function ContactPage() {
  useSEO({
    title: 'Contact Destiny Numbers | Book a Consultation',
    description: 'Get in touch with Dr. Arun Poovaiah for numerology, astrology or Vastu consultations in Bangalore. Book your session today.',
    keywords: 'contact destiny numbers, book numerology consultation bangalore, dr arun poovaiah contact, vastu consultation booking',
  });
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const set = (field: keyof typeof EMPTY_FORM) => (val: string) =>
    setFormData(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('loading');
    try {
      const res = await fetch(MAILER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name:    `${formData.firstName} ${formData.lastName}`.trim(),
          email:   formData.email,
          service: formData.service,
          message: formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message);
      setStatus('success');
      setFormData(EMPTY_FORM);
      setSubmitted(false);
      setErrors({});
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-warm-off-white min-h-screen">
      <HeroHeader
        eyebrow="Private Concierge"
        title="Connect With The Matrix"
        description="Looking to align your commercial brand or personal vibration with universal logic? Our private concierge team is at your disposal."
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-8 mb-20">
              {[
                { icon: Mail,   label: 'Secure Email',    value: 'support@destinynumbers.in' },
                { icon: Phone,  label: 'Direct WhatsApp', value: '+91 89712 25552' },
                { icon: MapPin, label: 'Global Hub',      value: 'Bangalore • Virtual Consultancy' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-none bg-white border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C] group-hover:bg-mystic-navy group-hover:text-white transition-all duration-500 shadow-xl">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#C9A84C]/80 tracking-widest font-black mb-1 uppercase">{item.label}</p>
                    <p className="text-mystic-navy font-bold text-lg tracking-wide group-hover:text-[#C9A84C] transition-colors duration-300">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  className="w-12 h-12 rounded-none border border-[#C9A84C]/20 flex items-center justify-center text-mystic-navy hover:border-[#C9A84C] hover:text-[#C9A84C] hover:shadow-lg transition-all bg-white shadow-sm"
                  target={social.url === '#' ? undefined : '_blank'}
                  rel={social.url === '#' ? undefined : 'noopener noreferrer'}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="glass-card p-8 md:p-12 rounded-none border border-[#E0D5C0] shadow-2xl bg-white relative"
          >
            <h3 className="text-2xl font-display font-black text-mystic-navy mb-10 tracking-widest uppercase">
              Strategic Inquiry
            </h3>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-16 text-center"
              >
                <CheckCircle className="w-16 h-16 text-[#1D9E75]" />
                <h4 className="text-xl font-display font-black text-mystic-navy tracking-wide uppercase">Message Sent</h4>
                <p className="text-sm text-mystic-navy/60 max-w-xs">
                  Your inquiry has been received. We'll respond to <span className="text-[#C9A84C] font-semibold">support@destinynumbers.in</span> within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-[11px] font-black tracking-widest uppercase text-[#C9A84C] hover:underline"
                >
                  Send Another
                </button>
              </motion.div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <StandardNameInput
                    label="First Name"
                    value={formData.firstName}
                    onChange={set('firstName')}
                    placeholder="Enter first name"
                    error={errors.firstName}
                    submitted={submitted}
                  />
                  <StandardNameInput
                    label="Last Name"
                    value={formData.lastName}
                    onChange={set('lastName')}
                    placeholder="Enter last name"
                  />
                </div>
                <StandardEmailInput
                  label="Email Address"
                  value={formData.email}
                  onChange={set('email')}
                  placeholder="name@organization.com"
                  error={errors.email}
                  submitted={submitted}
                />
                <StandardSelect
                  label="Service Category"
                  value={formData.service}
                  onChange={set('service')}
                  icon={<Briefcase />}
                  options={[
                    { value: 'Commercial Brand Naming',      label: 'Commercial Brand Naming' },
                    { value: 'Personal Vibration Mapping',   label: 'Personal Vibration Mapping' },
                    { value: 'Elite Vastu Architecture',     label: 'Elite Vastu Architecture' },
                    { value: 'Stellar Matrix Analysis',      label: 'Stellar Matrix Analysis' },
                    { value: 'Learning Academy Enrollment',  label: 'Learning Academy Enrollment' }
                  ]}
                />
                <StandardTextArea
                  label="Message Details"
                  value={formData.message}
                  onChange={set('message')}
                  placeholder="Brief description of your intent"
                  rows={4}
                  error={errors.message}
                  submitted={submitted}
                />

                {status === 'error' && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    Failed to send. Please try again or email us directly at support@destinynumbers.in
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full h-[52px] bg-[#C9A84C] text-white font-black tracking-widest text-[11px] rounded-[6px] flex items-center justify-center gap-4 hover:shadow-2xl hover:scale-[1.01] transition-all uppercase mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                  ) : (
                    <>Submit Request <Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* SEO Content */}
        <section className="mt-20 pt-12 border-t border-[#E0D5C0] max-w-3xl mx-auto">
          <h2 className="text-3xl font-display italic text-mystic-navy mb-6">Get in Touch With Destiny Numbers</h2>
          <p className="text-mystic-navy/80 leading-relaxed mb-4">
            Whether you are looking for a personal numerology reading, a Vastu audit of your home or office, a business-brand naming session, or a full Nadi and horoscope analysis, our team at Destiny Numbers is available to help. Dr. Arun Poovaiah personally reviews every enquiry and assigns the right specialist based on the complexity of your question.
          </p>
          <p className="text-mystic-navy/80 leading-relaxed mb-4">
            The fastest way to reach us is <strong>WhatsApp at +91 89712 25552</strong> — we typically respond within a few working hours. Email queries to <strong>support@destinynumbers.in</strong> are answered within 24 hours. If your matter is time-sensitive (a name-change deadline, a launch date, or an urgent Vastu concern), please mention that in your message so we can prioritise it.
          </p>
          <p className="text-mystic-navy/80 leading-relaxed mb-4">
            We are based in <strong>Bangalore, India</strong>, and serve clients across India and internationally through virtual consultation. Corporate visits, on-site Vastu audits, and in-person sessions are available on prior appointment. For a fixed-price package with pre-defined deliverables, review our <Link to="/consultation" className="text-[#C9A84C] font-semibold hover:underline">Consultation Plans</Link> or browse the <Link to="/services" className="text-[#C9A84C] font-semibold hover:underline">full list of services</Link>.
          </p>

          <h3 className="text-2xl font-display italic text-mystic-navy mt-10 mb-4">Consultation Modes</h3>
          <ul className="space-y-3 text-mystic-navy/80 leading-relaxed list-disc pl-6">
            <li><strong>Phone Call:</strong> best for urgent, focused questions with a fast turnaround.</li>
            <li><strong>Video Consultation:</strong> best for chart-walkthroughs and Vastu plan reviews.</li>
            <li><strong>WhatsApp Chat:</strong> best for follow-ups and short remedy clarifications.</li>
            <li><strong>In-person (Bangalore):</strong> best for full-day sessions and on-site Vastu.</li>
          </ul>
        </section>

        {/* Quick Links */}
        <div className="mt-24 pt-12 border-t border-[#E0D5C0] text-center">
          <p className="text-[10px] font-black tracking-widest text-[#C9A84C]/80 uppercase mb-6">Prefer to explore first?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/consultation" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Consultation Plans</Link>
            <Link to="/services" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">All Services</Link>
            <Link to="/tools" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Free Tools</Link>
            <Link to="/calculator" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Numerology Calculator</Link>
            <Link to="/about" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">About Dr. Arun</Link>
            <Link to="/blog" className="px-6 py-3 border border-[#C9A84C]/30 text-mystic-navy text-xs font-bold tracking-widest uppercase hover:bg-[#C9A84C] hover:text-white hover:border-transparent transition-all">Blog</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
