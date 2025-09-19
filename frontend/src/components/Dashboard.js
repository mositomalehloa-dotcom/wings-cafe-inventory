import React from 'react';
import './Dashboard.css';
import cafeImage from '../assets/cafe.jpg';

// Example images for specials
import wingsImage from '../assets/wings.jpg';
import mochaImage from '../assets/mocha.jpg';
import croissantImage from '../assets/croissant.jpg';
import cheesecakeImage from '../assets/cheesecake.jpg';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="logo-section">
        <img src={cafeImage} alt="Cafe Logo" className="logo" />
        <h2 className="tagline">Fresh Flavors, Every Day</h2>
      </div>

      <div className="cards-container">
        {/* Card 1: About Us */}
        <div className="card">
          <h3>About Us</h3>
          <p>Wings Cafe is your cozy escape in Maseru — serving premium coffee, warm meals, and fresh pastries daily. We blend comfort and creativity in every cup!</p>
        </div>

        {/* Card 2: Location */}
        <div className="card">
          <h3>Location</h3>
          <p>Limkokwing, Moshoeshoe Road, Maseru Central</p>
        </div>

        {/* Card 3: Opening Hours */}
        <div className="card">
          <h3>Opening Hours</h3>
          <p>Monday - Friday: 8:00 AM – 6:00 PM</p>
          <p>Saturday: 9:00 AM – 4:00 PM</p>
          <p>Sunday: Closed</p>
        </div>

        {/* Card 4: Contact */}
        <div className="card">
          <h3>Contact</h3>
          <p>Phone 1: +266 5801 2345</p>
          <p>Phone 2: +266 6201 6789</p>
          <p>We deliver around Maseru</p>
        </div>
      </div>

      {/* Specials Section */}
      <h3 className="specials-title">Menu Specials</h3>
      <div className="specials-row">
        {/* Special Item 1 */}
        <div className="card special-card">
          <img src={wingsImage} alt="Spicy Chicken Wings" />
          <h4>Spicy Chicken Wings Combo</h4>
          <p>Qty: 6 pcs</p>
          <p>Price: M35.00</p>
        </div>

        {/* Special Item 2 */}
        <div className="card special-card">
          <img src={mochaImage} alt="Mocha Latte" />
          <h4>Mocha Madness Latte</h4>
          <p>Qty: 1 cup</p>
          <p>Price: M25.00</p>
        </div>

        {/* Special Item 3 */}
        <div className="card special-card">
          <img src={croissantImage} alt="Croissant" />
          <h4>Freshly Baked Croissants</h4>
          <p>Qty: 2 pcs</p>
          <p>Price: M18.00</p>
        </div>


        <div className="card special-card">
          <img src={cheesecakeImage} alt="Strawberry Cheesecake" />
          <h4>Strawberry Cheesecake Slice</h4>
          <p>Qty: 1 slice</p>
          <p>Price: M22.00</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
