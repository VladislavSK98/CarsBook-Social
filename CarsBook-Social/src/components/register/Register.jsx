import { useRegister } from "../../api/authApi";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useRegister();
    const { userLoginHandler } = useUserContext();

    const registerHandler = async (e) => {
        e.preventDefault(); // ❗️ Спира презареждането на страницата
    
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
    
        if (data.password !== data['confirm-password']) {
            console.log('Password mismatch');
            return;
        }
    
        const authData = await register({
            tel: data.tel,
            username: data.username,
            email: data.email,
            password: data.password,
            repeatPassword: data['confirm-password'],
        });
    
        userLoginHandler(authData);
        navigate('/');
    };
    

    return (
        <section id="register-page" className="auth">
            <form id="register" onSubmit={registerHandler}>
                <div className="container">
                    <div className="brand-logo"></div>
                    <h2>Register</h2>

                    <label htmlFor="username">Username:</label>
                    <input type="text" name="username" id="username" className="username" />

                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="maria@email.com" className="input" />

                    <label htmlFor="pass">Password:</label>
                    <input type="password" name="password" id="register-password" className="input" />

                    <label htmlFor="con-pass">Confirm Password:</label>
                    <input type="password" name="confirm-password" id="confirm-password" className="input" />

                    <input className="button submit" type="submit" value="Register" />

                    <p className="field">
                        <span>If you already have a profile click <a href="#">here</a></span>
                    </p>
                </div>
            </form>
        </section>
    );
}
