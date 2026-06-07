'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "I'm impressed with the quality and explanation of the services to our fleet. We have a... well to put it nicely... a \"dying fleet.\" We are currently in the process of swapping our fleet out with newer vehicles beginning of the new year. We've had some very unsuccessful and disappointing mechanic shops touch our vehicles previously. Brian has been very detailed at giving our vehicles a good once over in general. Not just for the safety of our personnel, but the safety of others as well. Currently, I have nothing but great things to say about OTC so thank you for everything!!!!",
    name: 'Joshua G.',
    company: 'Fleet Manager',
    note: 'I copied our COO because it was his reference that brought Mammoth to OTC and couldn\'t be happier!!!',
    rating: 5,
  },
  {
    text: 'Derek and Brian consistently meet our needs with fast turn around times on our truck servicing and equipment repairs.',
    name: 'Liberty Insulation',
    company: 'York, PA',
    note: null,
    rating: 5,
  },
];

const FadeUp = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-charcoal-900 relative overflow-hidden">

      {/* Background accent */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #FFD400 0, #FFD400 1px, transparent 0, transparent 50%)',
        backgroundSize: '30px 30px',
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <FadeUp>
          <div className="text-center mb-16">
            <span className="text-[#FFD400] text-xs font-bold tracking-[0.25em] uppercase">
              What Our Customers Say
            </span>
            <h2 className="mt-4 text-4xl md:text-5xl font-bold text-white tracking-tight">
              Happy Customers
            </h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-lg">
              Fleet managers and business owners across Central PA trust OTC to keep their vehicles moving.
            </p>
          </div>
        </FadeUp>

        {/* Review cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <FadeUp key={i} delay={i * 0.15}>
              <div className="relative bg-charcoal-800 border border-white/10 rounded-lg p-8 h-full flex flex-col hover:border-[#FFD400]/40 transition-colors duration-300">

                {/* Quote icon */}
                <div className="absolute top-6 right-8 opacity-10">
                  <Quote className="w-16 h-16 text-[#FFD400]" />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, s) => (
                    <Star key={s} className="w-5 h-5 fill-yellow-500 text-brand" />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-slate-300 text-base leading-relaxed flex-1 italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Note */}
                {t.note && (
                  <p className="mt-4 text-slate-500 text-sm italic">
                    {t.note}
                  </p>
                )}

                {/* Divider */}
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#FFD400]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#FFD400] font-bold text-sm">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-sm">{t.company}</p>
                  </div>
                </div>

              </div>
            </FadeUp>
          ))}
        </div>

        {/* Leave a review CTAs */}
        <FadeUp delay={0.3}>
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-6 text-sm uppercase tracking-widest">Leave Us a Review</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://g.page/r/CTQw_n9829lZEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white font-bold rounded hover:bg-brand-dark transition-colors duration-200 text-sm tracking-wide"
              >
                <Star className="w-4 h-4" />
                Review Lancaster Location
              </a>
              <a
                href="https://g.page/r/CQNtD81aJROfEAE/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#FFD400] text-[#FFD400] font-bold rounded hover:bg-[#FFD400]/10 transition-colors duration-200 text-sm tracking-wide"
              >
                <Star className="w-4 h-4" />
                Review Berks Location
              </a>
            </div>
          </div>
        </FadeUp>

      </div>
    </section>
  );
}
