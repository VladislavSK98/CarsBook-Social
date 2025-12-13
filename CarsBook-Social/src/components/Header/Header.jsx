import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Header.module.css";
import logo from "../../assets/logo2.png";

export default function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <img src="src/assets/fonlogo.png" alt="Logo" className={styles.logo} />
          <span className={styles.title}>CarsBook</span>
        </div>

        <nav className={styles.nav}>
          <Link to="/">Home</Link>
          <Link to="/parking">Parking</Link>
          <Link to="/tracks">Tracks</Link>

          {isAuthenticated ? (
            <>
              <Link to="/garage">My Garage</Link>
              <Link to="/logout" className={styles.logout}>Logout</Link>
              <span className={styles.user}>{email}</span>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className={styles.register}>Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
