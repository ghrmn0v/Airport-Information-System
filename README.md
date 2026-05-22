# Airport Flight Information System
## A frontend dashboard for Heydar Aliyev International Airport (BAK) — built with HTML, CSS, and JavaScript.
 About This Project
This is my coursework project for web programming course. The goal was to build an interactive airport information system that simulates real-world flight boards, search functionality, and passenger services.
What it does:
Displays live flight information (arrivals & departures)
Lets users search and filter flights by city, date, or flight number
Shows flight details in a modal (gate, terminal, aircraft, timeline)
Includes airport services (VIP, Cargo, Passenger Support)
Simulates booking with a visual boarding pass
Has a live chat widget and notification system
Includes an admin panel for flight management
Tech Stack:
HTML5 (semantic structure)
CSS3 (Grid, Flexbox, animations, responsive design)
JavaScript (DOM manipulation, event handling, mock data generation)
No frameworks or libraries were used — this is pure vanilla JS to demonstrate core web development skills.
## How to Run
Download or clone this repository
Open index.html in any modern browser (Chrome, Firefox, Edge, Safari)
No server or build step required — it runs directly in the browser
bash
Copy
 Option 1: Simply double-click index.html
 Option 2: Use a local server for better experience
npx serve .
 or
python3 -m http.server 8000
## File Structure
plain
Copy
airport-flight-system/
├── index.html          # Main page with all sections
├── styles.css          # All styling and animations
├── app.js              # All JavaScript logic and data
└──  README.md          # This file

## Features
Flight Board
Toggle between Arrivals and Departures
Color-coded status badges (On Time, Delayed, Boarding, Landed, Cancelled)
Click any flight to see detailed info (aircraft, gate, terminal, timeline)
Data is randomly generated on page load (25 flights)
Search & Filter
Real-time filtering by city name (as you type)
Filter by flight number
Filter by date
Results update instantly without page reload
Airport Services
VIP Services: Private jet booking, VIP transfer, luxury lounge
Cargo Transport: International freight, customs clearance, cold storage
Passenger Support: Baggage info, check-in help, lost & found
Booking System
Visual boarding pass built with HTML/CSS
Simulated barcode using CSS gradients
Booking options: WhatsApp, Call Center, Online
Live Chat
Floating chat widget
Simulated bot responses (not real AI)
Provides 24/7 support appearance
Notifications
Random flight status updates every 15 seconds
Dropdown notification panel
Board updates automatically when status changes
Admin Panel
Add new flights via form
View passenger list (mock data)
See statistics: active flights, total passengers, delayed count
Access by signing in with an email containing "admin"
Responsive Design
Desktop: Table-based flight board
Mobile: Card-based layout with burger menu
Tablet: Adaptive grid layouts
## Design Decisions
Colors
Table
Color	Hex	Usage
Navy Blue	#1a365d	Primary brand color
Light Blue	#3182ce	Links, buttons, accents
Green	#48bb78	On Time status
Red	#f56565	Delayed status
Yellow	#ecc94b	Warnings
Status Badges
On Time → Green (safe, proceed)
Delayed → Red (alert, action needed)
Boarding → Blue (urgency, move now)
Landed → Gray (finished, no action)
Cancelled → Black + strikethrough (seek alternative)
## How It Works
Data Generation
Flights are generated randomly using JavaScript:
JavaScript
Copy
function generateFlights() {
  const airlines = ['AZAL', 'Turkish Airlines', 'Lufthansa', ...];
  const destinations = ['Istanbul', 'Dubai', 'London', ...];

  for (let i = 0; i < 25; i++) {
    flights.push({
      number: 'AZ' + Math.floor(Math.random() * 9000 + 1000),
      airline: airlines[random],
      city: destinations[random],
      status: ['On Time', 'Delayed', 'Boarding', 'Landed', 'Cancelled'][random],
      type: Math.random() > 0.5 ? 'arrival' : 'departure'
    });
  }
}
Real-time Filter
JavaScript
Copy
document.getElementById('city-filter').addEventListener('input', filterFlights);

function filterFlights() {
  const cityFilter = document.getElementById('city-filter').value.toLowerCase();

  const filtered = flights.filter(f => {
    if (f.type !== currentBoard) return false;
    if (cityFilter && !f.city.toLowerCase().includes(cityFilter)) return false;
    return true;
  });

  renderTable(filtered);
}
Responsive Switch
css
Copy
/* Desktop */
.desktop-only { display: block; }
.mobile-only { display: none; }

/* Mobile */
@media (max-width: 768px) {
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
}
## Challenges & Solutions
Bug: Empty Flight Board
Problem: Flight board rendered empty despite data being generated.
Cause: String mismatch — currentBoard = 'arrivals' (with 's') but flight.type = 'arrival' (without 's'). The filter excluded all flights.
Fix: Standardized all type strings to 'arrival' and 'departure'.
Lesson: Consistent data contracts between components are critical.
## Future Improvements
[ ] Integrate real flight API (Aviationstack, FlightAware)
[ ] Add dark mode toggle
[ ] Multi-language support (Azerbaijani, English, Russian)
[ ] Convert to Progressive Web App (PWA) for offline use
[ ] Add real-time weather information
[ ] Implement actual backend with user authentication
## What I Learned

CSS Grid & Flexbox for responsive layouts
JavaScript DOM manipulation without frameworks
Event-driven programming with real-time updates
Mobile-first responsive design with media queries
Debugging complex string and data issues
User experience design — progressive disclosure, visual feedback

## Resources Used
Unsplash — Free airport and city photos
Font Awesome — Icons (via CDN)
Google Fonts — Inter typeface (via CDN)
MDN Web Docs — HTML, CSS, JavaScript reference

### by Huseyn Gahramanov

Feel free to open an issue or submit a pull request if you find bugs or have suggestions!
Built as a student project for learning purposes. Not affiliated with Heydar Aliyev International Airport.
