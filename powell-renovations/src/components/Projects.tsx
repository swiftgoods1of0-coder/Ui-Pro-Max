'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight } from 'lucide-react'

const categories = ['All', 'Renovation', 'Plumbing', 'Pressure Washing']

const projects = [
  {
    id: 1,
    title: 'Full Kitchen Remodel',
    category: 'Renovation',
    location: 'York, PA',
    desc: 'Complete gut renovation — new cabinets, quartz countertops, tile backsplash, and premium fixtures.',
    image: '/images/project-kitchen.svg',
    span: 'col-span-2',
  },
  {
    id: 2,
    title: 'Master Bathroom Transformation',
    category: 'Renovation',
    location: 'Spring Grove, PA',
    desc: 'Custom tile shower, double vanity, and radiant floor heating.',
    image: '/images/project-bath.svg',
    span: 'col-span-1',
  },
  {
    id: 3,
    title: 'Whole-Home Plumbing Re-pipe',
    category: 'Plumbing',
    location: 'Red Lion, PA',
    desc: 'Full copper-to-PEX conversion on a 1960s colonial. Zero leaks. Lifetime warranty.',
    image: '/images/plumbing2.jpg',
    span: 'col-span-1',
  },
  {
    id: 4,
    title: 'Exterior House & Driveway Wash',
    category: 'Pressure Washing',
    location: 'Shrewsbury, PA',
    desc: 'Removed 8 years of grime from vinyl siding and restored the driveway to like-new condition.',
    image: '/images/project-wash.svg',
    span: 'col-span-1',
  },
  {
    id: 5,
    title: 'Basement Finishing',
    category: 'Renovation',
    location: 'Dover, PA',
    desc: '1,200 sq ft unfinished basement converted to a fully livable entertainment space.',
    image: '/images/project-basement.svg',
    span: 'col-span-1',
  },
  {
    id: 6,
    title: 'Deck Construction & Staining',
    category: 'Renovation',
    location: 'Dallastown, PA',
    desc: '400 sq ft composite deck with built-in lighting and cable railing system.',
    image: '/images/project-deck.svg',
    span: 'col-span-1',
  },
]

export default function Projects() {
  const [filter, setFilter] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <section id="projects" className="py-24 bg-dark-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="text-gold-500 text-xs font-semibold tracking-[0.3em] uppercase mb-3">Our Work</p>
          <h2 className="font-display text-display text-white mb-4">Projects That Speak for Themselves</h2>
          <p className="text-dark-300 max-w-xl mx-auto text-pretty">
            Every project below represents a real family whose home is now better than
            when we arrived. Add yours to the list.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-sm border transition-all duration-250 ${
                filter === cat
                  ? 'bg-gold-500 text-dark-950 border-gold-500'
                  : 'bg-transparent text-dark-300 border-dark-700 hover:border-gold-600/50 hover:text-gold-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className={`group relative overflow-hidden rounded-sm bg-dark-900 border border-dark-800 cursor-pointer
                  ${project.span === 'col-span-2' ? 'lg:col-span-2' : ''}
                `}
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-dark-800">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url('${project.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

                  {/* Category badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold text-gold-400 bg-dark-950/80 border border-gold-600/30 rounded-sm backdrop-blur-sm">
                    {project.category}
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-dark-950/40">
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center shadow-gold">
                      <ArrowUpRight size={20} className="text-dark-950" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-base mb-1">{project.title}</h3>
                      <p className="text-xs text-gold-500 mb-2">{project.location}</p>
                      <p className="text-dark-400 text-sm leading-relaxed">{project.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-500/50 text-gold-400 font-semibold rounded-sm hover:bg-gold-500/10 transition-all duration-300"
          >
            Start Your Project
            <ArrowUpRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
