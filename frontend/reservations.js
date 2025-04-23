// Get the token from localStorage
const token = localStorage.getItem('token');

// Check if the token exists
if (!token) {
    // If token doesn't exist, redirect to login page
    window.location.href = '/login.html';  // Redirect to login if no token
} else {
    // Fetch reservations if token exists
    async function fetchReservations() {
        const response = await fetch('http://localhost:2000/api/reservations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,  // Send the token in the header
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Handle and display the reservations data here
            const reservationsList = document.getElementById('reservations-list');
            data.forEach(reservation => {
                const listItem = document.createElement('li');
                listItem.textContent = `Reservation ID: ${reservation._id}, Date: ${reservation.date}, Guests: ${reservation.guests}`;
                reservationsList.appendChild(listItem);
            });
        } else {
            // If the API returns an error (e.g., invalid token), redirect to login
            alert(data.message || 'Unable to fetch reservations');
            window.location.href = '/login.html';  // Redirect to login if error
        }
    }

    fetchReservations();
}
