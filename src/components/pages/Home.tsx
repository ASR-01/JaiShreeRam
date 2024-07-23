
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our Website</h1>
        <p>Your one-stop solution for all your needs</p>
      </header>
      <nav className="home-nav">
        <ul>
          <li><Link to="/terms-conditions">Terms and Conditions</Link></li>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/refund-policy">Refunds/Cancellations</Link></li>
          <li><Link to="/shipping-policy">Shipping Policy</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
          <li><Link to="/services-products">Services/Products</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Home;
