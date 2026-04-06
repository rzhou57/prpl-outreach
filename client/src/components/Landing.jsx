import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const kinderFunctionLines = [
    'def _run_move_base_to(',
    '    env: Any,',
    '    state: Any,',
    '    sim: ObjectCentricBaseMotion3DEnv,',
    '    target_x: float,',
    '    target_y: float,',
    ') -> tuple[Any, list[NDArray[np.uint8]]]:',
    '    """Move the robot base to (target_x, target_y), return updated state and frames."""',
    '    assert isinstance(state, BaseMotion3DObjectCentricState)',
    '    sim.set_state(state)  # type: ignore[no-untyped-call]',
    '',
    '    goal_pose = SE2Pose(target_x, target_y, 0.0)',
    '    base_plan = run_single_arm_mobile_base_motion_planning(',
    '        sim.robot,',
    '        sim.robot.base.get_pose(),',
    '        goal_pose,',
    '        collision_bodies=set(),',
    '        seed=0,',
    '    )',
    '    if base_plan is None:',
    '        raise RuntimeError(f"Motion planning to ({target_x}, {target_y}) failed")',
    '',
    '    plan = base_plan[1:]',
    '    frames: list[NDArray[np.uint8]] = []',
    '',
    '    for step_i, waypoint in enumerate(plan):',
    '        current_base_pose = state.base_pose',
    '        delta = waypoint - current_base_pose',
    '        action_lst = [delta.x, delta.y, delta.rot] + [0.0] * 8',
    '        action = np.array(action_lst, dtype=np.float32)',
    '',
    '        obs, _, _, _, _ = env.step(action)',
    '        state = env.observation_space.devectorize(obs)  # type: ignore[attr-defined]',
    '',
    '        if step_i % FRAME_SKIP == 0 or step_i == len(plan) - 1:',
    '            frame: NDArray[np.uint8] = env.render()  # type: ignore[assignment]',
    '            frames.append(frame)',
    '',
    '    return state, frames',
  ];

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
            <circle cx="74"  cy="354" r="8" fill="#9160ee" stroke="#8350e2" strokeWidth="1.2"/>
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
            <rect x="344" y="178" width="26" height="20" rx="3" fill="#b883fa" opacity="0.8"/>
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
            <ellipse className="shadow-el" cx="240" cy="440" rx="70" ry="10" fill="#9160ee" opacity="0.15"/>

            <g className="robot-body">
              <line x1="240" y1="88" x2="240" y2="116" stroke="#b883fa" strokeWidth="3" strokeLinecap="round"/>
              <circle className="antenna-dot" cx="240" cy="82" r="6" fill="#c084fc"/>

              <rect x="182" y="116" width="116" height="82" rx="18" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>

              <g className="eye-l">
                <rect x="194" y="135" width="32" height="24" rx="8" fill="#9160ee"/>
                <circle cx="210" cy="147" r="7" fill="#1a1a1a"/>
                <circle cx="214" cy="141" r="3" fill="white" opacity="0.8"/>
              </g>
              <g className="eye-r">
                <rect x="254" y="135" width="32" height="24" rx="8" fill="#9160ee"/>
                <circle cx="270" cy="147" r="7" fill="#1a1a1a"/>
                <circle cx="274" cy="141" r="3" fill="white" opacity="0.8"/>
              </g>

              <path d="M218 173 Q240 187 262 173" stroke="#b883fa" strokeWidth="3" strokeLinecap="round" fill="none"/>
              <rect x="226" y="198" width="28" height="14" rx="5" fill="#e9d5ff" stroke="#b883fa" strokeWidth="1.5"/>

              <rect x="160" y="212" width="160" height="114" rx="20" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>
              <rect className="screen" x="184" y="228" width="112" height="60" rx="10" fill="#9160ee" opacity="0.9"/>
              <polyline className="screen" points="190,257 200,247 210,264 220,243 230,260 240,250 250,258 260,244 270,257 280,253 290,257" stroke="#c084fc" strokeWidth="2" fill="none" opacity="0.9"/>

              <circle cx="176" cy="228" r="4" fill="#e9d5ff" stroke="#b883fa" strokeWidth="1.5"/>
              <circle cx="304" cy="228" r="4" fill="#e9d5ff" stroke="#b883fa" strokeWidth="1.5"/>
              <circle cx="176" cy="312" r="4" fill="#e9d5ff" stroke="#b883fa" strokeWidth="1.5"/>
              <circle cx="304" cy="312" r="4" fill="#e9d5ff" stroke="#b883fa" strokeWidth="1.5"/>

              <g className="arm-l">
                <rect x="130" y="218" width="32" height="70" rx="14" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>
                <circle cx="146" cy="298" r="12" fill="#e9d5ff" stroke="#b883fa" strokeWidth="2"/>
                <line x1="138" y1="292" x2="132" y2="304" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
                <line x1="146" y1="310" x2="146" y2="320" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
                <line x1="154" y1="292" x2="160" y2="304" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
              </g>

              <g className="arm-r">
                <rect x="318" y="218" width="32" height="70" rx="14" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>
                <circle cx="334" cy="298" r="12" fill="#e9d5ff" stroke="#b883fa" strokeWidth="2"/>
                <line x1="326" y1="292" x2="320" y2="304" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
                <line x1="334" y1="310" x2="334" y2="320" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
                <line x1="342" y1="292" x2="348" y2="304" stroke="#b883fa" strokeWidth="2" strokeLinecap="round"/>
              </g>

              <rect x="188" y="324" width="104" height="20" rx="8" fill="#e9d5ff" stroke="#b883fa" strokeWidth="2"/>

              {/* Left leg + wheel */}
              <rect x="176" y="342" width="40" height="34" rx="10" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>
              <g>
                <circle cx="190" cy="378" r="20" fill="#9160ee" stroke="#b883fa" strokeWidth="2"/>
                <circle cx="190" cy="378" r="8"  fill="#e9d5ff"/>
                <g>
                  <line x1="190" y1="358" x2="190" y2="398" stroke="#b883fa" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="170" y1="378" x2="210" y2="378" stroke="#b883fa" strokeWidth="1.5" opacity="0.5"/>
                  <animateTransform attributeName="transform" type="rotate" from="0 190 378" to="360 190 378" dur="1.2s" repeatCount="indefinite"/>
                </g>
              </g>

              {/* Right leg + wheel */}
              <rect x="264" y="342" width="40" height="34" rx="10" fill="#f3e8ff" stroke="#b883fa" strokeWidth="2.5"/>
              <g>
                <circle cx="290" cy="378" r="20" fill="#9160ee" stroke="#b883fa" strokeWidth="2"/>
                <circle cx="290" cy="378" r="8"  fill="#e9d5ff"/>
                <g>
                  <line x1="290" y1="358" x2="290" y2="398" stroke="#b883fa" strokeWidth="1.5" opacity="0.5"/>
                  <line x1="270" y1="378" x2="310" y2="378" stroke="#b883fa" strokeWidth="1.5" opacity="0.5"/>
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

      {/* ── ABSTRACTION SECTION ── */}
      <section className={styles.abstraction}>
        <div className={styles.abstractionContent}>
          <p className={styles.eyebrow}>Real Robot, Big Idea</p>
          <h2 className={styles.abstractionTitle}>TidyBot &amp; <em>Abstraction</em></h2>
          <p className={styles.abstractionBody}>
            TidyBot is a real mobile manipulator robot that picks up objects and puts
            them away. Making it grab a single item requires rotating a base, extending
            a robotic arm, angling a wrist, opening and closing a gripper, and lifting —
            all with exact numbers. Abstraction lets us hide all of that inside simple
            high-level blocks so you can focus on <strong>what</strong> the robot should do,
            without worrying about the details. And when you're ready, you can peek inside the blocks to see the code that makes it all happen.
          </p>
        </div>

        <div className={styles.abstractionVis} aria-hidden="true">
          <svg viewBox="0 0 760 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.abstractionSvg}>
            <defs>
              <linearGradient id="absEditorFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1a1b26" stopOpacity="0"/>
                <stop offset="100%" stopColor="#1a1b26" stopOpacity="1"/>
              </linearGradient>
              <clipPath id="absEditorClip">
                <rect x="0" y="32" width="288" height="268" />
              </clipPath>
            </defs>
            <style>{`
              @keyframes absCodeWave {
                0%, 100% { opacity: 0.5; }
                50%       { opacity: 1; }
              }
              @keyframes absArrowPulse {
                0%, 100% { transform: translateX(0px); opacity: 0.75; }
                50%      { transform: translateX(5px); opacity: 1; }
              }
              @keyframes absGlowPulse {
                0%, 100% { opacity: 0.5; }
                50%      { opacity: 0.9; }
              }
              .abs-c1  { animation: absCodeWave 3.2s ease-in-out infinite 0s; }
              .abs-c2  { animation: absCodeWave 3.2s ease-in-out infinite 0.25s; }
              .abs-c3  { animation: absCodeWave 3.2s ease-in-out infinite 0.5s; }
              .abs-c4  { animation: absCodeWave 3.2s ease-in-out infinite 0.75s; }
              .abs-c5  { animation: absCodeWave 3.2s ease-in-out infinite 1s; }
              .abs-c6  { animation: absCodeWave 3.2s ease-in-out infinite 1.25s; }
              .abs-c7  { animation: absCodeWave 3.2s ease-in-out infinite 1.5s; }
              .abs-c8  { animation: absCodeWave 3.2s ease-in-out infinite 1.75s; }
              .abs-c9  { animation: absCodeWave 3.2s ease-in-out infinite 2s; }
              .abs-c10 { animation: absCodeWave 3.2s ease-in-out infinite 2.25s; }
              .abs-arrow { animation: absArrowPulse 1.8s ease-in-out infinite; transform-origin: 370px 150px; }
              .abs-glow  { animation: absGlowPulse 2.5s ease-in-out infinite; }
            `}</style>

            {/* ══ LEFT: Code Editor ══ */}
            <rect x="0" y="0" width="288" height="300" fill="#1a1b26"/>
            <rect x="0" y="0" width="288" height="32" fill="#24283b"/>
            <circle cx="18" cy="16" r="5" fill="#ff5f57"/>
            <circle cx="33" cy="16" r="5" fill="#febc2e"/>
            <circle cx="48" cy="16" r="5" fill="#28c840"/>
            <rect x="64" y="6" width="134" height="20" rx="3" fill="#1a1b26" opacity="0.5"/>
            <text x="72" y="20" fontFamily="'Courier New', monospace" fontSize="10" fill="#7aa2f7">executor.py</text>

            <g clipPath="url(#absEditorClip)">
              {kinderFunctionLines.map((_, i) => (
                <text key={`ln-${i}`} x="8" y={46 + i * 6.1} fontFamily="'Courier New', monospace" fontSize="6" fill="#3b4261">{i + 1}</text>
              ))}

              {kinderFunctionLines.map((line, i) => (
                <text
                  key={`code-${i}`}
                  x="26"
                  y={46 + i * 6.1}
                  fontFamily="'Courier New', monospace"
                  fontSize="5.8"
                  fill="#c0caf5"
                  xmlSpace="preserve"
                >
                  {line}
                </text>
              ))}
            </g>
            <rect x="0" y="235" width="288" height="65" fill="url(#absEditorFade)"/>

            {/* ══ CENTER: Abstraction Funnel ══ */}
            <path d="M288 90  Q318 90  338 140" stroke="#b883fa" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" fill="none"/>
            <path d="M288 150 Q315 150 340 150" stroke="#b883fa" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" fill="none"/>
            <path d="M288 210 Q318 210 338 160" stroke="#b883fa" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" fill="none"/>
            <circle className="abs-glow" cx="370" cy="150" r="52" fill="#f3e8ff" opacity="0.6"/>
            <circle cx="370" cy="150" r="52" stroke="#b883fa" strokeWidth="1" strokeDasharray="3 4" opacity="0.3" fill="none"/>
            {/* Package icon */}
            <rect x="352" y="122" width="36" height="30" rx="4" fill="none" stroke="#9160ee" strokeWidth="2"/>
            <path d="M352 133 L370 139 L388 133" stroke="#9160ee" strokeWidth="2" fill="none"/>
            <line x1="370" y1="139" x2="370" y2="152" stroke="#b883fa" strokeWidth="1.5"/>
            <text x="370" y="174" textAnchor="middle" fontFamily="sans-serif" fontSize="8.5" fontWeight="800" letterSpacing="0.14em" fill="#9160ee">ABSTRACTION</text>
            {/* Arrow → blocks */}
            <g className="abs-arrow">
              <line x1="408" y1="150" x2="458" y2="150" stroke="#9160ee" strokeWidth="2.5" strokeLinecap="round"/>
              <polyline points="453,144 461,150 453,156" stroke="#9160ee" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </g>

            {/* ══ RIGHT: Blockly Blocks — kinder-blockly/static/blocks.js ══ */}

            {/* BLOCK 1 — move_base_to_target (blue) */}
            <rect x="488" y="50" width="22" height="12" rx="3" fill="#4a90e2"/>
            <rect x="466" y="62" width="286" height="52" rx="6" fill="#4a90e2"/>
            <rect x="466" y="62" width="286" height="20" rx="6" fill="#3278c6"/>
            <rect x="466" y="74" width="286" height="8" fill="#3278c6"/>
            <circle cx="481" cy="89" r="9" fill="rgba(255,255,255,0.18)"/>
            {/* target/crosshair icon */}
            <circle cx="481" cy="89" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
            <line x1="481" y1="83" x2="481" y2="85" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="481" y1="93" x2="481" y2="95" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="475" y1="89" x2="477" y2="89" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="485" y1="89" x2="487" y2="89" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <text x="496" y="93" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="white">Move base to</text>
            <rect x="628" y="76" width="114" height="24" rx="4" fill="#2060b0"/>
            <text x="685" y="92" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="11" fill="#a8d4ff">x 0 y 0</text>

            {/* BLOCK 2 — move gripper to (purple) */}
            <rect x="488" y="106" width="22" height="12" rx="3" fill="#8b5cf6"/>
            <rect x="466" y="118" width="286" height="52" rx="6" fill="#8b5cf6"/>
            <rect x="466" y="118" width="286" height="20" rx="6" fill="#7d4ce9"/>
            <rect x="466" y="130" width="286" height="8" fill="#7d4ce9"/>
            <circle cx="481" cy="145" r="9" fill="rgba(255,255,255,0.18)"/>
            <path d="M476 146 Q481 138 486 146" stroke="white" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <circle cx="481" cy="147" r="1.8" fill="white"/>
            <text x="496" y="149" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="white">Move gripper to</text>
            <rect x="624" y="132" width="118" height="24" rx="4" fill="#6b3fd4"/>
            <text x="683" y="148" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="11" fill="#e9ddff">x 1 y 1 z 0.3</text>

            {/* BLOCK 3 — pick target (green) */}
            <rect x="488" y="162" width="22" height="12" rx="3" fill="#3fa86d"/>
            <rect x="466" y="174" width="286" height="52" rx="6" fill="#3fa86d"/>
            <rect x="466" y="174" width="286" height="20" rx="6" fill="#2f8c5a"/>
            <rect x="466" y="186" width="286" height="8" fill="#2f8c5a"/>
            <circle cx="481" cy="201" r="9" fill="rgba(255,255,255,0.18)"/>
            <rect x="476" y="196" width="10" height="8" rx="1.5" stroke="white" strokeWidth="1.4" fill="none"/>
            <line x1="476" y1="196" x2="486" y2="204" stroke="white" strokeWidth="1.2"/>
            <text x="496" y="205" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="white">Pick object</text>
            <rect x="634" y="190" width="108" height="24" rx="4" fill="#227447"/>
            <text x="688" y="206" textAnchor="middle" fontFamily="'Courier New', monospace" fontSize="11" fill="#bff6d7">target id: 2</text>
          </svg>
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
