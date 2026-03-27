import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (user) => {
    try {
      console.log(user);
      
      console.log("API URL:", import.meta.env.VITE_API_URL);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/login`, {
        method: "POST",

        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });

      console.log("LOGIN STATUS:", res.status);

      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);


      if (data.ok) {
        navigate("/dashboard/@me");
      }






    } catch (error) {
      console.error("LOGIN ERROR:", error);
    }
  };

  return (
    <main>
      <h2>Welcome back</h2>
      <p>Enter your details...</p>

      <div>
        <button type="button">Continue with Google</button>
        <button type="button">Continue with Microsoft</button>
      </div>

      <span>Or sign in with email</span>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                 
                message: "Invalid email format",
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Minimum 6 characters",
              },
            })}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}

export default LoginPage;