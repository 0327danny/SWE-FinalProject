document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const loginSection = document.getElementById('login-section');
    const reservationsSection = document.getElementById('reservations-section');
    const reservationsList = document.getElementById('reservations-list');

    const token = localStorage.getItem('token');
    if (token) {
        loginSection.style.display = 'none';
        reservationsSection.style.display = 'block';
        fetchReservations();
    } else {
        loginSection.style.display = 'block';
        reservationsSection.style.display = 'none';
    }

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('http://localhost:2000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Store the token and show the reservations section
            localStorage.setItem('token', data.token);
            loginSection.style.display = 'none';
            reservationsSection.style.display = 'block';
            fetchReservations();
        } else {
            alert('Login failed: ' + data.message);
        }
    });

    // Fetch the user's reservations
    async function fetchReservations() {
        const token = localStorage.getItem('token');

        const response = await fetch('http://localhost:2000/api/reservations', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            // Display reservations
            reservationsList.innerHTML = '';
            data.forEach((reservation) => {
                const listItem = document.createElement('li');
                listItem.textContent = `Reservation ID: ${reservation._id}, Date: ${new Date(reservation.date).toLocaleDateString()}, Guests: ${reservation.guests}`;
                reservationsList.appendChild(listItem);
            });
        } else {
            alert('Error fetching reservations');
        }
    }

    // Handle logout
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');  // Remove the token
        loginSection.style.display = 'block';
        reservationsSection.style.display = 'none';
    });
});
