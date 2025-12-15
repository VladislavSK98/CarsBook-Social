import { useRegister, useLogin } from "../../api/authApi";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { login } = useLogin();
    const { userLoginHandler } = useUserContext();

    const registerHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // 🔐 Password validation
        if (data.password !== data["confirm-password"]) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            // 1️⃣ Register
            await register({
                tel: data.tel,
                username: data.username,
                email: data.email,
                password: data.password,
                repeatPassword: data["confirm-password"],
            });

            // 2️⃣ Auto login
            const authData = await login(data.email, data.password);

            userLoginHandler({
                ...authData.user,
                accessToken: authData.accessToken,
            });

            toast.success("Successful registration 🎉");
            navigate("/garage");

        } catch (err) {
            toast.error(err.message || "Registration failed");
        }
    };

    return (
        <section id="register-page" className="auth">
            <form id="register" onSubmit={registerHandler}>
                <div className="container">
                    <h2>Register</h2>

                    <label>Username</label>
                    <input name="username" className="input" required />

                    <label>Email</label>
                    <input type="email" name="email" className="input" required />

                    <label>Password</label>
                    <input type="password" name="password" className="input" required />

                    <label>Confirm Password</label>
                    <input type="password" name="confirm-password" className="input" required />

                    <input className="submit" type="submit" value="Register" />

                    <p className="field">
                        Already have an account? <a href="/login">Login</a>
                    </p>
                </div>
            </form>
        </section>
    );
}
