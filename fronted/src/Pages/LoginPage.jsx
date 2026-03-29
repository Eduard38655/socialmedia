import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styles from "../Styles/LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        navigate("/dashboard/@me"); return;
      }
      setError("root", { message: data.message || "Invalid credentials" });
    } catch {
      setError("root", { message: "Connection error — check your server" });
    }
  };

  return (
    <div className={styles.lp}>
      {/* Background blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      <div className={styles.card}>

        {/* LEFT: Image panel */}
        <div className={styles.left}>
          <img
            className={styles.leftImg}
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
            alt="Team collaboration"
          />
          <div className={styles.leftOverlay} />
          <div className={styles.leftCaption}>
            <h2>Your team, in sync.</h2>
            <p>Real-time messaging and collaboration for modern teams.</p>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className={styles.right}>

          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <svg viewBox="0 0 24 24">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className={styles.brandName}>Workspace</span>
            <span className={styles.brandTag}>Beta</span>
          </div>

          <div className={styles.fhead}>
            <h1 className={styles.ftitle}>Welcome back!</h1>
            <p className={styles.fsub}>Sign in to continue to your workspace.</p>
          </div>

          <div className={styles.socials}>
            <button type="button" className={styles.soc}>
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button type="button" className={styles.soc}>
              <svg viewBox="0 0 24 24" fill="#8b9dc3">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
              Discord
            </button>
          </div>

          <div className={styles.or}>or with email</div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div className={`${styles.field} ${styles.field1}`}>
              <label htmlFor="email">Email</label>
              <div className={styles.wrap}>
                <span className={styles.ico}>
                  <svg viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="you@yourteam.com"
                  className={`${styles.input}${errors.email ? ` ${styles.inputErr}` : ""}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                  })}
                />
              </div>
              {errors.email && <span className={styles.errmsg}>{errors.email.message}</span>}
            </div>

            <div className={`${styles.field} ${styles.field2}`}>
              <div className={styles.pwRow}>
                <label htmlFor="password">Password</label>
                <a className={styles.forgot} href="#">Forgot password?</a>
              </div>
              <div className={styles.wrap}>
                <span className={styles.ico}>
                  <svg viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className={`${styles.input}${errors.password ? ` ${styles.inputErr}` : ""}`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  className={styles.eye}
                  onClick={() => setShowPw(p => !p)}
                  tabIndex={-1}
                >
                  {showPw ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <span className={styles.errmsg}>{errors.password.message}</span>}
            </div>



            <label className={styles.remember}>
              
              <input type="checkbox" />
              <span>Keep me signed in for 30 days</span>
            </label>

            {errors.root && <p className={styles.rootErr}>{errors.root.message}</p>}

            <button type="submit" className={styles.btn} disabled={isSubmitting}>
              {isSubmitting ? "Signing in…" : "Sign in to Workspace →"}
            </button>
          </form>

          <p className={styles.foot}>
            New here? <a href="#">Create an account</a>
          </p>
        </div>

      </div>
    </div>
  );
}