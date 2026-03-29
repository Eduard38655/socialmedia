import styles from "../../Styles/WelcomePage.module.css";

export default function WelcomePage() {
  return (
    <div className={styles.page}  >
     
      <div className={styles.grid}  />

     
      <div className={styles.blob1}  />
      <div className={styles.blob2}  />

      <main className={styles.main}>
    
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Now in beta
        </div>

        {/* Logo mark */}
        <div className={styles.logoMark} aria-hidden="true">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path
              d="M7 11C7 9.34 8.34 8 10 8h16c1.66 0 3 1.34 3 3v9c0 1.66-1.34 3-3 3h-2.5l-5 5-5-5H10c-1.66 0-3-1.34-3-3v-9z"
              fill="var(--primary-foreground)"
              fillOpacity="0.95"
            />
            <circle cx="12" cy="16" r="1.8" fill="var(--primary)" />
            <circle cx="18" cy="16" r="1.8" fill="var(--primary)" />
            <circle cx="24" cy="16" r="1.8" fill="var(--primary)" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          Welcome to{" "}
          <span className={styles.brand}>TalkSync</span>
        </h1>

        <p className={styles.sub}>
          One place for your team to chat, collaborate,
          <br />
          and stay in sync — in real time.
        </p>
      </main>
    </div>
  );
}