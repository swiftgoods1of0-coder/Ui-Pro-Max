#!/usr/bin/env node
const fs = require('fs'), path = require('path'), dir = __dirname

// Boarding - cozy kennel suite interior
const boarding = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2a1e"/><stop offset="100%" stop-color="#243028"/></linearGradient>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a3830"/><stop offset="100%" stop-color="#1e2c24"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4a3820"/><stop offset="50%" stop-color="#5a4828"/><stop offset="100%" stop-color="#4a3820"/></linearGradient>
  <radialGradient id="lamp" cx="50%" cy="0%" r="60%"><stop offset="0%" stop-color="#e8c870" stop-opacity="0.6"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.5)"/></radialGradient>
</defs>
<rect width="800" height="480" fill="url(#bg)"/>
<rect x="0" y="50" width="800" height="320" fill="url(#wall)"/>
<!-- Wood floor -->
<rect x="0" y="370" width="800" height="110" fill="url(#floor)"/>
<g stroke="#3a2c18" stroke-width="1.2" opacity="0.6">
  <line x1="0" y1="388" x2="800" y2="388"/><line x1="0" y1="406" x2="800" y2="406"/>
  <line x1="0" y1="424" x2="800" y2="424"/><line x1="0" y1="442" x2="800" y2="442"/>
  <line x1="0" y1="460" x2="800" y2="460"/>
  <line x1="100" y1="370" x2="100" y2="480"/><line x1="220" y1="370" x2="220" y2="480"/>
  <line x1="340" y1="370" x2="340" y2="480"/><line x1="460" y1="370" x2="460" y2="480"/>
  <line x1="580" y1="370" x2="580" y2="480"/><line x1="700" y1="370" x2="700" y2="480"/>
</g>
<!-- Warm ceiling light -->
<rect x="0" y="0" width="800" height="480" fill="url(#lamp)"/>
<!-- Ceiling light fixture -->
<rect x="360" y="0" width="80" height="12" rx="4" fill="#2a3020"/>
<rect x="370" y="10" width="60" height="8" rx="3" fill="#e8c870" opacity="0.8"/>
<!-- Dog bed / suite -->
<ellipse cx="400" cy="390" rx="160" ry="45" fill="#4a6035" opacity="0.8"/>
<ellipse cx="400" cy="386" rx="148" ry="40" fill="#5a7040" opacity="0.9"/>
<!-- Bed padding lines -->
<ellipse cx="400" cy="386" rx="130" ry="32" fill="none" stroke="#6a8050" stroke-width="2" opacity="0.6"/>
<ellipse cx="400" cy="386" rx="110" ry="24" fill="none" stroke="#6a8050" stroke-width="1.5" opacity="0.4"/>
<!-- Plush blanket / bedding -->
<ellipse cx="380" cy="380" rx="100" ry="28" fill="#c4922a" opacity="0.6"/>
<ellipse cx="380" cy="378" rx="90" ry="22" fill="#d4a840" opacity="0.5"/>
<!-- Sleeping dog silhouette -->
<ellipse cx="395" cy="372" rx="70" ry="18" fill="#2a1a10" opacity="0.7"/>
<ellipse cx="450" cy="368" rx="22" ry="16" fill="#2a1a10" opacity="0.7"/>
<ellipse cx="340" cy="376" rx="12" ry="8" fill="#2a1a10" opacity="0.6"/><!-- tail -->
<!-- Suite walls/gate -->
<rect x="100" y="120" width="600" height="250" fill="none" stroke="#3a5040" stroke-width="3"/>
<rect x="100" y="120" width="600" height="12" fill="#2e4035"/>
<rect x="100" y="358" width="600" height="12" fill="#2e4035"/>
<!-- Gate bars -->
<g stroke="#2e4035" stroke-width="8" opacity="0.7">
  <line x1="150" y1="132" x2="150" y2="358"/>
  <line x1="200" y1="132" x2="200" y2="358"/>
  <line x1="250" y1="132" x2="250" y2="358"/>
  <line x1="300" y1="132" x2="300" y2="358"/>
  <line x1="350" y1="132" x2="350" y2="358"/>
  <line x1="400" y1="132" x2="400" y2="358"/>
  <line x1="450" y1="132" x2="450" y2="358"/>
  <line x1="500" y1="132" x2="500" y2="358"/>
  <line x1="550" y1="132" x2="550" y2="358"/>
  <line x1="600" y1="132" x2="600" y2="358"/>
  <line x1="650" y1="132" x2="650" y2="358"/>
</g>
<!-- Nameplate on gate -->
<rect x="350" y="200" width="100" height="40" rx="6" fill="#c4922a" opacity="0.9"/>
<rect x="354" y="204" width="92" height="32" rx="4" fill="#b88820"/>
<!-- Water bowl -->
<ellipse cx="160" cy="395" rx="30" ry="10" fill="#3a5060" opacity="0.8"/>
<ellipse cx="160" cy="392" rx="24" ry="7" fill="#4a7080" opacity="0.7"/>
<!-- Food bowl -->
<ellipse cx="640" cy="395" rx="30" ry="10" fill="#5a4020" opacity="0.8"/>
<ellipse cx="640" cy="392" rx="22" ry="7" fill="#6a5030" opacity="0.7"/>
<!-- Wall decoration - paw print -->
<g transform="translate(200,180)" opacity="0.15" fill="white">
  <ellipse cx="0" cy="-15" rx="8" ry="10"/><ellipse cx="-12" cy="-8" rx="7" ry="9"/>
  <ellipse cx="12" cy="-8" rx="7" ry="9"/>
  <path d="M0 -5c-14 0-20 8-20 18s6 14 20 14 20-4 20-14-6-18-20-18z"/>
</g>
<rect width="800" height="480" fill="url(#vig)"/>
</svg>`

// Walking - path through green park
const walking = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">
<defs>
  <linearGradient id="wsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#5a8abA"/><stop offset="100%" stop-color="#7aaace"/></linearGradient>
  <linearGradient id="wgrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3a7040"/><stop offset="100%" stop-color="#2a5030"/></linearGradient>
  <linearGradient id="wpath" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8b888"/><stop offset="100%" stop-color="#b0a070"/></linearGradient>
  <radialGradient id="wsun" cx="80%" cy="15%" r="30%"><stop offset="0%" stop-color="#f0e090" stop-opacity="0.7"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <radialGradient id="wvig" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.4)"/></radialGradient>
</defs>
<!-- Sky -->
<rect width="800" height="480" fill="url(#wsky)"/>
<rect width="800" height="480" fill="url(#wsun)"/>
<!-- Clouds -->
<ellipse cx="150" cy="60" rx="80" ry="30" fill="white" opacity="0.7"/>
<ellipse cx="210" cy="55" rx="60" ry="25" fill="white" opacity="0.8"/>
<ellipse cx="120" cy="65" rx="50" ry="20" fill="white" opacity="0.6"/>
<ellipse cx="600" cy="80" rx="70" ry="25" fill="white" opacity="0.6"/>
<ellipse cx="650" cy="75" rx="55" ry="22" fill="white" opacity="0.7"/>
<!-- Trees background -->
<rect x="0" y="200" width="800" height="280" fill="url(#wgrass)"/>
<g fill="#1e4028" opacity="0.8">
  <ellipse cx="80" cy="220" rx="60" ry="80"/><ellipse cx="160" cy="200" rx="55" ry="70"/>
  <ellipse cx="620" cy="215" rx="60" ry="80"/><ellipse cx="700" cy="200" rx="55" ry="70"/>
  <ellipse cx="750" cy="220" rx="50" ry="65"/>
</g>
<g fill="#0e2818">
  <rect x="50" y="280" width="24" height="200"/><rect x="130" y="260" width="22" height="220"/>
  <rect x="594" y="276" width="24" height="204"/><rect x="673" y="260" width="22" height="220"/>
  <rect x="726" y="280" width="20" height="200"/>
</g>
<!-- Middle trees -->
<g fill="#2a5835" opacity="0.9">
  <ellipse cx="240" cy="280" rx="45" ry="60"/><ellipse cx="560" cy="280" rx="45" ry="60"/>
  <ellipse cx="310" cy="295" rx="35" ry="50"/><ellipse cx="490" cy="295" rx="35" ry="50"/>
</g>
<g fill="#1a3820">
  <rect x="218" y="320" width="18" height="160"/><rect x="542" y="320" width="18" height="160"/>
  <rect x="294" y="330" width="16" height="150"/><rect x="474" y="330" width="16" height="150"/>
</g>
<!-- Path -->
<path d="M 300 480 Q 350 380 380 320 Q 400 270 420 220 Q 440 170 460 100" stroke="url(#wpath)" stroke-width="80" fill="none" opacity="0.85"/>
<path d="M 300 480 Q 350 380 380 320 Q 400 270 420 220 Q 440 170 460 100" stroke="#d8c898" stroke-width="60" fill="none" opacity="0.5"/>
<!-- Path texture / stones -->
<g fill="#a89868" opacity="0.4">
  <ellipse cx="370" cy="380" rx="15" ry="5"/><ellipse cx="400" cy="350" rx="12" ry="4"/>
  <ellipse cx="395" cy="320" rx="10" ry="3"/><ellipse cx="415" cy="290" rx="14" ry="5"/>
  <ellipse cx="425" cy="260" rx="11" ry="4"/>
</g>
<!-- Walker silhouette -->
<rect x="410" y="280" width="22" height="70" rx="5" fill="#1a3020" opacity="0.85"/>
<circle cx="421" cy="265" r="18" fill="#1a3020" opacity="0.85"/>
<!-- Leash -->
<path d="M 435 315 Q 480 300 490 310 Q 500 318 495 330" stroke="#4a3020" stroke-width="3" fill="none"/>
<!-- Dog on leash -->
<ellipse cx="498" cy="338" rx="22" ry="12" fill="#c4922a" opacity="0.8"/>
<ellipse cx="518" cy="332" rx="12" ry="9" fill="#c4922a" opacity="0.8"/>
<!-- Dog tail up wagging -->
<path d="M 476 332 Q 465 315 470 305" stroke="#c4922a" stroke-width="5" fill="none"/>
<!-- Grass foreground -->
<rect x="0" y="420" width="800" height="60" fill="#2a5030"/>
<g stroke="#3a6038" stroke-width="2" opacity="0.7">
  <line x1="20" y1="420" x2="15" y2="400"/><line x1="30" y1="420" x2="35" y2="398"/>
  <line x1="50" y1="420" x2="45" y2="402"/><line x1="700" y1="420" x2="695" y2="400"/>
  <line x1="720" y1="420" x2="725" y2="398"/><line x1="750" y1="420" x2="745" y2="402"/>
</g>
<!-- Paw prints on path -->
<g opacity="0.3" fill="#8a7048">
  <ellipse cx="360" cy="400" rx="6" ry="8"/><ellipse cx="375" cy="390" rx="6" ry="8"/>
  <ellipse cx="385" cy="370" rx="5" ry="7"/><ellipse cx="400" cy="360" rx="5" ry="7"/>
</g>
<rect width="800" height="480" fill="url(#wvig)"/>
</svg>`

// Gallery - outdoor play area
const galleryPlay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">
<defs>
  <linearGradient id="gpsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a7aaa"/><stop offset="100%" stop-color="#6a9aba"/></linearGradient>
  <linearGradient id="gpgrass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4a8040"/><stop offset="100%" stop-color="#2a5828"/></linearGradient>
  <radialGradient id="gpvig" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.45)"/></radialGradient>
</defs>
<rect width="800" height="480" fill="url(#gpsky)"/>
<!-- Clouds -->
<ellipse cx="200" cy="70" rx="90" ry="32" fill="white" opacity="0.75"/>
<ellipse cx="270" cy="62" rx="70" ry="28" fill="white" opacity="0.85"/>
<ellipse cx="600" cy="80" rx="80" ry="28" fill="white" opacity="0.7"/>
<!-- Trees -->
<g fill="#1e4428"><ellipse cx="60" cy="210" rx="55" ry="75"/><ellipse cx="140" cy="195" rx="50" ry="65"/><ellipse cx="660" cy="210" rx="55" ry="75"/><ellipse cx="740" cy="195" rx="50" ry="65"/></g>
<g fill="#0e2818"><rect x="35" y="260" width="20" height="220"/><rect x="116" y="245" width="20" height="235"/><rect x="638" y="260" width="20" height="220"/><rect x="718" y="245" width="20" height="235"/></g>
<!-- Grass -->
<rect x="0" y="280" width="800" height="200" fill="url(#gpgrass)"/>
<!-- Wood chip mulch ground -->
<rect x="80" y="320" width="640" height="160" fill="#6a4a28" opacity="0.7"/>
<g stroke="#5a3a1a" stroke-width="1" opacity="0.4">
  <line x1="80" y1="340" x2="720" y2="340"/><line x1="80" y1="360" x2="720" y2="360"/>
  <line x1="80" y1="380" x2="720" y2="380"/><line x1="80" y1="400" x2="720" y2="400"/>
</g>
<!-- Fence -->
<g fill="#5a3a1a" opacity="0.9">
  <rect x="80" y="280" width="8" height="80"/><rect x="160" y="280" width="8" height="80"/>
  <rect x="240" y="280" width="8" height="80"/><rect x="320" y="280" width="8" height="80"/>
  <rect x="400" y="280" width="8" height="80"/><rect x="480" y="280" width="8" height="80"/>
  <rect x="560" y="280" width="8" height="80"/><rect x="640" y="280" width="8" height="80"/>
  <rect x="720" y="280" width="8" height="80"/>
</g>
<rect x="80" y="288" width="648" height="10" rx="2" fill="#5a3a1a" opacity="0.9"/>
<rect x="80" y="328" width="648" height="10" rx="2" fill="#5a3a1a" opacity="0.9"/>
<!-- Multiple dogs playing -->
<!-- Large poodle/standard dog -->
<ellipse cx="300" cy="400" rx="40" ry="22" fill="#808080"/>
<ellipse cx="338" cy="386" rx="22" ry="18" fill="#808080"/>
<path d="M 268 390 Q 250 370 255 355" stroke="#808080" stroke-width="8" fill="none" stroke-linecap="round"/>
<!-- Beagle colors -->
<ellipse cx="460" cy="405" rx="35" ry="18" fill="#c4922a"/>
<ellipse cx="492" cy="393" rx="18" ry="15" fill="#c4922a"/>
<ellipse cx="480" cy="388" rx="8" ry="6" fill="#2a1a0a"/>
<path d="M 428 396 Q 415 375 420 360" stroke="#c4922a" stroke-width="7" fill="none" stroke-linecap="round"/>
<!-- White fluffy dog -->
<ellipse cx="580" cy="400" rx="32" ry="20" fill="#f0f0f0"/>
<ellipse cx="608" cy="388" rx="18" ry="16" fill="#f0f0f0"/>
<path d="M 554 392 Q 540 372 548 358" stroke="#f0f0f0" stroke-width="7" fill="none" stroke-linecap="round"/>
<!-- Black lab -->
<ellipse cx="200" cy="402" rx="38" ry="20" fill="#1a1a1a"/>
<ellipse cx="234" cy="390" rx="20" ry="16" fill="#1a1a1a"/>
<path d="M 166 394 Q 150 374 156 360" stroke="#1a1a1a" stroke-width="7" fill="none" stroke-linecap="round"/>
<!-- Golden retriever-ish dog -->
<ellipse cx="650" cy="398" rx="36" ry="20" fill="#d4a030"/>
<ellipse cx="682" cy="386" rx="19" ry="16" fill="#d4a030"/>
<path d="M 618 390 Q 602 370 608 355" stroke="#d4a030" stroke-width="7" fill="none" stroke-linecap="round"/>
<!-- Play toys / ball on ground -->
<circle cx="400" cy="425" r="14" fill="#e04020" opacity="0.8"/>
<circle cx="400" cy="425" r="14" fill="none" stroke="#c03010" stroke-width="2"/>
<line x1="392" y1="414" x2="408" y2="436" stroke="#c03010" stroke-width="1.5"/>
<!-- Sun beam -->
<rect width="800" height="480" fill="url(#gpvig)"/>
</svg>`

// Gallery - grooming studio
const galleryGroom = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">
<defs>
  <linearGradient id="ggwall" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e8f4ea"/><stop offset="100%" stop-color="#d8ecda"/></linearGradient>
  <linearGradient id="ggfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#c8d0c8"/><stop offset="100%" stop-color="#b8c0b8"/></linearGradient>
  <radialGradient id="gglight" cx="50%" cy="0%" r="70%"><stop offset="0%" stop-color="#fffff0" stop-opacity="0.5"/><stop offset="100%" stop-color="transparent"/></radialGradient>
  <radialGradient id="ggvig" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.3)"/></radialGradient>
</defs>
<rect width="800" height="480" fill="url(#ggwall)"/>
<rect x="0" y="350" width="800" height="130" fill="url(#ggfloor)"/>
<!-- Tile grid on walls -->
<g stroke="#c8deca" stroke-width="0.8" opacity="0.5">
  <line x1="0" y1="80" x2="800" y2="80"/><line x1="0" y1="160" x2="800" y2="160"/>
  <line x1="0" y1="240" x2="800" y2="240"/><line x1="0" y1="320" x2="800" y2="320"/>
  <line x1="80" y1="0" x2="80" y2="350"/><line x1="160" y1="0" x2="160" y2="350"/>
  <line x1="240" y1="0" x2="240" y2="350"/><line x1="320" y1="0" x2="320" y2="350"/>
  <line x1="400" y1="0" x2="400" y2="350"/><line x1="480" y1="0" x2="480" y2="350"/>
  <line x1="560" y1="0" x2="560" y2="350"/><line x1="640" y1="0" x2="640" y2="350"/>
  <line x1="720" y1="0" x2="720" y2="350"/>
</g>
<!-- Warm light fill -->
<rect width="800" height="480" fill="url(#gglight)"/>
<!-- Grooming table center -->
<rect x="230" y="270" width="340" height="18" rx="4" fill="#5a8060"/>
<rect x="220" y="285" width="360" height="10" rx="3" fill="#4a7050"/>
<!-- Table legs -->
<rect x="250" y="293" width="12" height="80" fill="#4a7050"/>
<rect x="538" y="293" width="12" height="80" fill="#4a7050"/>
<rect x="265" y="293" width="12" height="80" fill="#4a7050"/>
<rect x="523" y="293" width="12" height="80" fill="#4a7050"/>
<!-- Non-slip mat on table -->
<rect x="235" y="260" width="330" height="12" rx="3" fill="#e8c870" opacity="0.7"/>
<!-- Dog on table - fluffy white dog (Bichon type) -->
<ellipse cx="400" cy="252" rx="70" ry="32" fill="#f5f5f5"/>
<ellipse cx="450" cy="238" rx="38" ry="30" fill="#f5f5f5"/>
<!-- Fluffy texture -->
<ellipse cx="380" cy="248" rx="30" ry="18" fill="#efefef" opacity="0.5"/>
<ellipse cx="440" cy="245" rx="28" ry="16" fill="#efefef" opacity="0.5"/>
<!-- Dog face details -->
<ellipse cx="458" cy="234" rx="8" ry="7" fill="#d0d0d0"/>
<circle cx="452" cy="232" r="3" fill="#1a1a1a"/>
<circle cx="466" cy="232" r="3" fill="#1a1a1a"/>
<ellipse cx="459" cy="237" rx="5" ry="3" fill="#e8a0a0"/>
<!-- Paw up -->
<ellipse cx="340" cy="252" rx="14" ry="10" fill="#f0f0f0"/>
<!-- Groomer tools on side table -->
<rect x="120" y="300" width="80" height="50" rx="6" fill="#4a8060"/>
<rect x="126" y="306" width="68" height="38" rx="4" fill="#5a9070"/>
<!-- Scissors -->
<rect x="140" y="312" width="40" height="5" rx="2.5" fill="#c0c8c0"/>
<rect x="138" y="318" width="44" height="4" rx="2" fill="#c0c8c0"/>
<!-- Comb -->
<rect x="140" y="326" width="36" height="3" rx="1.5" fill="#c4922a"/>
<g stroke="#b08020" stroke-width="2"><line x1="142" y1="326" x2="142" y2="335"/><line x1="148" y1="326" x2="148" y2="333"/><line x1="154" y1="326" x2="154" y2="335"/><line x1="160" y1="326" x2="160" y2="333"/><line x1="166" y1="326" x2="166" y2="335"/><line x1="172" y1="326" x2="172" y2="333"/></g>
<!-- Right side shelf with products -->
<rect x="600" y="200" width="100" height="140" fill="#4a6a50" opacity="0.7"/>
<rect x="606" y="206" width="88" height="128" fill="#5a7a60" opacity="0.6"/>
<!-- Shampoo bottles -->
<rect x="615" y="230" width="18" height="40" rx="5" fill="#5a9080" opacity="0.8"/>
<rect x="638" y="228" width="18" height="42" rx="5" fill="#8a5a7a" opacity="0.8"/>
<rect x="661" y="232" width="18" height="38" rx="5" fill="#7a8a50" opacity="0.8"/>
<rect x="684" y="230" width="12" height="40" rx="4" fill="#9a7040" opacity="0.8"/>
<!-- Paw print wall art -->
<g transform="translate(100,120)" opacity="0.2" fill="#4a8060">
  <ellipse cx="0" cy="-15" rx="8" ry="10"/><ellipse cx="-12" cy="-8" rx="7" ry="9"/><ellipse cx="12" cy="-8" rx="7" ry="9"/>
  <path d="M0 -5c-14 0-20 8-20 18s6 14 20 14 20-4 20-14-6-18-20-18z"/>
</g>
<g transform="translate(680,150)" opacity="0.15" fill="#4a8060">
  <ellipse cx="0" cy="-10" rx="6" ry="8"/><ellipse cx="-9" cy="-5" rx="5" ry="7"/><ellipse cx="9" cy="-5" rx="5" ry="7"/>
  <path d="M0 -3c-11 0-15 6-15 14s4 11 15 11 15-3 15-11-4-14-15-14z"/>
</g>
<!-- Mirror -->
<rect x="0" y="60" width="150" height="200" fill="#c8e0ca" opacity="0.6" rx="4"/>
<rect x="4" y="64" width="142" height="192" fill="#d0e8d2" opacity="0.5"/>
<rect x="0" y="60" width="150" height="200" fill="none" stroke="#5a8060" stroke-width="4" rx="4"/>
<!-- Floor tiles -->
<g stroke="#a8b8a8" stroke-width="1" opacity="0.5">
  <line x1="0" y1="370" x2="800" y2="370"/><line x1="0" y1="390" x2="800" y2="390"/>
  <line x1="0" y1="410" x2="800" y2="410"/><line x1="0" y1="430" x2="800" y2="430"/>
  <line x1="0" y1="450" x2="800" y2="450"/><line x1="0" y1="470" x2="800" y2="470"/>
  <line x1="100" y1="350" x2="100" y2="480"/><line x1="200" y1="350" x2="200" y2="480"/>
  <line x1="300" y1="350" x2="300" y2="480"/><line x1="400" y1="350" x2="400" y2="480"/>
  <line x1="500" y1="350" x2="500" y2="480"/><line x1="600" y1="350" x2="600" y2="480"/>
  <line x1="700" y1="350" x2="700" y2="480"/>
</g>
<!-- Kennel logo on wall -->
<rect x="330" y="30" width="140" height="50" rx="8" fill="#4a8060" opacity="0.2"/>
<rect width="800" height="480" fill="url(#ggvig)"/>
</svg>`

// Gallery - kennel / boarding suites row
const galleryKennel = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">
<defs>
  <linearGradient id="gkbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1e2c20"/><stop offset="100%" stop-color="#283428"/></linearGradient>
  <linearGradient id="gkfloor" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#4a3820"/><stop offset="50%" stop-color="#5a4828"/><stop offset="100%" stop-color="#4a3820"/></linearGradient>
  <radialGradient id="gkvig" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="transparent"/><stop offset="100%" stop-color="rgba(0,0,0,0.5)"/></radialGradient>
</defs>
<rect width="800" height="480" fill="url(#gkbg)"/>
<!-- Ceiling -->
<rect x="0" y="0" width="800" height="50" fill="#141e14"/>
<!-- Overhead lights -->
<g>
  <rect x="100" y="20" width="80" height="10" rx="5" fill="#2a3820"/>
  <rect x="105" y="28" width="70" height="6" rx="3" fill="#e8c870" opacity="0.7"/>
  <rect x="300" y="20" width="80" height="10" rx="5" fill="#2a3820"/>
  <rect x="305" y="28" width="70" height="6" rx="3" fill="#e8c870" opacity="0.7"/>
  <rect x="500" y="20" width="80" height="10" rx="5" fill="#2a3820"/>
  <rect x="505" y="28" width="70" height="6" rx="3" fill="#e8c870" opacity="0.7"/>
  <rect x="700" y="20" width="80" height="10" rx="5" fill="#2a3820"/>
  <rect x="705" y="28" width="70" height="6" rx="3" fill="#e8c870" opacity="0.7"/>
</g>
<!-- Floor -->
<rect x="0" y="380" width="800" height="100" fill="url(#gkfloor)"/>
<g stroke="#3a2c18" stroke-width="1" opacity="0.5">
  <line x1="0" y1="400" x2="800" y2="400"/><line x1="0" y1="420" x2="800" y2="420"/>
  <line x1="0" y1="440" x2="800" y2="440"/><line x1="0" y1="460" x2="800" y2="460"/>
  <line x1="100" y1="380" x2="100" y2="480"/><line x1="200" y1="380" x2="200" y2="480"/>
  <line x1="300" y1="380" x2="300" y2="480"/><line x1="400" y1="380" x2="400" y2="480"/>
  <line x1="500" y1="380" x2="500" y2="480"/><line x1="600" y1="380" x2="600" y2="480"/>
  <line x1="700" y1="380" x2="700" y2="480"/>
</g>
<!-- Row of boarding suites -->
<g>
  <!-- Suite 1 -->
  <rect x="20" y="80" width="170" height="300" fill="#1a2c1e"/>
  <rect x="20" y="80" width="170" height="300" fill="none" stroke="#2e4830" stroke-width="3"/>
  <rect x="24" y="84" width="162" height="296" fill="none" stroke="#3a5a3c" stroke-width="1" opacity="0.5"/>
  <!-- Gate bars -->
  <g stroke="#2a4030" stroke-width="6">
    <line x1="50" y1="84" x2="50" y2="376"/><line x1="80" y1="84" x2="80" y2="376"/>
    <line x1="110" y1="84" x2="110" y2="376"/><line x1="140" y1="84" x2="140" y2="376"/>
    <line x1="170" y1="84" x2="170" y2="376"/>
  </g>
  <rect x="24" y="84" width="162" height="12" fill="#2a4030"/>
  <rect x="24" y="368" width="162" height="12" fill="#2a4030"/>
  <!-- Dog bed inside -->
  <ellipse cx="105" cy="350" rx="55" ry="20" fill="#5a7040" opacity="0.8"/>
  <ellipse cx="105" cy="346" rx="48" ry="16" fill="#6a8050" opacity="0.9"/>
  <!-- Dog inside -->
  <ellipse cx="105" cy="340" rx="35" ry="14" fill="#c4922a" opacity="0.7"/>
  <ellipse cx="132" cy="332" rx="16" ry="12" fill="#c4922a" opacity="0.7"/>
  <!-- Suite number plate -->
  <rect x="75" y="180" width="60" height="30" rx="6" fill="#c4922a" opacity="0.8"/>
  <!-- Water bowl -->
  <ellipse cx="50" cy="370" rx="16" ry="6" fill="#3a5060" opacity="0.9"/>

  <!-- Suite 2 -->
  <rect x="215" y="80" width="170" height="300" fill="#1a2c1e"/>
  <rect x="215" y="80" width="170" height="300" fill="none" stroke="#2e4830" stroke-width="3"/>
  <g stroke="#2a4030" stroke-width="6">
    <line x1="245" y1="84" x2="245" y2="376"/><line x1="275" y1="84" x2="275" y2="376"/>
    <line x1="305" y1="84" x2="305" y2="376"/><line x1="335" y1="84" x2="335" y2="376"/>
    <line x1="365" y1="84" x2="365" y2="376"/>
  </g>
  <rect x="219" y="84" width="162" height="12" fill="#2a4030"/>
  <rect x="219" y="368" width="162" height="12" fill="#2a4030"/>
  <ellipse cx="300" cy="350" rx="55" ry="20" fill="#4a6035" opacity="0.8"/>
  <ellipse cx="300" cy="346" rx="48" ry="16" fill="#5a7040" opacity="0.9"/>
  <ellipse cx="300" cy="340" rx="32" ry="13" fill="#808080" opacity="0.7"/><!-- grey poodle -->
  <ellipse cx="328" cy="332" rx="16" ry="12" fill="#808080" opacity="0.7"/>
  <rect x="270" y="180" width="60" height="30" rx="6" fill="#c4922a" opacity="0.8"/>

  <!-- Suite 3 -->
  <rect x="410" y="80" width="170" height="300" fill="#1a2c1e"/>
  <rect x="410" y="80" width="170" height="300" fill="none" stroke="#2e4830" stroke-width="3"/>
  <g stroke="#2a4030" stroke-width="6">
    <line x1="440" y1="84" x2="440" y2="376"/><line x1="470" y1="84" x2="470" y2="376"/>
    <line x1="500" y1="84" x2="500" y2="376"/><line x1="530" y1="84" x2="530" y2="376"/>
    <line x1="560" y1="84" x2="560" y2="376"/>
  </g>
  <rect x="414" y="84" width="162" height="12" fill="#2a4030"/>
  <rect x="414" y="368" width="162" height="12" fill="#2a4030"/>
  <!-- Empty suite with just bed - available -->
  <ellipse cx="495" cy="350" rx="55" ry="20" fill="#3a5828" opacity="0.8"/>
  <ellipse cx="495" cy="346" rx="48" ry="16" fill="#4a6835" opacity="0.9"/>
  <!-- Toy in corner -->
  <circle cx="435" cy="370" r="10" fill="#e04020" opacity="0.7"/>
  <rect x="465" y="180" width="60" height="30" rx="6" fill="#4a8060" opacity="0.8"/>

  <!-- Suite 4 -->
  <rect x="605" y="80" width="175" height="300" fill="#1a2c1e"/>
  <rect x="605" y="80" width="175" height="300" fill="none" stroke="#2e4830" stroke-width="3"/>
  <g stroke="#2a4030" stroke-width="6">
    <line x1="635" y1="84" x2="635" y2="376"/><line x1="665" y1="84" x2="665" y2="376"/>
    <line x1="695" y1="84" x2="695" y2="376"/><line x1="725" y1="84" x2="725" y2="376"/>
    <line x1="755" y1="84" x2="755" y2="376"/>
  </g>
  <rect x="609" y="84" width="167" height="12" fill="#2a4030"/>
  <rect x="609" y="368" width="167" height="12" fill="#2a4030"/>
  <ellipse cx="692" cy="350" rx="55" ry="20" fill="#5a7040" opacity="0.8"/>
  <ellipse cx="692" cy="346" rx="48" ry="16" fill="#6a8050" opacity="0.9"/>
  <!-- Golden dog -->
  <ellipse cx="692" cy="338" rx="38" ry="15" fill="#d4a030" opacity="0.7"/>
  <ellipse cx="722" cy="330" rx="18" ry="14" fill="#d4a030" opacity="0.7"/>
  <rect x="663" y="180" width="60" height="30" rx="6" fill="#c4922a" opacity="0.8"/>
  <ellipse cx="640" cy="370" rx="15" ry="6" fill="#3a5060" opacity="0.9"/>
</g>
<rect width="800" height="480" fill="url(#gkvig)"/>
</svg>`

const images = {
  'boarding-bg.svg': boarding,
  'walk-bg.svg': walking,
  'gallery-play.svg': galleryPlay,
  'gallery-groom.svg': galleryGroom,
  'gallery-kennel.svg': galleryKennel,
}

for (const [name, svg] of Object.entries(images)) {
  fs.writeFileSync(path.join(dir, name), svg.trim())
  console.log('wrote', name)
}
console.log('done')
