import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token && !user) navigate('/auth?tab=login');
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.grid} aria-hidden="true"/>
      <div className={styles.glowTop} aria-hidden="true"/>
      <div className={styles.glowBottom} aria-hidden="true"/>

      <nav className={styles.nav}>
        <Link to="/" className={styles.logo}>
          <img src="/logo.png" alt="PRPL" className={styles.logoImg}
            onError={e => { e.target.style.display = 'none'; }}/>
          <div className={styles.logoText}>
            <span className={styles.logoMark}>PRPL</span>
            <span className={styles.logoSub}>Robotics Outreach</span>
          </div>
        </Link>
        <button className={styles.logoutBtn} onClick={handleLogout}>Log out</button>
      </nav>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.avatarRing}>
            <div className={styles.avatar}>
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
          </div>
          <p className={styles.eyebrow}>Welcome back</p>
          <h1 className={styles.name}>{user.firstName} {user.lastName}</h1>
          <div className={styles.divider}/>
          <div className={styles.comingSoon}>
            <span className={styles.comingIcon}>🚧</span>
            <p className={styles.comingText}>Dashboard coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
