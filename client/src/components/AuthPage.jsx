import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { api } from '../api';
import TermsModal from './TermsModal';
import styles from './AuthPage.module.css';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming',
];
const GRADE_LEVELS = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade','7th Grade','8th Grade','9th Grade'];

function useResendTimer() {
  const [seconds, setSeconds] = useState(0);
  const start = useCallback(() => setSeconds(30), []);
  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);
  return { seconds, start, canResend: seconds === 0 };
}

function CodeInput({ value, onChange }) {
  const digits = value.split('').concat(Array(6).fill('')).slice(0, 6);
  const refs = Array.from({ length: 6 }, () => null);
  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      onChange(value.slice(0, i) + value.slice(i + 1));
      if (i > 0) refs[i - 1]?.focus();
    }
  };
  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = (value.slice(0, i) + char + value.slice(i + 1)).slice(0, 6);
    onChange(next);
    if (char && i < 5) refs[i + 1]?.focus();
  };
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted);
    refs[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };
  return (
    <div className={styles.codeBoxes}>
      {digits.map((d, i) => (
        <input key={i} ref={el => { refs[i] = el; }} className={styles.codeBox}
          type="text" inputMode="numeric" maxLength={1} value={d}
          onChange={e => handleChange(i, e)} onKeyDown={e => handleKey(i, e)} onPaste={handlePaste}/>
      ))}
    </div>
  );
}

function VerifyScreen({ email }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const { seconds, start, canResend } = useResendTimer();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (code.length < 6) return setError('Please enter the full 6-digit code.');
    setError(''); setLoading(true);
    try {
      const data = await api.verify(email, code);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError(''); setResent(false);
    try { await api.resendVerify(email); setResent(true); start(); }
    catch (err) { setError(err.message); }
  };

  return (
    <div className={styles.formInner}>
      <div className={styles.iconBadge}>✉️</div>
      <h2 className={styles.formTitle}>Check your email</h2>
      <p className={styles.formSub}>We sent a 6-digit code to<br/><strong>{email}</strong></p>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {resent && <div className={styles.successBanner}>Code resent successfully!</div>}
      <div className={styles.field}>
        <label className={styles.label}>Verification code</label>
        <CodeInput value={code} onChange={setCode}/>
      </div>
      <button className={styles.submitBtn} onClick={handleVerify} disabled={loading || code.length < 6}>
        {loading ? <span className={styles.spinner}/> : null}
        {loading ? 'Verifying…' : 'Verify email'}
      </button>
      <p className={styles.resendRow}>
        Didn't get it?{' '}
        {canResend
          ? <button className={styles.linkBtn} onClick={handleResend}>Resend code</button>
          : <span className={styles.cooldown}>Resend in {seconds}s</span>}
      </p>
    </div>
  );
}

function ForgotScreen({ onBack }) {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { seconds, start, canResend } = useResendTimer();

  const handleRequest = async () => {
    if (!email) return setError('Please enter your email.');
    setError(''); setLoading(true);
    try { await api.forgotPassword(email); start(); setStep('code'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try { await api.forgotPassword(email); start(); }
    catch (err) { setError(err.message); }
  };

  const handleReset = async () => {
    if (newPassword.length < 8) return setError('Password must be at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    setError(''); setLoading(true);
    try { await api.resetPassword(email, code, newPassword); setStep('done'); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (step === 'done') return (
    <div className={styles.formInner}>
      <div className={styles.iconBadge}>✅</div>
      <h2 className={styles.formTitle}>Password reset!</h2>
      <p className={styles.formSub}>Your password has been updated. You can now log in.</p>
      <button className={styles.submitBtn} onClick={onBack}>Back to log in</button>
    </div>
  );

  return (
    <div className={styles.formInner}>
      <button className={styles.backBtn} onClick={step === 'request' ? onBack : () => setStep('request')}>← Back</button>
      <div className={styles.iconBadge}>{step === 'newpass' ? '🔒' : '🔑'}</div>
      <h2 className={styles.formTitle}>
        {step === 'request' && 'Forgot password'}
        {step === 'code'    && 'Enter reset code'}
        {step === 'newpass' && 'New password'}
      </h2>
      {error && <div className={styles.errorBanner}>{error}</div>}
      {step === 'request' && (
        <>
          <p className={styles.formSub}>Enter your email and we'll send a reset code.</p>
          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input className={styles.input} type="email" placeholder="you@school.edu"
              value={email} onChange={e => setEmail(e.target.value)}/>
          </div>
          <button className={styles.submitBtn} onClick={handleRequest} disabled={loading}>
            {loading ? <span className={styles.spinner}/> : null}
            {loading ? 'Sending…' : 'Send reset code'}
          </button>
        </>
      )}
      {step === 'code' && (
        <>
          <p className={styles.formSub}>We sent a code to <strong>{email}</strong></p>
          <div className={styles.field}>
            <label className={styles.label}>Reset code</label>
            <CodeInput value={code} onChange={setCode}/>
          </div>
          <button className={styles.submitBtn} onClick={() => { if (code.length < 6) return setError('Enter the full 6-digit code.'); setError(''); setStep('newpass'); }}
            disabled={code.length < 6}>Continue</button>
          <p className={styles.resendRow}>
            Didn't get it?{' '}
            {canResend
              ? <button className={styles.linkBtn} onClick={handleResend}>Resend code</button>
              : <span className={styles.cooldown}>Resend in {seconds}s</span>}
          </p>
        </>
      )}
      {step === 'newpass' && (
        <>
          <p className={styles.formSub}>Choose a new password for your account.</p>
          <div className={styles.field}>
            <label className={styles.label}>New password</label>
            <div className={styles.passWrap}>
              <input className={styles.input} type={showPass ? 'text' : 'password'}
                placeholder="At least 8 characters" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
              <button type="button" className={styles.passToggle} onClick={() => setShowPass(v => !v)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input className={styles.input} type="password" placeholder="Re-enter password"
              value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
            {confirmPassword && (
              <span className={newPassword === confirmPassword ? styles.matchOk : styles.matchBad}>
                {newPassword === confirmPassword ? '✓ Passwords match' : "✗ Passwords don't match"}
              </span>
            )}
          </div>
          <button className={styles.submitBtn} onClick={handleReset} disabled={loading}>
            {loading ? <span className={styles.spinner}/> : null}
            {loading ? 'Resetting…' : 'Reset password'}
          </button>
        </>
      )}
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState('login');
  const [pendingEmail, setPendingEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const data = await api.login(email, password);
      login(data.user, data.token); navigate('/dashboard');
    } catch (err) {
      if (err.message.includes('verify')) { setPendingEmail(email); setScreen('verify'); }
      else { setError(err.message); }
    } finally { setLoading(false); }
  };

  if (screen === 'verify') return <VerifyScreen email={pendingEmail}/>;
  if (screen === 'forgot') return <ForgotScreen onBack={() => setScreen('login')}/>;

  return (
    <div className={styles.formInner}>
      <h2 className={styles.formTitle}>Welcome back</h2>
      <p className={styles.formSub}>Log in to your PRPL Robotics account</p>
      {error && <div className={styles.errorBanner}>{error}</div>}
      <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:'16px'}}>
        <div className={styles.field}>
          <label className={styles.label}>Email address</label>
          <input className={styles.input} type="email" placeholder="you@school.edu"
            value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <div className={styles.passWrap}>
            <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/>
            <button type="button" className={styles.passToggle} onClick={() => setShowPass(v => !v)}>
              {showPass ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <button type="button" className={styles.forgotLink} onClick={() => setScreen('forgot')}>
          Forgot password?
        </button>
        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner}/> : null}
          {loading ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className={styles.switchText}>
        Don't have an account?{' '}
        <button className={styles.linkBtn} onClick={onSwitch}>Sign up free</button>
      </p>
    </div>
  );
}

function SignupForm({ onSwitch }) {
  const [form, setForm] = useState({
    firstName:'',lastName:'',age:'',gradeLevel:'',town:'',state:'',email:'',password:'',confirmPassword:'',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 8)  return { label: 'Too short', cls: styles.strengthWeak };
    if (p.length < 12) return { label: 'Fair', cls: styles.strengthFair };
    return { label: 'Strong', cls: styles.strengthStrong };
  })();

  const validate = () => {
    const { firstName,lastName,age,gradeLevel,town,state,email,password,confirmPassword } = form;
    if (!firstName||!lastName||!age||!gradeLevel||!town||!state||!email||!password) return 'Please fill in all fields.';
    if (parseInt(age) < 1 || parseInt(age) > 99) return 'Please enter an age (1–99).';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    if (!termsAccepted) return 'Please accept the Terms & Conditions.';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate(); if (err) return setError(err);
    setError(''); setLoading(true);
    try { await api.signup({ ...form, age: parseInt(form.age), termsAccepted }); setPendingEmail(form.email); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (pendingEmail) return <VerifyScreen email={pendingEmail}/>;

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)}/>}
      <div className={styles.formInner}>
        <h2 className={styles.formTitle}>Join PRPL Robotics</h2>
        <p className={styles.formSub}>Create your free student account</p>
        {error && <div className={styles.errorBanner}>{error}</div>}
        <form onSubmit={handleSubmit} noValidate style={{display:'flex',flexDirection:'column',gap:'14px'}}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>First name</label>
              <input className={styles.input} placeholder="Ada" value={form.firstName} onChange={set('firstName')}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Last name</label>
              <input className={styles.input} placeholder="Lovelace" value={form.lastName} onChange={set('lastName')}/>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Age</label>
              <input className={styles.input} type="number" min="1" max="99" placeholder="12"
                value={form.age} onChange={set('age')}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Grade level</label>
              <select className={styles.input} value={form.gradeLevel} onChange={set('gradeLevel')}>
                <option value="">Select…</option>
                {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Town / City</label>
              <input className={styles.input} placeholder="Princeton" value={form.town} onChange={set('town')}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>State</label>
              <select className={styles.input} value={form.state} onChange={set('state')}>
                <option value="">Select…</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email address</label>
            <input className={styles.input} type="email" placeholder="you@school.edu"
              value={form.email} onChange={set('email')} autoComplete="email"/>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passWrap}>
              <input className={styles.input} type={showPass ? 'text' : 'password'} placeholder="At least 8 characters"
                value={form.password} onChange={set('password')} autoComplete="new-password"/>
              <button type="button" className={styles.passToggle} onClick={() => setShowPass(v => !v)}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {strength && (
              <div className={styles.strengthRow}>
                <span className={`${styles.strengthDot} ${strength.cls}`}/>
                <span className={`${styles.strengthLabel} ${strength.cls}`}>{strength.label}</span>
              </div>
            )}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm password</label>
            <input className={styles.input} type="password" placeholder="Re-enter password"
              value={form.confirmPassword} onChange={set('confirmPassword')} autoComplete="new-password"/>
            {form.confirmPassword && (
              <span className={form.password === form.confirmPassword ? styles.matchOk : styles.matchBad}>
                {form.password === form.confirmPassword ? '✓ Passwords match' : "✗ Passwords don't match"}
              </span>
            )}
          </div>
          <label className={styles.termsRow}>
            <input type="checkbox" className={styles.checkbox}
              checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)}/>
            <span>I agree to the{' '}
              <button type="button" className={styles.linkBtn} onClick={() => setShowTerms(true)}>
                Terms &amp; Conditions
              </button>
            </span>
          </label>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner}/> : null}
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className={styles.switchText}>
          Already have an account?{' '}
          <button className={styles.linkBtn} onClick={onSwitch}>Log in</button>
        </p>
      </div>
    </>
  );
}

export default function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'login';
  const switchTab = t => setSearchParams({ tab: t });

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true"/>
      <div className={styles.glowTop} aria-hidden="true"/>
      <div className={styles.glowBottom} aria-hidden="true"/>
      <Link to="/" className={styles.backLink}>← Back to home</Link>
      <div className={styles.card}>
        <div className={styles.cardLogo}>
          <img src="/logo.png" alt="PRPL" className={styles.cardLogoImg}
            onError={e => { e.target.style.display = 'none'; }}/>
          <div className={styles.cardLogoText}>
            <span className={styles.cardLogoMark}>PRPL</span>
            <span className={styles.cardLogoSub}>Robotics Outreach</span>
          </div>
        </div>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab==='login' ? styles.tabActive : ''}`} onClick={() => switchTab('login')}>Log in</button>
          <button className={`${styles.tab} ${tab==='signup' ? styles.tabActive : ''}`} onClick={() => switchTab('signup')}>Sign up</button>
          <div className={styles.tabIndicator} style={{transform:`translateX(${tab==='signup'?'100%':'0%'})`}}/>
        </div>
        <div className={styles.formWrap}>
          {tab === 'login'
            ? <LoginForm onSwitch={() => switchTab('signup')}/>
            : <SignupForm onSwitch={() => switchTab('login')}/>}
        </div>
      </div>
    </div>
  );
}
