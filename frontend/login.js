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
