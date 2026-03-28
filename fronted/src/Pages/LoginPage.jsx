import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const {

    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    try {
      console.log("API URL:", import.meta.env.VITE_API_URL); // ← agrega esto
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log(data);

    
        navigate("/dashboard/@me");
       
        console.log(data);

        setError("root", { message: data.message, login: data.login });
       
        
    } catch {
      setError("root", { message: "Connection error — check your server" });
    }
  };

  return (
    <main className="login-page">
      <div className="card">
        {/* Logo */}
        <div className="logo">
          <div className="logo-mark" />
          <span className="logo-name">Workspace</span>
        </div>

        <h1>Welcome back</h1>
        <p className="subtitle">Sign in to continue to your workspace</p>

        {/* Social buttons */}
        <div className="social-row">
          <button type="button" className="social-btn">Google</button>
          <button type="button" className="social-btn">Microsoft</button>
        </div>

        <span className="divider">or sign in with email</span>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Email */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@company.com"
              className={errors.email ? "invalid" : ""}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,  // ← fix principal
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <span className="error-msg">{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className={errors.password ? "invalid" : ""}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && <span className="error-msg">{errors.password.message}</span>}
          </div>

          <a className="forgot" href="#">Forgot password?</a>

          {/* Error global (credenciales inválidas) */}
          {errors.root && <p className="error-msg show">{errors.root.message}</p>}

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="footer-text">
          Don't have an account? <a href="#">Sign up free</a>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;