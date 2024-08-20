document.addEventListener('DOMContentLoaded', () => {
    // Register Form
    const registerForm = document.querySelector('.sign-up form');
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const username = registerForm.querySelector('input[placeholder="User Name"]').value;
        const name = registerForm.querySelector('input[placeholder="Name"]').value;
        const email = registerForm.querySelector('input[placeholder="Email"]').value;
        const password = registerForm.querySelector('input[placeholder="Password"]').value;
        try {
            const response = await fetch('/v1/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username ,name, email, password })
            });

            const data = await response.json();
            alert(data.message); // Show response message
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed');
        }
    });

        // Login Form
        const loginForm = document.querySelector('.sign-in form');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the default form submission
    
            const email = loginForm.querySelector('input[placeholder="Email"]').value;
            const password = loginForm.querySelector('input[placeholder="Password"]').value;
    
            try {
                const response = await fetch('/v1/user/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
    
                const data = await response.json();
                if (response.ok) {
                    // Save the token in localStorage or cookies
                    localStorage.setItem('token', data.token);
                    // Redirect to another page or perform any other action
                    window.location.href = '/userDashboard'; // Redirect to user dashboard
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed');
            }
        });
    

    // Toggle Between Sign In and Sign Up
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });
});