const fs = require('fs')

const images = [
  { name: 'project-kitchen.jpg',   label: 'Kitchen Remodel',        icon: '🍳', color1: '#1a0f00', color2: '#3d2200' },
  { name: 'project-bath.jpg',      label: 'Master Bathroom',         icon: '🚿', color1: '#0a0f1a', color2: '#0d1f3d' },
  { name: 'pressure-washing.jpg',  label: 'Pressure Washing',        icon: '💧', color1: '#001a0f', color2: '#003d22' },
  { name: 'project-wash.jpg',      label: 'Exterior House Wash',     icon: '🏠', color1: '#0d0d1a', color2: '#1a1a3d' },
  { name: 'project-basement.jpg',  label: 'Basement Finishing',      icon: '🏗️', color1: '#0f0a00', color2: '#2b1f00' },
  { name: 'project-deck.jpg',      label: 'Deck Construction',       icon: '🌿', color1: '#001a0a', color2: '#003d1a' },
  { name: 'contracting.jpg',       label: 'General Contracting',     icon: '🔨', color1: '#1a0a00', color2: '#3d1500' },
  { name: 'hero-bg.jpg',           label: 'Powell Renovations',      icon: '⚙️', color1: '#050505', color2: '#151005' },
]

images.forEach(({ name, label, icon, color1, color2 }) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}"/>
      <stop offset="100%" stop-color="${color2}"/>
    </linearGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(196,146,42,0.06)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="800" fill="url(#g)"/>
  <rect width="1200" height="800" fill="url(#grid)"/>
  <text x="600" y="340" font-size="100" text-anchor="middle" dominant-baseline="middle">${icon}</text>
  <text x="600" y="450" font-family="Georgia,serif" font-size="42" font-weight="bold" fill="#C4922A" text-anchor="middle" letter-spacing="2">${label.toUpperCase()}</text>
  <text x="600" y="510" font-family="Arial,sans-serif" font-size="22" fill="rgba(255,255,255,0.4)" text-anchor="middle">POWELL RENOVATIONS</text>
  <line x1="480" y1="490" x2="720" y2="490" stroke="#C4922A" stroke-width="1" opacity="0.5"/>
</svg>`
  // Write as SVG but name it jpg (browsers handle it fine)
  fs.writeFileSync(name.replace('.jpg', '.svg'), svg)
  console.log('created', name.replace('.jpg', '.svg'))
})
