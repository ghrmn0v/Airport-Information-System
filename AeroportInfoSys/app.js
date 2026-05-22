// ===== DATA =====
const airlines = [
    { code: 'AZ', name: 'AZAL', color: '#0056b3' },
    { code: 'TK', name: 'Turkish Airlines', color: '#c8102e' },
    { code: 'LH', name: 'Lufthansa', color: '#05164d' },
    { code: 'EK', name: 'Emirates', color: '#d71921' },
    { code: 'QR', name: 'Qatar Airways', color: '#5c0931' },
    { code: 'SU', name: 'Aeroflot', color: '#d52b1e' },
    { code: 'BA', name: 'British Airways', color: '#075aaa' },
    { code: 'AF', name: 'Air France', color: '#002157' },
    { code: 'LH', name: 'Lufthansa', color: '#05164d' },
    { code: 'PC', name: 'Pegasus', color: '#f9c818' },
    { code: 'FZ', name: 'Flydubai', color: '#f26522' },
    { code: 'J2', name: 'Buta Airways', color: '#e31837' }
];

const destinations = [
    { city: 'Istanbul', country: 'Turkey', code: 'IST', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80', price: '€120' },
    { city: 'Dubai', country: 'UAE', code: 'DXB', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', price: '€180' },
    { city: 'Moscow', country: 'Russia', code: 'SVO', image: 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=600&q=80', price: '€150' },
    { city: 'London', country: 'UK', code: 'LHR', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', price: '€250' },
    { city: 'Paris', country: 'France', code: 'CDG', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', price: '€220' },
    { city: 'Frankfurt', country: 'Germany', code: 'FRA', image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80', price: '€200' },
    { city: 'Doha', country: 'Qatar', code: 'DOH', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80', price: '€190' },
    { city: 'Tbilisi', country: 'Georgia', code: 'TBS', image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&q=80', price: '€80' }
];

let flights = [];
let currentBoard = 'arrival';
let currentUser = null;
let notifications = [];
let notificationInterval;

// Generate realistic flight data
function generateFlights() {
    console.log("Generating flights...");
    const statuses = ['On Time', 'Delayed', 'Boarding', 'Landed', 'Cancelled'];
    const gates = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2'];

    flights = [];

    for (let i = 0; i < 25; i++) {
        const airline = airlines[Math.floor(Math.random() * airlines.length)];
        const dest = destinations[Math.floor(Math.random() * destinations.length)];
        const isArrival = Math.random() > 0.5;
        const hour = Math.floor(Math.random() * 24);
        const minute = Math.floor(Math.random() * 60);
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        let status;
        if (isArrival) {
            status = Math.random() > 0.7 ? 'Landed' : (Math.random() > 0.8 ? 'Delayed' : 'On Time');
        } else {
            status = Math.random() > 0.8 ? 'Boarding' : (Math.random() > 0.85 ? 'Delayed' : (Math.random() > 0.95 ? 'Cancelled' : 'On Time'));
        }

        flights.push({
            id: i + 1,
            number: `${airline.code}${Math.floor(Math.random() * 9000) + 1000}`,
            airline: airline.name,
            airlineCode: airline.code,
            city: dest.city,
            country: dest.country,
            time: time,
            gate: gates[Math.floor(Math.random() * gates.length)],
            status: status,
            type: isArrival ? 'arrival' : 'departure',
            aircraft: ['Boeing 737-800', 'Airbus A320', 'Boeing 787-9', 'Airbus A350-900'][Math.floor(Math.random() * 4)],
            duration: `${Math.floor(Math.random() * 5) + 1}h ${Math.floor(Math.random() * 59)}m`,
            terminal: ['1', '2'][Math.floor(Math.random() * 2)],
            passengers: Math.floor(Math.random() * 200) + 50
        });
    }

    // Sort by time
    flights.sort((a, b) => a.time.localeCompare(b.time));
    console.log("Generated", flights.length, "flights");
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2500);

    // Generate data
    generateFlights();

    // Initialize components
    updateTime();
    setInterval(updateTime, 1000);

    renderFlights();
    renderDestinations();
    renderReviews();
    updateStats();

    // Setup event listeners
    setupEventListeners();

    // Start notifications
    startNotifications();

    // Set today's date in filter
    document.getElementById('date-filter').valueAsDate = new Date();
});

// ===== TIME =====
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('current-time').textContent = timeStr;
}

// ===== FLIGHT BOARD =====
function renderFlights() {
    console.log("renderFlights called, flights count:", flights.length);
    const tbody = document.getElementById('flight-tbody');
    const cardsContainer = document.getElementById('flight-cards');
    const noResults = document.getElementById('no-results');

    const cityFilter = document.getElementById('city-filter').value.toLowerCase();
    const flightFilter = document.getElementById('flight-filter').value.toLowerCase();

    let filtered = flights.filter(f => {
        console.log("Checking flight:", f.number, "type:", f.type, "currentBoard:", currentBoard);
        if (f.type !== currentBoard) return false;
        if (cityFilter && !f.city.toLowerCase().includes(cityFilter)) return false;
        if (flightFilter && !f.number.toLowerCase().includes(flightFilter)) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = '';
        cardsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    // Desktop table
    tbody.innerHTML = filtered.map(flight => `
        <tr onclick="showFlightDetail(${flight.id})">
            <td><span class="flight-num">${flight.number}</span></td>
            <td>
                <div class="airline-cell">
                    <div class="airline-logo">${flight.airlineCode}</div>
                    <span>${flight.airline}</span>
                </div>
            </td>
            <td>${flight.city}, ${flight.country}</td>
            <td><strong>${flight.time}</strong></td>
            <td>${flight.gate}</td>
            <td><span class="status-badge status-${flight.status.toLowerCase().replace(' ', '')}">${flight.status}</span></td>
            <td><button class="action-btn" onclick="event.stopPropagation(); showFlightDetail(${flight.id})">Details</button></td>
        </tr>
    `).join('');

    // Mobile cards
    cardsContainer.innerHTML = filtered.map(flight => `
        <div class="flight-card" onclick="showFlightDetail(${flight.id})">
            <div class="flight-card-header">
                <span class="flight-card-num">${flight.number}</span>
                <span class="status-badge status-${flight.status.toLowerCase().replace(' ', '')}">${flight.status}</span>
            </div>
            <div class="flight-card-body">
                <div class="flight-card-info">
                    <small>Airline</small>
                    <strong>${flight.airline}</strong>
                </div>
                <div class="flight-card-info">
                    <small>${currentBoard === 'arrivals' ? 'From' : 'To'}</small>
                    <strong>${flight.city}</strong>
                </div>
                <div class="flight-card-info">
                    <small>Time</small>
                    <strong>${flight.time}</strong>
                </div>
                <div class="flight-card-info">
                    <small>Gate</small>
                    <strong>${flight.gate}</strong>
                </div>
            </div>
            <div class="flight-card-footer">
                <span>${flight.airlineCode}</span>
                <button class="action-btn" onclick="event.stopPropagation(); showFlightDetail(${flight.id})">Details</button>
            </div>
        </div>
    `).join('');
}

function switchBoard(type) {
    currentBoard = type;
    document.querySelectorAll('.board-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    renderFlights();
}

function filterFlights() {
    renderFlights();
}

// ===== FLIGHT DETAIL MODAL =====
function showFlightDetail(id) {
    const flight = flights.find(f => f.id === id);
    if (!flight) return;

    const content = document.getElementById('flight-detail-content');
    content.innerHTML = `
        <div class="flight-detail-grid">
            <div class="flight-detail-item">
                <small>Flight Number</small>
                <strong>${flight.number}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Airline</small>
                <strong>${flight.airline}</strong>
            </div>
            <div class="flight-detail-item">
                <small>${flight.type === 'arrival' ? 'Origin' : 'Destination'}</small>
                <strong>${flight.city}, ${flight.country}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Scheduled Time</small>
                <strong>${flight.time}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Gate</small>
                <strong>${flight.gate}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Terminal</small>
                <strong>${flight.terminal}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Aircraft</small>
                <strong>${flight.aircraft}</strong>
            </div>
            <div class="flight-detail-item">
                <small>Status</small>
                <span class="status-badge status-${flight.status.toLowerCase().replace(' ', '')}">${flight.status}</span>
            </div>
        </div>

        <div class="flight-timeline">
            <div class="timeline-item completed">
                <small>Scheduled</small>
                <p>Flight scheduled at ${flight.time}</p>
            </div>
            <div class="timeline-item ${flight.status !== 'On Time' && flight.status !== 'Delayed' ? 'completed' : ''}">
                <small>Check-in</small>
                <p>Check-in counters open</p>
            </div>
            <div class="timeline-item ${flight.status === 'Boarding' || flight.status === 'Landed' ? 'completed' : ''}">
                <small>Boarding</small>
                <p>Gate ${flight.gate} - Boarding ${flight.status === 'Boarding' ? 'NOW' : 'pending'}</p>
            </div>
            <div class="timeline-item ${flight.status === 'Landed' ? 'completed' : ''}">
                <small>${flight.type === 'arrival' ? 'Landed' : 'Departed'}</small>
                <p>${flight.type === 'arrival' ? 'Arrival at Baku' : 'Departure from Baku'}</p>
            </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
            <button class="btn-primary" onclick="simulateBooking('flight', '${flight.number}')">Book This Flight</button>
        </div>
    `;

    openModal('flight');
}

// ===== DESTINATIONS =====
function renderDestinations() {
    const grid = document.getElementById('destinations-grid');
    grid.innerHTML = destinations.map(dest => `
        <div class="destination-card" onclick="filterByCity('${dest.city}')">
            <img src="${dest.image}" alt="${dest.city}" loading="lazy">
            <div class="destination-info">
                <h3>${dest.city}</h3>
                <p>${dest.country}</p>
                <div class="destination-price">
                    <span>${dest.price}</span>
                    <small>one way</small>
                </div>
            </div>
        </div>
    `).join('');
}

function filterByCity(city) {
    document.getElementById('city-filter').value = city;
    document.getElementById('flights').scrollIntoView({ behavior: 'smooth' });
    filterFlights();
}

// ===== REVIEWS =====
function renderReviews() {
    const reviews = [
        { name: 'John Smith', rating: 5, text: 'Excellent airport experience! Very modern facilities and friendly staff. The new terminal is impressive.', avatar: 'JS' },
        { name: 'Maria Garcia', rating: 5, text: 'Smooth check-in process and great shopping options. Love the VIP lounge!', avatar: 'MG' },
        { name: 'Ahmed Hassan', rating: 4, text: 'Good connections to major cities. Clean and well organized. Would recommend.', avatar: 'AH' },
        { name: 'Lisa Chen', rating: 5, text: 'The most beautiful airport in the region. Amazing architecture and efficient service.', avatar: 'LC' },
        { name: 'Robert Brown', rating: 4, text: 'Very efficient security checks. Flight information displays are clear and helpful.', avatar: 'RB' },
        { name: 'Sophie Martin', rating: 5, text: 'Fantastic experience! The staff was very helpful when my flight was delayed.', avatar: 'SM' }
    ];

    const grid = document.getElementById('reviews-grid');
    grid.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="review-avatar">${review.avatar}</div>
                <div class="review-meta">
                    <h4>${review.name}</h4>
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
            </div>
            <p>${review.text}</p>
        </div>
    `).join('');
}

// ===== SERVICES =====
function showServiceDetail(type) {
    const titles = {
        vip: 'VIP Services',
        cargo: 'Cargo Transport',
        support: 'Passenger Support'
    };

    const contents = {
        vip: `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" alt="VIP" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
            </div>
            <h4 style="margin-bottom: 15px; color: var(--primary);">Exclusive VIP Services</h4>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Private jet charter and booking</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> VIP terminal access with luxury lounge</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Personal concierge and assistant</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Luxury vehicle transfer (Mercedes S-Class, BMW 7-Series)</li>
                <li style="padding: 10px 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Fast-track immigration and security</li>
            </ul>
            <div style="margin-top: 20px; padding: 15px; background: var(--gray-lighter); border-radius: 8px;">
                <p style="margin: 0; font-size: 0.9rem;"><i class="fas fa-phone" style="margin-right: 8px; color: var(--accent);"></i> Contact: +994 12 497 27 27 (VIP Line)</p>
            </div>
        `,
        cargo: `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80" alt="Cargo" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
            </div>
            <h4 style="margin-bottom: 15px; color: var(--primary);">Cargo & Logistics Services</h4>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> International freight forwarding</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Cold storage and perishable handling</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Customs clearance assistance</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Dangerous goods handling certified</li>
                <li style="padding: 10px 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Real-time cargo tracking system</li>
            </ul>
            <div style="margin-top: 20px; padding: 15px; background: var(--gray-lighter); border-radius: 8px;">
                <p style="margin: 0; font-size: 0.9rem;"><i class="fas fa-envelope" style="margin-right: 8px; color: var(--accent);"></i> cargo@bak.airport.az</p>
            </div>
        `,
        support: `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=600&q=80" alt="Support" style="width: 100%; border-radius: 10px; margin-bottom: 15px;">
            </div>
            <h4 style="margin-bottom: 15px; color: var(--primary);">Passenger Support Services</h4>
            <ul style="list-style: none; padding: 0;">
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> 24/7 information desk and help center</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Lost & found baggage service</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Special assistance for reduced mobility</li>
                <li style="padding: 10px 0; border-bottom: 1px solid var(--gray-light);"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Medical center and first aid</li>
                <li style="padding: 10px 0;"><i class="fas fa-check" style="color: var(--success); margin-right: 10px;"></i> Prayer rooms and family services</li>
            </ul>
            <div style="margin-top: 20px; padding: 15px; background: var(--gray-lighter); border-radius: 8px;">
                <p style="margin: 0; font-size: 0.9rem;"><i class="fas fa-phone" style="margin-right: 8px; color: var(--accent);"></i> Hotline: +994 12 497 27 27</p>
            </div>
        `
    };

    document.getElementById('service-modal-title').textContent = titles[type];
    document.getElementById('service-detail-content').innerHTML = contents[type];
    openModal('service');
}

// ===== BOOKING =====
function simulateBooking(method, flightNum = null) {
    if (method === 'flight' && flightNum) {
        updateTicketPreview(flightNum);
        showNotification('Booking Initiated', `You are booking flight ${flightNum}. Redirecting to booking partner...`);
        return;
    }

    const methods = {
        whatsapp: { icon: 'fab fa-whatsapp', title: 'WhatsApp Booking', msg: 'Opening WhatsApp booking service...' },
        phone: { icon: 'fas fa-phone', title: 'Call Center', msg: 'Connecting to our 24/7 call center...' },
        online: { icon: 'fas fa-globe', title: 'Online Booking', msg: 'Redirecting to online booking portal...' }
    };

    const m = methods[method];
    showNotification(m.title, m.msg);
}

function updateTicketPreview(flightNum) {
    const flight = flights.find(f => f.number === flightNum);
    if (!flight) return;

    const ticket = document.querySelector('.ticket-body');
    ticket.innerHTML = `
        <div class="ticket-row">
            <div>
                <small>Passenger</small>
                <strong>${currentUser ? currentUser.name : 'Guest User'}</strong>
            </div>
            <div>
                <small>Flight</small>
                <strong>${flight.number}</strong>
            </div>
        </div>
        <div class="ticket-row">
            <div>
                <small>From</small>
                <strong>${flight.type === 'arrival' ? flight.city : 'BAK'}</strong>
            </div>
            <div class="ticket-plane">
                <i class="fas fa-plane"></i>
            </div>
            <div>
                <small>To</small>
                <strong>${flight.type === 'departure' ? flight.city : 'BAK'}</strong>
            </div>
        </div>
        <div class="ticket-row">
            <div>
                <small>Date</small>
                <strong>${new Date().toLocaleDateString('en-GB')}</strong>
            </div>
            <div>
                <small>Gate</small>
                <strong>${flight.gate}</strong>
            </div>
            <div>
                <small>Seat</small>
                <strong>${Math.floor(Math.random() * 30) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}</strong>
            </div>
        </div>
    `;
}

// ===== AUTH =====
function handleSignIn(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;

    currentUser = {
        name: email.split('@')[0],
        email: email,
        isAdmin: email.includes('admin')
    };

    closeModal();
    updateAuthUI();
    showNotification('Welcome Back!', `Signed in as ${currentUser.name}`);

    if (currentUser.isAdmin) {
        document.getElementById('admin-link').style.display = 'inline';
        document.getElementById('mobile-admin-link').style.display = 'block';
    }
}

function handleSignUp(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;

    currentUser = {
        name: name,
        email: email,
        isAdmin: false
    };

    closeModal();
    updateAuthUI();
    showNotification('Account Created', `Welcome, ${name}! Your account has been created.`);
}

function logout() {
    currentUser = null;
    updateAuthUI();
    document.getElementById('admin-link').style.display = 'none';
    document.getElementById('mobile-admin-link').style.display = 'none';
    showNotification('Signed Out', 'You have been signed out successfully.');
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    const userMenu = document.getElementById('user-menu');

    if (currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'flex';
        document.getElementById('user-name').textContent = currentUser.name;
    } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// ===== ADMIN PANEL =====
function addFlight() {
    const num = document.getElementById('admin-flight-num').value;
    const airline = document.getElementById('admin-airline').value;
    const city = document.getElementById('admin-city').value;
    const time = document.getElementById('admin-time').value;
    const type = document.getElementById('admin-type').value;
    const status = document.getElementById('admin-status').value;

    if (!num || !airline || !city || !time) {
        showNotification('Error', 'Please fill in all fields');
        return;
    }

    const newFlight = {
        id: flights.length + 1,
        number: num,
        airline: airline,
        airlineCode: num.substring(0, 2).toUpperCase(),
        city: city,
        country: 'Unknown',
        time: time,
        gate: 'A' + (Math.floor(Math.random() * 9) + 1),
        status: status,
        type: type,
        aircraft: 'Boeing 737-800',
        duration: '2h 30m',
        terminal: '1',
        passengers: 0
    };

    flights.push(newFlight);
    flights.sort((a, b) => a.time.localeCompare(b.time));
    console.log("Generated", flights.length, "flights");

    renderFlights();
    updateStats();
    showNotification('Flight Added', `Flight ${num} has been added successfully.`);

    // Clear form
    document.getElementById('admin-flight-num').value = '';
    document.getElementById('admin-airline').value = '';
    document.getElementById('admin-city').value = '';
}

function updateStats() {
    const activeFlights = flights.filter(f => f.status !== 'Landed' && f.status !== 'Cancelled').length;
    const passengers = flights.reduce((sum, f) => sum + f.passengers, 0);
    const delayed = flights.filter(f => f.status === 'Delayed').length;

    document.getElementById('stat-flights').textContent = activeFlights;
    document.getElementById('stat-passengers').textContent = passengers;
    document.getElementById('stat-delayed').textContent = delayed;

    // Passenger list
    const passengerList = document.getElementById('passenger-list');
    const samplePassengers = [
        { name: 'Ali Mammadov', flight: 'AZ102', seat: '12A' },
        { name: 'Sarah Johnson', flight: 'TK456', seat: '8F' },
        { name: 'Hassan Al-Rashid', flight: 'EK789', seat: '15C' },
        { name: 'Elena Petrova', flight: 'SU321', seat: '22B' },
        { name: 'James Wilson', flight: 'BA654', seat: '5D' }
    ];

    passengerList.innerHTML = samplePassengers.map(p => `
        <div class="passenger-item">
            <div>
                <strong>${p.name}</strong>
                <small style="display: block; color: var(--gray);">${p.flight} - Seat ${p.seat}</small>
            </div>
            <span class="status-badge status-ontime">Checked In</span>
        </div>
    `).join('');
}

// ===== NOTIFICATIONS =====
function startNotifications() {
    const messages = [
        { type: 'warning', title: 'Flight Delayed', text: 'Flight AZ102 to Istanbul is delayed by 30 minutes.' },
        { type: 'success', title: 'Boarding Started', text: 'Flight TK456 to Dubai is now boarding at Gate A3.' },
        { type: 'info', title: 'New Flight Added', text: 'New flight J201 to Tbilisi has been scheduled.' },
        { type: 'warning', title: 'Gate Changed', text: 'Flight LH789 gate changed from B2 to C1.' },
        { type: 'success', title: 'Flight Landed', text: 'Flight EK101 from Dubai has landed successfully.' }
    ];

    // Initial notification
    setTimeout(() => {
        showNotification('Welcome', 'Welcome to Heydar Aliyev International Airport Flight Information System.');
    }, 3000);

    // Random notifications
    notificationInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            const msg = messages[Math.floor(Math.random() * messages.length)];
            showNotification(msg.title, msg.text, msg.type);

            // Update a random flight status
            const activeFlights = flights.filter(f => f.status !== 'Landed' && f.status !== 'Cancelled');
            if (activeFlights.length > 0) {
                const flight = activeFlights[Math.floor(Math.random() * activeFlights.length)];
                if (msg.title.includes('Delayed')) {
                    flight.status = 'Delayed';
                } else if (msg.title.includes('Boarding')) {
                    flight.status = 'Boarding';
                } else if (msg.title.includes('Landed')) {
                    flight.status = 'Landed';
                }
                renderFlights();
                updateStats();
            }
        }
    }, 15000);
}

function showNotification(title, message, type = 'info') {
    const panel = document.getElementById('notification-panel');
    const list = document.getElementById('notification-list');

    const iconMap = {
        info: 'fa-info-circle',
        success: 'fa-check-circle',
        warning: 'fa-exclamation-triangle',
        danger: 'fa-times-circle'
    };

    const colorMap = {
        info: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)'
    };

    const notification = {
        id: Date.now(),
        title,
        message,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        type
    };

    notifications.unshift(notification);
    if (notifications.length > 10) notifications.pop();

    const item = document.createElement('div');
    item.className = `notification-item ${type}`;
    item.innerHTML = `
        <i class="fas ${iconMap[type]}" style="color: ${colorMap[type]}"></i>
        <div>
            <p><strong>${title}</strong></p>
            <small>${message} • ${notification.time}</small>
        </div>
    `;

    list.insertBefore(item, list.firstChild);

    // Show panel briefly
    panel.classList.add('active');
    setTimeout(() => {
        panel.classList.remove('active');
    }, 5000);
}

function clearNotifications() {
    notifications = [];
    document.getElementById('notification-list').innerHTML = '';
}

// ===== CHAT =====
function toggleChat() {
    const panel = document.getElementById('chat-panel');
    panel.classList.toggle('active');
    document.getElementById('chat-badge').style.display = 'none';
}

function handleChatKey(e) {
    if (e.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const messagesContainer = document.getElementById('chat-messages');
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // User message
    messagesContainer.innerHTML += `
        <div class="message user">
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        </div>
    `;

    input.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Bot response
    setTimeout(() => {
        const responses = [
            'I can help you with flight information, booking, or airport services. What do you need?',
            'For flight status updates, please check our Live Flight Board section.',
            'Our VIP services include private jet charter and luxury lounge access. Would you like more details?',
            'You can book flights through WhatsApp, our call center, or online booking portal.',
            'The airport is open 24/7. Security check-in opens 3 hours before international flights.',
            'Is there anything specific about Baku airport services I can help you with?'
        ];

        const botResponse = responses[Math.floor(Math.random() * responses.length)];

        messagesContainer.innerHTML += `
            <div class="message bot">
                <div class="message-content">
                    <p>${botResponse}</p>
                    <span class="message-time">${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        `;

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
}

// ===== MODALS =====
function openModal(type) {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.add('active');

    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');

    const modalMap = {
        signin: 'signin-modal',
        signup: 'signup-modal',
        flight: 'flight-modal',
        service: 'service-modal',
        notification: 'notification-modal'
    };

    if (modalMap[type]) {
        document.getElementById(modalMap[type]).style.display = 'block';
    }
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Burger menu
    document.getElementById('burger').addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.toggle('active');
        this.classList.toggle('active');
    });

    // Search tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentBoard = this.dataset.tab;
            console.log('Switched board to:', currentBoard);
        });
    });

    // Filter inputs
    document.getElementById('city-filter').addEventListener('input', filterFlights);
    document.getElementById('flight-filter').addEventListener('input', filterFlights);
    document.getElementById('date-filter').addEventListener('change', filterFlights);

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('mobile-menu').classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            navbar.style.boxShadow = 'var(--shadow)';
        }
    });

    // Admin panel toggle
    document.getElementById('admin-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('admin').style.display = 'block';
        document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('mobile-admin-link').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('admin').style.display = 'block';
        document.getElementById('admin').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('mobile-menu').classList.remove('active');
    });
}

// ===== UTILITY =====
// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}