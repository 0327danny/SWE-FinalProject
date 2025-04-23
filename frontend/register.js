const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;

    const response = await fetch('http://localhost:2000/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (response.ok) {
        // Alert the user that their account was created successfully
        alert(data.message);

        // Redirect to the login page
        window.location.href = '/login.html'; // Update this URL if needed
    } else {
        // Display error message
        alert(data.message || 'An error occurred');
    }
}); 