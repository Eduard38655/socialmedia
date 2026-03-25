import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
function LoginPage() {
const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = (user) => {

        try { 

            fetch(  `${import.meta.env.VITE_API_URL}/public/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    password: user.password,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                  
 
                    if (data.ok) {
                        navigate("/dashboard/@me")
                    }
                    
                });

        } catch (error) {
            console.log(error);

        }
    }

    return (
        <main>
            {/* Header */}
            <h2>Welcome back</h2>
            <p>Enter your details...</p>

            {/* Social login */}
            <div>
                <button type="button">Continue with Google</button>
                <button type="button">Continue with Microsoft</button>
            </div>

            {/* Divider */}
            <span>Or sign in with email</span>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>

                {/* Email */}
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    {errors.email && <span>{errors.email.message}</span>}
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Minimum 6 characters"
                            },
                            maxLength: {
                                value: 20,
                                message: "Maximum 20 characters"
                            }
                        })}
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                </div>

                <button type="submit">Sign in</button>
            </form>

            {/* Footer links */}
            <p>
                Don't have an account? <a href="#">Create an account</a>
            </p>

            <nav>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </nav>
        </main>
    )
}

export default LoginPage