const API_URL = 'http://localhost:6767/api/v1';
let currentEventId = null;

// Load events on page load
document.addEventListener('DOMContentLoaded', () => {
    loadEvents();
});

async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error('Failed to fetch events');
        
        const events = await response.json();
        
        const upcomingEvents = events.filter(e => !e.isPast);
        
        displayEvents(upcomingEvents, 'upcoming-events', false);
    } catch (error) {
        console.error('Error loading events:', error);
        document.getElementById('upcoming-events').innerHTML = '<p class="no-events">⚠️ Error loading events! ⚠️</p>';
    }
}

function displayEvents(events, containerId, isPast) {
    const container = document.getElementById(containerId);
    
    if (events.length === 0) {
        container.innerHTML = '<p class="no-events">No events found! 😢</p>';
        return;
    }
    
    container.innerHTML = events.map(event => {
        const eventDate = new Date(event.eventDate);
        const spotsLeft = event.maxParticipants - event.registrationCount;
        const isFull = spotsLeft <= 0;
        
        return `
            <div class="event-card ${isPast ? 'past-event' : ''}">
                <table>
                    <tr>
                        <td colspan="2" class="event-name">
                            ${event.name}
                        </td>
                    </tr>
                    <tr>
                        <td class="label">📝 Description:</td>
                        <td class="event-info">${event.description}</td>
                    </tr>
                    <tr>
                        <td class="label">📅 Date:</td>
                        <td class="event-info">${eventDate.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td class="label">📍 Location:</td>
                        <td class="event-info">${event.location}</td>
                    </tr>
                    <tr>
                        <td class="label">👥 Participants:</td>
                        <td class="event-info">
                            ${event.registrationCount} / ${event.maxParticipants}
                            ${isFull ? '<b style="color: #ff0000;">⚠️ FULL!</b>' : `<b style="color: #00ff00;">(${spotsLeft} spots left!)</b>`}
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" align="center">
                            <button class="view-button" onclick="viewEvent(${event.id})">
                                ${isPast ? '👁️ VIEW DETAILS' : '🎫 REGISTER NOW!'}
                            </button>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    }).join('');
}

async function viewEvent(eventId) {
    currentEventId = eventId;
    
    try {
        // Fetch event details
        const eventResponse = await fetch(`${API_URL}/events/${eventId}`);
        if (!eventResponse.ok) throw new Error('Failed to fetch event');
        const event = await eventResponse.json();
        
        // Fetch registrations
        const regResponse = await fetch(`${API_URL}/events/${eventId}/registrations`);
        if (!regResponse.ok) throw new Error('Failed to fetch registrations');
        const registrations = await regResponse.json();
        
        // Display event details
        const eventDate = new Date(event.eventDate);
        const isPast = eventDate < new Date();
        const spotsLeft = event.maxParticipants - registrations.length;
        
        document.getElementById('event-details').innerHTML = `
            <table border="3" cellpadding="15" cellspacing="0" bgcolor="#ffccff" width="100%">
                <tr>
                    <td colspan="2" align="center" bgcolor="#ff00ff" style="color: #ffff00; font-size: 1.8em; font-weight: bold;">
                        ${event.name}
                    </td>
                </tr>
                <tr>
                    <td width="150"><b>Description:</b></td>
                    <td>${event.description}</td>
                </tr>
                <tr>
                    <td><b>Date:</b></td>
                    <td>${eventDate.toLocaleString()}</td>
                </tr>
                <tr>
                    <td><b>Location:</b></td>
                    <td>${event.location}</td>
                </tr>
                <tr>
                    <td><b>Status:</b></td>
                    <td>
                        ${isPast ? '<span style="color: #999;">🕐 Event has passed</span>' : 
                          spotsLeft <= 0 ? '<span style="color: #ff0000;">⚠️ FULLY BOOKED</span>' : 
                          `<span style="color: #00ff00;">✅ ${spotsLeft} spots available!</span>`}
                    </td>
                </tr>
            </table>
        `;
        
        // Show/hide registration form
        const form = document.getElementById('registration-form');
        if (isPast || spotsLeft <= 0) {
            form.style.display = 'none';
        } else {
            form.style.display = 'block';
            form.onsubmit = (e) => registerForEvent(e);
        }
        
        // Display registrations
        displayRegistrations(registrations);
        
        // Switch to registration page
        document.querySelector('.container').style.display = 'none';
        document.getElementById('registration-page').classList.remove('hidden');
        
        // Clear form and message
        document.getElementById('reg-name').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('message').style.display = 'none';
        
    } catch (error) {
        console.error('Error viewing event:', error);
        alert('Error loading event details!');
    }
}

function displayRegistrations(registrations) {
    const container = document.getElementById('registrations-list');
    
    if (registrations.length === 0) {
        container.innerHTML = '<p class="no-events">No registrations yet! Be the first! 🎉</p>';
        return;
    }
    
    container.innerHTML = registrations.map((reg, index) => {
        const regDate = new Date(reg.registrationDate);
        return `
            <div class="registration-item">
                <b>${index + 1}. ${reg.name}</b> (${reg.email})<br>
                <small>Registered: ${regDate.toLocaleString()}</small>
            </div>
        `;
    }).join('');
}

async function registerForEvent(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch(`${API_URL}/events/${currentEventId}/registrations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.textContent = '🎉 SUCCESS! You are registered! 🎉';
            messageDiv.className = 'success';
            messageDiv.style.display = 'block';
            
            // Clear form
            document.getElementById('reg-name').value = '';
            document.getElementById('reg-email').value = '';
            
            // Reload event to update registration list
            setTimeout(() => viewEvent(currentEventId), 2000);
        } else {
            messageDiv.textContent = `⚠️ ERROR: ${data.message || 'Registration failed!'}`;
            messageDiv.className = 'error';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error registering:', error);
        messageDiv.textContent = '⚠️ ERROR: Could not connect to server!';
        messageDiv.className = 'error';
        messageDiv.style.display = 'block';
    }
}

function showMainPage() {
    document.getElementById('registration-page').classList.add('hidden');
    document.querySelector('.container').style.display = 'block';
    loadEvents(); // Refresh the event list
}
