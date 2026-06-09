#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const dir = __dirname

// ── Kitchen ──────────────────────────────────────────────────────────────────
const kitchen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="kwall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1c1a16"/>
    <stop offset="100%" stop-color="#2a2518"/>
  </linearGradient>
  <linearGradient id="kfloor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3b2e1a"/>
    <stop offset="100%" stop-color="#1e1710"/>
  </linearGradient>
  <linearGradient id="kcab" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1e2530"/>
    <stop offset="100%" stop-color="#141c26"/>
  </linearGradient>
  <linearGradient id="klight" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#f5e8c8" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#f5e8c8" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="kquartz" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#e8e2d8"/>
    <stop offset="40%" stop-color="#f0ece4"/>
    <stop offset="100%" stop-color="#d8d0c4"/>
  </linearGradient>
  <linearGradient id="kbacksplash" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c8b88a"/>
    <stop offset="100%" stop-color="#a89668"/>
  </linearGradient>
  <filter id="glow">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Wall -->
<rect width="800" height="520" fill="url(#kwall)"/>
<!-- Floor -->
<rect y="400" width="800" height="120" fill="url(#kfloor)"/>
<!-- Floor tiles -->
<line x1="0" y1="440" x2="800" y2="440" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="0" y1="480" x2="800" y2="480" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="100" y1="400" x2="100" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="200" y1="400" x2="200" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="300" y1="400" x2="300" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="400" y1="400" x2="400" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="500" y1="400" x2="500" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="600" y1="400" x2="600" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>
<line x1="700" y1="400" x2="700" y2="520" stroke="#2a1e10" stroke-width="1.5" opacity="0.6"/>

<!-- Upper cabinets left -->
<rect x="0" y="60" width="260" height="160" fill="url(#kcab)"/>
<rect x="4" y="64" width="120" height="152" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="8" y="68" width="112" height="144" rx="1" fill="none" stroke="#3a4a5c" stroke-width="0.8"/>
<rect x="136" y="64" width="120" height="152" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="140" y="68" width="112" height="144" rx="1" fill="none" stroke="#3a4a5c" stroke-width="0.8"/>
<!-- Handles left upper -->
<rect x="56" y="136" width="30" height="5" rx="2.5" fill="#c4922a" opacity="0.9"/>
<rect x="184" y="136" width="30" height="5" rx="2.5" fill="#c4922a" opacity="0.9"/>

<!-- Upper cabinets right -->
<rect x="540" y="60" width="260" height="160" fill="url(#kcab)"/>
<rect x="544" y="64" width="120" height="152" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="548" y="68" width="112" height="144" rx="1" fill="none" stroke="#3a4a5c" stroke-width="0.8"/>
<rect x="676" y="64" width="120" height="152" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="680" y="68" width="112" height="144" rx="1" fill="none" stroke="#3a4a5c" stroke-width="0.8"/>
<!-- Handles right upper -->
<rect x="596" y="136" width="30" height="5" rx="2.5" fill="#c4922a" opacity="0.9"/>
<rect x="724" y="136" width="30" height="5" rx="2.5" fill="#c4922a" opacity="0.9"/>

<!-- Window -->
<rect x="290" y="50" width="220" height="160" fill="#0d1f35"/>
<rect x="296" y="56" width="208" height="148" fill="#162a42"/>
<!-- Window frame lines -->
<line x1="400" y1="56" x2="400" y2="204" stroke="#1e3a55" stroke-width="3"/>
<line x1="296" y1="128" x2="504" y2="128" stroke="#1e3a55" stroke-width="3"/>
<!-- Window light effect -->
<rect x="296" y="56" width="208" height="148" fill="url(#klight)" opacity="0.3"/>
<!-- Window trim -->
<rect x="288" y="46" width="224" height="170" fill="none" stroke="#2d3a4a" stroke-width="4"/>

<!-- Backsplash area -->
<rect x="0" y="220" width="800" height="80" fill="#b8a878" opacity="0.15"/>
<!-- Tile pattern -->
<g opacity="0.6">
  <line x1="0" y1="240" x2="800" y2="240" stroke="#a09060" stroke-width="1"/>
  <line x1="0" y1="260" x2="800" y2="260" stroke="#a09060" stroke-width="1"/>
  <line x1="0" y1="280" x2="800" y2="280" stroke="#a09060" stroke-width="1"/>
  <line x1="0" y1="300" x2="800" y2="300" stroke="#a09060" stroke-width="1"/>
  <line x1="40" y1="220" x2="40" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="80" y1="220" x2="80" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="120" y1="220" x2="120" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="160" y1="220" x2="160" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="200" y1="220" x2="200" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="240" y1="220" x2="240" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="280" y1="220" x2="280" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="320" y1="220" x2="320" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="360" y1="220" x2="360" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="400" y1="220" x2="400" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="440" y1="220" x2="440" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="480" y1="220" x2="480" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="520" y1="220" x2="520" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="560" y1="220" x2="560" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="600" y1="220" x2="600" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="640" y1="220" x2="640" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="680" y1="220" x2="680" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="720" y1="220" x2="720" y2="300" stroke="#a09060" stroke-width="0.8"/>
  <line x1="760" y1="220" x2="760" y2="300" stroke="#a09060" stroke-width="0.8"/>
</g>

<!-- Counter / lower cabinets -->
<rect x="0" y="300" width="800" height="100" fill="url(#kcab)"/>
<!-- Cabinet doors lower -->
<rect x="4" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="98" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="192" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="518" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="612" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<rect x="706" y="304" width="90" height="92" fill="none" stroke="#2d3a4a" stroke-width="1.5"/>
<!-- Handles lower -->
<rect x="40" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="134" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="228" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="554" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="648" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="742" y="348" width="20" height="4" rx="2" fill="#c4922a" opacity="0.9"/>

<!-- Quartz countertop -->
<rect x="0" y="290" width="800" height="15" fill="url(#kquartz)"/>
<rect x="0" y="290" width="800" height="2" fill="#fff" opacity="0.4"/>

<!-- Island -->
<rect x="220" y="330" width="360" height="80" rx="2" fill="#1a2230"/>
<rect x="220" y="320" width="360" height="15" fill="url(#kquartz)"/>
<rect x="220" y="320" width="360" height="2" fill="#fff" opacity="0.5"/>
<!-- Island handles -->
<rect x="370" y="370" width="25" height="4" rx="2" fill="#c4922a" opacity="0.9"/>

<!-- Pendant lights -->
<line x1="300" y1="0" x2="300" y2="60" stroke="#8a7a5a" stroke-width="2"/>
<circle cx="300" cy="65" r="12" fill="#2a2010"/>
<circle cx="300" cy="65" r="9" fill="#c4922a" opacity="0.8"/>
<circle cx="300" cy="65" r="5" fill="#f5e8c8" filter="url(#glow)"/>
<ellipse cx="300" cy="100" rx="80" ry="40" fill="url(#klight)" opacity="0.25"/>

<line x1="500" y1="0" x2="500" y2="60" stroke="#8a7a5a" stroke-width="2"/>
<circle cx="500" cy="65" r="12" fill="#2a2010"/>
<circle cx="500" cy="65" r="9" fill="#c4922a" opacity="0.8"/>
<circle cx="500" cy="65" r="5" fill="#f5e8c8" filter="url(#glow)"/>
<ellipse cx="500" cy="100" rx="80" ry="40" fill="url(#klight)" opacity="0.25"/>

<!-- Sink -->
<rect x="286" y="292" width="80" height="12" rx="1" fill="#c8c0b0"/>
<rect x="290" y="293" width="72" height="10" rx="1" fill="#9a9488"/>
<!-- Faucet -->
<rect x="322" y="275" width="6" height="18" rx="3" fill="#b8a878"/>
<rect x="318" y="273" width="14" height="4" rx="2" fill="#b8a878"/>

<!-- Dark overlay for photo effect -->
<rect width="800" height="520" fill="rgba(0,0,0,0.18)"/>
<!-- Vignette -->
<radialGradient id="vig" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#vig)"/>
</svg>`

// ── Bathroom ─────────────────────────────────────────────────────────────────
const bathroom = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="bwall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a1c20"/>
    <stop offset="100%" stop-color="#222530"/>
  </linearGradient>
  <linearGradient id="btile" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#2a2d35"/>
    <stop offset="100%" stop-color="#1e2028"/>
  </linearGradient>
  <linearGradient id="bmarble" x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0%" stop-color="#e8e4dc"/>
    <stop offset="30%" stop-color="#f0ece6"/>
    <stop offset="60%" stop-color="#d8d4cc"/>
    <stop offset="100%" stop-color="#e4e0d8"/>
  </linearGradient>
  <linearGradient id="bglass" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#4a6a8a" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#6a8aaa" stop-opacity="0.15"/>
  </linearGradient>
  <linearGradient id="blight" x1="0.5" y1="0" x2="0.5" y2="1">
    <stop offset="0%" stop-color="#e8d8b0" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#e8d8b0" stop-opacity="0"/>
  </linearGradient>
</defs>
<!-- Background -->
<rect width="800" height="520" fill="url(#bwall)"/>
<!-- Large format wall tiles -->
<g fill="url(#btile)" stroke="#2e3240" stroke-width="1">
  <rect x="0" y="0" width="200" height="160"/>
  <rect x="202" y="0" width="200" height="160"/>
  <rect x="404" y="0" width="200" height="160"/>
  <rect x="606" y="0" width="194" height="160"/>
  <rect x="0" y="162" width="200" height="160"/>
  <rect x="202" y="162" width="200" height="160"/>
  <rect x="404" y="162" width="200" height="160"/>
  <rect x="606" y="162" width="194" height="160"/>
  <rect x="0" y="324" width="200" height="196"/>
  <rect x="202" y="324" width="200" height="196"/>
  <rect x="404" y="324" width="200" height="196"/>
  <rect x="606" y="324" width="194" height="196"/>
</g>
<!-- Tile veining/texture -->
<line x1="20" y1="0" x2="60" y2="160" stroke="#3a3e4a" stroke-width="0.5" opacity="0.4"/>
<line x1="80" y1="0" x2="40" y2="160" stroke="#3a3e4a" stroke-width="0.5" opacity="0.3"/>
<line x1="240" y1="0" x2="280" y2="160" stroke="#3a3e4a" stroke-width="0.5" opacity="0.4"/>
<line x1="440" y1="0" x2="480" y2="160" stroke="#3a3e4a" stroke-width="0.5" opacity="0.35"/>
<line x1="650" y1="0" x2="680" y2="160" stroke="#3a3e4a" stroke-width="0.5" opacity="0.4"/>

<!-- Floor -->
<rect x="0" y="420" width="800" height="100" fill="#1a1c1e"/>
<!-- Floor tiles hexagonal-ish -->
<g stroke="#252830" stroke-width="1.5" fill="#1e2025">
  <rect x="0" y="422" width="80" height="50"/>
  <rect x="82" y="422" width="80" height="50"/>
  <rect x="164" y="422" width="80" height="50"/>
  <rect x="246" y="422" width="80" height="50"/>
  <rect x="328" y="422" width="80" height="50"/>
  <rect x="410" y="422" width="80" height="50"/>
  <rect x="492" y="422" width="80" height="50"/>
  <rect x="574" y="422" width="80" height="50"/>
  <rect x="656" y="422" width="80" height="50"/>
  <rect x="738" y="422" width="62" height="50"/>
  <rect x="40" y="474" width="80" height="46"/>
  <rect x="122" y="474" width="80" height="46"/>
  <rect x="204" y="474" width="80" height="46"/>
  <rect x="286" y="474" width="80" height="46"/>
  <rect x="368" y="474" width="80" height="46"/>
  <rect x="450" y="474" width="80" height="46"/>
  <rect x="532" y="474" width="80" height="46"/>
  <rect x="614" y="474" width="80" height="46"/>
  <rect x="696" y="474" width="104" height="46"/>
</g>

<!-- Shower enclosure - large walk-in shower right side -->
<rect x="450" y="60" width="340" height="360" fill="#141820" opacity="0.6"/>
<!-- Shower tiles - vertical strips -->
<g fill="#1e2230" stroke="#283040" stroke-width="0.8">
  <rect x="452" y="62" width="106" height="96"/>
  <rect x="560" y="62" width="106" height="96"/>
  <rect x="668" y="62" width="120" height="96"/>
  <rect x="452" y="160" width="106" height="96"/>
  <rect x="560" y="160" width="106" height="96"/>
  <rect x="668" y="160" width="120" height="96"/>
  <rect x="452" y="258" width="106" height="96"/>
  <rect x="560" y="258" width="106" height="96"/>
  <rect x="668" y="258" width="120" height="96"/>
  <rect x="452" y="356" width="336" height="64"/>
</g>
<!-- Marble accent strip in shower -->
<rect x="452" y="220" width="336" height="8" fill="url(#bmarble)" opacity="0.8"/>

<!-- Glass shower door -->
<rect x="448" y="62" width="6" height="358" fill="#8aA0B0" opacity="0.6"/>
<rect x="452" y="62" width="160" height="358" fill="url(#bglass)"/>
<!-- Door frame -->
<rect x="446" y="60" width="4" height="362" rx="2" fill="#8a9aaa"/>
<rect x="450" y="418" width="164" height="4" rx="2" fill="#8a9aaa"/>
<!-- Door handle -->
<rect x="455" y="230" width="4" height="40" rx="2" fill="#c4922a"/>

<!-- Rainfall shower head -->
<rect x="570" y="62" width="80" height="6" rx="3" fill="#8a9aaa"/>
<rect x="598" y="55" width="6" height="10" fill="#8a9aaa"/>
<!-- Water stream dots -->
<g fill="#6a9ab0" opacity="0.4">
  <rect x="576" y="70" width="2" height="8" rx="1"/>
  <rect x="582" y="72" width="2" height="12" rx="1"/>
  <rect x="588" y="69" width="2" height="10" rx="1"/>
  <rect x="594" y="73" width="2" height="8" rx="1"/>
  <rect x="600" y="70" width="2" height="14" rx="1"/>
  <rect x="606" y="71" width="2" height="9" rx="1"/>
  <rect x="612" y="74" width="2" height="11" rx="1"/>
  <rect x="618" y="70" width="2" height="8" rx="1"/>
  <rect x="624" y="72" width="2" height="12" rx="1"/>
  <rect x="630" y="69" width="2" height="10" rx="1"/>
  <rect x="636" y="73" width="2" height="8" rx="1"/>
  <rect x="642" y="70" width="2" height="9" rx="1"/>
</g>

<!-- Double vanity left side -->
<rect x="0" y="330" width="420" height="90" fill="#16191e"/>
<!-- Vanity cabinet doors -->
<rect x="4" y="334" width="100" height="82" fill="#1a1e26" stroke="#252d38" stroke-width="1.5" rx="1"/>
<rect x="108" y="334" width="100" height="82" fill="#1a1e26" stroke="#252d38" stroke-width="1.5" rx="1"/>
<rect x="212" y="334" width="100" height="82" fill="#1a1e26" stroke="#252d38" stroke-width="1.5" rx="1"/>
<rect x="316" y="334" width="100" height="82" fill="#1a1e26" stroke="#252d38" stroke-width="1.5" rx="1"/>
<!-- Vanity handles gold -->
<rect x="46" y="372" width="18" height="3" rx="1.5" fill="#c4922a"/>
<rect x="150" y="372" width="18" height="3" rx="1.5" fill="#c4922a"/>
<rect x="254" y="372" width="18" height="3" rx="1.5" fill="#c4922a"/>
<rect x="358" y="372" width="18" height="3" rx="1.5" fill="#c4922a"/>

<!-- Marble countertop -->
<rect x="0" y="320" width="420" height="14" fill="url(#bmarble)"/>
<rect x="0" y="320" width="420" height="2" fill="#fff" opacity="0.5"/>

<!-- Two sinks -->
<ellipse cx="105" cy="326" rx="70" ry="10" fill="#888" opacity="0.4"/>
<ellipse cx="105" cy="326" rx="58" ry="8" fill="#444" opacity="0.6"/>
<ellipse cx="310" cy="326" rx="70" ry="10" fill="#888" opacity="0.4"/>
<ellipse cx="310" cy="326" rx="58" ry="8" fill="#444" opacity="0.6"/>

<!-- Gold faucets -->
<rect x="99" y="295" width="12" height="28" rx="6" fill="#c4922a"/>
<rect x="88" y="293" width="34" height="5" rx="2.5" fill="#c4922a"/>
<rect x="304" y="295" width="12" height="28" rx="6" fill="#c4922a"/>
<rect x="293" y="293" width="34" height="5" rx="2.5" fill="#c4922a"/>

<!-- Mirror (large) -->
<rect x="10" y="80" width="400" height="200" fill="#0e1520" stroke="#3a4a5c" stroke-width="3"/>
<rect x="10" y="80" width="400" height="200" fill="#162030" opacity="0.5"/>
<!-- Mirror reflection hint -->
<rect x="14" y="84" width="392" height="192" fill="none" stroke="#4a6a8a" stroke-width="0.5" opacity="0.5"/>

<!-- Mirror lighting bars top -->
<rect x="10" y="74" width="400" height="8" rx="4" fill="#2a3040"/>
<rect x="10" y="74" width="400" height="3" rx="1.5" fill="#e8d8b0" opacity="0.7" filter="url(#glow)"/>

<!-- Warm light glow from lighting -->
<ellipse cx="210" cy="82" rx="180" ry="30" fill="url(#blight)" opacity="0.4"/>

<!-- Vignette -->
<radialGradient id="bvig" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#bvig)"/>
</svg>`

// ── Pressure Washing ──────────────────────────────────────────────────────────
const pressureWash = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1628"/>
    <stop offset="100%" stop-color="#1a2a3a"/>
  </linearGradient>
  <linearGradient id="psiding-dirty" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a3628"/>
    <stop offset="100%" stop-color="#2e2a1e"/>
  </linearGradient>
  <linearGradient id="psiding-clean" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c8d0d8"/>
    <stop offset="100%" stop-color="#b0bac4"/>
  </linearGradient>
  <linearGradient id="pdrive-dirty" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a2820"/>
    <stop offset="100%" stop-color="#1e1c18"/>
  </linearGradient>
  <linearGradient id="pdrive-clean" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#8a8880"/>
    <stop offset="100%" stop-color="#707068"/>
  </linearGradient>
  <linearGradient id="pwater" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#80c0e8" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#40a0d0" stop-opacity="0"/>
  </linearGradient>
  <filter id="pglow">
    <feGaussianBlur stdDeviation="4" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Sky -->
<rect width="800" height="520" fill="url(#psky)"/>

<!-- House - dirty left half -->
<rect x="0" y="50" width="400" height="300" fill="url(#psiding-dirty)"/>
<!-- Dirty siding lines -->
<g stroke="#252218" stroke-width="1.5" opacity="0.8">
  <line x1="0" y1="80" x2="400" y2="80"/>
  <line x1="0" y1="100" x2="400" y2="100"/>
  <line x1="0" y1="120" x2="400" y2="120"/>
  <line x1="0" y1="140" x2="400" y2="140"/>
  <line x1="0" y1="160" x2="400" y2="160"/>
  <line x1="0" y1="180" x2="400" y2="180"/>
  <line x1="0" y1="200" x2="400" y2="200"/>
  <line x1="0" y1="220" x2="400" y2="220"/>
  <line x1="0" y1="240" x2="400" y2="240"/>
  <line x1="0" y1="260" x2="400" y2="260"/>
  <line x1="0" y1="280" x2="400" y2="280"/>
  <line x1="0" y1="300" x2="400" y2="300"/>
  <line x1="0" y1="320" x2="400" y2="320"/>
  <line x1="0" y1="340" x2="400" y2="340"/>
</g>
<!-- Algae/dirt stains -->
<rect x="20" y="150" width="60" height="80" rx="4" fill="#3a4a20" opacity="0.3"/>
<rect x="100" y="200" width="40" height="60" rx="4" fill="#2a3a18" opacity="0.25"/>
<rect x="200" y="130" width="80" height="100" rx="6" fill="#3a3820" opacity="0.2"/>
<rect x="310" y="180" width="50" height="70" rx="4" fill="#3a4a20" opacity="0.3"/>

<!-- House - clean right half -->
<rect x="400" y="50" width="400" height="300" fill="url(#psiding-clean)"/>
<!-- Clean siding lines -->
<g stroke="#9aa4ae" stroke-width="1.5" opacity="0.6">
  <line x1="400" y1="80" x2="800" y2="80"/>
  <line x1="400" y1="100" x2="800" y2="100"/>
  <line x1="400" y1="120" x2="800" y2="120"/>
  <line x1="400" y1="140" x2="800" y2="140"/>
  <line x1="400" y1="160" x2="800" y2="160"/>
  <line x1="400" y1="180" x2="800" y2="180"/>
  <line x1="400" y1="200" x2="800" y2="200"/>
  <line x1="400" y1="220" x2="800" y2="220"/>
  <line x1="400" y1="240" x2="800" y2="240"/>
  <line x1="400" y1="260" x2="800" y2="260"/>
  <line x1="400" y1="280" x2="800" y2="280"/>
  <line x1="400" y1="300" x2="800" y2="300"/>
  <line x1="400" y1="320" x2="800" y2="320"/>
  <line x1="400" y1="340" x2="800" y2="340"/>
</g>

<!-- Dividing water spray line -->
<rect x="390" y="50" width="20" height="300" fill="url(#pwater)" opacity="0.8" filter="url(#pglow)"/>
<rect x="395" y="50" width="10" height="300" fill="#a0d8f8" opacity="0.6" filter="url(#pglow)"/>

<!-- Windows dirty left -->
<rect x="60" y="100" width="120" height="100" fill="#1a1e20" opacity="0.7"/>
<rect x="200" y="100" width="120" height="100" fill="#1a1e20" opacity="0.7"/>
<!-- Windows clean right -->
<rect x="440" y="100" width="120" height="100" fill="#2a3a50" opacity="0.9"/>
<rect x="600" y="100" width="120" height="100" fill="#2a3a50" opacity="0.9"/>
<!-- Window reflections -->
<line x1="455" y1="105" x2="475" y2="105" stroke="#4a6a8a" stroke-width="1.5"/>
<line x1="615" y1="105" x2="635" y2="105" stroke="#4a6a8a" stroke-width="1.5"/>
<!-- Window trim clean -->
<rect x="438" y="98" width="124" height="104" fill="none" stroke="#c8d0d8" stroke-width="3"/>
<rect x="598" y="98" width="124" height="104" fill="none" stroke="#c8d0d8" stroke-width="3"/>

<!-- Driveway - dirty left -->
<rect x="0" y="350" width="400" height="170" fill="url(#pdrive-dirty)"/>
<g stroke="#1a1810" stroke-width="1" opacity="0.5">
  <line x1="0" y1="370" x2="400" y2="370"/>
  <line x1="0" y1="390" x2="400" y2="390"/>
  <line x1="0" y1="410" x2="400" y2="410"/>
  <line x1="0" y1="430" x2="400" y2="430"/>
  <line x1="0" y1="450" x2="400" y2="450"/>
  <line x1="100" y1="350" x2="100" y2="520"/>
  <line x1="200" y1="350" x2="200" y2="520"/>
  <line x1="300" y1="350" x2="300" y2="520"/>
</g>
<!-- Driveway stains dirty -->
<ellipse cx="150" cy="400" rx="80" ry="30" fill="#1a1808" opacity="0.4"/>
<ellipse cx="300" cy="460" rx="60" ry="20" fill="#1a1808" opacity="0.3"/>

<!-- Driveway - clean right -->
<rect x="400" y="350" width="400" height="170" fill="url(#pdrive-clean)"/>
<g stroke="#606058" stroke-width="1" opacity="0.4">
  <line x1="400" y1="370" x2="800" y2="370"/>
  <line x1="400" y1="390" x2="800" y2="390"/>
  <line x1="400" y1="410" x2="800" y2="410"/>
  <line x1="400" y1="430" x2="800" y2="430"/>
  <line x1="400" y1="450" x2="800" y2="450"/>
  <line x1="500" y1="350" x2="500" y2="520"/>
  <line x1="600" y1="350" x2="600" y2="520"/>
  <line x1="700" y1="350" x2="700" y2="520"/>
</g>
<!-- Driveway spray line -->
<rect x="390" y="350" width="20" height="170" fill="url(#pwater)" opacity="0.8" filter="url(#pglow)"/>
<rect x="395" y="350" width="10" height="170" fill="#a0d8f8" opacity="0.6" filter="url(#pglow)"/>

<!-- Worker silhouette right -->
<rect x="520" y="300" width="20" height="60" rx="4" fill="#1a2230" opacity="0.9"/>
<circle cx="530" cy="292" r="14" fill="#1a2230" opacity="0.9"/>
<!-- Pressure washer wand -->
<line x1="540" y1="330" x2="430" y2="380" stroke="#3a4a5a" stroke-width="4"/>
<line x1="430" y1="380" x2="400" y2="350" stroke="#3a4a5a" stroke-width="3"/>

<!-- Water spray fan -->
<path d="M 400 350 L 360 300 L 420 330 Z" fill="url(#pwater)" opacity="0.5" filter="url(#pglow)"/>
<path d="M 400 350 L 380 285 L 420 330 Z" fill="url(#pwater)" opacity="0.4" filter="url(#pglow)"/>

<!-- Labels -->
<rect x="30" y="460" width="80" height="24" rx="4" fill="rgba(0,0,0,0.6)"/>
<text x="70" y="477" font-family="Arial,sans-serif" font-size="11" fill="#a09060" text-anchor="middle">BEFORE</text>
<rect x="680" y="460" width="80" height="24" rx="4" fill="rgba(0,0,0,0.6)"/>
<text x="720" y="477" font-family="Arial,sans-serif" font-size="11" fill="#60a0c4" text-anchor="middle">AFTER</text>

<!-- Vignette -->
<radialGradient id="pvig" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#pvig)"/>
</svg>`

// ── Basement ──────────────────────────────────────────────────────────────────
const basement = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="baswall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#141820"/>
    <stop offset="100%" stop-color="#1a2030"/>
  </linearGradient>
  <linearGradient id="basfloor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a2218"/>
    <stop offset="100%" stop-color="#1a1610"/>
  </linearGradient>
  <linearGradient id="basceil" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0e1218"/>
    <stop offset="100%" stop-color="#141820"/>
  </linearGradient>
  <radialGradient id="baslight1" cx="25%" cy="0%" r="50%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="baslight2" cx="50%" cy="0%" r="50%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="baslight3" cx="75%" cy="0%" r="50%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <linearGradient id="tvscreen" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1628"/>
    <stop offset="40%" stop-color="#1a3050"/>
    <stop offset="100%" stop-color="#0a1020"/>
  </linearGradient>
</defs>
<!-- Background -->
<rect width="800" height="520" fill="url(#baswall)"/>
<!-- Ceiling -->
<rect x="0" y="0" width="800" height="50" fill="url(#basceil)"/>
<!-- Recessed lighting can housings -->
<ellipse cx="200" cy="45" rx="20" ry="6" fill="#1e2430"/>
<ellipse cx="200" cy="44" rx="14" ry="4" fill="#c4922a" opacity="0.7"/>
<ellipse cx="400" cy="45" rx="20" ry="6" fill="#1e2430"/>
<ellipse cx="400" cy="44" rx="14" ry="4" fill="#c4922a" opacity="0.7"/>
<ellipse cx="600" cy="45" rx="20" ry="6" fill="#1e2430"/>
<ellipse cx="600" cy="44" rx="14" ry="4" fill="#c4922a" opacity="0.7"/>
<!-- Light cones -->
<rect x="0" y="46" width="800" height="300" fill="url(#baslight1)" opacity="0.8"/>
<rect x="0" y="46" width="800" height="300" fill="url(#baslight2)" opacity="0.8"/>
<rect x="0" y="46" width="800" height="300" fill="url(#baslight3)" opacity="0.8"/>

<!-- Floor - LVP planks -->
<rect x="0" y="400" width="800" height="120" fill="url(#basfloor)"/>
<g stroke="#251d14" stroke-width="1.2" opacity="0.7">
  <line x1="0" y1="420" x2="800" y2="420"/>
  <line x1="0" y1="440" x2="800" y2="440"/>
  <line x1="0" y1="460" x2="800" y2="460"/>
  <line x1="0" y1="480" x2="800" y2="480"/>
  <line x1="0" y1="500" x2="800" y2="500"/>
  <line x1="120" y1="400" x2="120" y2="520"/>
  <line x1="240" y1="400" x2="240" y2="520"/>
  <line x1="360" y1="400" x2="360" y2="520"/>
  <line x1="480" y1="400" x2="480" y2="520"/>
  <line x1="600" y1="400" x2="600" y2="520"/>
  <line x1="720" y1="400" x2="720" y2="520"/>
</g>

<!-- Back wall with TV unit -->
<rect x="100" y="80" width="600" height="320" fill="#111520" opacity="0.4"/>

<!-- Built-in shelving / entertainment unit -->
<rect x="80" y="60" width="640" height="340" fill="#0e1218"/>
<rect x="84" y="64" width="632" height="332" fill="#141820" stroke="#1e2430" stroke-width="1"/>
<!-- Shelf dividers -->
<line x1="280" y1="64" x2="280" y2="396" stroke="#1e2430" stroke-width="2"/>
<line x1="520" y1="64" x2="520" y2="396" stroke="#1e2430" stroke-width="2"/>
<line x1="84" y1="250" x2="280" y2="250" stroke="#1e2430" stroke-width="2"/>
<line x1="520" y1="250" x2="716" y2="250" stroke="#1e2430" stroke-width="2"/>

<!-- TV (center large) -->
<rect x="284" y="68" width="232" height="140" fill="url(#tvscreen)" rx="2"/>
<rect x="284" y="68" width="232" height="140" fill="none" stroke="#3a4a5a" stroke-width="3" rx="2"/>
<!-- TV stand -->
<rect x="380" y="208" width="40" height="8" fill="#252d38"/>
<rect x="370" y="214" width="60" height="4" fill="#252d38"/>
<!-- TV reflection/screen content hint -->
<rect x="290" y="74" width="220" height="128" fill="#0d1a2e"/>
<line x1="290" y1="120" x2="510" y2="120" stroke="#1a2a3a" stroke-width="0.5" opacity="0.5"/>
<rect x="300" y="80" width="100" height="30" rx="2" fill="#142030" opacity="0.5"/>

<!-- Left side shelves content - bar area -->
<rect x="90" y="256" width="184" height="136" fill="#0e1218"/>
<!-- Bar shelves -->
<line x1="90" y1="300" x2="274" y2="300" stroke="#1e2430" stroke-width="1.5"/>
<line x1="90" y1="330" x2="274" y2="330" stroke="#1e2430" stroke-width="1.5"/>
<line x1="90" y1="360" x2="274" y2="360" stroke="#1e2430" stroke-width="1.5"/>
<!-- Bottles silhouettes -->
<rect x="100" y="272" width="14" height="26" rx="4" fill="#2a4a2a" opacity="0.7"/>
<rect x="118" y="268" width="14" height="30" rx="4" fill="#4a2a10" opacity="0.7"/>
<rect x="136" y="272" width="14" height="26" rx="4" fill="#1a3a1a" opacity="0.7"/>
<rect x="154" y="270" width="14" height="28" rx="4" fill="#3a1a10" opacity="0.7"/>
<rect x="172" y="272" width="14" height="26" rx="4" fill="#2a3a4a" opacity="0.7"/>
<rect x="190" y="268" width="14" height="30" rx="4" fill="#4a3a10" opacity="0.7"/>
<rect x="208" y="272" width="14" height="26" rx="4" fill="#2a4a2a" opacity="0.7"/>
<rect x="226" y="270" width="14" height="28" rx="4" fill="#1a2a3a" opacity="0.7"/>
<!-- Gold bottle caps/tops -->
<rect x="101" y="270" width="12" height="4" rx="2" fill="#c4922a" opacity="0.6"/>
<rect x="119" y="266" width="12" height="4" rx="2" fill="#c4922a" opacity="0.6"/>

<!-- Right side decorative shelves -->
<rect x="526" y="256" width="184" height="136" fill="#0e1218"/>
<line x1="526" y1="300" x2="710" y2="300" stroke="#1e2430" stroke-width="1.5"/>
<line x1="526" y1="345" x2="710" y2="345" stroke="#1e2430" stroke-width="1.5"/>
<!-- Decorative items -->
<rect x="540" y="268" width="30" height="28" rx="2" fill="#2a3a4a" opacity="0.6"/>
<rect x="580" y="265" width="20" height="32" rx="2" fill="#1a2a1a" opacity="0.6"/>
<rect x="610" y="270" width="25" height="28" rx="2" fill="#3a2a1a" opacity="0.6"/>
<rect x="650" y="266" width="20" height="30" rx="2" fill="#2a1a3a" opacity="0.6"/>
<rect x="680" y="268" width="18" height="28" rx="2" fill="#1a3a2a" opacity="0.6"/>

<!-- LED strip accent lighting -->
<rect x="84" y="60" width="632" height="4" fill="#c4922a" opacity="0.5"/>
<rect x="84" y="60" width="632" height="2" fill="#e8c870" opacity="0.4" filter="url(#baslight2)"/>

<!-- Couch / seating area -->
<rect x="150" y="370" width="500" height="40" rx="4" fill="#1e2840"/>
<rect x="150" y="352" width="500" height="22" rx="2" fill="#253050"/>
<!-- Couch back -->
<rect x="144" y="340" width="512" height="30" rx="3" fill="#1a2238"/>
<!-- Couch cushions -->
<rect x="158" y="354" width="120" height="18" rx="2" fill="#2a3650"/>
<rect x="290" y="354" width="120" height="18" rx="2" fill="#2a3650"/>
<rect x="422" y="354" width="120" height="18" rx="2" fill="#2a3650"/>
<!-- Throw pillows gold -->
<rect x="544" y="346" width="40" height="30" rx="4" fill="#c4922a" opacity="0.7"/>
<rect x="210" y="346" width="35" height="28" rx="4" fill="#c4922a" opacity="0.5"/>

<!-- Vignette -->
<radialGradient id="basvig" cx="50%" cy="50%" r="75%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.6)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#basvig)"/>
</svg>`

// ── Deck ──────────────────────────────────────────────────────────────────────
const deck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1828"/>
    <stop offset="40%" stop-color="#1a2a3a"/>
    <stop offset="100%" stop-color="#243040"/>
  </linearGradient>
  <linearGradient id="dboard" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#4a3820"/>
    <stop offset="40%" stop-color="#5a4830"/>
    <stop offset="70%" stop-color="#4a3820"/>
    <stop offset="100%" stop-color="#3a2c18"/>
  </linearGradient>
  <linearGradient id="dboard2" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#3e3018"/>
    <stop offset="50%" stop-color="#4e3e28"/>
    <stop offset="100%" stop-color="#3e3018"/>
  </linearGradient>
  <linearGradient id="dhouse" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a3040"/>
    <stop offset="100%" stop-color="#1a2030"/>
  </linearGradient>
  <radialGradient id="dlight1" cx="20%" cy="30%" r="25%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="dlight2" cx="50%" cy="35%" r="20%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="dlight3" cx="80%" cy="30%" r="25%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
</defs>
<!-- Sky / evening background -->
<rect width="800" height="520" fill="url(#dsky)"/>
<!-- Stars -->
<circle cx="50" cy="30" r="1" fill="#fff" opacity="0.7"/>
<circle cx="150" cy="15" r="1.2" fill="#fff" opacity="0.5"/>
<circle cx="250" cy="40" r="1" fill="#fff" opacity="0.6"/>
<circle cx="450" cy="20" r="1.5" fill="#fff" opacity="0.7"/>
<circle cx="620" cy="35" r="1" fill="#fff" opacity="0.5"/>
<circle cx="720" cy="15" r="1.2" fill="#fff" opacity="0.6"/>
<circle cx="780" cy="50" r="1" fill="#fff" opacity="0.7"/>

<!-- House back wall -->
<rect x="0" y="50" width="800" height="250" fill="url(#dhouse)"/>
<!-- House siding lines -->
<g stroke="#1e2838" stroke-width="1.5" opacity="0.6">
  <line x1="0" y1="80" x2="800" y2="80"/>
  <line x1="0" y1="100" x2="800" y2="100"/>
  <line x1="0" y1="120" x2="800" y2="120"/>
  <line x1="0" y1="140" x2="800" y2="140"/>
  <line x1="0" y1="160" x2="800" y2="160"/>
  <line x1="0" y1="180" x2="800" y2="180"/>
  <line x1="0" y1="200" x2="800" y2="200"/>
  <line x1="0" y1="220" x2="800" y2="220"/>
  <line x1="0" y1="240" x2="800" y2="240"/>
  <line x1="0" y1="260" x2="800" y2="260"/>
  <line x1="0" y1="280" x2="800" y2="280"/>
</g>
<!-- Windows glowing warm -->
<rect x="80" y="100" width="140" height="110" fill="#c4922a" opacity="0.2"/>
<rect x="80" y="100" width="140" height="110" fill="#e8c870" opacity="0.15"/>
<rect x="80" y="100" width="140" height="110" fill="none" stroke="#3a4a5a" stroke-width="3"/>
<line x1="150" y1="100" x2="150" y2="210" stroke="#3a4a5a" stroke-width="2"/>
<line x1="80" y1="155" x2="220" y2="155" stroke="#3a4a5a" stroke-width="2"/>
<rect x="340" y="100" width="120" height="110" fill="#c4922a" opacity="0.2"/>
<rect x="340" y="100" width="120" height="110" fill="#e8c870" opacity="0.15"/>
<rect x="340" y="100" width="120" height="110" fill="none" stroke="#3a4a5a" stroke-width="3"/>
<rect x="560" y="100" width="160" height="110" fill="#c4922a" opacity="0.2"/>
<rect x="560" y="100" width="160" height="110" fill="#e8c870" opacity="0.15"/>
<rect x="560" y="100" width="160" height="110" fill="none" stroke="#3a4a5a" stroke-width="3"/>
<!-- Door -->
<rect x="360" y="210" width="80" height="90" fill="#1a2030"/>
<rect x="360" y="210" width="80" height="90" fill="none" stroke="#3a4a5a" stroke-width="2"/>
<rect x="378" y="224" width="20" height="30" rx="1" fill="#111820" stroke="#2a3a4a" stroke-width="1"/>
<rect x="400" y="224" width="20" height="30" rx="1" fill="#111820" stroke="#2a3a4a" stroke-width="1"/>
<circle cx="395" cy="254" r="3" fill="#c4922a" opacity="0.8"/>

<!-- House base / foundation -->
<rect x="0" y="298" width="800" height="10" fill="#252d38"/>

<!-- DECK SURFACE -->
<!-- Deck boards - composite horizontal planks -->
<g>
  <rect x="0" y="308" width="800" height="22" fill="url(#dboard)"/>
  <rect x="0" y="332" width="800" height="22" fill="url(#dboard2)"/>
  <rect x="0" y="356" width="800" height="22" fill="url(#dboard)"/>
  <rect x="0" y="380" width="800" height="22" fill="url(#dboard2)"/>
  <rect x="0" y="404" width="800" height="22" fill="url(#dboard)"/>
  <rect x="0" y="428" width="800" height="22" fill="url(#dboard2)"/>
  <rect x="0" y="452" width="800" height="22" fill="url(#dboard)"/>
  <rect x="0" y="476" width="800" height="22" fill="url(#dboard2)"/>
  <rect x="0" y="498" width="800" height="22" fill="url(#dboard)"/>
</g>
<!-- Board grain lines -->
<g stroke="#3a2c14" stroke-width="0.5" opacity="0.4">
  <line x1="80" y1="308" x2="80" y2="520"/>
  <line x1="160" y1="308" x2="160" y2="520"/>
  <line x1="240" y1="308" x2="240" y2="520"/>
  <line x1="320" y1="308" x2="320" y2="520"/>
  <line x1="400" y1="308" x2="400" y2="520"/>
  <line x1="480" y1="308" x2="480" y2="520"/>
  <line x1="560" y1="308" x2="560" y2="520"/>
  <line x1="640" y1="308" x2="640" y2="520"/>
  <line x1="720" y1="308" x2="720" y2="520"/>
</g>
<!-- Board screws -->
<g fill="#2a2010" opacity="0.6">
  <circle cx="40" cy="319" r="2"/>
  <circle cx="120" cy="319" r="2"/>
  <circle cx="200" cy="319" r="2"/>
  <circle cx="280" cy="319" r="2"/>
  <circle cx="360" cy="319" r="2"/>
  <circle cx="440" cy="319" r="2"/>
  <circle cx="520" cy="319" r="2"/>
  <circle cx="600" cy="319" r="2"/>
  <circle cx="680" cy="319" r="2"/>
  <circle cx="760" cy="319" r="2"/>
  <circle cx="40" cy="343" r="2"/>
  <circle cx="120" cy="343" r="2"/>
  <circle cx="200" cy="343" r="2"/>
  <circle cx="280" cy="343" r="2"/>
  <circle cx="360" cy="343" r="2"/>
  <circle cx="440" cy="343" r="2"/>
  <circle cx="520" cy="343" r="2"/>
  <circle cx="600" cy="343" r="2"/>
  <circle cx="680" cy="343" r="2"/>
  <circle cx="760" cy="343" r="2"/>
</g>

<!-- Cable railing posts -->
<rect x="10" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="105" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="200" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="295" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="390" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="485" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="580" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="675" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<rect x="782" y="288" width="8" height="90" rx="2" fill="#c4922a" opacity="0.9"/>
<!-- Cable wires horizontal -->
<g stroke="#a08050" stroke-width="1.5" opacity="0.8">
  <line x1="10" y1="300" x2="790" y2="300"/>
  <line x1="10" y1="312" x2="790" y2="312"/>
  <line x1="10" y1="324" x2="790" y2="324"/>
  <line x1="10" y1="336" x2="790" y2="336"/>
  <line x1="10" y1="348" x2="790" y2="348"/>
  <line x1="10" y1="360" x2="790" y2="360"/>
</g>
<!-- Top rail -->
<rect x="8" y="286" width="784" height="6" rx="3" fill="#c4922a" opacity="0.8"/>

<!-- Built-in LED step lights -->
<rect x="8" y="380" width="12" height="6" rx="2" fill="#e8c870" opacity="0.7"/>
<rect x="8" y="404" width="12" height="6" rx="2" fill="#e8c870" opacity="0.5"/>
<!-- Light halos -->
<ellipse cx="14" cy="383" rx="20" ry="8" fill="url(#dlight1)" opacity="0.6"/>

<!-- String lights overhead -->
<path d="M 50,270 Q 200,290 350,272 Q 500,254 650,270 Q 750,280 800,270" stroke="#8a7a4a" stroke-width="1.5" fill="none" opacity="0.6"/>
<g fill="#e8c870" opacity="0.8">
  <circle cx="100" cy="280" r="4" filter="url(#dlight1)"/>
  <circle cx="200" cy="285" r="4" filter="url(#dlight1)"/>
  <circle cx="300" cy="276" r="4" filter="url(#dlight1)"/>
  <circle cx="400" cy="263" r="4" filter="url(#dlight1)"/>
  <circle cx="500" cy="258" r="4" filter="url(#dlight1)"/>
  <circle cx="600" cy="265" r="4" filter="url(#dlight1)"/>
  <circle cx="700" cy="274" r="4" filter="url(#dlight1)"/>
</g>

<!-- Light glows under lights -->
<rect x="0" y="270" width="800" height="80" fill="url(#dlight2)" opacity="0.5"/>
<rect x="0" y="270" width="800" height="80" fill="url(#dlight3)" opacity="0.4"/>

<!-- Outdoor chairs/furniture silhouette -->
<rect x="560" y="360" width="80" height="50" rx="3" fill="#1a2030" opacity="0.8"/>
<rect x="554" y="340" width="92" height="24" rx="3" fill="#1e2838" opacity="0.8"/>
<rect x="640" y="360" width="80" height="50" rx="3" fill="#1a2030" opacity="0.8"/>
<rect x="634" y="340" width="92" height="24" rx="3" fill="#1e2838" opacity="0.8"/>
<!-- Table -->
<ellipse cx="660" cy="375" rx="45" ry="15" fill="#2a2010" opacity="0.7"/>

<!-- Potted plants -->
<ellipse cx="30" cy="400" rx="18" ry="8" fill="#1a3010" opacity="0.8"/>
<rect x="20" y="368" width="20" height="34" rx="3" fill="#2a1a0a" opacity="0.8"/>
<ellipse cx="30" cy="370" rx="22" ry="28" fill="#1a4010" opacity="0.6"/>
<ellipse cx="770" cy="400" rx="18" ry="8" fill="#1a3010" opacity="0.8"/>
<rect x="760" y="368" width="20" height="34" rx="3" fill="#2a1a0a" opacity="0.8"/>
<ellipse cx="770" cy="370" rx="22" ry="28" fill="#1a4010" opacity="0.6"/>

<!-- Vignette -->
<radialGradient id="dvig" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#dvig)"/>
</svg>`

// ── Contracting / General Renovation ─────────────────────────────────────────
const contracting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="cwall" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1c1a18"/>
    <stop offset="100%" stop-color="#242220"/>
  </linearGradient>
  <linearGradient id="cfloor" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3a3028"/>
    <stop offset="100%" stop-color="#1e1a14"/>
  </linearGradient>
  <linearGradient id="cwainscot" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#2a2620"/>
    <stop offset="100%" stop-color="#1e1c18"/>
  </linearGradient>
  <radialGradient id="clight" cx="50%" cy="0%" r="60%">
    <stop offset="0%" stop-color="#e8d8b0" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <linearGradient id="caccent" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#c4922a"/>
    <stop offset="100%" stop-color="#8a6010"/>
  </linearGradient>
</defs>
<!-- Background wall -->
<rect width="800" height="520" fill="url(#cwall)"/>

<!-- Floor -->
<rect x="0" y="390" width="800" height="130" fill="url(#cfloor)"/>
<!-- Hardwood floor planks -->
<g stroke="#2a2018" stroke-width="1.2" opacity="0.7">
  <line x1="0" y1="410" x2="800" y2="410"/>
  <line x1="0" y1="430" x2="800" y2="430"/>
  <line x1="0" y1="450" x2="800" y2="450"/>
  <line x1="0" y1="470" x2="800" y2="470"/>
  <line x1="0" y1="490" x2="800" y2="490"/>
  <line x1="0" y1="510" x2="800" y2="510"/>
  <line x1="100" y1="390" x2="100" y2="520"/>
  <line x1="180" y1="390" x2="180" y2="520"/>
  <line x1="280" y1="390" x2="280" y2="520"/>
  <line x1="360" y1="390" x2="360" y2="520"/>
  <line x1="460" y1="390" x2="460" y2="520"/>
  <line x1="560" y1="390" x2="560" y2="520"/>
  <line x1="640" y1="390" x2="640" y2="520"/>
  <line x1="740" y1="390" x2="740" y2="520"/>
</g>
<!-- Floor grain -->
<g stroke="#2e2416" stroke-width="0.5" opacity="0.3">
  <line x1="40" y1="390" x2="60" y2="430"/>
  <line x1="150" y1="390" x2="130" y2="430"/>
  <line x1="320" y1="390" x2="340" y2="430"/>
  <line x1="500" y1="390" x2="520" y2="430"/>
  <line x1="680" y1="390" x2="660" y2="430"/>
</g>

<!-- Wainscoting / lower wall paneling -->
<rect x="0" y="270" width="800" height="120" fill="url(#cwainscot)"/>
<rect x="0" y="270" width="800" height="3" fill="#3a3428"/>
<rect x="0" y="390" width="800" height="3" fill="#3a3428"/>
<!-- Panel details -->
<g fill="none" stroke="#302c26" stroke-width="1">
  <rect x="20" y="280" width="120" height="100" rx="1"/>
  <rect x="160" y="280" width="120" height="100" rx="1"/>
  <rect x="300" y="280" width="120" height="100" rx="1"/>
  <rect x="440" y="280" width="120" height="100" rx="1"/>
  <rect x="580" y="280" width="120" height="100" rx="1"/>
  <rect x="660" y="280" width="120" height="100" rx="1"/>
</g>
<!-- Accent molding strip gold -->
<rect x="0" y="270" width="800" height="4" fill="url(#caccent)" opacity="0.7"/>

<!-- Upper wall - dark paint -->
<rect x="0" y="0" width="800" height="273" fill="#1a1818"/>

<!-- Crown molding -->
<rect x="0" y="0" width="800" height="12" fill="#252220"/>
<rect x="0" y="10" width="800" height="5" fill="#2e2a26"/>

<!-- Large window -->
<rect x="280" y="40" width="240" height="220" fill="#0a1422"/>
<rect x="286" y="46" width="228" height="208" fill="#0e1c30"/>
<!-- Window frame -->
<rect x="278" y="38" width="244" height="226" fill="none" stroke="#2a2824" stroke-width="5"/>
<rect x="400" y="38" width="4" height="226" fill="#242020"/>
<rect x="278" y="155" width="244" height="4" fill="#242020"/>
<!-- Window light fill -->
<rect x="286" y="46" width="228" height="208" fill="#1a3050" opacity="0.6"/>
<!-- Window muntins shine -->
<line x1="286" y1="50" x2="290" y2="52" stroke="#4a6a8a" stroke-width="1" opacity="0.7"/>
<!-- Exterior hint through window -->
<rect x="290" y="50" width="106" height="104" fill="#0e2040"/>
<rect x="402" y="50" width="108" height="104" fill="#0e2040"/>
<rect x="290" y="160" width="106" height="90" fill="#0e2040"/>
<rect x="402" y="160" width="108" height="90" fill="#0e2040"/>

<!-- Wall sconces / lighting -->
<rect x="100" y="160" width="14" height="50" rx="3" fill="#2a2620"/>
<rect x="93" y="158" width="28" height="8" rx="3" fill="#1e1c18"/>
<ellipse cx="107" cy="162" rx="10" ry="4" fill="#c4922a" opacity="0.8"/>
<ellipse cx="107" cy="162" rx="5" ry="2" fill="#e8c870" opacity="0.7"/>
<rect x="680" y="160" width="14" height="50" rx="3" fill="#2a2620"/>
<rect x="673" y="158" width="28" height="8" rx="3" fill="#1e1c18"/>
<ellipse cx="687" cy="162" rx="10" ry="4" fill="#c4922a" opacity="0.8"/>
<ellipse cx="687" cy="162" rx="5" ry="2" fill="#e8c870" opacity="0.7"/>

<!-- Overhead warm light cone -->
<rect x="0" y="0" width="800" height="400" fill="url(#clight)" opacity="0.7"/>

<!-- Fireplace / focal point center -->
<rect x="330" y="220" width="140" height="170" fill="#111010"/>
<rect x="330" y="220" width="140" height="170" fill="none" stroke="#3a3230" stroke-width="4"/>
<!-- Mantel -->
<rect x="310" y="215" width="180" height="12" fill="#2a2620"/>
<rect x="305" y="226" width="190" height="6" fill="#252220"/>
<!-- Fireplace surround tiles -->
<g fill="#1a1816" stroke="#2a2620" stroke-width="1">
  <rect x="334" y="224" width="30" height="30"/>
  <rect x="366" y="224" width="30" height="30"/>
  <rect x="398" y="224" width="30" height="30"/>
  <rect x="430" y="224" width="36" height="30"/>
  <rect x="334" y="256" width="30" height="30"/>
  <rect x="430" y="256" width="36" height="30"/>
</g>
<!-- Firebox -->
<rect x="345" y="255" width="110" height="130" fill="#0a0808"/>
<!-- Faux fire -->
<ellipse cx="400" cy="370" rx="50" ry="8" fill="#c4922a" opacity="0.3"/>
<ellipse cx="400" cy="360" rx="30" ry="15" fill="#e85010" opacity="0.4"/>
<ellipse cx="390" cy="345" rx="18" ry="25" fill="#e87020" opacity="0.35"/>
<ellipse cx="412" cy="340" rx="15" ry="22" fill="#e8a020" opacity="0.3"/>
<ellipse cx="400" cy="350" rx="10" ry="18" fill="#f0c040" opacity="0.25"/>

<!-- Decorative objects on mantel -->
<rect x="320" y="196" width="14" height="20" rx="2" fill="#2a3040" opacity="0.7"/>
<ellipse cx="327" cy="196" rx="7" ry="4" fill="#1a2030" opacity="0.7"/>
<rect x="460" y="196" width="14" height="20" rx="2" fill="#2a3040" opacity="0.7"/>
<ellipse cx="467" cy="196" rx="7" ry="4" fill="#1a2030" opacity="0.7"/>

<!-- Furniture silhouette - sofa -->
<rect x="100" y="340" width="240" height="55" rx="3" fill="#1a2030" opacity="0.9"/>
<rect x="94" y="316" width="252" height="28" rx="3" fill="#1e2838"/>
<!-- Cushions -->
<rect x="108" y="318" width="70" height="24" rx="2" fill="#1a2234"/>
<rect x="184" y="318" width="70" height="24" rx="2" fill="#1a2234"/>
<rect x="260" y="318" width="70" height="24" rx="2" fill="#1a2234"/>
<!-- Throw pillow gold -->
<rect x="306" y="312" width="36" height="30" rx="4" fill="#c4922a" opacity="0.7"/>

<!-- Right chair -->
<rect x="560" y="340" width="120" height="55" rx="3" fill="#1a2030" opacity="0.9"/>
<rect x="554" y="316" width="132" height="28" rx="3" fill="#1e2838"/>
<!-- Pillow -->
<rect x="610" y="312" width="30" height="26" rx="3" fill="#c4922a" opacity="0.6"/>

<!-- Vignette -->
<radialGradient id="cvig" cx="50%" cy="45%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.55)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#cvig)"/>
</svg>`

// ── Pressure Washing Service card image ──────────────────────────────────────
const pressureService = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520">
<defs>
  <linearGradient id="psvc-bg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0a1628"/>
    <stop offset="100%" stop-color="#1a2a3a"/>
  </linearGradient>
  <linearGradient id="psvc-drive" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#2a2820"/>
    <stop offset="50%" stop-color="#8a8880"/>
    <stop offset="100%" stop-color="#8a8880"/>
  </linearGradient>
  <linearGradient id="psvc-house" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#3a3628"/>
    <stop offset="55%" stop-color="#c8d0d8"/>
    <stop offset="100%" stop-color="#c8d0d8"/>
  </linearGradient>
  <radialGradient id="psvc-spray" cx="40%" cy="60%" r="35%">
    <stop offset="0%" stop-color="#a0d8f8" stop-opacity="0.9"/>
    <stop offset="60%" stop-color="#60b8e8" stop-opacity="0.4"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <filter id="psvc-glow">
    <feGaussianBlur stdDeviation="5"/>
  </filter>
</defs>
<rect width="800" height="520" fill="url(#psvc-bg)"/>
<!-- Ground / concrete - split clean/dirty -->
<rect x="0" y="360" width="800" height="160" fill="url(#psvc-drive)"/>
<g stroke="#252820" stroke-width="1" opacity="0.6">
  <line x1="0" y1="380" x2="800" y2="380"/>
  <line x1="0" y1="400" x2="800" y2="400"/>
  <line x1="0" y1="420" x2="800" y2="420"/>
  <line x1="0" y1="440" x2="800" y2="440"/>
  <line x1="0" y1="460" x2="800" y2="460"/>
  <line x1="0" y1="480" x2="800" y2="480"/>
  <line x1="0" y1="500" x2="800" y2="500"/>
</g>
<!-- Clean line on ground -->
<rect x="320" y="360" width="4" height="160" fill="#a0d8f8" opacity="0.5"/>
<rect x="320" y="360" width="2" height="160" fill="#c0e8f8" opacity="0.8"/>

<!-- House exterior split -->
<rect x="0" y="80" width="800" height="280" fill="url(#psvc-house)"/>
<!-- Siding lines -->
<g opacity="0.7">
  <g stroke="#252218" stroke-width="1.5">
    <line x1="0" y1="100" x2="330" y2="100"/>
    <line x1="0" y1="120" x2="330" y2="120"/>
    <line x1="0" y1="140" x2="330" y2="140"/>
    <line x1="0" y1="160" x2="330" y2="160"/>
    <line x1="0" y1="180" x2="330" y2="180"/>
    <line x1="0" y1="200" x2="330" y2="200"/>
    <line x1="0" y1="220" x2="330" y2="220"/>
    <line x1="0" y1="240" x2="330" y2="240"/>
    <line x1="0" y1="260" x2="330" y2="260"/>
    <line x1="0" y1="280" x2="330" y2="280"/>
    <line x1="0" y1="300" x2="330" y2="300"/>
    <line x1="0" y1="320" x2="330" y2="320"/>
    <line x1="0" y1="340" x2="330" y2="340"/>
  </g>
  <g stroke="#9aa4ae" stroke-width="1.5">
    <line x1="330" y1="100" x2="800" y2="100"/>
    <line x1="330" y1="120" x2="800" y2="120"/>
    <line x1="330" y1="140" x2="800" y2="140"/>
    <line x1="330" y1="160" x2="800" y2="160"/>
    <line x1="330" y1="180" x2="800" y2="180"/>
    <line x1="330" y1="200" x2="800" y2="200"/>
    <line x1="330" y1="220" x2="800" y2="220"/>
    <line x1="330" y1="240" x2="800" y2="240"/>
    <line x1="330" y1="260" x2="800" y2="260"/>
    <line x1="330" y1="280" x2="800" y2="280"/>
    <line x1="330" y1="300" x2="800" y2="300"/>
    <line x1="330" y1="320" x2="800" y2="320"/>
    <line x1="330" y1="340" x2="800" y2="340"/>
  </g>
</g>
<!-- Dirty stains left side -->
<ellipse cx="120" cy="200" rx="80" ry="60" fill="#2a3810" opacity="0.25"/>
<ellipse cx="260" cy="160" rx="60" ry="50" fill="#2a3810" opacity="0.2"/>
<ellipse cx="60" cy="300" rx="50" ry="40" fill="#1a2a08" opacity="0.2"/>
<!-- Clean house split line -->
<rect x="326" y="80" width="8" height="280" fill="url(#psvc-spray)"/>

<!-- Worker + wand mid-frame -->
<rect x="290" y="260" width="24" height="80" rx="4" fill="#1a2230"/>
<circle cx="302" cy="248" r="18" fill="#1a2230"/>
<rect x="310" y="295" width="4" height="3" fill="#c4922a" opacity="0.8"/>
<!-- Wand arm -->
<line x1="310" y1="295" x2="330" y2="360" stroke="#3a4a5a" stroke-width="5"/>
<!-- Wand tip -->
<line x1="330" y1="360" x2="322" y2="400" stroke="#c4922a" stroke-width="4"/>
<!-- Pressure washer unit on ground -->
<rect x="350" y="420" width="60" height="50" rx="4" fill="#1a2030"/>
<rect x="358" y="426" width="44" height="36" rx="2" fill="#141820"/>
<rect x="362" y="430" width="18" height="14" rx="1" fill="#c4922a" opacity="0.6"/>
<!-- Hose from unit to worker -->
<path d="M 380 420 Q 360 380 320 310" stroke="#3a4a5a" stroke-width="5" fill="none"/>

<!-- Spray fan -->
<path d="M 322 400 L 260 320 L 328 360 Z" fill="url(#psvc-spray)" opacity="0.7"/>
<path d="M 322 400 L 270 340 L 328 368 Z" fill="#a0d8f8" opacity="0.4"/>
<path d="M 322 400 L 250 360 L 322 390 Z" fill="url(#psvc-spray)" opacity="0.5"/>

<!-- Spray glow -->
<ellipse cx="290" cy="360" rx="50" ry="30" fill="#60c0f0" opacity="0.15" filter="url(#psvc-glow)"/>

<!-- Labels -->
<rect x="40" y="460" width="70" height="22" rx="3" fill="rgba(0,0,0,0.7)"/>
<text x="75" y="476" font-family="Arial,sans-serif" font-size="10" fill="#a09060" text-anchor="middle">BEFORE</text>
<rect x="680" y="460" width="70" height="22" rx="3" fill="rgba(0,0,0,0.7)"/>
<text x="715" y="476" font-family="Arial,sans-serif" font-size="10" fill="#60c0e8" text-anchor="middle">AFTER</text>

<radialGradient id="psvc-vig" cx="50%" cy="50%" r="70%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.5)"/>
</radialGradient>
<rect width="800" height="520" fill="url(#psvc-vig)"/>
</svg>`

// ── Hero Background ──────────────────────────────────────────────────────────
const heroBg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
<defs>
  <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#060a10"/>
    <stop offset="40%" stop-color="#0a1420"/>
    <stop offset="100%" stop-color="#141e2c"/>
  </linearGradient>
  <radialGradient id="hmoon" cx="75%" cy="15%" r="10%">
    <stop offset="0%" stop-color="#e8d8b0" stop-opacity="0.8"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <linearGradient id="hhouse" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1e2838"/>
    <stop offset="100%" stop-color="#141c28"/>
  </linearGradient>
  <linearGradient id="hroof" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#0e1420"/>
    <stop offset="100%" stop-color="#141c2a"/>
  </linearGradient>
  <radialGradient id="hwarm1" cx="28%" cy="55%" r="8%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.8"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="hwarm2" cx="55%" cy="50%" r="8%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <radialGradient id="hwarm3" cx="72%" cy="55%" r="6%">
    <stop offset="0%" stop-color="#e8c870" stop-opacity="0.7"/>
    <stop offset="100%" stop-color="transparent"/>
  </radialGradient>
  <linearGradient id="hground" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#1a2030"/>
    <stop offset="100%" stop-color="#0e1218"/>
  </linearGradient>
  <filter id="hglow">
    <feGaussianBlur stdDeviation="8" result="blur"/>
    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>
<!-- Night sky -->
<rect width="1920" height="1080" fill="url(#hsky)"/>
<!-- Moon glow -->
<rect width="1920" height="1080" fill="url(#hmoon)"/>
<!-- Stars scattered -->
<g fill="#ffffff" opacity="0.6">
  <circle cx="80" cy="50" r="1.5"/>
  <circle cx="200" cy="80" r="1"/>
  <circle cx="350" cy="30" r="2"/>
  <circle cx="500" cy="60" r="1.5"/>
  <circle cx="700" cy="40" r="1"/>
  <circle cx="900" cy="20" r="2"/>
  <circle cx="1050" cy="55" r="1.5"/>
  <circle cx="1200" cy="35" r="1"/>
  <circle cx="1400" cy="65" r="2"/>
  <circle cx="1600" cy="25" r="1.5"/>
  <circle cx="1750" cy="50" r="1"/>
  <circle cx="1880" cy="70" r="1.5"/>
  <circle cx="140" cy="120" r="1"/>
  <circle cx="420" cy="100" r="1.5"/>
  <circle cx="650" cy="130" r="1"/>
  <circle cx="850" cy="90" r="1.5"/>
  <circle cx="1100" cy="110" r="2"/>
  <circle cx="1300" cy="80" r="1"/>
  <circle cx="1500" cy="120" r="1.5"/>
  <circle cx="1700" cy="95" r="1"/>
  <circle cx="1830" cy="115" r="1.5"/>
</g>
<!-- Trees in background -->
<ellipse cx="100" cy="560" rx="70" ry="120" fill="#0a1018" opacity="0.8"/>
<ellipse cx="200" cy="540" rx="55" ry="100" fill="#0e1420" opacity="0.7"/>
<ellipse cx="1720" cy="560" rx="70" ry="120" fill="#0a1018" opacity="0.8"/>
<ellipse cx="1820" cy="540" rx="55" ry="100" fill="#0e1420" opacity="0.7"/>
<rect x="60" y="620" width="30" height="200" fill="#0a0e14"/>
<rect x="170" y="640" width="24" height="180" fill="#0a0e14"/>
<rect x="1700" y="620" width="30" height="200" fill="#0a0e14"/>
<rect x="1800" y="640" width="24" height="180" fill="#0a0e14"/>

<!-- House - main structure -->
<!-- Foundation -->
<rect x="380" y="620" width="1160" height="460" fill="#101418"/>
<!-- Main walls -->
<rect x="400" y="380" width="1120" height="300" fill="url(#hhouse)"/>
<!-- Siding subtle horizontal lines -->
<g stroke="#1a2230" stroke-width="2" opacity="0.5">
  <line x1="400" y1="400" x2="1520" y2="400"/>
  <line x1="400" y1="430" x2="1520" y2="430"/>
  <line x1="400" y1="460" x2="1520" y2="460"/>
  <line x1="400" y1="490" x2="1520" y2="490"/>
  <line x1="400" y1="520" x2="1520" y2="520"/>
  <line x1="400" y1="550" x2="1520" y2="550"/>
  <line x1="400" y1="580" x2="1520" y2="580"/>
  <line x1="400" y1="610" x2="1520" y2="610"/>
</g>

<!-- Roof main gable -->
<polygon points="380,380 960,200 1540,380" fill="url(#hroof)"/>
<polygon points="380,380 960,200 1540,380" fill="none" stroke="#1a2030" stroke-width="2"/>
<!-- Roof ridge -->
<line x1="960" y1="200" x2="960" y2="380" stroke="#1e2838" stroke-width="2"/>

<!-- Garage left -->
<rect x="410" y="520" width="320" height="160" fill="#0e1420"/>
<!-- Garage door sections -->
<rect x="420" y="530" width="300" height="145" fill="#111824"/>
<g stroke="#1a2432" stroke-width="2">
  <line x1="420" y1="560" x2="720" y2="560"/>
  <line x1="420" y1="590" x2="720" y2="590"/>
  <line x1="420" y1="620" x2="720" y2="620"/>
  <line x1="420" y1="650" x2="720" y2="650"/>
  <line x1="570" y1="530" x2="570" y2="675"/>
</g>
<!-- Garage door hardware -->
<rect x="484" y="640" width="8" height="8" rx="4" fill="#2a3040"/>
<rect x="554" y="640" width="8" height="8" rx="4" fill="#2a3040"/>
<rect x="624" y="640" width="8" height="8" rx="4" fill="#2a3040"/>

<!-- Large window left -->
<rect x="760" y="410" width="180" height="160" fill="#c4922a" opacity="0.2"/>
<rect x="760" y="410" width="180" height="160" fill="#e8c870" opacity="0.12"/>
<rect x="755" y="405" width="190" height="170" fill="none" stroke="#2a3040" stroke-width="5"/>
<line x1="850" y1="405" x2="850" y2="575" stroke="#2a3040" stroke-width="3"/>
<line x1="755" y1="488" x2="945" y2="488" stroke="#2a3040" stroke-width="3"/>

<!-- Center front door -->
<rect x="900" y="520" width="120" height="160" fill="#0e1420"/>
<rect x="895" y="515" width="130" height="168" fill="none" stroke="#2a3040" stroke-width="5"/>
<rect x="906" y="530" width="45" height="50" rx="1" fill="#111824" stroke="#1e2838" stroke-width="1"/>
<rect x="959" y="530" width="45" height="50" rx="1" fill="#111824" stroke="#1e2838" stroke-width="1"/>
<rect x="906" y="588" width="45" height="80" rx="1" fill="#111824" stroke="#1e2838" stroke-width="1"/>
<rect x="959" y="588" width="45" height="80" rx="1" fill="#111824" stroke="#1e2838" stroke-width="1"/>
<!-- Door knob -->
<circle cx="955" cy="610" r="5" fill="#c4922a" opacity="0.9"/>

<!-- Large window right -->
<rect x="1060" y="410" width="180" height="160" fill="#c4922a" opacity="0.2"/>
<rect x="1060" y="410" width="180" height="160" fill="#e8c870" opacity="0.12"/>
<rect x="1055" y="405" width="190" height="170" fill="none" stroke="#2a3040" stroke-width="5"/>
<line x1="1150" y1="405" x2="1150" y2="575" stroke="#2a3040" stroke-width="3"/>
<line x1="1055" y1="488" x2="1245" y2="488" stroke="#2a3040" stroke-width="3"/>

<!-- Upper windows -->
<rect x="680" y="280" width="120" height="90" fill="#c4922a" opacity="0.15"/>
<rect x="680" y="280" width="120" height="90" fill="none" stroke="#2a3040" stroke-width="3"/>
<line x1="740" y1="280" x2="740" y2="370" stroke="#2a3040" stroke-width="2"/>
<rect x="1100" y="280" width="120" height="90" fill="#c4922a" opacity="0.15"/>
<rect x="1100" y="280" width="120" height="90" fill="none" stroke="#2a3040" stroke-width="3"/>
<line x1="1160" y1="280" x2="1160" y2="370" stroke="#2a3040" stroke-width="2"/>

<!-- Porch columns -->
<rect x="868" y="490" width="20" height="195" fill="#1e2838"/>
<rect x="1032" y="490" width="20" height="195" fill="#1e2838"/>
<!-- Porch cap gold accent -->
<rect x="858" y="487" width="40" height="6" fill="#c4922a" opacity="0.7"/>
<rect x="1022" y="487" width="40" height="6" fill="#c4922a" opacity="0.7"/>
<!-- Porch beam -->
<rect x="850" y="490" width="220" height="8" fill="#1e2838"/>

<!-- Warm light glows from windows -->
<rect x="0" y="0" width="1920" height="1080" fill="url(#hwarm1)"/>
<rect x="0" y="0" width="1920" height="1080" fill="url(#hwarm2)"/>
<rect x="0" y="0" width="1920" height="1080" fill="url(#hwarm3)"/>

<!-- Porch light fixtures -->
<rect x="855" y="500" width="12" height="20" rx="3" fill="#2a3040"/>
<ellipse cx="861" cy="500" rx="8" ry="4" fill="#c4922a" opacity="0.9" filter="url(#hglow)"/>
<rect x="1055" y="500" width="12" height="20" rx="3" fill="#2a3040"/>
<ellipse cx="1061" cy="500" rx="8" ry="4" fill="#c4922a" opacity="0.9" filter="url(#hglow)"/>

<!-- Path / walkway -->
<polygon points="880,685 1040,685 1100,1080 820,1080" fill="#181e28"/>
<g stroke="#222838" stroke-width="2" opacity="0.5">
  <line x1="830" y1="760" x2="1090" y2="760"/>
  <line x1="840" y1="840" x2="1080" y2="840"/>
  <line x1="850" y1="920" x2="1070" y2="920"/>
  <line x1="860" y1="1000" x2="1060" y2="1000"/>
</g>
<!-- Path lights -->
<circle cx="870" cy="740" r="6" fill="#c4922a" opacity="0.7" filter="url(#hglow)"/>
<circle cx="1050" cy="740" r="6" fill="#c4922a" opacity="0.7" filter="url(#hglow)"/>
<circle cx="860" cy="860" r="6" fill="#c4922a" opacity="0.6" filter="url(#hglow)"/>
<circle cx="1060" cy="860" r="6" fill="#c4922a" opacity="0.6" filter="url(#hglow)"/>

<!-- Ground lawn -->
<rect x="0" y="680" width="1920" height="400" fill="url(#hground)"/>
<!-- Lawn texture -->
<g stroke="#141c24" stroke-width="1" opacity="0.4">
  <line x1="0" y1="720" x2="1920" y2="720"/>
  <line x1="0" y1="760" x2="1920" y2="760"/>
  <line x1="0" y1="800" x2="1920" y2="800"/>
  <line x1="0" y1="840" x2="1920" y2="840"/>
</g>

<!-- Bushes along front of house -->
<ellipse cx="450" cy="695" rx="60" ry="35" fill="#0e1810" opacity="0.9"/>
<ellipse cx="560" cy="690" rx="55" ry="30" fill="#0a1c0a" opacity="0.8"/>
<ellipse cx="680" cy="693" rx="50" ry="28" fill="#0e1810" opacity="0.9"/>
<ellipse cx="1240" cy="695" rx="60" ry="35" fill="#0e1810" opacity="0.9"/>
<ellipse cx="1360" cy="690" rx="55" ry="30" fill="#0a1c0a" opacity="0.8"/>
<ellipse cx="1470" cy="693" rx="50" ry="28" fill="#0e1810" opacity="0.9"/>

<!-- Final dark overlay for depth -->
<rect width="1920" height="1080" fill="rgba(0,0,0,0.2)"/>

<!-- Vignette -->
<radialGradient id="hvig" cx="50%" cy="55%" r="65%">
  <stop offset="0%" stop-color="transparent"/>
  <stop offset="100%" stop-color="rgba(0,0,0,0.65)"/>
</radialGradient>
<rect width="1920" height="1080" fill="url(#hvig)"/>
</svg>`

const images = {
  'project-kitchen.svg': kitchen,
  'project-bath.svg': bathroom,
  'project-wash.svg': pressureWash,
  'project-basement.svg': basement,
  'project-deck.svg': deck,
  'contracting.svg': contracting,
  'pressure-washing.svg': pressureService,
  'hero-bg.svg': heroBg,
}

for (const [name, svg] of Object.entries(images)) {
  fs.writeFileSync(path.join(dir, name), svg.trim())
  console.log('wrote', name)
}
console.log('all images generated')
