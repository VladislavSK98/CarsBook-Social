// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-logo">
                    <h2>CarRacingHub</h2>
                    <p>Adrenaline. Speed. Community.</p>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/tracks">Tracks</Link></li>
                        <li><Link to="/parking">Cars</Link></li>
                        <li><Link to="/posts">Posts</Link></li>
                    </ul>
                </div>

                <div className="footer-socials">
                    <h4>Follow Us</h4>
                    <div className="icons">
                        <a href="#"><FaFacebook /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaTwitter /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} CarRacingHub. All rights reserved.</p>
            </div>
        </footer>
    );
}
