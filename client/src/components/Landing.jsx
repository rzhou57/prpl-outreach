import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const goToKinderBlockly = () => {
    if (token) {
      navigate('/kinder-blockly');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true" />

      {/* Purple glow accents */}
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />

      <nav className={styles.nav}>
        <div className={styles.logo}>
          <img
            src="/logo.png"
            alt="PRPL Lab"
            className={styles.logoImg}
            onError={e => { e.target.style.display = 'none'; }}
          />
          <div className={styles.logoText}>
            <span className={styles.logoMark}>PRPL</span>
            <span className={styles.logoSub}>Robotics Outreach</span>
          </div>
        </div>
        <div className={styles.navActions}>
          <button className={styles.navBlockly} onClick={goToKinderBlockly}>Go to Kinder-Blockly</button>
          <button className={styles.navSignup} onClick={() => navigate('/auth?tab=signup')}>Sign Up</button>
          <button className={styles.navLogin} onClick={() => navigate('/auth?tab=login')}>Log In</button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Princeton Planning &amp; Robot Learning Lab</p>
          <h1 className={styles.title}>
            Robots that<br />
            <em>learn.</em>
          </h1>
          <p className={styles.subtitle}>
            An outreach program from Princeton's PRPL lab introducing middle school
            students to robot learning — where machines observe, adapt, and improve
            just like we do.
          </p>
          <div className={styles.actions}>
            <button className={styles.btnBlockly} onClick={goToKinderBlockly}>Go to Kinder-Blockly</button>
            <button className={styles.btnPrimary} onClick={() => navigate('/auth?tab=signup')}>Sign Up</button>
            <button className={styles.btnGhost} onClick={() => navigate('/auth?tab=login')}>Log In</button>
          </div>
        </div>

        <div className={styles.visual} aria-hidden="true">
          <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
            <style>{`
              @keyframes robotBob {
                0%,100% { transform: translateY(0px); }
                50%      { transform: translateY(-10px); }
              }
              @keyframes eyeBlink {
                0%,90%,100% { transform: scaleY(1); }
                95%         { transform: scaleY(0.1); }
              }
              @keyframes armSwing {
                0%,100% { transform: rotate(-12deg); }
                50%     { transform: rotate(12deg); }
              }
              @keyframes armSwingR {
                0%,100% { transform: rotate(12deg); }
                50%     { transform: rotate(-12deg); }
              }
              @keyframes antennaPulse {
                0%,100% { opacity:0.5; }
                50%      { opacity:1; }
              }
              @keyframes screenFlicker {
                0%,100% { opacity:1; }
                45%,55% { opacity:0.7; }
                50%     { opacity:0.4; }
              }
              @keyframes shadowAnim {
                0%,100% { transform: scaleX(1); opacity:0.15; }
                50%     { transform: scaleX(0.7); opacity:0.07; }
              }
              @keyframes steamRise {
                0%   { transform: translateY(0px);  opacity:0.8; }
                100% { transform: translateY(-30px); opacity:0; }
              }
              @keyframes ovenGlow {
                0%,100% { opacity:0.4; }
                50%     { opacity:0.85; }
              }
              @keyframes panWobble {
                0%,100% { transform: rotate(-1.5deg); }
                50%     { transform: rotate(1.5deg); }
              }
              .robot-body  { animation: robotBob 2.4s ease-in-out infinite; transform-origin: 240px 300px; }
              .eye-l       { animation: eyeBlink 4s ease-in-out infinite; transform-origin: 210px 185px; }
              .eye-r       { animation: eyeBlink 4s ease-in-out infinite 0.05s; transform-origin: 270px 185px; }
              .arm-l       { animation: armSwing 2.4s ease-in-out infinite; transform-origin: 158px 245px; }
              .arm-r       { animation: armSwingR 2.4s ease-in-out infinite; transform-origin: 322px 245px; }
              .antenna-dot { animation: antennaPulse 1.8s ease-in-out infinite; }
              .screen      { animation: screenFlicker 6s ease-in-out infinite; }
              .shadow-el   { animation: shadowAnim 2.4s ease-in-out infinite; transform-origin: 240px 440px; }
              .steam1      { animation: steamRise 1.8s ease-in infinite 0s; }
              .steam2      { animation: steamRise 1.8s ease-in infinite 0.6s; }
              .steam3      { animation: steamRise 1.8s ease-in infinite 1.2s; }
              .oven-light  { animation: ovenGlow 2s ease-in-out infinite; }
              .pan-g       { animation: panWobble 2.2s ease-in-out infinite; transform-origin: 55px 188px; }
            `}</style>

            {/* ── WALL  y=0 to y=370 ── */}
            <rect x="0" y="0" width="480" height="480" fill="#fdf6f0"/>

            {/* Wall tile rows */}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`ta${i}`} x={i*70}    y="0"   width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`tb${i}`} x={i*70-35} y="56"  width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`tc${i}`} x={i*70}    y="112" width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`td${i}`} x={i*70-35} y="168" width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`te${i}`} x={i*70}    y="224" width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`tf${i}`} x={i*70-35} y="280" width="68" height="56" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}
            {[0,1,2,3,4,5,6].map(i => (
              <rect key={`tg${i}`} x={i*70}    y="336" width="68" height="36" rx="1" fill="none" stroke="#edddd0" strokeWidth="0.8"/>
            ))}

            {/* ── FLOOR  y=370 to y=480 ── */}
            <rect x="0" y="370" width="480" height="110" fill="#e2d3c6"/>
            {/* Baseboard */}
            <rect x="0" y="362" width="480" height="10" fill="#cfc0b0" stroke="#b8a898" strokeWidth="0.5"/>
            {/* Floor planks */}
            {[390,415,440,465].map(y => (
              <line key={`fl${y}`} x1="0" y1={y} x2="480" y2={y} stroke="#cdbfb2" strokeWidth="1"/>
            ))}
            {[0,80,160,240,320,400,480].map(x => (
              <line key={`fv${x}`} x1={x} y1="370" x2={x} y2="480" stroke="#cdbfb2" strokeWidth="0.8"/>
            ))}
            {[40,120,200,280,360,440].map(x => (
              <line key={`fv2${x}`} x1={x} y1="390" x2={x} y2="480" stroke="#cdbfb2" strokeWidth="0.5"/>
            ))}

            {/* ── WINDOW (center of wall) ── */}
            <rect x="178" y="18" width="124" height="96" rx="5" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2"/>
            <line x1="240" y1="18" x2="240" y2="114" stroke="#93c5fd" strokeWidth="1.5"/>
            <line x1="178" y1="66" x2="302" y2="66"  stroke="#93c5fd" strokeWidth="1.5"/>
            <rect x="181" y="21" width="56" height="42" rx="1" fill="#dbeafe" opacity="0.7"/>
            <rect x="243" y="21" width="56" height="42" rx="1" fill="#dbeafe" opacity="0.7"/>
            <rect x="181" y="69" width="56" height="42" rx="1" fill="#bfdbfe" opacity="0.6"/>
            <rect x="243" y="69" width="56" height="42" rx="1" fill="#bfdbfe" opacity="0.6"/>
            {/* Clouds */}
            <ellipse cx="204" cy="40" rx="14" ry="8"  fill="white" opacity="0.85"/>
            <ellipse cx="216" cy="36" rx="10" ry="7"  fill="white" opacity="0.85"/>
            <ellipse cx="194" cy="38" rx="8"  ry="6"  fill="white" opacity="0.75"/>
            <ellipse cx="265" cy="44" rx="12" ry="7"  fill="white" opacity="0.8"/>
            <ellipse cx="277" cy="40" rx="9"  ry="6"  fill="white" opacity="0.8"/>
            {/* Curtains */}
            <path d="M178 18 Q188 46 182 114" fill="#fda4af" opacity="0.4" stroke="#fb7185" strokeWidth="1"/>
            <path d="M302 18 Q292 46 298 114" fill="#fda4af" opacity="0.4" stroke="#fb7185" strokeWidth="1"/>

            {/* ── FREESTANDING STOVE — left wall, y=185 to y=370 (sits on floor) ── */}
            {/* Stove body */}
            <rect x="0" y="185" width="148" height="185" rx="0" fill="#c8b8aa" stroke="#a89888" strokeWidth="1.5"/>
            {/* Oven door — takes up most of the stove face */}
            <rect x="10" y="220" width="128" height="110" rx="4" fill="#bfafa0" stroke="#a89888" strokeWidth="1.2"/>
            {/* Oven glass window */}
            <rect x="18" y="228" width="112" height="80" rx="3" fill="#1e1410" opacity="0.9"/>
            {/* Warm glow inside oven */}
            <ellipse className="oven-light" cx="74" cy="268" rx="30" ry="18" fill="#ffa040" opacity="0.4"/>
            {/* Oven door handle */}
            <rect x="24" y="218" width="100" height="8" rx="4" fill="#9a8878" stroke="#7a6858" strokeWidth="1"/>
            {/* Knob panel at bottom of stove */}
            <rect x="0" y="338" width="148" height="32" rx="0" fill="#b8a898" stroke="#a89888" strokeWidth="1"/>
            <circle cx="22"  cy="354" r="8" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            <circle cx="46"  cy="354" r="8" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            <circle cx="74"  cy="354" r="8" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1.2"/>
            <circle cx="102" cy="354" r="8" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            <circle cx="126" cy="354" r="8" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            {/* Stovetop surface — very top of stove */}
            <rect x="0" y="172" width="148" height="16" rx="2" fill="#b0a090" stroke="#9a8878" strokeWidth="1.5"/>
            {/* Left burner on stovetop */}
            <ellipse cx="40"  cy="180" rx="24" ry="7" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            <ellipse cx="40"  cy="180" rx="14" ry="4" fill="#887868" stroke="#7a6858" strokeWidth="1"/>
            {/* Right burner on stovetop */}
            <ellipse cx="108" cy="180" rx="24" ry="7" fill="#9a8878" stroke="#7a6858" strokeWidth="1.2"/>
            <ellipse cx="108" cy="180" rx="14" ry="4" fill="#887868" stroke="#7a6858" strokeWidth="1"/>

            {/* Pan sitting ON left stovetop burner (cy=180, so pan sits just above) */}
            <g className="pan-g">
              <ellipse cx="40" cy="173" rx="30" ry="8"  fill="#3a2a22" stroke="#2a1a12" strokeWidth="1.5"/>
              <ellipse cx="40" cy="171" rx="30" ry="6"  fill="none"    stroke="#5a4a42" strokeWidth="1"/>
              <rect    x="69"  y="169" width="38" height="7" rx="3.5"  fill="#2a1a12" stroke="#1a0a02" strokeWidth="1"/>
              <circle cx="30" cy="172" r="3.5" fill="#fb923c" opacity="0.85"/>
              <circle cx="42" cy="170" r="3"   fill="#fbbf24" opacity="0.85"/>
              <circle cx="52" cy="173" r="3.5" fill="#fb923c" opacity="0.85"/>
            </g>

            {/* Steam rising up from pan */}
            <path className="steam1" d="M28 166 Q25 152 28 138" stroke="#c8b8b0" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path className="steam2" d="M40 163 Q37 149 40 135" stroke="#c8b8b0" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
            <path className="steam3" d="M52 166 Q49 152 52 138" stroke="#c8b8b0" strokeWidth="2.2" strokeLinecap="round" fill="none"/>

            {/* ── COUNTER CABINET — between stove and fridge ── */}
            {/* Counter cabinet body, y=255 to y=370 (floor) */}
            <rect x="148" y="255" width="184" height="115" rx="0" fill="#d4c0b0" stroke="#b8a898" strokeWidth="1"/>
            {/* Two cabinet doors */}
            <rect x="153" y="261" width="82" height="102" rx="3" fill="#dcc8b8" stroke="#b8a898" strokeWidth="1"/>
            <rect x="241" y="261" width="82" height="102" rx="3" fill="#dcc8b8" stroke="#b8a898" strokeWidth="1"/>
            {/* Door knobs */}
            <circle cx="232" cy="312" r="5" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>
            <circle cx="244" cy="312" r="5" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>
            {/* Countertop slab */}
            <rect x="148" y="245" width="184" height="14" rx="2" fill="#c8b4a2" stroke="#a89888" strokeWidth="1.2"/>
            <rect x="148" y="245" width="184" height="3"  rx="1" fill="#d8c4b2"/>

            {/* Items on counter */}
            {/* Fruit bowl */}
            <ellipse cx="232" cy="243" rx="26" ry="6"   fill="#c0a888" stroke="#a08868" strokeWidth="1.2"/>
            <path d="M206 243 Q232 229 258 243"          fill="#c8b090" stroke="#a08868" strokeWidth="1"/>
            <circle cx="222" cy="234" r="7"              fill="#fb923c"/>
            <circle cx="234" cy="231" r="7"              fill="#f87171"/>
            <circle cx="245" cy="235" r="6"              fill="#fbbf24"/>
            {/* Herb pot */}
            <rect x="262" y="229" width="18" height="16" rx="3" fill="#9a7040" stroke="#7a5828" strokeWidth="1"/>
            <ellipse cx="271" cy="229" rx="9" ry="3.5"  fill="#7a5828"/>
            <ellipse cx="267" cy="222" rx="6" ry="9"    fill="#4ade80" opacity="0.9" transform="rotate(-15 267 222)"/>
            <ellipse cx="275" cy="220" rx="6" ry="9"    fill="#22c55e" opacity="0.9" transform="rotate(12 275 220)"/>
            <ellipse cx="271" cy="218" rx="5" ry="8"    fill="#4ade80" opacity="0.8"/>

            {/* ── FREESTANDING FRIDGE — right wall, y=60 to y=370 (sits on floor) ── */}
            <rect x="332" y="60" width="148" height="310" rx="4" fill="#e8dcd4" stroke="#c8b8a8" strokeWidth="1.5"/>
            {/* Freezer compartment top portion */}
            <rect x="332" y="60"  width="148" height="110" rx="4" fill="#ddd0c8" stroke="#c8b8a8" strokeWidth="1"/>
            {/* Divider between freezer and fridge */}
            <line x1="332" y1="170" x2="480" y2="170" stroke="#b8a898" strokeWidth="2"/>
            {/* Freezer handle */}
            <rect x="462" y="80"  width="9" height="44" rx="4.5" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>
            {/* Fridge handle */}
            <rect x="462" y="188" width="9" height="60" rx="4.5" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>
            {/* Fridge magnets */}
            <rect x="344" y="178" width="26" height="20" rx="3" fill="#a855f7" opacity="0.8"/>
            <rect x="344" y="204" width="20" height="16" rx="3" fill="#fb923c" opacity="0.7"/>
            <rect x="372" y="182" width="18" height="22" rx="3" fill="#34d399" opacity="0.7"/>
            {/* Bottom vent grill */}
            <rect x="332" y="356" width="148" height="14" rx="0" fill="#c8b8a8"/>
            {[348,364,380,396,412,428,444,460].map(x => (
              <line key={`g${x}`} x1={x} y1="357" x2={x} y2="369" stroke="#a89888" strokeWidth="1"/>
            ))}

            {/* ── UPPER CABINET above counter ── */}
            <rect x="148" y="130" width="184" height="80" rx="4" fill="#d4c0b0" stroke="#b8a898" strokeWidth="1"/>
            <rect x="153" y="135" width="82" height="68" rx="2" fill="#dcc8b8" stroke="#b8a898" strokeWidth="1"/>
            <rect x="241" y="135" width="82" height="68" rx="2" fill="#dcc8b8" stroke="#b8a898" strokeWidth="1"/>
            <circle cx="232" cy="170" r="4" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>
            <circle cx="244" cy="170" r="4" fill="#a89888" stroke="#8a7a6a" strokeWidth="1"/>

            {/* ── ROBOT centered on floor ── */}
            <ellipse className="shadow-el" cx="240" cy="440" rx="70" ry="10" fill="#7c3aed" opacity="0.15"/>

            <g className="robot-body">
              <line x1="240" y1="88" x2="240" y2="116" stroke="#a855f7" strokeWidth="3" strokeLinecap="round"/>
              <circle className="antenna-dot" cx="240" cy="82" r="6" fill="#c084fc"/>

              <rect x="182" y="116" width="116" height="82" rx="18" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>

              <g className="eye-l">
                <rect x="194" y="135" width="32" height="24" rx="8" fill="#7c3aed"/>
                <circle cx="210" cy="147" r="7" fill="#1a1a1a"/>
                <circle cx="214" cy="141" r="3" fill="white" opacity="0.8"/>
              </g>
              <g className="eye-r">
                <rect x="254" y="135" width="32" height="24" rx="8" fill="#7c3aed"/>
                <circle cx="270" cy="147" r="7" fill="#1a1a1a"/>
                <circle cx="274" cy="141" r="3" fill="white" opacity="0.8"/>
              </g>

              <path d="M218 173 Q240 187 262 173" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <rect x="226" y="198" width="28" height="14" rx="5" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.5"/>

              <rect x="160" y="212" width="160" height="114" rx="20" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>
              <rect className="screen" x="184" y="228" width="112" height="60" rx="10" fill="#7c3aed" opacity="0.9"/>
              <polyline className="screen" points="190,257 200,247 210,264 220,243 230,260 240,250 250,258 260,244 270,257 280,253 290,257" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.9"/>

              <circle cx="176" cy="228" r="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.5"/>
              <circle cx="304" cy="228" r="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.5"/>
              <circle cx="176" cy="312" r="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.5"/>
              <circle cx="304" cy="312" r="4" fill="#e9d5ff" stroke="#a855f7" strokeWidth="1.5"/>

              <g className="arm-l">
                <rect x="130" y="218" width="32" height="70" rx="14" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>
                <circle cx="146" cy="298" r="12" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2"/>
                <line x1="138" y1="292" x2="132" y2="304" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
                <line x1="146" y1="310" x2="146" y2="320" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
                <line x1="154" y1="292" x2="160" y2="304" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
              </g>

              <g className="arm-r">
                <rect x="318" y="218" width="32" height="70" rx="14" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>
                <circle cx="334" cy="298" r="12" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2"/>
                <line x1="326" y1="292" x2="320" y2="304" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
                <line x1="334" y1="310" x2="334" y2="320" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
                <line x1="342" y1="292" x2="348" y2="304" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"/>
              </g>

              <rect x="188" y="324" width="104" height="20" rx="8" fill="#e9d5ff" stroke="#a855f7" strokeWidth="2"/>

              {/* Left leg + wheel */}
              <rect x="176" y="342" width="40" height="34" rx="10" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>
              <g>
                <circle cx="190" cy="378" r="20" fill="#7c3aed" stroke="#a855f7" strokeWidth="2"/>
                <circle cx="190" cy="378" r="8"  fill="#e9d5ff"/>
                <g>
                  <line x1="190" y1="358" x2="190" y2="398" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="170" y1="378" x2="210" y2="378" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 190 378" to="360 190 378" dur="1.2s" repeatCount="indefinite"/>
                </g>
              </g>

              {/* Right leg + wheel */}
              <rect x="264" y="342" width="40" height="34" rx="10" fill="#f3e8ff" stroke="#a855f7" strokeWidth="2.5"/>
              <g>
                <circle cx="290" cy="378" r="20" fill="#7c3aed" stroke="#a855f7" strokeWidth="2"/>
                <circle cx="290" cy="378" r="8"  fill="#e9d5ff"/>
                <g>
                  <line x1="290" y1="358" x2="290" y2="398" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="270" y1="378" x2="310" y2="378" stroke="#a855f7" strokeWidth="1.5" opacity="0.5"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 290 378" to="360 290 378" dur="1.2s" repeatCount="indefinite"/>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </section>

      <section className={styles.pillars}>
        <div className={styles.pillar}>
          <span className={styles.pillarNum}>01</span>
          <h3 className={styles.pillarTitle}>Observe</h3>
          <p className={styles.pillarText}>Robots begin by watching — collecting data from the world around them, building an understanding of their environment before they act.</p>
        </div>
        <div className={styles.pillarDivider} />
        <div className={styles.pillar}>
          <span className={styles.pillarNum}>02</span>
          <h3 className={styles.pillarTitle}>Learn</h3>
          <p className={styles.pillarText}>Through trial, feedback, and iteration, robots refine their behavior. The same principles that drive human learning power machine intelligence.</p>
        </div>
        <div className={styles.pillarDivider} />
        <div className={styles.pillar}>
          <span className={styles.pillarNum}>03</span>
          <h3 className={styles.pillarTitle}>Adapt</h3>
          <p className={styles.pillarText}>The best robots don't just memorize — they generalize. They take what they've learned and apply it to situations they've never seen before.</p>
        </div>
      </section>

      <section className={styles.cta}>
        <p className={styles.ctaText}>Ready to build something that thinks?</p>
        <button className={styles.btnPrimary} onClick={() => navigate('/auth?tab=signup')}>Create your account</button>
      </section>

      <footer className={styles.footer}>
        <span>Princeton Planning &amp; Robot Learning Lab — Robotics Outreach</span>
        <span className={styles.footerDot}>·</span>
        <span>Princeton University</span>
      </footer>
    </div>
  );
}
