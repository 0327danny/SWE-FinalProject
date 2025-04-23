// Socket.io setup for real-time communication
const socket = io('http://localhost:5000');

// Function to handle user login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('reservation-section').style.display = 'block';
  } else {
    alert('Login failed!');
  }
});

// Function to handle reservation form submission
document.getElementById('reservation-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const date = document.getElementById('reservation-date').value;
  const guests = document.getElementById('guests').value;

  const response = await fetch('/api/reservations/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ date, guests })
  });

  const data = await response.json();
  if (data.msg) {
    alert('Reservation confirmed!');
  } else {
    alert('Error with reservation');
  }
});




document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const message = document.getElementById('message').value;

  alert(`Thank you, ${name}! We have received your message.`);
  this.reset();
});




document.addEventListener('DOMContentLoaded', () => {
  const reservationForm = document.getElementById('reservation-form');
  reservationForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const partySize = document.getElementById('party-size').value;
      const specialRequests = document.getElementById('special-requests').value;

      alert(`
          Thank you, ${name}! Your reservation has been received.
          Details:
          - Email: ${email}
          - Phone: ${phone}
          - Date: ${date}
          - Time: ${time}
          - Party Size: ${partySize}
          - Special Requests: ${specialRequests || 'None'}
      `);

      reservationForm.reset();
  });
});



document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      // Simple mock authentication (replace with a real backend call)
      if (username === "admin" && password === "password123") {
          alert("Login successful! Welcome back, " + username);
          // Redirect to a dashboard or homepage
          window.location.href = "index.html";
      } else {
          alert("Invalid username or password. Please try again.");
      }

      loginForm.reset();
  });
});
document.addEventListener('DOMContentLoaded', () => {
  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          try {
              const response = await fetch('http://localhost:3000/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password })
              });

              const data = await response.json();
              if (response.ok) {
                  alert(data.message);
                  window.location.href = "index.html"; // Redirect on success
              } else {
                  alert(data.message);
              }
          } catch (error) {
              alert("An error occurred. Please try again later.");
          }
      });
  }

  // Reservation Form
  const reservationForm = document.getElementById('reservation-form');
  if (reservationForm) {
      reservationForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;
          const phone = document.getElementById('phone').value;
          const date = document.getElementById('date').value;
          const time = document.getElementById('time').value;
          const partySize = document.getElementById('party-size').value;
          const specialRequests = document.getElementById('special-requests').value;

          try {
              const response = await fetch('http://localhost:3000/api/reservations', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name, email, phone, date, time, partySize, specialRequests })
              });

              const data = await response.json();
              if (response.ok) {
                  alert(data.message);
                  reservationForm.reset();
              } else {
                  alert("Failed to submit reservation. Please try again.");
              }
          } catch (error) {
              alert("An error occurred. Please try again later.");
          }
      });
  }
});

const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error. Please try again later." });
    }
});


document.addEventListener('DOMContentLoaded', () => {
  // Handle Sign-Up Form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
      signupForm.addEventListener('submit', async (event) => {
          event.preventDefault(); // Prevent the default form submission

          const username = document.getElementById('new-username').value;
          const password = document.getElementById('new-password').value;

          try {
              const response = await fetch('http://localhost:3000/api/signup', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password })
              });

              const data = await response.json();
              if (response.ok) {
                  alert(data.message); // Show success message
                  window.location.href = "login.html"; // Redirect to login page
              } else {
                  alert(data.message); // Show error message
              }
          } catch (error) {
              alert("An error occurred. Please try again later.");
          }
      });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  // Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
      loginForm.addEventListener('submit', async (event) => {
          event.preventDefault();

          const username = document.getElementById('username').value;
          const password = document.getElementById('password').value;

          try {
              const response = await fetch('http://localhost:3000/api/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username, password }),
              });

              const data = await response.json();
              if (response.ok) {
                  alert(data.message);

                  // Save the token in localStorage
                  localStorage.setItem('token', data.token);

                  // Redirect to the Deals Page
                  window.location.href = 'deals.html';
              } else {
                  alert(data.message);
              }
          } catch (error) {
              alert("An error occurred. Please try again later.");
          }
      });
  }
});

  const logout = document.getElementById('logout');
  if (logout) {
      logout.addEventListener('click', () => {
          alert("You have been logged out.");
          window.location.href = "login.html";
      });
  }
