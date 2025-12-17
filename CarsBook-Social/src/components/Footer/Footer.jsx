import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerleft}>
        <h2>CarsBook-Social</h2>
        <span>&copy; {new Date().getFullYear()}</span>
      </div>

      <div className={styles.footerlinks}>
        <Link to="/">Home</Link>
        <Link to="/tracks">Tracks</Link>
        <Link to="/parking">Cars</Link>
        <Link to="/garage">Garage</Link>
      </div>

      <div className={styles.footerright}>
        <a href="https://www.facebook.com/"><FaFacebook /></a>
        <a href="https://www.instagram.com/"><FaInstagram /></a>
        <a href="https://x.com/"><FaTwitter /></a>
      </div>
    </footer>
  );
}
