import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../../api/authApi";
import { UserContext } from "../../contexts/UserContext";
import { toast } from 'react-toastify';

export default function Login() {
    const navigate = useNavigate();
    const { userLoginHandler } = useContext(UserContext);
    const { login } = useLogin();

    const [isLoading, setIsLoading] = useState(false);

    const loginHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());

        try {
            const authData = await login(values.email, values.password);
            userLoginHandler({
                ...authData.user,
                accessToken: authData.accessToken,
            });
            
            toast.success('Successful Login');
            navigate('/garage');
            console.log("Navigation triggered to /garage");

        } catch (err) {
            toast.error(err.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="login-page" className="auth">
            <form id="login" onSubmit={loginHandler}>
                <div className="container">
                    <h2>Login</h2>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email"  
                        id="email" 
                        name="email" 
                        placeholder="youremail@gmail.com" 
                        className="input"
                        required
                    />

                    <label htmlFor="login-password">Password:</label>
                    <input 
                        type="password" 
                        id="login-password" 
                        name="password" 
                        className="input"
                        required
                        autoComplete="current-password"
                    />

                    <input 
                        type="submit" 
                        className="button submit" 
                        value={isLoading ? "Logging in..." : "Login"} 
                        disabled={isLoading}
                    />

                    <p className="field">
                        <span>If you don't have a profile, click <Link to="/register">here</Link></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
