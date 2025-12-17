import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>About Glow Store</h1>
        <p className="about-tagline">Your trusted partner in skincare excellence</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Glow Store was founded with a simple mission: to bring premium skincare products
            to everyone who values quality and effectiveness. We carefully curate our collection
            to ensure that every product meets our high standards.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <p>
            From advanced serums to nourishing masks, our product range includes some of the
            most sought-after skincare items. We partner with trusted brands to bring you
            products that deliver real results.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Commitment</h2>
          <p>
            We're committed to providing authentic products, fast shipping, and excellent
            customer service. Your satisfaction and skin health are our top priorities.
          </p>
        </section>
      </div>
    </div>
  );
}
