import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Glow Store</h1>
        <p className="hero-subtitle">
          Discover premium skincare products for your beauty routine
        </p>
        <Link to="/products" className="cta-button">
          Shop Now
        </Link>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Premium Quality</h3>
          <p>Carefully curated skincare products from trusted brands</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Shipping</h3>
          <p>Quick delivery to your doorstep</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💝</div>
          <h3>Special Offers</h3>
          <p>Exclusive deals and discounts on featured products</p>
        </div>
      </div>
    </div>
  );
}
