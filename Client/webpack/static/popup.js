// This file is used to handle the popup.html page
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Login page loaded');
            const loginForm = document.getElementById('loginForm');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const passwordToggle = document.getElementById('passwordToggle');

            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = emailInput.value;
                const password = passwordInput.value;

                chrome.runtime.sendMessage({ action: 'login', email, password }, function(response) {
                    if (response.success) {
                        alert('Login successful!');
                    } else {
                        alert('Login failed: ' + response.error);
                    }
                });
            });

            passwordToggle.addEventListener('click', function() {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    passwordToggle.textContent = '🔒';
                } else {
                    passwordInput.type = 'password';
                    passwordToggle.textContent = '👁️';
                }
            });
        });
